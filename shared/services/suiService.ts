import { fromB64 } from '@mysten/bcs'
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { remove0xStartOfString } from '@portal/portal-extension/src/utils/constants'
import { ethers } from 'ethers'
import { IResponse, NetworkToken } from '../utils/types'
import { fromUTF8Array } from '../utils/utf8'

export const suiProvider = new SuiClient({ url: getFullnodeUrl('testnet') })
export const getSuiProvider = (networkType) => new SuiClient({ url: getFullnodeUrl(networkType || 'testnet') })
export const getSuiWalletUsingSeed = async (mnemonic: string, derivationPathIndex?: number) => {
  try {
    // Derive keypair using the provided mnemonic
    const keypair = Ed25519Keypair.deriveKeypair(mnemonic, `m/44'/784'/0'/0'/${derivationPathIndex || 0}'`)

    // Get the SUI address and private key in both base64 and hex formats
    const suiAddress = keypair.getPublicKey().toSuiAddress()
    const privateKey = keypair.export().privateKey
    const strBase64 = Buffer.from(privateKey, 'base64')
    const privateKeyHex = strBase64.toString('hex')
    return { address: suiAddress, privateKey: privateKeyHex }
  } catch (error: any) {}
}

export const getSuiWalletUsingPrivateKey = async (privateKey) => {
  privateKey = remove0xStartOfString(privateKey)
  const strBase64 = Buffer.from(privateKey, 'hex')
  const secretKey = new Uint8Array(strBase64)
  const keypair = Ed25519Keypair.fromSecretKey(secretKey)
  return keypair
}

export const getSuiWalletUsingEncryptedPrivateKey = async (encryptedPrivateKey) => {
  const keypair = Ed25519Keypair.fromSecretKey(fromB64(encryptedPrivateKey))
  return keypair
}

export const getSuiBalance = async (address: string, asset: NetworkToken): Promise<number> => {
  try {
    const coinType = asset.tokenContractAddress ? asset.tokenContractAddress : '0x2::sui::SUI'

    let { totalBalance } = await suiProvider.getBalance({
      owner: address,
      coinType: coinType,
    })
    return Number(totalBalance)
  } catch (error: any) {
    return 0
  }
}

export const getSUITransactions = async (network: string, address: string, contractAddress?: string) => {
  let transactions = []
  try {
    const paginationCount = 20
    const fromTransactionBlocks = await suiProvider.queryTransactionBlocks({
      filter: {
        FromAddress: address,
      },
      options: {
        showBalanceChanges: true,
        showEffects: true,
        showInput: true,
      },
      limit: paginationCount,
      order: 'descending',
    })

    const toTransactionBlocks = await suiProvider.queryTransactionBlocks({
      filter: {
        ToAddress: address,
      },
      options: {
        showBalanceChanges: true,
        showEffects: true,
        showInput: true,
      },
      limit: paginationCount,
      order: 'descending',
    })

    let transactionList = fromTransactionBlocks.data
    transactionList = transactionList.concat(toTransactionBlocks.data)

    const seen = new Map()
    for (const obj of transactionList) {
      const digest = obj?.digest

      if (obj?.balanceChanges?.length) {
        let toAddress = ''
        let functionName = ''
        let value = ''

        for (const balanceChange of obj?.balanceChanges) {
          if (balanceChange?.owner?.AddressOwner !== obj?.transaction?.data?.sender) {
            toAddress = balanceChange?.owner?.AddressOwner ?? ''
            value = balanceChange?.amount ?? '0'
            if (!balanceChange.coinType?.includes('sui::SUI')) {
              functionName = balanceChange?.coinType ?? ''
            }
          }
        }

        if (!seen.has(digest)) {
          if (value) {
            transactions.push({
              blockNumber: '',
              time: obj?.timestampMs ? (Number(obj?.timestampMs ?? 0) / 1000).toString() : '',
              hash: digest,
              nonce: '',
              from: obj?.transaction?.data?.sender ?? '',
              to: toAddress,
              value: ethers.formatUnits(value, 9),
              gas: '',
              gasPrice: obj?.transaction?.data?.gasData?.price ?? '0',
              gasUsed: '',
              cumulativeGasUsed: functionName,
              tokenDecimal: 9,
              functionName: functionName,
            })
          }
        }
      }
      seen.set(digest, true)
    }

    transactions = transactions.sort(function (x, y) {
      return y.time - x.time
    })

    const filteredTransactions = contractAddress
      ? transactions.filter((transaction) => transaction.functionName === contractAddress)
      : transactions.filter((transaction) => transaction.functionName === '')

    return filteredTransactions
  } catch (error: any) {
    console.log('SOL trnasaction ERR ', error)
  }
}
export const getSuiTransaction = async (transactionHash: string) => {
  try {
    const transactionBlock = await suiProvider.getTransactionBlock({
      digest: transactionHash,
      options: {
        showBalanceChanges: true,
        showEffects: true,
        showInput: true,
      },
    })

    const digest = transactionBlock?.digest

    if (transactionBlock?.balanceChanges?.length) {
      let toAddress = ''
      let functionName = ''
      let value = ''

      for (const balanceChange of transactionBlock?.balanceChanges) {
        if (balanceChange?.owner?.AddressOwner !== transactionBlock?.transaction?.data?.sender) {
          toAddress = balanceChange?.owner?.AddressOwner ?? ''
          value = balanceChange?.amount ?? '0'
          functionName = balanceChange?.coinType ?? ''
        }
      }

      return {
        blockNumber: transactionBlock.checkpoint,
        time: transactionBlock?.timestampMs ? (Number(transactionBlock?.timestampMs ?? 0) / 1000).toString() : '',
        hash: digest,
        nonce: '',
        from: transactionBlock?.transaction?.data?.sender ?? '',
        to: toAddress,
        value: ethers.formatUnits(value, 9),
        gas: '',
        gasPrice: transactionBlock?.transaction?.data?.gasData?.price ?? '0',
        gasUsed: '',
        cumulativeGasUsed: '',
        tokenDecimal: 9,
        networkFees: transactionBlock?.transaction?.data?.gasData?.price
          ? ethers.formatUnits(transactionBlock?.transaction?.data?.gasData?.price, 9)
          : '0',
      }
    }
  } catch (error: any) {}
  return null
}

