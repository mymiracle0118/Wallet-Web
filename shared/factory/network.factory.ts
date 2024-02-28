import { BigNumber, ethers } from 'ethers'
import produce from 'immer'
import { ContractTransaction, getTransactions as getEthTransactions } from '@portal/shared/services/etherscan'
import { Asset, GasOption, IResponse, NETWORKS, NetworkToken } from '@portal/shared/utils/types'
import ERC20ABI from '@portal/shared/data/ERC20.json'
import type { WalletState } from '@portal/shared/hooks/useWallet'
import { useWallet } from '@portal/shared/hooks/useWallet'

import EthereumHelper from './helpers/Ethereum'
import {
  getAptosTransactionByHash,
  getAptosTransactions,
  getAptosWalletUsingPrivateKey,
  getAptosWalletUsingSeed,
  getBalance,
  getFeeData,
  sendAptos,
} from '@portal/shared/services/aptosService'
import {
  getSolanaBalance,
  getSolanaFeeData,
  getSolanaTransactionByHash,
  getSolanaTransactions,
  getSolanaWalletUsingPrivateKey,
  getSolonaWalletUsingSeed,
  sendSolana,
} from '@portal/shared/services/solanaService'

import { fromUTF8Array, toUTF8Array } from '@portal/shared/utils/utf8'
import {
  formatErc20TokenConvertNormal,
  getSuiBalance,
  getSuiGasFeeData,
  getSuiTransaction,
  getSUITransactions,
  getSuiWalletUsingPrivateKey,
  getSuiWalletUsingSeed,
  sendSuiTransaction,
} from '../services/suiService'
import Decimal from 'decimal.js'
import { TransactionBlock } from '@mysten/sui.js/transactions'

import { useSettings } from '@portal/shared/hooks/useSettings'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import * as aptos from 'aptos'
import * as supraSDK from 'supra-l1-devnet-sdk'
import {
  getSupraTransactionByHash,
  getSupraTransactionWithFormation,
  getWalletUsingSeed,
  sendSupraToken,
} from '@portal/shared/services/supraService'
import { useStore } from '@portal/shared/hooks/useStore'

let supraClient = await supraSDK.SupraClient.init('https://rpc-devnet.supraoracles.com/rpc/v1/')

export interface INetwork {
  provider?: any
  /** Create Wallet from mnemonics as params */
  createWallet: (mnemonics?: string, deriveIndex?: number) => Promise<any>
  recoverWallet: (mnemonic: string) => void
  sendTransaction: (value: any) => Promise<IResponse>
  getEstimatedTransactionCost: (
    maxFeePerGas?: BigNumber,
    maxPriorityFeePerGas?: BigNumber,
    gasLimit?: number
  ) => Promise<number | null> | string | BigNumber
  getMaxPriorityFeePerGas: (value: any) => any
  marketGas: (value?: ethers.BigNumberish) => Promise<string>
  /** Get List of Transaction for Network - Token */
  getTransactions: (network?: string, address?: string, contractAddress?: string) => Promise<Array<ContractTransaction>>
  /** Provide Balance to the Network - Token */
  getTokenBalance: (walletAddress: string, asset: NetworkToken) => Promise<BigNumber | number>
  /** Provide Money value for the balance */
  getBalanceFormattedValue: (value?: number | BigNumber) => number
  getFeeData: () => Promise<string>
  getTransactionReceipt: (transactionHash?: string) => any
  getTransaction: (transactionHash?: string) => any
  getBlockExplorerURL: (hash: string, type?: string) => string
  getAddress: () => string
  checkAccountAlreadyImported: (privateKey: string, network: string) => Promise<{ result: boolean; msg: string }>
  getSigner: (privateKey: string) => Promise<ethers.Wallet | Ed25519Keypair>
  importWalletByPrivateKey: (privateKey: string, network: string) => Promise<{ result: boolean; msg: string }>
  importPrivateKey: (privateKey: string) => Promise<any>
}

export class EthereumNetwork {
  public provider
  public asset: NetworkToken

  constructor(asset: NetworkToken) {
    this.provider = new ethers.providers.JsonRpcProvider(asset.providerNetworkRPC_URL)
    // this.provider = new ethers.providers.InfuraProvider('goerli')
    this.asset = asset
  }

