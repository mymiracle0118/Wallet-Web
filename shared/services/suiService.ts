import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client'
import { Asset, IResponse } from '../utils/types'
import { ethers } from 'ethers'
import { fromB64 } from '@mysten/bcs'
import { fromUTF8Array } from '../utils/utf8'
import { remove0xStartOfString } from '@portal/portal-extension/src/utils/constants'

export const suiProvider = new SuiClient({ url: getFullnodeUrl('testnet') })
export const getSuiProvider = (networkType) => new SuiClient({ url: getFullnodeUrl(networkType || 'testnet') })
export const getSuiWalletUsingSeed = async (mnemonic: string, deriveIndex?: number) => {
  try {
    // Derive keypair using the provided mnemonic
    const keypair = Ed25519Keypair.deriveKeypair(mnemonic, `m/44'/784'/0'/0'/${deriveIndex || 0}'`)

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

export const getSuiBalance = async (address: string, asset: Asset): Promise<number> => {
  try {
    let { totalBalance } = await suiProvider.getBalance({
      owner: address,
    })
    return Number(totalBalance)
  } catch (error: any) {
    return 0
  }
}

export const getSUITransactions = async (network: string, address: string, contractAddress?: string) => {
  let transactions = []
  // const gasFees = await suiProvider.getReferenceGasPrice()
  try {
    const paginationCount = 20
    const fromTransactionBlocks = await suiProvider.queryTransactionBlocks({
      filter: {
        FromAddress: address,
        // FromOrToAddress: { addr: address },
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
            // if (!balanceChange.coinType?.includes('sui::SUI')) {
            functionName = balanceChange?.coinType ?? ''
            // }
          }
        }

        if (!seen.has(digest)) {
          if (value) {
            transactions.push({
              blockNumber: '',
              time: (Number(obj?.timestampMs ?? 0) / 1000).toString(),
              hash: digest,
              nonce: '',
              from: obj?.transaction?.data?.sender ?? '',
              to: toAddress,
              value: ethers.utils.formatUnits(value, 9),
              gas: '',
              gasPrice: obj?.transaction?.data?.gasData?.price ?? '0',
              gasUsed: '',
              cumulativeGasUsed: '',
              tokenDecimal: 9,
            })
          }
        }
      }
      seen.set(digest, true)
    }

    transactions = transactions.sort(function (x, y) {
      return y.time - x.time
    })
  } catch (error: any) {}

  return transactions
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
        time: (Number(transactionBlock?.timestampMs ?? 0) / 1000).toString(),
        hash: digest,
        nonce: '',
        from: transactionBlock?.transaction?.data?.sender ?? '',
        to: toAddress,
        value: ethers.utils.formatUnits(value, 9),
        gas: '',
        gasPrice: transactionBlock?.transaction?.data?.gasData?.price ?? '0',
        gasUsed: '',
        cumulativeGasUsed: '',
        tokenDecimal: 9,
        networkFees: transactionBlock?.transaction?.data?.gasData?.price
          ? ethers.utils.formatUnits(transactionBlock?.transaction?.data?.gasData?.price, 9)
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

export const formatErc20TokenConvertNormal = (value: number, decimal = 6) => {
  return value * Math.pow(10, decimal)
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
        const gasAmount = ethers.BigNumber.from(transactionBlock.effects.gasUsed.computationCost)
        return successResponse({
          gasPrice: gasAmount,
          hash: transactionBlock?.digest,
          txHash: transactionBlock?.digest,
          status: '1',
          gasUsed: gasAmount,
        })
      } else {
        throw new SyntaxError('Sui Transaction failed')
      }
    } else {
      throw Error('Failed to sui transaction')
    }
  } catch (error: any) {
    throw Error('Failed to sui transaction :' + error.message)
  }
}
