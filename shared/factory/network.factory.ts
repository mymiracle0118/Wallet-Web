import ERC20ABI from '@portal/shared/data/ERC20.json'
import Erc20TokenABI from '@portal/shared/data/Erc20TokenABI.json'
import { ContractTransaction, getTransactions as getEthTransactions } from '@portal/shared/services/etherscan'
import { Asset, GasOption, IResponse, NETWORKS, NetworkToken } from '@portal/shared/utils/types'
import { JsonRpcProvider, Mnemonic, ethers } from 'ethers'

import { useWallet } from '@portal/shared/hooks/useWallet'

import {
  getAptosTransactionByHash,
  getAptosTransactions,
  getAptosWalletUsingPrivateKey,
  getAptosWalletUsingSeed,
  getBalance,
  getFeeDataAptos,
  sendAptos,
} from '@portal/shared/services/aptosService'
import {
  createProvider,
  fetchTokenInfo,
  getSolanaBalance,
  getSolanaFeeData,
  getSolanaTransactionByHash,
  getSolanaTransactions,
  getSolanaWalletUsingPrivateKey,
  getSolonaWalletUsingSeed,
  sendSolana,
} from '@portal/shared/services/solanaService'
import EthereumHelper from './helpers/Ethereum'

import { TransactionBlock } from '@mysten/sui.js/transactions'
import { fromUTF8Array, toUTF8Array } from '@portal/shared/utils/utf8'
import {
  formatErc20TokenConvertNormal,
  getSUITransactions,
  getSuiBalance,
  getSuiGasFeeData,
  getSuiTransaction,
  getSuiWalletUsingPrivateKey,
  getSuiWalletUsingSeed,
  selectCoins,
  sendSuiTransaction,
} from '../services/suiService'

import { SuiClient } from '@mysten/sui.js/client'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { generateRandomString } from '@portal/portal-extension/src/utils/generateRandomString'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import {
  getSupraTransactionByHash,
  getSupraTransactionWithFormation,
  getWalletUsingSeed,
  sendSupraToken,
} from '@portal/shared/services/supraService'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import * as aptos from 'aptos'
import * as supraSDK from 'supra-l1-devnet-sdk'
import Bip39Manager from '../utils/Bip39Manager'
export interface INetwork {
  provider?: any
  createWallet: (mnemonics?: string, derivationPathIndex?: number) => Promise<any>
  recoverWallet: (mnemonic: string) => void
  sendTransaction: (value: any) => Promise<IResponse>
  getEstimatedTransactionCost: (
    maxFeePerGas?: number,
    maxPriorityFeePerGas?: number,
    gasLimit?: number
  ) => Promise<number | null> | string | number
  getMaxPriorityFeePerGas: (value: any) => any
  marketGas: (value?: ethers.BigNumberish) => Promise<string>
  getTransactions: (network?: string, address?: string, contractAddress?: string) => Promise<Array<ContractTransaction>>
  getTokenBalance: (walletAddress: string, asset: NetworkToken) => Promise<number>
  getBalanceFormattedValue: (value?: number) => number
  getFeeData: () => Promise<string>
  getTransactionReceipt: (transactionHash?: string) => any
  getTransaction: (transactionHash?: string, blockNumber?: string) => any
  getBlockExplorerURL: (hash: string, type?: string) => string
  getAddress: () => string
  checkAccountAlreadyImported: (privateKey: string, network: string) => Promise<{ result: boolean; msg: string }>
  checkAddressInImportedAccount: (address: string, network: string) => Promise<{ result: boolean; msg: string }>
  getSigner: (privateKey: string) => Promise<ethers.Wallet | Ed25519Keypair>
  importWalletByPrivateKey: (privateKey: string, network: string) => Promise<{ result: boolean; msg: string }>
  importPrivateKey: (privateKey: string) => Promise<any>
  getCustomToken: (contractAddress: string, walletAddress?: string) => Promise<any>
}
export class CommonNetwork {
  public provider
  public asset: NetworkToken

  getBlockExplorerURL(hash, type = 'tx') {
    if (type == 'tx') {
      return this.asset?.explorerURL?.replace('$tx', hash)
    }
    return this.asset?.explorerAccountURL?.replace('$tx', hash)
  }

  getAddress() {
    const currentAccount = useSettings.getState().currentAccount
    const walletNetworkName = this.asset.isEVMNetwork
      ? 'ETH'
      : this.asset?.isSupraNetwork
      ? 'SUPRA'
      : this.asset.networkName

    return currentAccount && useStore.getState().walletsList[currentAccount.id][walletNetworkName]?.address
  }
  checkAddressInImportedAccount(address: string, network: string) {
    const { getWalletListByAccountImported } = useStore.getState()
    const allWalletList = getWalletListByAccountImported(true)

    // Check if the network has the given address
    const addressExists = Object.values(allWalletList).some((wallet) => wallet[network]?.address === address)
    return addressExists ? { result: false, msg: 'Wallet already exists' } : { result: true, msg: '' }
  }
}
export class EthereumNetwork extends CommonNetwork {
  constructor(asset: NetworkToken) {
    super()
    this.provider = new JsonRpcProvider(asset.providerNetworkRPC_URL)
    this.asset = asset
  }