  getBlockExplorerURL(hash, type = 'tx') {
    // const networkData = defaultNetworkAssets.find((n) => n.networkId === this.asset.network)
    // if (networkData?.networkURL) {
    //   return `${networkData?.blockExplorer}/${type}/${hash}`
    // }
    // return `https://${this.asset.network}.etherscan.io/${type}/${hash}`
    if (type == 'tx') {
      return this.asset?.explorerURL?.replace('$tx', hash)
    }
    return this.asset?.explorerAccountURL?.replace('$tx', hash)
  }

  getAddress() {
    // return this.asset.address
    const getCurrentAccount = useSettings.getState().currentAccount
    const currentAccountWallet = useStore.getState().walletsList[getCurrentAccount?.address]
    const address = currentAccountWallet[this.asset.shortName].address
    return address
  }

  async createWallet(mnemonic?: string | undefined, deriveIndex?: number) {
    let wallet
    if (mnemonic) {
      if (!ethers.utils.isValidMnemonic(mnemonic)) {
        throw new Error('Incorrect secret recovery phrase')
      }
      wallet = await ethers.Wallet.fromMnemonic(mnemonic, deriveIndex ? `m/44'/60'/0'/0/${deriveIndex}` : '')
    } else {
      wallet = await EthereumHelper.createWallet()
    }

    // const defaultAssetsValue = defaultAssets.filter(
    //   (n) => n.chain === NETWORKS.Ethereum && n.enabledAsDefault
    // ) as Array<Asset>
    // const defaultNetworkAssetsValue = defaultNetworkAssets.filter((n) => n.enabledAsDefault)
    // return { wallet, assets: defaultAssetsValue, networkAssets: defaultNetworkAssetsValue }

    useWallet.setState({
      wallet: wallet,
      encryptedPrivateKey: toUTF8Array(wallet.privateKey),
    })
    return { wallet, address: wallet.address, encryptedPrivateKey: toUTF8Array(wallet.privateKey) }
  }

  recoverWallet(mnemonic: string) {
    if (!ethers.utils.isValidMnemonic(mnemonic)) {
      throw new Error('Incorrect secret recovery phrase')
    }
    const wallet = ethers.Wallet.fromMnemonic(mnemonic)
    useWallet.setState({
      wallet: wallet,
      encryptedPrivateKey: toUTF8Array(wallet.privateKey),
    })
    return { wallet, address: wallet.address, encryptedPrivateKey: toUTF8Array(wallet.privateKey) }
  }

  async getTokenBalance(walletAddress: string, asset: NetworkToken): Promise<BigNumber> {
    let balance: BigNumber
    if (asset.tokenContractAddress) {
      const contract = new ethers.Contract(asset.tokenContractAddress, ERC20ABI, this.provider)
      const decimals = await contract.decimals()
      balance = await contract.balanceOf(walletAddress)
      return ethers.utils.parseUnits(ethers.utils.formatUnits(balance, decimals).toString())
    } else {
      balance = await this.provider.getBalance(walletAddress)
    }
    return balance
  }

  getBalanceFormattedValue(value: number | BigNumber) {
    return Number(ethers.utils.formatUnits(value || BigNumber.from(0)))
  }

  async getTransactions(network: string, address: string, contractAddress?: string | undefined) {
    return getEthTransactions(this.asset.apiUrl, address, contractAddress)
  }

  getEstimatedTransactionCost(maxFeePerGas, maxPriorityFeePerGas, gasLimit) {
    const estimatedTransactionCost = EthereumHelper.getEstimatedTransactionCost({
      maxFeePerGas,
      maxPriorityFeePerGas,
      gasLimit,
    })
    // return Number(ethers.utils.formatEther(estimatedTransactionCost as ethers.BigNumberish))
    return ethers.utils.formatEther(estimatedTransactionCost as ethers.BigNumberish)
  }

