import { findValueByKey } from '@portal/portal-extension/src/utils/constants'
import Bip39Manager from '@portal/shared/utils/Bip39Manager'
import { IResponse, NetworkToken } from '@portal/shared/utils/types'
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token'
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js'
import bs58 from 'bs58'
import { HDKey } from 'ed25519-keygen/hdkey'
import { ethers } from 'ethers'
import { useAxios } from '../factory/helpers/axiosHelper'
import { fromUTF8Array } from '../utils/utf8'

let solanaConnectionObject: Connection

export const getSolonaWalletUsingSeed = async (mnemonic?: string, derivationPathIndex?: number) => {
  try {
    if (!mnemonic) {
      return
    }

    const seed = Bip39Manager().getSeedUsingMnemonic(mnemonic)

    const hd = HDKey.fromMasterSeed(seed.toString('hex'))

    // eslint-disable-next-line quotes
    const path = `m/44'/501'/0'/${derivationPathIndex || 0}'`
    const keypair = Keypair.fromSeed(hd.derive(path).privateKey)

    const solanaAddress = keypair.publicKey.toBase58()
    const secretKey = keypair.secretKey

    const privateKey = bs58.encode(secretKey)

    return { address: solanaAddress, privateKey, secretKey }
  } catch (error: any) {}
}

export const getSolanaWalletUsingPrivateKey = async (privateKey) => {
  const keypair = Keypair.fromSecretKey(bs58.decode(privateKey))
  return keypair
}

export const getSolanaBalance = async (address: string, rpc: string): Promise<string> => {
  try {
    const SOLANA_PROVIDER = new Connection(rpc)
    const pubKey = new PublicKey(address)
    const balance = await SOLANA_PROVIDER.getBalance(pubKey)
    return balance ? balance.toString() : '0'
  } catch (error: any) {
    return '0'
  }
}

export const getSolanaFeeData = async (rpc: string, walletAddress?: string): Promise<any> => {
  try {
    const SOLANA_PROVIDER = new Connection(rpc)
    const connection = SOLANA_PROVIDER
    const fromPubkey = new PublicKey(walletAddress ?? '')
    const { blockhash } = await connection.getLatestBlockhash()
    const transaction = new Transaction()
    transaction.feePayer = fromPubkey
    transaction.recentBlockhash = blockhash
    const fees = await transaction.getEstimatedFee(connection)

    return {
      gasPrice: fees,
      maxFeePerGas: '',
      maxPriorityFeePerGas: '',
    }
  } catch (e) {}
}

export const sendSolana = async (
  transaction: any,
  rpc: string,
  encryptedPrivateKey: string,
  walletAddress?: string
) => {
  const { to: toAddress, amount } = transaction
  try {
    const privateKey = encryptedPrivateKey ? fromUTF8Array(encryptedPrivateKey) : null
    if (!privateKey || !toAddress || !walletAddress || !amount) {
      throw new SyntaxError('Transaction failed because something is missing')
    }
    const SOLANA_PROVIDER = new Connection(rpc)
    const connection = SOLANA_PROVIDER
    const fromPubkey = new PublicKey(walletAddress ?? '')
    const secretKey = bs58.decode(privateKey)
    const FROM_KEYPAIR = Keypair.fromSecretKey(secretKey)
    const toPubkey = new PublicKey(toAddress ?? '')

    const recentBlockhash = await connection.getLatestBlockhash()

    const tx = new Transaction()
    tx.feePayer = fromPubkey
    tx.recentBlockhash = recentBlockhash.blockhash
    const fees = await tx.getEstimatedFee(connection)

    if (transaction.asset.tokenContractAddress) {
      const mintPubkey = new PublicKey(transaction.asset.tokenContractAddress ?? '')
      const sourceAccount = await getOrCreateAssociatedTokenAccount(connection, FROM_KEYPAIR, mintPubkey, fromPubkey)
      const destinationAccount = await getOrCreateAssociatedTokenAccount(connection, FROM_KEYPAIR, mintPubkey, toPubkey)
      const transferInstruction = createTransferCheckedInstruction(
        sourceAccount.address,
        mintPubkey,
        destinationAccount.address,
        FROM_KEYPAIR.publicKey,
        BigInt(formatErc20TokenConvertNormal(amount, transaction.asset.decimal)),
        transaction.asset.decimal
      )
      tx.add(transferInstruction)
    } else {
      const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: fromPubkey,
        toPubkey: toPubkey,
        lamports: BigInt(formatErc20TokenConvertNormal(amount, 9)),
      })
      tx.add(sendSolInstruction)
    }

    const txData = await sendAndConfirmTransaction(connection, tx, [FROM_KEYPAIR])

    if (txData) {
      return successResponse({
        gasPrice: fees,
        txHash: txData,
        status: '1',
        gasUsed: fees,
      })
    }
  } catch (error: any) {
    let errMsg = error
    if (error instanceof Error) errMsg = error.message.split('\n')[0]
    throw new Error(errMsg)
  }
}