  async createWallet(mnemonic?: string | undefined, derivationPathIndex?: number) {
    let wallet
    if (mnemonic) {
      if (!Bip39Manager().isMnemonicValid(mnemonic)) {
        throw new Error('Incorrect secret recovery phrase')
      }
      // wallet = await ethers.Wallet.fromMnemonic(
      //   mnemonic,
      //   derivationPathIndex ? `m/44'/60'/0'/0/${derivationPathIndex}` : ''
      // )
      const newMnemonic = Mnemonic.fromPhrase(mnemonic)

      const derivationPath = derivationPathIndex ? `m/44'/60'/0'/0/${derivationPathIndex}` : ''
      wallet = ethers.HDNodeWallet.fromMnemonic(newMnemonic, derivationPath)
    } else {
      wallet = await EthereumHelper.createWallet()
    }

    useWallet.setState({
      wallet: wallet,
      encryptedPrivateKey: toUTF8Array(wallet.privateKey),
    })
    return { wallet, address: wallet.address, encryptedPrivateKey: toUTF8Array(wallet.privateKey) }
  }

  recoverWallet(mnemonic: string) {
    if (!Bip39Manager().isMnemonicValid(mnemonic)) {
      throw new Error('Incorrect secret recovery phrase')
    }
    const wallet = ethers.Wallet.fromPhrase(mnemonic)
    useWallet.setState({
      wallet: wallet,
      encryptedPrivateKey: toUTF8Array(wallet.privateKey),
    })
    return { wallet, address: wallet.address, encryptedPrivateKey: toUTF8Array(wallet.privateKey) }
  }

  async getTokenBalance(walletAddress: string, asset: NetworkToken): Promise<number> {
    try {
      let balance: number
      if (asset.tokenContractAddress) {
        const contract = new ethers.Contract(asset.tokenContractAddress, ERC20ABI, this.provider)
        balance = await contract.balanceOf(walletAddress)
        return Number(balance)
      } else {
        balance = await this.provider.getBalance(walletAddress)
      }
      return balance
    } catch (e) {
      return 0
    }
  }

  getBalanceFormattedValue(value: number) {
    const decimals = Number(this.asset.decimal || '18')
    return Number(ethers.formatUnits(value ? value?.toString() : '0', decimals))
  }

  async getTransactions(network: string, address: string, contractAddress?: string | undefined) {
    return getEthTransactions(this.provider, this.asset, address, contractAddress)
  }

  getEstimatedTransactionCost(maxFeePerGas, maxPriorityFeePerGas, gasLimit) {
    const estimatedTransactionCost = EthereumHelper.getEstimatedTransactionCost({
      maxFeePerGas,
      maxPriorityFeePerGas,
      gasLimit,
    })
    return ethers.formatEther(estimatedTransactionCost as ethers.BigNumberish)
  }

  getMaxPriorityFeePerGas({ maxFeePerGas, gasOption }) {
    const baseFee = ethers.formatUnits(maxFeePerGas, 'gwei')
    const maxFromAmount = (amount: number) => {
      const max = Number(baseFee) < amount ? baseFee.toString() : amount.toString()
      return ethers.parseUnits(max, 'gwei')
    }
    switch (gasOption) {
      case GasOption.Low:
        return maxFromAmount(1.0)
      case GasOption.Market:
        return maxFromAmount(1.5)
      case GasOption.Aggressive:
        return maxFromAmount(2.0)
    }
  }

  async sendTransaction({
    maxPriorityFeePerGas,
    maxFeePerGas,
    gasLimit,
    encryptedPrivateKey,
    transaction,
    fromAddress,
    shouldCancelTransaction,
    cancelTransactionObject,
  }) {
    return EthereumHelper.sendTransaction(
      maxPriorityFeePerGas,
      maxFeePerGas,
      gasLimit,
      encryptedPrivateKey,
      transaction,
      fromAddress,
      shouldCancelTransaction,
      cancelTransactionObject
    )
  }

  async marketGas(maxFeePerGas: ethers.BigNumberish) {
    const feeData = await this.provider.getFeeData()
    return ethers.formatUnits(feeData.gasPrice, 'gwei')
  }