  getMaxPriorityFeePerGas({ maxFeePerGas, gasOption }) {
    const baseFee = ethers.utils.formatUnits(maxFeePerGas, 'gwei')
    const maxFromAmount = (amount: number) => {
      const max = Number(baseFee) < amount ? baseFee.toString() : amount.toString()
      return ethers.utils.parseUnits(max, 'gwei')
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
    return EthereumHelper.sendTransaction(
      maxPriorityFeePerGas,
      maxFeePerGas,
      gasLimit,
      encryptedPrivateKey,
      transaction,
      fromAddress
    )
  }

  async marketGas(maxFeePerGas: ethers.BigNumberish) {
    const gasPrice = await this.provider.getGasPrice()

    return ethers.utils.formatUnits(gasPrice, 'gwei')
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
          let networkFees: string = '0'
          if (txData.maxFeePerGas && txData.maxPriorityFeePerGas) {
            const baseFee = Number(ethers.utils.formatUnits(txData.maxFeePerGas, 'gwei'))
            const tip = Number(ethers.utils.formatUnits(txData.maxPriorityFeePerGas, 'gwei'))
            const gasLimit = 21000
            const total = (gasLimit * (baseFee + tip)).toFixed(5)
            const totalGwei = ethers.utils.parseUnits(total, 'gwei')
            networkFees = ethers.utils.formatEther(totalGwei)
          }
          const value = new Decimal(ethers.utils.formatUnits(txData.value, txData.tokenDecimal))
            .toDecimalPlaces(5)
            .toString()

          const block = await this.provider.getBlock(txData.blockNumber)

          const tx: any = {
            blockNumber: txData.blockNumber,
            time: block.timestamp,
            hash: txData.hash,
            nonce: txData.nonce,
            from: txData.from,
            to: txData.to,
            value: value,
            gas: '',
            gasPrice: '',
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
      const allWalletList = useStore.getState().walletsList

      // Check if the network has the given address
      let addressExists = Object.values(allWalletList).some((wallet) => wallet[network]?.address === signer.address)
      if (addressExists) {
        return { result: false, msg: 'Account already Exist!' }
      }
      return { result: true, msg: '' }
    } catch (error) {
      return { result: false, msg: 'An error occurred, indicating that the private key is not valid' }
    }
  }

  getSigner = async (privateKey: string) => {
    return new ethers.Wallet(privateKey, this.provider)
  }

  // import using private key when onboarding
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
      // An error occurred, indicating that the private key is not valid
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
}

export class SUINetwork {
  public provider
  public asset

  constructor(asset: NetworkToken) {
    this.asset = asset
    // this.provider = getNetworkProvider(asset.network)
  }

  getBlockExplorerURL(hash, type = 'tx') {
    if (type == 'tx') {
      return this.asset?.explorerURL?.replace('$tx', hash)
    }
    return this.asset?.explorerAccountURL?.replace('$tx', hash)
  }

  getAddress() {
    // return this.asset.address
    const getCurrentAccount = useSettings.getState().currentAccount
    const currentAccountWallet = useStore.getState().walletsList[getCurrentAccount?.address]
    const address = currentAccountWallet[this.asset.shortName].address
    return address
  }

  async createWallet(mnemonic?: string | undefined, deriveIndex?: number) {
    // const { createSUIWallet } = useSUI.getState()
    // return createSUIWallet(mnemonic)
    if (mnemonic) {
      if (ethers.utils.isValidMnemonic(mnemonic)) {
        const wallet = await getSuiWalletUsingSeed(mnemonic as string, deriveIndex)
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

  async getTokenBalance(walletAddress: string, asset: Asset): Promise<number> {
    return await getSuiBalance(walletAddress, asset)
  }

  getBalanceFormattedValue(value: number | BigNumber) {
    return Number(ethers.utils.formatUnits(value || BigNumber.from(0), 9))
  }

  async getTransactions(network: string, address: string, contractAddress?: string | undefined) {
    const txns = await getSUITransactions(network, address, contractAddress)
    return txns
  }

  async getEstimatedTransactionCost(maxFeePerGas, maxPriorityFeePerGas, gasLimit) {
    const feeData = await this.getFeeData()
    if (!feeData) return 0
    return Number(ethers.utils.formatUnits(parseInt(feeData.gasPrice), 9))
    // return Number(ethers.utils.formatUnits(parseInt(feeData.gasPrice) * parseInt(feeData.gasUsed), 9))
  }

  getMaxPriorityFeePerGas({ maxFeePerGas, gasOption }) {
    const baseFee = ethers.utils.formatUnits(maxFeePerGas, 'gwei')
    const maxFromAmount = (amount: number) => {
      const max = Number(baseFee) < amount ? baseFee.toString() : amount.toString()
      return ethers.utils.parseUnits(max, 'gwei')
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
    const [coin] = txb.splitCoins(txb.gas, [formatErc20TokenConvertNormal(Number(transaction.amount), 9)])
    txb.transferObjects([coin], transaction.to)
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
      if (signer) {
        const allWalletList = useStore.getState().walletsList

        // Check if the network has the given address
        let addressExists = Object.values(allWalletList).some(
          (wallet) => wallet[network]?.address === signer.getPublicKey().toSuiAddress()
        )
        if (addressExists) {
          return { result: false, msg: 'Account already Exist!' }
        }
        return { result: true, msg: 'Success!' }
      }
      return { result: false, msg: 'Something is wrong!' }
    } catch (error) {
      return { result: false, msg: 'An error occurred, indicating that the private key is not valid' }
    }
  }

  getSigner = async (privateKey: string) => {
    let provider = await getSuiWalletUsingPrivateKey(privateKey)
    return provider
  }

  // import using private key when onboarding
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
      // An error occurred, indicating that the private key is not valid
      return { result: false, msg: errMsg && errMsg[1] ? errMsg[1] : message }
    }
  }

  // import using private key after logged in
  importPrivateKey = async (privateKey: string) => {
    const signer = await this.getSigner(privateKey)
    return {
      wallet: signer,
      encryptedPrivateKey: toUTF8Array(privateKey),
      address: signer.getPublicKey().toSuiAddress(),
    }
  }
}

export class AptosNetwork {
  public provider
  public asset