const successResponse = (args: IResponse) => {
  return args
}

export const formatErc20TokenConvertNormal = (amountStr: string, decimal = 6) => {
  const amount = Number(amountStr)
  return Math.round(amount * Math.pow(10, decimal)).toString()
}

export const getSolanaTransactions = async (
  network: string,
  address: string,
  rpc: string,
  contractAddress?: string
) => {
  const SOLANA_PROVIDER = new Connection(rpc)
  const connection = SOLANA_PROVIDER

  if (contractAddress) {
    const mint = new PublicKey(contractAddress)
    const owner = new PublicKey(address)
    const tokenAddress = await getAssociatedTokenAddress(mint, owner)
    const mintTokenAccountAddress = new PublicKey(tokenAddress)
    const signatures = await connection.getConfirmedSignaturesForAddress2(mintTokenAccountAddress)
    const transactions = await Promise.all(
      signatures.map(async (signatureInfo) => {
        const transactionDetails = await connection.getParsedTransaction(signatureInfo.signature)
        const blockTime = transactionDetails ? await connection.getBlockTime(transactionDetails.slot) : null
        let to = ''
        let from = ''
        let value = 0
        if (
          transactionDetails?.meta?.preTokenBalances?.length &&
          transactionDetails?.meta?.preTokenBalances?.length > 0 &&
          transactionDetails?.meta?.postTokenBalances?.length &&
          transactionDetails?.meta?.postTokenBalances?.length > 0
        ) {
          if (transactionDetails && transactionDetails.transaction.message.instructions.length > 0) {
            for (const instruction of transactionDetails.transaction.message.instructions) {
              if (instruction.program !== 'system') {
                to = instruction.parsed.info.destination ?? ''
                from = instruction.parsed.info.authority ?? ''
                value =
                  Math.abs(
                    ((Number(transactionDetails?.meta?.preTokenBalances[0]?.uiTokenAmount?.amount) ?? 0) -
                      (Number(transactionDetails?.meta?.postTokenBalances[0]?.uiTokenAmount?.amount) ?? 0)) /
                      Math.pow(10, transactionDetails?.meta?.preTokenBalances[0]?.uiTokenAmount?.decimals)
                  ) ?? 0
                break
              }
            }
          }
        }
        return {
          blockNumber: transactionDetails ? transactionDetails.slot : '',
          time: blockTime ? blockTime : '',
          hash: signatureInfo.signature,
          from: from,
          to: to,
          value: value,
          gas: '',
          gasPrice: '',
        }
      })
    )
    const filteredTransactions = transactions.filter((transaction) => transaction.value > 0)
    return filteredTransactions
  } else {
    const publicKey = new PublicKey(address)
    const signatures = await connection.getSignaturesForAddress(publicKey)
    const transactions = await Promise.all(
      signatures.map(async (signatureInfo) => {
        const transactionDetails = await connection.getParsedTransaction(signatureInfo.signature)
        const blockTime = transactionDetails ? await connection.getBlockTime(transactionDetails.slot) : null

        let to = ''
        let from = ''
        let value = 0

        if (transactionDetails && transactionDetails.transaction.message.instructions.length > 0) {
          for (const instruction of transactionDetails.transaction.message.instructions) {
            // Check if the instruction is a transfer of SOL
            //TODO: We should decide how to handle transactions with multiple transfers
            //A transaction can have multiple transfers,
            if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
              to = instruction.parsed.info.destination
              from = instruction.parsed.info.source
              value = instruction.parsed.info.lamports
              break
            }
          }
        }

        return {
          blockNumber: transactionDetails ? transactionDetails.slot : '',
          time: blockTime ? blockTime : '',
          hash: signatureInfo.signature,
          from: from,
          to: to,
          value: value / LAMPORTS_PER_SOL,
          gas: '',
          gasPrice: '',
        }
      })
    )
    const filteredTransactions = transactions.filter((transaction) => transaction.value > 0)
    return filteredTransactions
  }
}

