import { TRANSACTION, add0xStartOfString } from '@portal/portal-extension/src/utils/constants'
import { IResponse } from '@portal/shared/utils/types'
import { AptosAccount, HexString } from 'aptos'
import { ethers } from 'ethers'
import * as supraSDK from 'supra-l1-devnet-sdk'

export const getWalletUsingSeed = async (mnemonic?: string, derivationPathIndex?: number) => {
  try {
    if (!mnemonic) {
      return
    }

    // eslint-disable-next-line quotes
    const derivationPath = `m/44'/637'/0'/0'/${derivationPathIndex || 0}'`
    const account = AptosAccount.fromDerivePath(derivationPath, mnemonic)

    const accountObj = account.toPrivateKeyObject()
    const supraAddress = accountObj.address
    const privateKey = accountObj.privateKeyHex?.toString()
    if (account) {
      return { address: supraAddress, privateKey: privateKey }
    } else {
      throw Error('Failed to fetch wallet SupraService')
    }
  } catch (error: any) {}
}

export const getSupraTransactionWithFormation = async (walletAddress: HexString, page: number, rpcUrl: string) => {
  try {
    let supraClient = await supraSDK.SupraClient.init(rpcUrl)
    const transactionVersion = await supraClient.getSupraTransferHistory(walletAddress, TRANSACTION.COUNT)
    const transactionsPromises = transactionVersion.map(async (transaction) => {
      return {
        blockNumber: transaction?.blockNumber ? transaction.blockHash : '',
        time: transaction?.txConfirmationTime ? Number(transaction.txConfirmationTime) / 1000000 : '',
        hash: transaction?.txHash ? transaction.txHash : '',
        nonce: '',
        from: transaction?.sender ? add0xStartOfString(transaction.sender) : '',
        to: transaction?.receiver ? add0xStartOfString(transaction.receiver) : '',
        value: ethers.formatUnits(transaction?.amount, 6),
        gas: transaction?.gasUsed ?? '0',
        gasPrice: transaction?.gasUnitPrice ?? '0',
        status: transaction?.status ? transaction.status : '',
      }
    })
    const transactions = await Promise.all(transactionsPromises)
    return transactions
  } catch (error) {
    return []
  }
}

export const sendSupraToken = async (toAddress: string, amount: string, privateKey?: string, rpcUrl: string) => {
  try {
    let supraClient = await supraSDK.SupraClient.init(rpcUrl)
    if (!privateKey) {
      throw new SyntaxError('Transaction failed')
    }

    const amountInBigInt = BigInt(formatErc20TokenConvertNormal(amount, 6))
    const privateKeyBytes = HexString.ensure(privateKey).toUint8Array()
    const myAccount = new AptosAccount(privateKeyBytes)
    const senderAccount = HexString.ensure(toAddress)
    let transactionResponse = await supraClient.transferSupraCoin(myAccount, senderAccount, amountInBigInt)
    if (transactionResponse?.result === 'Success' || 'Invalid') {
      return successResponse({
        gasPrice: '',
        txHash: transactionResponse?.txHash,
        status: transactionResponse.result,
        gasUsed: '',
      })
    } else {
      throw new SyntaxError('Transaction failed')
    }
  } catch (error: any) {
    throw new SyntaxError('Transaction failed', error)
  }
}

export const formatErc20TokenConvertNormal = (amountStr: string, decimals = 6) => {
  const amount = Number(amountStr)
  return Math.round(amount * Math.pow(10, decimals)).toString()
}

export const successResponse = (args: IResponse) => {
  return args
}

export const getSupraTransactionByHash = async (hash: string, rpcUrl: string) => {
  let supraClient = await supraSDK.SupraClient.init(rpcUrl)
  let transactionDetail = await supraClient.getTransactionDetail(hash)
  return {
    blockNumber: transactionDetail?.blockNumber ? transactionDetail.blockNumber : '',
    time: transactionDetail?.txConfirmationTime ? Number(transactionDetail?.txConfirmationTime) / 1000000 : '', //Math.floor(new Date(Number(transactionDetail?.confirmation_time ?? 0) / 1000).getTime() / 1000),
    hash: transactionDetail?.txHash ? transactionDetail?.txHash : '',
    nonce: '',
    from: transactionDetail?.sender ? add0xStartOfString(transactionDetail?.sender) : '',
    to: transactionDetail?.receiver ? add0xStartOfString(transactionDetail?.receiver) : '',
    value: transactionDetail?.amount ? ethers.formatUnits(transactionDetail?.amount, 6) : '0',
    gas: transactionDetail?.gasUsed ?? '0',
    gasPrice: transactionDetail?.gasUnitPrice ?? 0,
    confirmations: 0,
    wait: 0,
    gasLimit: '',
    data: '',
    chainId: '',
    status: transactionDetail?.status ? transactionDetail?.status : '',
    networkFees: ethers.formatUnits(transactionDetail?.gasUnitPrice * transactionDetail?.gasUsed, 6), //ethers.formatEther(TRANSACTION.NETWORK_FEE),
  }
}

export const addBalanceFaucet = async (address: string, rpcUrl: string) => {
  try {
    let supraClient = await supraSDK.SupraClient.init(rpcUrl)
    const hexAddress = HexString.ensure(address)
    await supraClient.fundAccountWithFaucet(hexAddress)
    return true
  } catch (err) {
    return err
  }
}