export const getSuiGasFeeData = async () => {
  try {
    const fees = await suiProvider.getReferenceGasPrice()
    return {
      gasPrice: fees.toString(),
      maxFeePerGas: '',
      maxPriorityFeePerGas: '',
      gasUsed: '',
    }
  } catch (error: any) {}
  return {}
}
const successResponse = (args: IResponse) => {
  return args
}

export const formatErc20TokenConvertNormal = (value: string, decimal = 6) => {
  const amount = Number(value)
  return Math.round(amount * Math.pow(10, decimal)).toString()
}

export const selectCoins = async (addr: string, amount: number, coinType: string = '0x2::SUI::SUI', suiProvider) => {
  const selectedCoins: {
    objectId: string
    digest: string
    version: string
  }[] = []
  let totalAmount = 0
  let hasNext = true,
    nextCursor: string | null | undefined = null

  while (hasNext && totalAmount < amount) {
    const coins = await suiProvider.getCoins({
      owner: addr,
      coinType: coinType,
      cursor: nextCursor,
    })

    // Sort the coins by balance in descending order
    // eslint-disable-next-line radix
    coins.data.sort((a, b) => parseInt(b.balance) - parseInt(a.balance))

    for (const coinData of coins.data) {
      selectedCoins.push({
        objectId: coinData.coinObjectId,
        digest: coinData.digest,
        version: coinData.version,
      })
      // eslint-disable-next-line radix
      totalAmount = totalAmount + parseInt(coinData.balance)
      if (totalAmount >= amount) {
        break
      }
    }

    nextCursor = coins.nextCursor
    hasNext = coins.hasNextPage
  }

  if (!selectedCoins.length) {
    throw new Error('No valid coins found for the transaction.')
  }

  return selectedCoins
}

export const sendSuiTransaction = async (txb, encryptedPrivateKey: (string | number)[]) => {
  try {
    const privateKey = encryptedPrivateKey ? fromUTF8Array(encryptedPrivateKey) : null
    if (privateKey) {
      const keypair = await getSuiWalletUsingPrivateKey(privateKey)

      const pendingTransactionBlock = await suiProvider.signAndExecuteTransactionBlock({
        transactionBlock: txb,
        signer: keypair,
        requestType: 'WaitForLocalExecution',
        options: {
          showEffects: true,
        },
      })

      const transactionBlock = await suiProvider.waitForTransactionBlock({
        digest: pendingTransactionBlock.digest,
        options: {
          showEffects: true,
        },
      })
      if (transactionBlock) {
        const gasAmount = ethers.formatUnits(transactionBlock.effects.gasUsed.computationCost)
        return successResponse({
          gasPrice: gasAmount,
          hash: transactionBlock?.digest,
          txHash: transactionBlock?.digest,
          status: '1',
          gasUsed: gasAmount,
        })
      } else {
        throw new SyntaxError('Transaction failed')
      }
    } else {
      throw Error('Transaction failed')
    }
  } catch (error: any) {
    throw Error('Failed transaction : ' + error.message)
  }
}