  constructor(asset: NetworkToken) {
    this.asset = asset
  }

  getBlockExplorerURL(hash, type = 'tx') {
    if (type == 'tx') {
      return this.asset?.explorerURL?.replace('$tx', hash)
    }
    return this.asset?.explorerAccountURL?.replace('$tx', hash)
  }

  getAddress() {
    // return this.asset.address
    const getCurrentAccount = useSettings.getState().currentAccount
    const currentAccountWallet = useStore.getState().walletsList[getCurrentAccount?.address]
    const address = currentAccountWallet[this.asset.shortName].address
    return address
  }

  async createWallet(mnemonic?: string | undefined, deriveIndex?: number) {
    if (mnemonic) {
      if (ethers.utils.isValidMnemonic(mnemonic)) {
        const wallet = await getAptosWalletUsingSeed(mnemonic as string, deriveIndex)
        if (wallet) {
          const encryptedPrivateKey = toUTF8Array(wallet.privateKey)
          return { wallet, address: wallet.address, encryptedPrivateKey }
        }
      }
    }
    throw new Error('Incorrect secret recovery phrase')
  }

  async getTokenBalance(walletAddress: string, asset: NetworkToken): Promise<number> {
    //TODO: need to check about aptosType
    const aptosType = '0x1::aptos_coin::AptosCoin'
    return await getBalance(walletAddress, aptosType)
  }

  getBalanceFormattedValue(value: number | BigNumber) {
    return Number(ethers.utils.formatUnits(value || BigNumber.from(0), 8))
  }

  async getTransactions(network: string, address: string, contractAddress?: string | undefined) {
    const txns = await getAptosTransactions(address, 1)
    return txns
  }

  async getEstimatedTransactionCost() {
    const feeData = await this.getFeeData()
    if (!feeData) return 0
    return Number(ethers.utils.formatUnits(parseInt(feeData.gasPrice) * parseInt(feeData.gasUsed), 8))
  }

