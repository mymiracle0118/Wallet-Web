import { getErrorMessage } from '@portal/portal-extension/src/utils/errorConstants'
import { useSessionStore } from '@portal/shared/hooks/useSessionStore'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { decryptData } from '@portal/shared/services/EncryptionService'
import { IResponse } from '@portal/shared/utils/types'
import { fromUTF8Array } from '@portal/shared/utils/utf8'
import {
  APTOS_COIN,
  AptosAccount,
  AptosClient,
  HexString,
  IndexerClient,
  TransactionBuilderRemoteABI,
  TRANSFER_COINS,
} from 'aptos'
import { ethers } from 'ethers'

export const APTOS_COIN_STORE = '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
export const APTOS_DECIMALS = 8

function formatErc20TokenConvertNormal(amountStr: string, decimals = 6) {
  const amount = Number(amountStr)
  return Math.round(amount * Math.pow(10, decimals)).toString()
}

export const getAptosWalletUsingSeed = async (mnemonic?: string, derivationPathIndex?: number) => {
  try {
    if (!mnemonic) {
      return
    }

    // eslint-disable-next-line quotes
    const derivationPath = `m/44'/637'/0'/0'/${derivationPathIndex || 0}'`
    const account = AptosAccount.fromDerivePath(derivationPath, mnemonic)

    const accountObj = account.toPrivateKeyObject()
    const aptosAddress = accountObj.address
    const privateKey = accountObj.privateKeyHex?.toString()

    if (aptosAddress) {
      return { address: aptosAddress, privateKey: privateKey }
    } else {
      throw Error('Failed to fetch wallet AptosService')
    }
  } catch (error: any) {}
}

export const PAGINATION_COUNT = 10
export const PAGINATION_COUNT_100 = 100
export const PAGINATION_COUNT_5 = 5
export const PAGINATION_COUNT_50 = 50

export const getBalance = async (address?: string, aptosType?: string, provider?: any): Promise<any> => {
  if (!address) return '0'

  if (!aptosType) aptosType = '0x1::aptos_coin::AptosCoin'

  try {
    const accountResources = await provider.getAccountResources(address)
    const coinStoreResource = accountResources.find(
      (resource) => resource.type === `0x1::coin::CoinStore<${aptosType}>`
    )
    const rawBalance = (coinStoreResource?.data as any).coin?.value?.toString() || '0'

    if (!rawBalance) return 0

    return rawBalance
  } catch (error: any) {
    return 0
  }
}

export const getAptosTransactions = async (
  walletAddress: string,
  page: number,
  provider: any,
  contractAddress?: string
) => {
  try {
    const client = provider
    const indexerClient = new IndexerClient('https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql')

    const transactionVersion = await indexerClient.getAccountTransactionsData(walletAddress, {
      options: {
        limit: PAGINATION_COUNT_5,
        offset: (page - 1) * PAGINATION_COUNT_5,
      },
      orderBy: [{ transaction_version: 'desc' }],
    })

    const transactionsPromises = transactionVersion.account_transactions.map(async (version) => {
      const transaction = await client.getTransactionByVersion(version.transaction_version)

      if (transaction?.payload?.function?.toLowerCase()?.includes('register')) {
        return null
      }

      const functionName = getTransactionFunctionName(transaction, contractAddress)
      return {
        blockNumber: '',
        time: transaction?.timestamp
          ? Math.floor(new Date(Number(transaction?.timestamp ?? 0) / 1000).getTime() / 1000)
          : '',
        hash: transaction?.hash,
        nonce: '',
        from: transaction?.sender,
        to: transaction?.payload?.arguments?.length === 2 ? transaction?.payload?.arguments[0] : '',
        value:
          transaction?.payload?.arguments?.length === 2
            ? ethers.formatUnits(transaction?.payload?.arguments[1], 8)
            : ethers.formatUnits(transaction?.payload?.arguments[0], 8),
        gas: transaction?.gas_used ?? '0',
        gasPrice: transaction?.gas_unit_price ?? '0',
        functionName,
      }
    })

    const transactions = await Promise.all(transactionsPromises)

    const filteredTransactions = contractAddress
      ? transactions.filter((transaction) => transaction.functionName === contractAddress)
      : transactions.filter((transaction) => transaction.functionName === '')

    return filteredTransactions
  } catch (error) {
    console.error('Error fetching Aptos transactions:', error)
    return []
  }
}

const getTransactionFunctionName = (transaction: any, contractAddress: string) => {
  const functionName =
    contractAddress && contractAddress === transaction?.payload?.type_arguments[0]
      ? transaction?.payload?.type_arguments[0]
      : transaction?.payload?.type_arguments?.toString()?.toLowerCase()?.includes('aptos') ||
        transaction?.payload?.type_arguments?.length === 0
      ? ''
      : transaction?.payload?.type_arguments[0]
  return functionName
}

