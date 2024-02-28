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
import { IResponse } from '@portal/shared/utils/types'

export const APTOS_COIN_STORE = '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'

export const APTOS_CLIENT = new AptosClient(
  process.env.APTOS_PROVIDER_LINK || 'https://fullnode.testnet.aptoslabs.com/v1'
)

export const APTOS_DECIMALS = 8

function formatErc20TokenConvertNormal(amountStr: string, decimals = 6) {
  const amount = Number(amountStr)
  return Math.round(amount * Math.pow(10, decimals)).toString()
}

export const getAptosWalletUsingSeed = async (mnemonic?: string, deriveIndex?: number) => {
  try {
    if (!mnemonic) {
      return
    }

    // eslint-disable-next-line quotes
    const derivationPath = `m/44'/637'/0'/0'/${deriveIndex || 0}'`
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

export const getBalance = async (address?: string, aptosType?: string): Promise<any> => {
  if (!address) return '0'

  if (!aptosType) aptosType = '0x1::aptos_coin::AptosCoin'

  try {
    const accountResources = await APTOS_CLIENT.getAccountResources(address)
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

export const getAptosTransactions = async (walletAddress, page) => {
  try {
    const client = APTOS_CLIENT
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

      return {
        blockNumber: '',
        time: Math.floor(new Date(Number(transaction?.timestamp ?? 0) / 1000).getTime() / 1000),
        hash: transaction?.hash,
        nonce: '',
        from: transaction?.sender,
        to: transaction?.payload?.arguments?.length === 2 ? transaction?.payload?.arguments[0] : '',
        value:
          transaction?.payload?.arguments?.length === 2
            ? ethers.utils.formatUnits(transaction?.payload?.arguments[1], 8)
            : ethers.utils.formatUnits(transaction?.payload?.arguments[0], 8),
        gas: transaction?.gas_used ?? '0',
        gasPrice: transaction?.gas_unit_price ?? '0',
      }
    })

    const transactions = await Promise.all(transactionsPromises)

    return transactions.filter((tx) => tx !== null)
  } catch (error) {
    console.error('Error fetching Aptos transactions:', error)
    return []
  }
}

export const sendAptos = async (toAddress: string, amount: string, privateKey?: string) => {
  try {
    if (!privateKey) {
      throw new SyntaxError('Transaction failed')
    }

    const amountInBigInt = BigInt(formatErc20TokenConvertNormal(amount, 8))

    const privateKeyBytes = HexString.ensure(privateKey).toUint8Array()
    const myAccount = new AptosAccount(privateKeyBytes)

    const client = APTOS_CLIENT

    const builder = new TransactionBuilderRemoteABI(client, {
      sender: myAccount.address(),
    })
    const rawTxn = await builder.build(TRANSFER_COINS, [APTOS_COIN], [toAddress, amountInBigInt])
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
    throw new SyntaxError('Transaction failed', error)
  }
}

const successResponse = (args: IResponse) => {
  return args
}

export const getFeeData = async (walletAddress?: string, privateKey?: string) => {
  try {
    if (!walletAddress || !privateKey) {
      return {
        gasPrice: '',
        maxFeePerGas: '',
        maxPriorityFeePerGas: '',
        gasUsed: '',
      }
    }

    const privateKeyBytes = HexString.ensure(privateKey).toUint8Array()
    const myAccount = new AptosAccount(privateKeyBytes)

    const client = APTOS_CLIENT

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

export const getAptosTransactionByHash = async (hash: string) => {
  const client = APTOS_CLIENT

  const transaction = await client.getTransactionByHash(hash)

  return {
    blockNumber: 1,
    time: Math.floor(new Date(Number(transaction?.timestamp ?? 0) / 1000).getTime() / 1000),
    hash: transaction?.hash,
    nonce: '',
    from: transaction?.sender,
    to: transaction?.payload?.arguments?.length === 2 ? transaction?.payload?.arguments[0] : '',
    value:
      transaction?.payload?.arguments?.length === 2
        ? ethers.utils.formatUnits(transaction?.payload?.arguments[1], 8)
        : ethers.utils.formatUnits(transaction?.payload?.arguments[0], 8),
    gas: transaction?.gas_used ?? '0',
    gasPrice: transaction?.gas_unit_price ? ethers.utils.formatUnits(transaction?.gas_unit_price, 8) : '0',
    confirmations: 0,
    wait: 0,
    gasLimit: '',
    data: '',
    chainId: '',
    networkFees: transaction?.gas_unit_price
      ? ethers.utils.formatUnits(transaction?.gas_unit_price * transaction?.gas_used, 8)
      : '0',
  }
}

export const getAptosWalletUsingPrivateKey = async (privateKey) => {
  const privateKeyBytes = HexString.ensure(privateKey).toUint8Array()

  const account = new AptosAccount(privateKeyBytes)

  return account
}