export const getSolanaTransactionByHash = async (hash: string, rpc: string, contractAddress?: string) => {
  const SOLANA_PROVIDER = new Connection(rpc)
  const connection = SOLANA_PROVIDER
  const transactionDetails = await connection.getParsedTransaction(hash)

  const blockTime = transactionDetails ? await connection.getBlockTime(transactionDetails.slot) : null

  let to = ''
  let from = ''
  let value = 0

  if (contractAddress) {
    const instruction = findValueByKey(transactionDetails, 'parsed')
    to = transactionDetails?.meta?.preTokenBalances[1].owner ?? ''
    from = instruction.info.authority ?? ''
    value = Math.abs(
      ((Number(transactionDetails?.meta?.preTokenBalances[0]?.uiTokenAmount?.amount) ?? 0) -
        (Number(transactionDetails?.meta?.postTokenBalances[0]?.uiTokenAmount?.amount) ?? 0)) /
        Math.pow(10, transactionDetails?.meta?.preTokenBalances[0]?.uiTokenAmount?.decimals) ?? 0
    )
  } else {
    if (transactionDetails && transactionDetails.transaction.message.instructions.length > 0) {
      for (const instruction of transactionDetails.transaction.message.instructions) {
        // Check if the instruction is a transfer of SOL
        //TODO: We should decide how to handle transactions with multiple transfers
        //A transaction can have multiple transfers,
        if (instruction.program === 'system' && instruction.parsed.type === 'transfer') {
          to = instruction.parsed.info.destination
          from = instruction.parsed.info.source
          value = instruction.parsed.info.lamports
          break
        }
      }
    }
  }
  return {
    blockNumber: transactionDetails ? transactionDetails.slot : '',
    time: blockTime ? blockTime : '',
    hash: hash,
    from: from,
    to: to,
    value: contractAddress ? value : value / LAMPORTS_PER_SOL,
    gas: '',
    gasPrice: '',
    networkFees: transactionDetails?.meta?.fee ? ethers.formatUnits(transactionDetails?.meta?.fee, 9) : '0',
  }
}

export const createProvider = async (url: string) => {
  if (solanaConnectionObject?.rpcEndpoint !== url) {
    solanaConnectionObject = new Connection(url, {
      wsEndpoint: url?.replace('https', 'wss'),
    })
  }
  return solanaConnectionObject
}

export const fetchTokenInfo = async (tokenObj: NetworkToken) => {
  const response = await useAxios<any>({
    axiosParams: {
      method: 'post',
      url: `https://token-list-api.solana.cloud/v1/mints?chainId=${tokenObj.providerNetworkRPC_Network_Name}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: { addresses: [tokenObj.tokenContractAddress] },
    },
  })
  return response.content[0]
}