  getTransactionReceipt = async (transactionHash): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.provider
        .getTransactionReceipt(transactionHash)
        .then((receiptResult: any) => {
          resolve(receiptResult)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  getTransaction = async (transactionHash): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.provider
        .getTransaction(transactionHash)
        .then(async (txData: any) => {
          const res = await this.provider.getTransactionReceipt(transactionHash)
          let log: any
          if (this.asset.tokenContractAddress) {
            if (res) {
              log = res.logs.find(
                (log: any) => log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
              )
            } else {
              log = null
            }
            // find transafer topic if multiple events there - '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' is topic of transfer event
          }
          let networkFees: string = '0'
          if (res) {
            networkFees = ethers.formatEther(res?.gasPrice * res?.gasUsed)
          }
          const decimals = this.asset.decimal ?? 6
          const value = this.asset.tokenContractAddress
            ? Number(ethers.formatUnits(log ? log.data.toString() : '0', decimals))
            : Number(ethers.formatUnits(txData.value, txData.tokenDecimal))
          const block = await this.provider.getBlock(txData.blockNumber)

          const feeData: any = await this.getFeeData()

          let customResponse: any
          if (txData.blockNumber && this.asset.tokenContractAddress) {
            const etherscanProvider = new ethers.EtherscanProvider(
              this.asset.networkName === 'ETH'
                ? this.asset.providerNetworkRPC_Network_Name
                : this.asset.networkName.toLowerCase()
            )
            let response = await etherscanProvider.fetch('account', {
              action: 'tokentx',
              startblock: txData.blockNumber,
              endblock: txData.blockNumber,
              address: this.getAddress(),
            })
            customResponse = response[0]
          }

          const tx: any = {
            blockNumber: txData.blockNumber,
            time: block.timestamp || '',
            hash: txData.hash,
            nonce: txData.nonce,
            from: txData.from,
            to: customResponse?.to || txData.to,
            value: value,
            gas: '',
            gasPrice: txData.gasPrice || feeData.gasPrice,
            gasUsed: '',
            cumulativeGasUsed: '',
            tokenDecimal: '',
            networkFees: networkFees,
          }
          resolve(tx)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  getFeeData = async () => {
    return new Promise((resolve, reject) => {
      this.provider
        .getFeeData()
        .then((feeData: any) => {
          resolve(feeData)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  checkAccountAlreadyImported = async (privateKey: string, network: string) => {
    try {
      const signer = await this.getSigner(privateKey)
      return this.checkAddressInImportedAccount(signer.address, network)
    } catch (error) {
      return { result: false, msg: 'Incorrect Private Key' }
    }
  }

  getSigner = async (privateKey: string) => {
    return new ethers.Wallet(privateKey, this.provider)
  }

  importWalletByPrivateKey = async (privateKey: string, network: string) => {
    try {
      const signer = await this.getSigner(privateKey)
      if (signer) {
        useWallet.setState({
          wallet: signer,
          encryptedPrivateKey: toUTF8Array(signer.privateKey),
          isAccountCreatedByPrivateKey: true,
          address: signer.address,
        })
        return { result: true, msg: 'Success!' }
      }
      return { result: false, msg: 'Something is wrong!' }
    } catch (error) {
      let message = 'Something is wrong!'
      if (error instanceof Error) message = error.message
      const errMsg = message.match(/^(.*?)\s?\(/)
      return { result: false, msg: errMsg && errMsg[1] ? errMsg[1] : message }
    }
  }

  // import using private key after logged in
  importPrivateKey = async (privateKey: string) => {
    const signer = await this.getSigner(privateKey)
    return {
      wallet: signer,
      encryptedPrivateKey: toUTF8Array(signer.privateKey),
      address: signer.address,
      isAccountImported: true,
    }
  }

  getCustomToken = async (contractAddress: string, walletAddress: string) => {
    if (contractAddress.length === 42) {
      try {
        let data = new ethers.Contract(contractAddress, Erc20TokenABI, this.provider)
        const symbol = await data.symbol()
        const decimal = await data.decimals()
        const balance = await data?.balanceOf(walletAddress)
        const newToken: NetworkToken = {
          ...this.asset,
          title: symbol,
          subTitle: symbol,
          tokenContractAddress: contractAddress,
          shortName: `${this.asset.networkName}_${symbol}_${generateRandomString(5)}`,
          balance: Number(balance),
          formattedBalance: Number(ethers.formatUnits(balance || 0, Number(decimal)) ?? 9),
          decimal: Number(decimal),
          tokenType: 'ERC20',
          isCustom: true,
        }
        return newToken
      } catch (error) {
        const match = error.toString().match(/:\s*(.*)/)
        const messageSentence = match ? match[1].trim() : ''
        const errorMessage = messageSentence.split('(').length
          ? (messageSentence.split('(')[0] as string)
          : messageSentence

        return {
          error: errorMessage,
        }
      }
    }
    return {
      error: 'Token address must be a valid!',
    }
  }
}

export class SUINetwork extends CommonNetwork {
  constructor(asset: NetworkToken) {
    super()
    this.provider = new SuiClient({
      url: asset.providerNetworkRPC_URL,
    })
    this.asset = asset
  }

  async createWallet(mnemonic?: string | undefined, derivationPathIndex?: number) {
    if (mnemonic) {
      if (Bip39Manager().isMnemonicValid(mnemonic)) {
        const wallet = await getSuiWalletUsingSeed(mnemonic as string, derivationPathIndex)
        if (wallet) {
          useWallet.setState({
            wallet: wallet,
            encryptedPrivateKey: toUTF8Array(wallet.privateKey),
          })
          return { wallet, address: wallet.address, encryptedPrivateKey: toUTF8Array(wallet.privateKey) }
        }
      }
    }
    throw new Error('Incorrect secret recovery phrase')
  }

  async getTokenBalance(walletAddress: string, asset: NetworkToken): Promise<number> {
    return await getSuiBalance(walletAddress, asset)
  }

  getBalanceFormattedValue(value: number) {
    const decimals = Number(this.asset.decimal || '9')
    return Number(ethers.formatUnits(value ? value?.toString() : '0', decimals))
  }

  async getTransactions(network: string, address: string, contractAddress?: string | undefined) {
    const txns = await getSUITransactions(network, address, contractAddress)
    return txns
  }

  async getEstimatedTransactionCost(maxFeePerGas, maxPriorityFeePerGas, gasLimit) {
    const feeData = await this.getFeeData()
    if (!feeData) return 0
    return Number(ethers.formatUnits(parseInt(feeData.gasPrice), 9))
  }

  getMaxPriorityFeePerGas({ maxFeePerGas, gasOption }) {
    const baseFee = ethers.formatUnits(maxFeePerGas, 'gwei')
    const maxFromAmount = (amount: number) => {
      const max = Number(baseFee) < amount ? baseFee.toString() : amount.toString()
      return ethers.parseUnits(max, 'gwei')
    }
    switch (gasOption) {
      case GasOption.Low:
        return maxFromAmount(1.0)
      case GasOption.Market:
        return maxFromAmount(1.5)
      case GasOption.Aggressive:
        return maxFromAmount(2.0)
    }
  }

  async sendTransaction({
    maxPriorityFeePerGas,
    maxFeePerGas,
    gasLimit,
    transaction,
    fromAddress,
    encryptedPrivateKey,
  }) {
    const txb = new TransactionBlock()
    if (transaction.asset.tokenContractAddress) {
      const coins = await selectCoins(
        fromAddress,
        transaction.amount,
        transaction.asset.tokenContractAddress,
        this.provider
      )
      const [coin] = txb.splitCoins(coins[0].objectId, [
        formatErc20TokenConvertNormal(transaction.amount, transaction.asset.decimal),
      ])
      txb.transferObjects([coin], transaction.to)
    } else {
      const [coin] = txb.splitCoins(txb.gas, [
        formatErc20TokenConvertNormal(transaction.amount, transaction.asset.decimal),
      ])
      txb.transferObjects([coin], transaction.to)
    }
    return await sendSuiTransaction(txb, encryptedPrivateKey)
  }

  async marketGas() {
    const feeData = await this.getFeeData()
    if (feeData) {
      // @ts-ignore
      return feeData.gasPrice
    }
    return '0'
  }

  getTransactionReceipt(transactionHash) {
    return { name: Math.random() }
  }

  getTransaction = async (transactionHash): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      getSuiTransaction(transactionHash)
        .then((tx: any) => {
          resolve(tx)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  getFeeData = async () => {
    return new Promise((resolve, reject) => {
      getSuiGasFeeData()
        .then((feeData: any) => {
          resolve(feeData)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  checkAccountAlreadyImported = async (privateKey: string, network: string) => {
    try {
      const signer = await this.getSigner(privateKey)
      return this.checkAddressInImportedAccount(signer.getPublicKey().toSuiAddress(), network)
    } catch (error) {
      return { result: false, msg: 'Incorrect Private Key' }
    }
  }

  getSigner = async (privateKey: string) => {
    let provider = await getSuiWalletUsingPrivateKey(privateKey)
    return provider
  }

  async importWalletByPrivateKey(privateKey: string, network: string) {
    try {
      const signer = await this.getSigner(privateKey)
      if (signer) {
        const walletAddress = signer.getPublicKey().toSuiAddress()
        useWallet.setState({
          wallet: signer,
          encryptedPrivateKey: toUTF8Array(privateKey),
          isAccountCreatedByPrivateKey: true,
          address: walletAddress,
        })

        return { result: true, msg: 'Success!' }
      }
      return { result: false, msg: 'Something is wrong!' }
    } catch (error) {
      let message = 'Something is wrong!'
      if (error instanceof Error) message = error.message
      const errMsg = message.match(/^(.*?)\s?\(/)
      return { result: false, msg: errMsg && errMsg[1] ? errMsg[1] : message }
    }
  }

  importPrivateKey = async (privateKey: string) => {
    const signer = await this.getSigner(privateKey)
    return {
      wallet: signer,
      encryptedPrivateKey: toUTF8Array(privateKey),
      address: signer.getPublicKey().toSuiAddress(),
    }
  }

  getCustomToken = async (contractAddress: string, walletAddress: string) => {
    try {
      const tokenInfo = await this.provider.getCoinMetadata({
        coinType: contractAddress,
      })
      if (tokenInfo) {
        let balance = 0
        let customAsset = {
          ...this.asset,
          tokenContractAddress: contractAddress,
          subTitle: tokenInfo.symbol,
        }
        balance = await this.getTokenBalance(walletAddress, customAsset)

        const newToken: NetworkToken = {
          ...this.asset,
          title: tokenInfo.symbol,
          subTitle: tokenInfo.name,
          tokenContractAddress: contractAddress,
          shortName: `${this.asset.networkName}_${tokenInfo.symbol}_${generateRandomString(5)}`,
          balance: balance,
          formattedBalance: Number(ethers.formatUnits(balance || 0, tokenInfo?.decimals ?? 9)),
          decimal: tokenInfo?.decimals ?? '9',
          tokenType: 'ERC20',
          isCustom: true,
          image: tokenInfo?.iconUrl ?? this.asset.image,
        }
        return newToken
      } else {
        return { error: 'Resource not found by Address' }
      }
    } catch (error: any) {
      const match = error.toString().match(/Error: Invalid struct type: (.+?)\. Got/)[0]
      const errorMessage = match ? match.split(':')[1].trim() : error
      return { error: errorMessage }
    }
  }
}

export class AptosNetwork extends CommonNetwork {
  constructor(asset: NetworkToken) {
    super()
    this.asset = asset
    this.provider = new aptos.AptosClient(this.asset.providerNetworkRPC_URL)
  }

  async createWallet(mnemonic?: string | undefined, derivationPathIndex?: number) {
    if (mnemonic) {
      if (Bip39Manager().isMnemonicValid(mnemonic)) {
        const wallet = await getAptosWalletUsingSeed(mnemonic as string, derivationPathIndex)
        if (wallet) {
          const encryptedPrivateKey = toUTF8Array(wallet.privateKey)
          return { wallet, address: wallet.address, encryptedPrivateKey }
        }
      }
    }
    throw new Error('Incorrect secret recovery phrase')
  }

  async getTokenBalance(walletAddress: string, asset: NetworkToken): Promise<number> {
    return await getBalance(walletAddress, asset?.tokenContractAddress, this.provider)
  }

  getBalanceFormattedValue(value: number) {
    const decimals = Number(this.asset.decimal || '8')
    return Number(ethers.formatUnits(value ? value?.toString() : '0', decimals))
  }

  async getTransactions(network: string, address: string, contractAddress?: string | undefined) {
    const txns = await getAptosTransactions(address, 1, this.provider, contractAddress)
    return txns
  }

  async getEstimatedTransactionCost() {
    const feeData = await this.getFeeData()
    if (!feeData) return 0
    return Number(ethers.formatUnits(parseInt(feeData.gasPrice) * parseInt(feeData.gasUsed), 8))
  }

  getMaxPriorityFeePerGas({ maxFeePerGas, gasOption }) {
    const baseFee = ethers.formatUnits(maxFeePerGas, 'gwei')
    const maxFromAmount = (amount: number) => {
      const max = Number(baseFee) < amount ? baseFee.toString() : amount.toString()
      return ethers.parseUnits(max, 'gwei')
    }
    switch (gasOption) {
      case GasOption.Low:
        return maxFromAmount(1.0)
      case GasOption.Market:
        return maxFromAmount(1.5)
      case GasOption.Aggressive:
        return maxFromAmount(2.0)
    }
  }

  async sendTransaction({
    maxPriorityFeePerGas,
    maxFeePerGas,
    gasLimit,
    encryptedPrivateKey,
    transaction,
    fromAddress,
  }) {
    return sendAptos(transaction, fromUTF8Array(encryptedPrivateKey), this.provider)
  }

  async marketGas() {
    const feeData = await this.getFeeData()
    if (feeData && feeData.gasPrice !== null) {
      return ethers.formatUnits(parseInt(feeData.gasPrice), 0)
    }
  }

  async getFeeData() {
    let encryptedPrivateKey = ''
    const getCurrentAccount = useSettings.getState().currentAccount
    if (getCurrentAccount && getCurrentAccount.encryptedPrivateKey) {
      encryptedPrivateKey = getCurrentAccount.encryptedPrivateKey as string
    }
    return await getFeeDataAptos(this.getAddress(), this.provider, encryptedPrivateKey)
  }

  getTransaction = async (transactionHash): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      getAptosTransactionByHash(transactionHash, this.provider)
        .then((tx: any) => {
          resolve(tx)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  checkAccountAlreadyImported = async (privateKey: string, network: string) => {
    try {
      const signer = await this.getSigner(privateKey)
      return this.checkAddressInImportedAccount(signer.address().toString(), network)
    } catch (error) {
      return { result: false, msg: 'Incorrect Private Key' }
    }
  }

  getSigner = async (privateKey: string) => {
    let provider = await getAptosWalletUsingPrivateKey(privateKey)
    return provider
  }

  async importWalletByPrivateKey(privateKey: string, network: string) {
    try {
      const signer = await this.getSigner(privateKey)
      if (signer) {
        const walletAddress = signer.address().toString()
        useWallet.setState({
          wallet: signer,
          encryptedPrivateKey: toUTF8Array(privateKey),
          isAccountCreatedByPrivateKey: true,
          address: walletAddress,
        })

        return { result: true, msg: 'Success!' }
      }
      return { result: false, msg: 'Something is wrong!' }
    } catch (error) {
      let message = 'Something is wrong!'
      if (error instanceof Error) message = error.message
      const errMsg = message.match(/^(.*?)\s?\(/)
      return { result: false, msg: errMsg && errMsg[1] ? errMsg[1] : message }
    }
  }

  getTransactionReceipt(transactionHash) {
    return { name: Math.random() }
  }

  // import using private key after logged in
  importPrivateKey = async (privateKey: string) => {
    const signer = await this.getSigner(privateKey)
    const accountObj = signer.toPrivateKeyObject()
    return { wallet: signer, encryptedPrivateKey: toUTF8Array(privateKey), address: accountObj.address }
  }

  getCustomToken = async (contractAddress: string, walletAddress: string) => {
    try {
      const client = new aptos.AptosClient(this.asset.providerNetworkRPC_URL)
      const contractAddressValue = contractAddress.split('::')[0]
      const coinInfo = `0x1::coin::CoinInfo<${contractAddress}>`
      const coinStore = `0x1::coin::CoinStore<${contractAddress}>`
      const tokenInfo = await client.getAccountResource(contractAddressValue, coinInfo)
      const tokenBalance = await client.getAccountResource(walletAddress, coinStore)
      const balance = tokenBalance?.data?.coin?.value ? tokenBalance?.data?.coin?.value : 0
      const newToken: NetworkToken = {
        ...this.asset,
        title: tokenInfo?.data?.symbol ?? '',
        subTitle: tokenInfo?.data?.name ?? '',
        tokenContractAddress: contractAddress,
        shortName: `${this.asset.networkName}_${tokenInfo?.data?.symbol}_${generateRandomString(5)}`,
        balance: balance,
        formattedBalance: Number(ethers.formatUnits(balance || 0, tokenInfo?.decimals ?? 8)),
        decimal: tokenInfo?.data?.decimals ?? '8',
        tokenType: tokenInfo?.data?.type ?? 'ERC20',
        isCustom: true,
        image: tokenInfo?.iconUrl ?? this.asset.image,
      }
      return newToken
    } catch (error: any) {
      const errorObject = JSON.parse(error.message)
      const messageSentence = errorObject.message
      const errorMsg = messageSentence.split('(')[0] as string
      // Log the error if needed
      return { error: errorMsg.includes('resource_type') ? 'Resource not found by Address toke::::' : errorMsg }
    }
  }
}

export class SolanaNetwork extends CommonNetwork {
  constructor(asset: NetworkToken) {
    super()
    this.asset = asset
  }

  async createWallet(mnemonic?: string | undefined, derivationPathIndex?: number) {
    if (mnemonic) {
      if (Bip39Manager().isMnemonicValid(mnemonic)) {
        const wallet = await getSolonaWalletUsingSeed(mnemonic, derivationPathIndex)
        if (wallet) {
          useWallet.setState({
            wallet: wallet,
            encryptedPrivateKey: toUTF8Array(wallet.privateKey),
          })
          return { wallet, address: wallet.address, encryptedPrivateKey: toUTF8Array(wallet.privateKey) }
        }
      }
    }
    throw new Error('Incorrect secret recovery phrase')
  }

  async getTransactions(network: string, address: string, contractAddress?: string | undefined) {
    const txns = await getSolanaTransactions(network, address, this.asset.providerNetworkRPC_URL, contractAddress)
    return txns
  }

  async getEstimatedTransactionCost() {
    const feeData = await this.getFeeData()
    if (!feeData) return 0
    return this.getBalanceFormattedValue(feeData.gasPrice)
  }

  getMaxPriorityFeePerGas({ maxFeePerGas, gasOption }) {
    return 0
  }

  async sendTransaction({
    maxPriorityFeePerGas,
    maxFeePerGas,
    gasLimit,
    transaction,
    fromAddress,
    encryptedPrivateKey,
  }) {
    const tx = await sendSolana(transaction, this.asset.providerNetworkRPC_URL, encryptedPrivateKey, fromAddress)
    return tx
  }

  async marketGas() {
    const feeData = await this.getFeeData()
    if (feeData) {
      return feeData.gasPrice
    }
    return 0
  }

  getFeeData = async () => {
    return new Promise((resolve, reject) => {
      getSolanaFeeData(this.asset.providerNetworkRPC_URL, this.getAddress())
        .then((feeData: any) => {
          resolve(feeData)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  async getTokenBalance(walletAddress: string, asset: NetworkToken): Promise<number> {
    if (asset.tokenContractAddress) {
      const ownerAccount = new PublicKey(walletAddress)
      const tokenAccount = new PublicKey(asset?.tokenContractAddress)
      const connection = await createProvider(this.asset.providerNetworkRPC_URL)
      const data = await getAssociatedTokenAddressSync(
        tokenAccount, // token address
        ownerAccount // user address
      )
      const tokenDetails = await connection.getTokenAccountBalance(data)
      return +tokenDetails.value.amount
    } else {
      const solanaBalance = await getSolanaBalance(walletAddress, this.asset.providerNetworkRPC_URL)
      return +solanaBalance
    }
  }

  getBalanceFormattedValue(value: number) {
    const decimals = Number(this.asset.decimal || '9')
    return Number(ethers.formatUnits(value ? value?.toString() : '0', decimals))
  }

  getTransactionReceipt(transactionHash) {
    return { name: Math.random() }
  }

  getTransaction = async (transactionHash): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      getSolanaTransactionByHash(transactionHash, this.asset.providerNetworkRPC_URL, this.asset.tokenContractAddress)
        .then((tx: any) => {
          resolve(tx)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  // import using private key after logged in
  importPrivateKey = async (privateKey: string) => {
    const signer = await this.getSigner(privateKey)
    return {
      wallet: signer,
      encryptedPrivateKey: toUTF8Array(privateKey),
      address: signer.publicKey.toBase58(),
    }
  }

  async importWalletByPrivateKey(privateKey: string, network: string) {
    try {
      const signer = await this.getSigner(privateKey)
      if (signer) {
        const walletAddress = signer.publicKey.toBase58()
        useWallet.setState({
          wallet: signer,
          encryptedPrivateKey: toUTF8Array(privateKey),
          isAccountCreatedByPrivateKey: true,
          address: walletAddress,
        })
        return { result: true, msg: 'Success!' }
      }
      return { result: false, msg: 'Something is wrong!' }
    } catch (error) {
      let message = 'Something is wrong!'
      if (error instanceof Error) message = error.message
      const errMsg = message.match(/^(.*?)\s?\(/)
      return { result: false, msg: errMsg && errMsg[1] ? errMsg[1] : message }
    }
  }

  getSigner = async (privateKey: string) => {
    let provider = await getSolanaWalletUsingPrivateKey(privateKey)
    return provider
  }

  checkAccountAlreadyImported = async (privateKey: string, network: string) => {
    try {
      const signer = await this.getSigner(privateKey)
      return this.checkAddressInImportedAccount(signer.publicKey.toBase58(), network)
    } catch (error) {
      return { result: false, msg: 'Incorrect Private Key' }
    }
  }

  getCustomToken = async (contractAddress: string, walletAddress: string) => {
    try {
      this.asset.tokenContractAddress = contractAddress
      const tokenInfo = await fetchTokenInfo(this.asset)

      if (tokenInfo) {
        const ownerAccount = new PublicKey(walletAddress)
        const tokenAccount = new PublicKey(contractAddress)
        const connection = await createProvider(this.asset.providerNetworkRPC_URL)
        const data = await getAssociatedTokenAddressSync(
          tokenAccount, // token address
          ownerAccount // user address
        )
        const tokenDetails = await connection.getTokenAccountBalance(data)
        const balance = tokenDetails.value.amount ? Number(tokenDetails.value.amount) : 0
        const newToken: NetworkToken = {
          ...this.asset,
          title: tokenInfo?.symbol ?? '',
          subTitle: tokenInfo?.name ?? '',
          tokenContractAddress: contractAddress,
          shortName: `${this.asset.networkName}_${tokenInfo?.symbol}_${generateRandomString(5)}`,
          balance: balance,
          formattedBalance: Number(ethers.formatUnits(balance || 0, tokenInfo?.decimals ?? 9)),
          decimal: tokenInfo?.decimals ?? '6',
          tokenType: tokenInfo?.type ?? 'ERC20',
          isCustom: true,
          image: tokenInfo?.logoURI ?? this.asset.image,
        }
        return newToken
      } else {
        return { error: 'Resource not found by Address' }
      }
    } catch (error) {
      const match = error.toString().match(/:\s*(.*)/)
      const sentenceAfterFirstColon = match ? match[1].trim() : ''
      return { error: sentenceAfterFirstColon }
    }
  }
}

export class SupraNetwork extends CommonNetwork {
  constructor(asset: NetworkToken) {
    super()
    this.asset = asset
  }

  async createWallet(mnemonic?: string | undefined, derivationPathIndex?: number) {
    if (mnemonic) {
      if (Bip39Manager().isMnemonicValid(mnemonic)) {
        const wallet = await getWalletUsingSeed(mnemonic as string, derivationPathIndex || 0)
        if (wallet) {
          const encryptedPrivateKey = toUTF8Array(wallet.privateKey)
          return { wallet, address: wallet.address, encryptedPrivateKey }
        }
      }
    }
    throw new Error('Incorrect secret recovery phrase')
  }

  getSigner = async (privateKey: string) => {
    let provider = await getAptosWalletUsingPrivateKey(privateKey)
    return provider
  }

  async importWalletByPrivateKey(privateKey: string, network: string) {
    try {
      const signer = await this.getSigner(privateKey)
      if (signer) {
        const walletAddress = signer.address().toString()
        useWallet.setState({
          wallet: signer,
          encryptedPrivateKey: toUTF8Array(privateKey),
          isAccountCreatedByPrivateKey: true,
          address: walletAddress,
        })

        return { result: true, msg: 'Success!' }
      }
      return { result: false, msg: 'Something is wrong!' }
    } catch (error) {
      let message = 'Something is wrong!'
      if (error instanceof Error) message = error.message
      const errMsg = message.match(/^(.*?)\s?\(/)
      return { result: false, msg: errMsg && errMsg[1] ? errMsg[1] : message }
    }
  }

  async getTokenBalance(walletAddress: string, asset: Asset): Promise<number> {
    let senderAccount = new aptos.HexString(walletAddress)
    let supraClient = await supraSDK.SupraClient.init(this.asset.providerNetworkRPC_URL)
    let supraBalance = await supraClient.getAccountSupraCoinBalance(senderAccount)
    return Number(supraBalance)
  }

  getBalanceFormattedValue(value: number) {
    const decimals = Number(this.asset.decimal || '6')
    return Number(ethers.formatUnits(value ? value?.toString() : '0', decimals))
  }

  getMaxPriorityFeePerGas({ maxFeePerGas, gasOption }) {
    const baseFee = ethers.formatUnits(maxFeePerGas, 'gwei')
    const maxFromAmount = (amount: number) => {
      const max = Number(baseFee) < amount ? baseFee.toString() : amount.toString()
      return ethers.parseUnits(max, 'gwei')
    }
    switch (gasOption) {
      case GasOption.Low:
        return maxFromAmount(1.0)
      case GasOption.Market:
        return maxFromAmount(1.5)
      case GasOption.Aggressive:
        return maxFromAmount(2.0)
    }
  }

  async getEstimatedTransactionCost() {
    const gasPrice = await this.getFeeData()
    if (!gasPrice) return 0
    return Number(ethers.formatUnits(parseInt(gasPrice.toString()), 6))
  }

  async getFeeData() {
    let supraClient = await supraSDK.SupraClient.init(this.asset.providerNetworkRPC_URL)

    return await supraClient.getGasPrice()
  }

  async marketGas() {
    const feeData = await this.getFeeData()

    if (feeData && feeData !== null) {
      return ethers.formatUnits(parseInt(feeData.toString()), 0)
    }
  }

  async getTransactions(network: string, address: aptos.HexString, contractAddress?: string | undefined) {
    const txns = await getSupraTransactionWithFormation(address, 1, this.asset.providerNetworkRPC_URL)
    return txns
  }

  getTransaction = async (transactionHash): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      getSupraTransactionByHash(transactionHash, this.asset.providerNetworkRPC_URL)
        .then((tx: any) => {
          resolve(tx)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  getAddress() {
    const getCurrentAccount = useSettings.getState().currentAccount
    const currentAccountWallet = useStore.getState().walletsList[getCurrentAccount?.id]
    const address = currentAccountWallet[this.asset.shortName].address
    return address
  }

  getBlockExplorerURL(hash, type = 'tx') {
    if (type == 'tx') {
      return this.asset?.explorerURL?.replace('$tx', hash)
    }
    return this.asset?.explorerAccountURL?.replace('$tx', hash)
  }

  async sendTransaction({
    maxPriorityFeePerGas,
    maxFeePerGas,
    gasLimit,
    encryptedPrivateKey,
    transaction,
    fromAddress,
  }) {
    return sendSupraToken(
      transaction.to,
      transaction.amount,
      fromUTF8Array(encryptedPrivateKey),
      this.asset.providerNetworkRPC_URL
    )
  }

  checkAccountAlreadyImported = async (privateKey: string, network: string) => {
    try {
      const signer = await this.getSigner(privateKey)
      return this.checkAddressInImportedAccount(signer.address().toString(), network)
    } catch (error) {
      return { result: false, msg: 'Incorrect Private Key' }
    }
  }

  // import using private key after logged in
  importPrivateKey = async (privateKey: string) => {
    const signer = await this.getSigner(privateKey)
    const accountObj = signer.toPrivateKeyObject()
    return { wallet: signer, encryptedPrivateKey: toUTF8Array(privateKey), address: accountObj.address }
  }

  getCustomToken = async (contractAddress: string) => {
    console.log('tokenAddress Sup', contractAddress)
  }
}

export class NetworkFactory {
  public static selectNetwork(
    asset: Asset
  ): INetwork | EthereumNetwork | AptosNetwork | SUINetwork | SolanaNetwork | SupraNetwork {
    if (asset.chain === NETWORKS.Ethereum) return new EthereumNetwork(asset)
    if (asset.chain === NETWORKS.APTOS) return new AptosNetwork(asset)
    if (asset.chain === NETWORKS.SUI) return new SUINetwork(asset)
    if (asset.chain === NETWORKS.SOLANA) return new SolanaNetwork(asset)
    return new EthereumNetwork(asset)
  }

  public static checkAndCreateNextDeriveWallet = async (
    mnemonic: string,
    networkName: string,
    nextDerivationPathIndex?: number
  ): Promise<any> => {
    const { getDerivationPathIndex, getWalletListByAccountImported } = useStore.getState()

    const derivationPathIndex = nextDerivationPathIndex ? nextDerivationPathIndex : getDerivationPathIndex(networkName)
    const networkFactory = this.selectByNetworkId(networkName)
    const walletObj = await networkFactory.createWallet(mnemonic, derivationPathIndex)
    const { wallet } = walletObj

    const filteredWalletsList = getWalletListByAccountImported(false)
    const isAddressExist =
      filteredWalletsList &&
      Object.values(filteredWalletsList).some((w) => w[networkName] && w[networkName].address === wallet.address)
    if (isAddressExist) {
      return await this.checkAndCreateNextDeriveWallet(mnemonic, networkName, derivationPathIndex + 1)
    }
    return { ...walletObj, derivationPathIndex }
  }

  public static selectByNetworkId(key: string): INetwork {
    const { getNetworkTokenWithCurrentEnv } = useWallet.getState()
    const asset = getNetworkTokenWithCurrentEnv(key)
    if (asset.isEVMNetwork) return new EthereumNetwork(asset) as INetwork
    if (asset.networkName === 'APT') return new AptosNetwork(asset) as INetwork
    if (asset.networkName === 'SUI') return new SUINetwork(asset) as INetwork
    if (asset.networkName === 'SUPRA' || asset.isSupraNetwork) return new SupraNetwork(asset) as INetwork
    if (asset.networkName === 'SOL') return new SolanaNetwork(asset) as INetwork
    return new EthereumNetwork(asset) as INetwork
  }
}