  getMaxPriorityFeePerGas({ maxFeePerGas, gasOption }) {
    const baseFee = ethers.utils.formatUnits(maxFeePerGas, 'gwei')
    const maxFromAmount = (amount: number) => {
      const max = Number(baseFee) < amount ? baseFee.toString() : amount.toString()
      return ethers.utils.parseUnits(max, 'gwei')
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
    return sendAptos(transaction.to, transaction.amount, fromUTF8Array(encryptedPrivateKey))
  }

  async marketGas() {
    const feeData = await this.getFeeData()
    if (feeData && feeData.gasPrice !== null) {
      return ethers.utils.formatUnits(parseInt(feeData.gasPrice), 0)
    }
  }

  async getFeeData() {
    const getCurrentAccount = useSettings.getState().currentAccount
    const currentAccountWallet = useStore.getState().walletsList[getCurrentAccount?.address]
    const encryptedPrivateKey = currentAccountWallet[this.asset.shortName].encryptedPrivateKey

    return await getFeeData(this.getAddress(), fromUTF8Array(encryptedPrivateKey))
  }

  getTransaction = async (transactionHash): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      getAptosTransactionByHash(transactionHash)
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
      if (signer) {
        const allWalletList = useStore.getState().walletsList
        // Check if the network has the given address
        let addressExists = Object.values(allWalletList).some(
          (wallet) => wallet[network]?.address === signer.address().toString()
        )
        if (addressExists) {
          return { result: false, msg: 'Account already Exist!' }
        }
        return { result: true, msg: 'Success!' }
      }
      return { result: false, msg: 'Something is wrong!' }
    } catch (error) {
      return { result: false, msg: 'An error occurred, indicating that the private key is not valid' }
    }
  }

  getSigner = async (privateKey: string) => {
    let provider = await getAptosWalletUsingPrivateKey(privateKey)
    return provider
  }

  // import using private key when onboarding
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
      // An error occurred, indicating that the private key is not valid
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
}

export class SolanaNetwork {
  public provider
  public asset

  constructor(asset: NetworkToken) {
    this.asset = asset
    // this.provider = getNetworkProvider(asset.network)
  }

  getBlockExplorerURL(hash, type = 'tx') {
    if (type == 'tx') {
      return this.asset?.explorerURL?.replace('$tx', hash)
    }
    return this.asset?.explorerAccountURL?.replace('$tx', hash)
  }

  getAddress() {
    // const { address } = useWallet()
    // return address
    const getCurrentAccount = useSettings.getState().currentAccount
    const currentAccountWallet = useStore.getState().walletsList[getCurrentAccount?.address]
    const address = currentAccountWallet[this.asset.shortName].address
    return address
  }