export const sendAptos = async (transaction: any, privateKey?: string, provider?: any) => {
  try {
    const { to: toAddress, amount, asset } = transaction
    if (!privateKey || !amount) {
      throw new SyntaxError('Transaction failed')
    }

    const amountInBigInt = BigInt(formatErc20TokenConvertNormal(amount, asset?.decimal))

    const privateKeyBytes = HexString.ensure(privateKey).toUint8Array()
    const myAccount = new AptosAccount(privateKeyBytes)

    const client = provider

    const builder = new TransactionBuilderRemoteABI(client, {
      sender: myAccount.address(),
    })

    let coin = APTOS_COIN
    if (asset.tokenContractAddress) {
      coin = asset.tokenContractAddress
    }

    const rawTxn = await builder.build(TRANSFER_COINS, [coin], [toAddress, amountInBigInt])
    const bcsTxn = AptosClient.generateBCSTransaction(myAccount, rawTxn)
    const pendingTransaction = await client.submitSignedBCSTransaction(bcsTxn)

    const transactions = await client.waitForTransactionWithResult(pendingTransaction.hash)
    if (transactions?.success) {
      return successResponse({
        gasPrice: transactions?.gas_unit_price,
        txHash: transactions?.hash,
        status: '1',
        gasUsed: transactions?.gas_used,
      })
    } else {
      throw new SyntaxError('Transaction failed')
    }
  } catch (error: any) {
    const validationCodeMatch = error.message.match(/Validation Code: (\w+)/)
    let validationCode = 'error'
    if (validationCodeMatch && validationCodeMatch.length > 1) {
      validationCode = validationCodeMatch[1]
      throw new Error(getErrorMessage(validationCode))
    } else {
      throw new Error('Something went wrong')
    }
  }
}

const successResponse = (args: IResponse) => {
  return args
}

export const getFeeDataAptos = async (walletAddress?: string, provider?: any, encryptedPrivateKey?: string) => {
  try {
    const client = provider
    const mnemonic = useWallet.getState().getPhrase()
    if (!walletAddress) {
      return {
        gasPrice: '',
        maxFeePerGas: '',
        maxPriorityFeePerGas: '',
        gasUsed: '',
      }
    }
    let myAccount: any
    if (mnemonic) {
      const derivationPath = `m/44'/637'/0'/0'/0'`
      myAccount = AptosAccount.fromDerivePath(derivationPath, mnemonic)
    } else if (encryptedPrivateKey && encryptedPrivateKey !== '') {
      const { getPassword } = useSessionStore.getState()
      const password = getPassword()
      const privateKey = (encryptedPrivateKey = fromUTF8Array(
        JSON.parse(decryptData(encryptedPrivateKey as string, password as string) as string)
      ))
      const privateKeyBytes = HexString.ensure(privateKey).toUint8Array()
      myAccount = new AptosAccount(privateKeyBytes)
    } else {
      return {
        gasPrice: '',
        maxFeePerGas: '',
        maxPriorityFeePerGas: '',
        gasUsed: '',
      }
    }

    const builder = new TransactionBuilderRemoteABI(client, {
      sender: myAccount.address(),
    })

    const rawTxn = await builder.build(TRANSFER_COINS, [APTOS_COIN], [walletAddress, 1_000])

    const transactions = await client.simulateTransaction(myAccount, rawTxn, {
      estimateGasUnitPrice: true,
      estimateMaxGasAmount: true,
      estimatePrioritizedGasUnitPrice: false,
    })
    if (transactions?.length) {
      return {
        gasPrice: transactions[0]?.gas_unit_price,
        maxFeePerGas: transactions[0]?.gas_unit_price,
        maxPriorityFeePerGas: transactions[0]?.gas_unit_price,
        gasUsed: transactions[0]?.gas_used,
      }
    } else {
      return {
        gasPrice: '',
        maxFeePerGas: '',
        maxPriorityFeePerGas: '',
        gasUsed: '',
      }
    }
  } catch (error) {
    return {
      gasPrice: '',
      maxFeePerGas: '',
      maxPriorityFeePerGas: '',
      gasUsed: '',
    }
  }
}

export const getAptosTransactionByHash = async (hash: string, provider: any) => {
  const client = provider

  const transaction = await client.getTransactionByHash(hash)

  return {
    blockNumber: 1,
    time: transaction?.timestamp
      ? Math.floor(new Date(Number(transaction?.timestamp ?? 0) / 1000).getTime() / 1000)
      : '',
    hash: transaction?.hash,
    nonce: '',
    from: transaction?.sender,
    to: transaction?.payload?.arguments?.length === 2 ? transaction?.payload?.arguments[0] : '',
    value:
      transaction?.payload?.arguments?.length === 2
        ? ethers.formatUnits(transaction?.payload?.arguments[1], 8)
        : ethers.formatUnits(transaction?.payload?.arguments[0], 8),
    gas: transaction?.gas_used ?? '0',
    gasPrice: transaction?.gas_unit_price ? ethers.formatUnits(transaction?.gas_unit_price, 8) : '0',
    confirmations: 0,
    wait: 0,
    gasLimit: '',
    data: '',
    chainId: '',
    networkFees: transaction?.gas_unit_price
      ? ethers.formatUnits(transaction?.gas_unit_price * transaction?.gas_used, 8)
      : '0',
  }
}

export const getAptosWalletUsingPrivateKey = async (privateKey) => {
  const privateKeyBytes = HexString.ensure(privateKey).toUint8Array()

  const account = new AptosAccount(privateKeyBytes)

  return account
}
