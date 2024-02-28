import { IResponse } from '@portal/shared/utils/types'
import Bip39Manager from '@portal/shared/utils/Bip39Manager'
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js'
import { HDKey } from 'ed25519-keygen/hdkey'
import bs58 from 'bs58'
import { fromUTF8Array } from '../utils/utf8'
import { ethers } from 'ethers'

export const SOLANA_PROVIDER = new Connection('https://api.devnet.solana.com', {
  wsEndpoint: 'https://api.devnet.solana.com'?.replace('https', 'wss'),
})

export const getSolonaWalletUsingSeed = async (mnemonic?: string, deriveIndex?: number) => {
  try {
    if (!mnemonic) {
      return
    }

    const seed = Bip39Manager().getSeedUsingMnemonic(mnemonic)

    const hd = HDKey.fromMasterSeed(seed.toString('hex'))

    // eslint-disable-next-line quotes
    const path = `m/44'/501'/0'/${deriveIndex || 0}'`
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

export const getSolanaBalance = async (address: string): Promise<string> => {
  try {
    const pubKey = new PublicKey(address)
    const balance = await SOLANA_PROVIDER.getBalance(pubKey)
    return balance ? balance.toString() : '0'
  } catch (error: any) {
    return '0'
  }
}

export const getSolanaFeeData = async (walletAddress?: string): Promise<any> => {
  try {
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
  toAddress: string,
  amount: string,
  walletAddress?: string,
  encryptedPrivateKey?: string
) => {
  try {
    const privateKey = encryptedPrivateKey ? fromUTF8Array(encryptedPrivateKey) : null
    if (!privateKey || !toAddress || !walletAddress || !amount) {
      throw new SyntaxError('Transaction failed because something is missing')
    }

    const connection = SOLANA_PROVIDER
    const fromPubkey = new PublicKey(walletAddress ?? '')
    const secretKey = bs58.decode(privateKey)
    const FROM_KEYPAIR = Keypair.fromSecretKey(secretKey)
    const toPubkey = new PublicKey(toAddress ?? '')

    const recentBlockhash = await connection.getLatestBlockhash()

    const sendSolInstruction = SystemProgram.transfer({
      fromPubkey: fromPubkey,
      toPubkey: toPubkey,
      lamports: formatErc20TokenConvertNormal(Number(amount), 9),
    })
    const transaction = new Transaction()
    transaction.feePayer = fromPubkey
    transaction.recentBlockhash = recentBlockhash.blockhash
    const fees = await transaction.getEstimatedFee(connection)

    transaction.add(sendSolInstruction)

    const tx = await sendAndConfirmTransaction(connection, transaction, [FROM_KEYPAIR])

    if (tx) {
      return successResponse({
        gasPrice: fees,
        txHash: tx,
        status: '1',
        gasUsed: fees,
      })
    }
  } catch (error: any) {
    throw error
  }
}

const successResponse = (args: IResponse) => {
  return args
}

export const formatErc20TokenConvertNormal = (value: number, decimal = 6) => {
  return value * Math.pow(10, decimal)
}

export const getSolanaTransactions = async (network: string, address: string, contractAddress?: string) => {
  const connection = SOLANA_PROVIDER
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
        time: blockTime,
        hash: signatureInfo.signature,
        from: from,
        to: to,
        value: value / LAMPORTS_PER_SOL,
        gas: '',
        gasPrice: '',
      }
    })
  )

  return transactions
}

export const getSolanaTransactionByHash = async (hash) => {
  const connection = SOLANA_PROVIDER
  const transactionDetails = await connection.getParsedTransaction(hash)

  //const transactionDetails = await connection.getParsedTransaction(signatureInfo.signature);

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
    time: blockTime,
    hash: hash,
    from: from,
    to: to,
    value: value / LAMPORTS_PER_SOL,
    gas: '',
    gasPrice: '',
    networkFees: transactionDetails?.meta?.fee ? ethers.utils.formatUnits(transactionDetails?.meta?.fee, 9) : '0',
  }

  //return transactionDetails;
}