  async createWallet(mnemonic?: string | undefined, deriveIndex?: number) {
    if (mnemonic) {
      if (ethers.utils.isValidMnemonic(mnemonic)) {
        const wallet = await getSolonaWalletUsingSeed(mnemonic, deriveIndex)
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
    const txns = await getSolanaTransactions(network, address, contractAddress)
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
    const tx = await sendSolana(transaction.to, transaction.amount, fromAddress, encryptedPrivateKey)
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
      getSolanaFeeData(this.getAddress())
        .then((feeData: any) => {
          resolve(feeData)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  async getTokenBalance(walletAddress: string, asset: Asset): Promise<number> {
    const solanaBalance = await getSolanaBalance(walletAddress)
    useWallet.setState(
      produce((state: WalletState) => {
        const assetToUpdate = state.assets.find((a) => a.id === asset.id && a.network === asset.network)
        if (assetToUpdate) {
          assetToUpdate.balance = +solanaBalance
        }
      })
    )
    return +solanaBalance
  }

  getBalanceFormattedValue(value: number | BigNumber) {
    return Number(ethers.utils.formatUnits(value || BigNumber.from(0), 9))
  }

  getTransactionReceipt(transactionHash) {
    return { name: Math.random() }
  }

  getTransaction = async (transactionHash): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      getSolanaTransactionByHash(transactionHash)
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

  // import using private key when onboarding
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
      // An error occurred, indicating that the private key is not valid
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
      if (signer) {
        const allWalletList = useStore.getState().walletsList

        // Check if the network has the given address
        let addressExists = Object.values(allWalletList).some(
          (wallet) => wallet[network]?.address === signer.publicKey.toBase58()
        )
        if (addressExists) {
          return { result: false, msg: 'Account already Exist!' }
        }
        return { result: true, msg: 'Success!' }
      }
      return { result: false, msg: 'Something is wrong!' }
    } catch (error) {
      return { result: false, msg: 'An error occurred, indicating that the private key is not valid' }
    }
  }
}

export class SupraNetwork {
  public provider
  public asset

  constructor(asset?: NetworkToken) {
    this.asset = asset
  }

  async createWallet(mnemonic?: string | undefined, deriveIndex?: number) {
    if (mnemonic) {
      if (ethers.utils.isValidMnemonic(mnemonic)) {
        const wallet = await getWalletUsingSeed(mnemonic as string, deriveIndex)
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

  // import using private key when onboarding
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
      // An error occurred, indicating that the private key is not valid
      return { result: false, msg: errMsg && errMsg[1] ? errMsg[1] : message }
    }
  }

  async getTokenBalance(walletAddress: string, asset: Asset): Promise<number> {
    let senderAccount = new aptos.HexString(walletAddress)
    let supraBalance = await supraClient.getAccountSupraCoinBalance(senderAccount)
    return Number(supraBalance)
  }

  getBalanceFormattedValue(value: number | BigNumber) {
    return Number(ethers.utils.formatUnits(value || BigNumber.from(0), 6))
  }

  getMaxPriorityFeePerGas({ maxFeePerGas, gasOption }) {
    const baseFee = ethers.utils.formatUnits(maxFeePerGas, 'gwei')
    const maxFromAmount = (amount: number) => {
      const max = Number(baseFee) < amount ? baseFee.toString() : amount.toString()
      return ethers.utils.parseUnits(max, 'gwei')
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
    return Number(ethers.utils.formatUnits(parseInt(gasPrice.toString()), 6))
  }

  async getFeeData() {
    return await supraClient.getGasPrice()
  }

  async marketGas() {
    const feeData = await this.getFeeData()

    if (feeData && feeData !== null) {
      return ethers.utils.formatUnits(parseInt(feeData.toString()), 0)
    }
  }

  async getTransactions(network: string, address: aptos.HexString, contractAddress?: string | undefined) {
    const txns = await getSupraTransactionWithFormation(address, 1)
    return txns
  }

  getTransaction = async (transactionHash): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      getSupraTransactionByHash(transactionHash)
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
    const currentAccountWallet = useStore.getState().walletsList[getCurrentAccount?.address]
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
    return sendSupraToken(transaction.to, transaction.amount, fromUTF8Array(encryptedPrivateKey))
  }

  checkAccountAlreadyImported = async (privateKey: string, network: string) => {
    try {
      const signer = await this.getSigner(privateKey)
      if (signer) {
        const allWalletList = useStore.getState().walletsList
        // Check if the network has the given address
        let addressExists = Object.values(allWalletList).some(
          (wallet) => wallet[network]?.address === signer.address().toString()
        )
        if (addressExists) {
          return { result: false, msg: 'Account already Exist!' }
        }
        return { result: true, msg: 'Success!' }
      }
      return { result: false, msg: 'Something is wrong!' }
    } catch (error) {
      return { result: false, msg: 'An error occurred, indicating that the private key is not valid' }
    }
  }

  // import using private key after logged in
  importPrivateKey = async (privateKey: string) => {
    const signer = await this.getSigner(privateKey)
    const accountObj = signer.toPrivateKeyObject()
    return { wallet: signer, encryptedPrivateKey: toUTF8Array(privateKey), address: accountObj.address }
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
    nextDeriveIndex?: number
  ): Promise<any> => {
    const { getDeriveIndex, walletsList } = useStore.getState()

    const deriveIndex = nextDeriveIndex ? nextDeriveIndex : getDeriveIndex(networkName)
    const networkFactory = this.selectByNetworkId(networkName)
    const walletObj = await networkFactory.createWallet(mnemonic, deriveIndex)
    const { wallet } = walletObj
    const isAddressExist =
      walletsList &&
      Object.values(walletsList).filter((w) => w[networkName] && w[networkName].address === wallet.address).length > 0
    if (isAddressExist) {
      return await this.checkAndCreateNextDeriveWallet(mnemonic, networkName, deriveIndex + 1)
    }
    return { ...walletObj, deriveIndex }
  }

  public static selectByNetworkId(key: string): INetwork {
    const { getNetworkTokenWithCurrentEnv } = useWallet.getState()
    const asset = getNetworkTokenWithCurrentEnv(key)
    if (asset.isEVMNetwork) return new EthereumNetwork(asset) as INetwork
    if (asset.networkName === 'APT') return new AptosNetwork(asset) as INetwork
    if (asset.networkName === 'SUI') return new SUINetwork(asset) as INetwork
    if (asset.networkName === 'SUPRA') return new SupraNetwork(asset) as INetwork
    if (asset.networkName === 'SOL') return new SolanaNetwork(asset) as INetwork
    return new EthereumNetwork(asset) as INetwork
  }
}
