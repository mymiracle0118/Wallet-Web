import { ethers } from 'ethers'
import { produce } from 'immer'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { default as defaultAssets } from '../data/assets.json'
import { default as networkTokens } from '../data/networkTokens.json'
import { default as networkUrlsSupraDevnet } from '../data/networkUrls-SupraDevnet.json'
import { default as networkUrlsSupraQanet } from '../data/networkUrls-SupraQanet.json'
import { default as networkUrls } from '../data/networkUrls.json'

import moment from 'moment'

import { ContractTransaction } from '@portal/shared/services/etherscan'
import { chromeLocalStorage } from '@portal/shared/utils/chromeSyncStorage'
import { NetworkFactory } from '../factory/network.factory'

import { GasOption, NetworkToken, NetworkTokensList } from '@portal/shared/utils/types'
import { useSettings } from './useSettings'
// @ts-ignore
import { isAlphaBuild, isBetaBuild } from '@portal/portal-extension/src/app/services/config'
import { decryptData } from '../services/EncryptionService'
import { useSessionStore } from './useSessionStore'
import { useStore } from './useStore'
export type AssetType = 'layer1' | 'erc20' | 'erc721'

export type listNetwork = {
  image?: string
  coin?: string
  name: string
  symbol?: string
  chainId?: number
  chain: string
  testNetwork?: boolean
  networkId: string
  blockExplorer?: string
  enabledAsDefault?: boolean
  networkURL?: string
}

export type Asset = {
  id: string
  network: string
  chain: 'ethereum' | string
  type: AssetType
  contractAddress?: string
  name: string
  symbol?: string
  decimal?: ethers.BigNumberish
  balance?: ethers.BigNumberish
  formattedBalance?: number
  token?: string
  image?: string
  metadata?: { image: string; attributes: Array<{ trait_type: string; value: string }> }
  enabledAsDefault?: boolean
  gasSymbol?: string
  isFavorite?: boolean
}

export type Transaction = {
  symbol: any
  asset: NetworkToken
  to: string
  amount?: string
  gasOption: GasOption
  hash?: string
  nonce?: number
}

export type NetworkAssetsCollection = {
  networkId: string
  coin: string
  image?: string
  imageURL?: string
  address?: string
  active?: boolean
  link?: boolean
  testNetwork?: boolean
  symbol?: string
  name?: string
  chainId?: number
  chain?: string
  rpcUrl?: string
  networkURL?: string
  blockExplorer?: string
  enabledAsDefault?: boolean
}

export type TokenProfitCollection = {
  network: string
  token: string
  value: number
  time: Date
}

export enum OnBoardingTypes {
  privateKey = 'privateKey',
  recoveryPhrase = 'recoveryPhrase',
  fileRecovery = 'fileRecovery',
  createdAccount = 'createdAccount',
}

export type WalletState = {
  onboardingBy: OnBoardingTypes | string
  isCreateWalletProcessCompleted: boolean
  isAccountCreatedByPrivateKey: boolean
  isAccountImported: boolean
  assets: Array<Asset>
  NFTs: Array<Asset>
  networkAssets: Array<NetworkAssetsCollection>
  address?: string
  username?: string
  avatar?: string
  encryptedWallet?: string
  wallet?: ethers.Wallet | any
  encryptedPrivateKey?: (string | number)[] | undefined
  transaction?: Transaction
  transactionDetails?: ContractTransaction
  pendingTransactions?: Array<ContractTransaction>
  lockTime: number
  lockWallet: boolean
  createWallet: () => void
  clearWallet: () => Promise<void>
  storeWallet: (
    walletObj: any,
    username: string,
    password: string,
    network?: string,
    accountId?: string,
    derivationPathIndex?: number
  ) => Promise<string>
  openWallet: (password: string) => Promise<void>
  getAsset: (network: string, assetId: string) => Asset
  getDefaultAsset: (network: string, assetId: string) => Asset
  getNFTAsset: (network: string, contractAddress: string, assetId: string) => Asset
  setTransaction: (transaction: Transaction) => void
  setTransactionDetails: (transactionDetails: ContractTransaction) => void
  setPendingTransactions: (pendingTransactions: ContractTransaction[] | undefined) => void
  sendTransaction: (
    maxPriorityFeePerGas: number,
    maxFeePerGas: number,
    gasLimit: number,
    password?: string,
    shouldCancelTransaction?: boolean,
    cancelTransactionObject?: any
  ) => Promise<{}>
  cancelTransaction: (
    network: string,
    txData: {
      nonce: number
      maxPriorityFeePerGas: number
      maxFeePerGas: number
    }
  ) => Promise<void>
  setLockTimer: (lockTime: number) => void
  setLockWallet: (lock: boolean) => void
  setActiveWallet: (address: string) => void
  addNFT: (nft: Asset) => void
  removeNFT: (nft: Asset) => void
  changeAvatar: (avatar: string) => void
  tokenProfitLossCollection: Array<TokenProfitCollection>
  setTokenProfitLoss: (data: TokenProfitCollection) => void
  setUsername: (username: string) => void
  selectedNetwork?: string
  setSelectedNetwork: (selectedNetwork: string) => void
  networkType: string
  defaultOnboardingNetwork: string
  defaultPrimaryNetwork: string[]
  walletAddress: { [key: string]: { [key: string]: string } }
  currentSelectedToken: NetworkToken | null
  selectedTokensList: string[]
  getNetworksList: () => NetworkToken[]
  getNetworksTokenList: (defaultNetworkOnly?: boolean) => NetworkTokensList
  getNetworkTokenWithCurrentEnv: (key: string) => NetworkToken
  getPhrase: () => string | null
  setCreateWalletProcessCompleted: (isCreateWalletProcessCompleted: boolean) => void
  setOnboardingBy: (onboardingBy: OnBoardingTypes) => void
}

export type AccountWallet = {
  address: string
  derivationPathIndex: number
}

const initialState = {
  assets: [],
  networkAssets: [],
  address: undefined,
  username: undefined,
  avatar: undefined,
  encryptedWallet: undefined,
  wallet: undefined,
  NFTs: [],
  lockTime: 5,
  lockWallet: false,
  pendingTransactions: [],
  tokenProfitLossCollection: [],
  isAccountImported: false,
  selectedNetwork: '',
  networkType: 'testnet',
  isAccountCreatedByPrivateKey: false,
  defaultOnboardingNetwork: 'ETH',
  defaultPrimaryNetwork: ['ETH', 'SUPRA'], //The primary network is not hidden from the token list.
  walletAddress: {},
  currentSelectedToken: null,
  selectedTokensList: [],
  isCreateWalletProcessCompleted: false,
  onboardingBy: '',
}

const encryptOptions = {
  scrypt: {
    N: 1 << 16,
  },
}

// Set supra network Devnet & Qanet url according build type
let defaultNetworkUrls = networkUrls as any
if (isAlphaBuild) {
  defaultNetworkUrls = { ...networkUrls, ...networkUrlsSupraDevnet } as any
} else if (isBetaBuild) {
  defaultNetworkUrls = { ...networkUrls, ...networkUrlsSupraQanet } as any
}

export const useWallet = create<WalletState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        getNetworkTokenWithCurrentEnv: (key: string): NetworkToken => {
          const { networkEnvironment } = useSettings.getState()
          const networkTokenList = get().getNetworksTokenList()
          const token = networkTokenList[key] as NetworkToken
          if (token) {
            const networkUrlsObject =
              defaultNetworkUrls[token.networkName] && defaultNetworkUrls[token.networkName][networkEnvironment]
                ? { ...defaultNetworkUrls[token.networkName][networkEnvironment] }
                : {}
            return { ...token, ...networkUrlsObject }
          }
          throw new Error(`Invalid network token :: ${key}`)
        },
        getNetworksTokenList: (defaultNetworkOnly?: boolean): NetworkTokensList | any => {
          const defaultNetworkTokensList = networkTokens as unknown as NetworkTokensList
          if (defaultNetworkOnly) {
            return defaultNetworkTokensList
          }

          const { networkEnvironment, currentAccount, accounts } = useSettings.getState()
          const { customNetworks } = useStore.getState()

          const accountsCustomToken: NetworkTokensList =
            currentAccount && accounts[currentAccount.id]
              ? accounts[currentAccount.id].customTokens[networkEnvironment]
              : {}

          return { ...defaultNetworkTokensList, ...customNetworks[networkEnvironment], ...accountsCustomToken }
        },
        getNetworksList: (): NetworkToken[] => {
          const networkTokenList = get().getNetworksTokenList()
          const tokens: NetworkToken[] = Object.values(networkTokenList).filter((token) => {
            return token.tokenType === 'Native'
          }) as NetworkToken[]
          return tokens
        },
        createWallet: () => {
          const asset = defaultAssets.find((n) => n.network === 'mainnet') as Asset
          const wallet = NetworkFactory.selectNetwork(asset).createWallet()
          set(wallet)
        },
        clearWallet: async () => {
          set(initialState)
          await useStore.getState().clearStore()
          await useSessionStore.getState().clearStore()
          await useSettings.getState().clearStore()
        },
        storeWallet: async (walletObj: any, username: string, password: string, network: string, accountId: string) => {
          const { address: walletAddress, derivationPathIndex } = walletObj
          const networkToken = get().getNetworkTokenWithCurrentEnv(network)

          // const walletAddress = address ? address : wallet.address
          // let encryptedWallet = null
          //
          // if (networkToken.isEVMNetwork) {
          //   encryptedWallet = await wallet.encrypt(password, encryptOptions)
          // } else {
          //   encryptedWallet = encryptData(wallet, password)
          // }

          const newWalletObj: AccountWallet = {
            address: walletAddress,
            derivationPathIndex: derivationPathIndex ? derivationPathIndex : 0,
          }
          const { addWalletToList, addTokenToList } = useStore.getState()
          await addWalletToList(accountId, networkToken.networkName, newWalletObj)
          await addTokenToList(accountId, networkToken.shortName)

          return walletAddress
        },

        setActiveWallet: async (address: string) => {
          const accounts = useSettings.getState().accounts
          const account = accounts[address]
          if (account) {
            set({ ...account })
          }
        },

        openWallet: async (password: string) => {
          const { currentAccount, accounts } = useSettings.getState()
          const primaryAccount = Object.values(accounts).find((acc) => acc.isPrimary)
          try {
            if (currentAccount && primaryAccount) {
              const { encryptedWallet, encryptedPrivateKey } = primaryAccount
              const wallet = decryptData((encryptedWallet || encryptedPrivateKey) as string, password)
              if (wallet) {
                const { setPassword } = useSessionStore.getState()
                setPassword(password)
                set({
                  lockWallet: false,
                })
              } else {
                throw new Error('Incorrect password')
              }
            }
          } catch (error) {
            console.log(error)
            throw new Error('Incorrect password')
          }
        },

        getAsset: (network: string, assetId: string) => {
          const { assets } = get()
          const asset = assets.find((a) => a.id === assetId && a.network === network)
          if (!asset) {
            throw new Error(`Asset ${assetId} on ${network} network not found`)
          }
          return asset
        },

        getDefaultAsset: (network: string, assetId: string) => {
          const defaultAsset: Asset | undefined = (defaultAssets as Asset[]).find(
            (a) => a.id === assetId && a.network === network
          )
          if (!defaultAsset) {
            throw new Error(`Asset ${assetId} on ${network} network not found`)
          }
          return defaultAsset
        },

        getNFTAsset: (network: string, contractAddress: string, assetId: string) => {
          if (network === 'APTOS') {
            throw new Error(`NFT Asset ${assetId} on ${network} network not found`)
          }
          const { NFTs } = get()
          const asset = NFTs.find(
            (a) => a.id === assetId && a.contractAddress === contractAddress && a.network === network
          )
          if (!asset) {
            throw new Error(`NFT Asset ${assetId} on ${network} network not found`)
          }
          return asset
        },

        setTransaction: (transaction: Transaction) => {
          set({ transaction })
        },

        setTransactionDetails: (transactionDetails: ContractTransaction) => {
          set({ transactionDetails })
        },

        setPendingTransactions: (pendingTransactions: ContractTransaction[] | undefined) => {
          set({ pendingTransactions })
        },

        sendTransaction: async (
          maxPriorityFeePerGas: number,
          maxFeePerGas: number,
          gasLimit: number,
          password?: string,
          shouldCancelTransaction?: boolean,
          cancelTransactionObject?: any
        ) => {
          const { transaction } = get()

          const { accounts, currentAccount } = useSettings.getState()
          const primaryAccount = Object.values(accounts).find((acc) => acc.isPrimary)

          if (currentAccount && transaction) {
            const walletNetworkName = transaction.asset.isEVMNetwork ? 'ETH' : transaction.asset.networkName
            const networkFactory = NetworkFactory.selectByNetworkId(transaction.asset.shortName)
            const currentAccountWallet = useStore.getState().walletsList[currentAccount?.id]

            let encryptedPrivateKey: any
            if (
              currentAccount.isAccountImported ||
              (currentAccount.encryptedPrivateKey && !currentAccount.encryptedWallet)
            ) {
              encryptedPrivateKey = JSON.parse(
                decryptData(currentAccount.encryptedPrivateKey as string, password as string) as string
              )
            } else {
              let encryptedWallet = primaryAccount?.encryptedWallet

              const mnemonic = decryptData(encryptedWallet as string, password as string)
              if (mnemonic) {
                const networkFactory = NetworkFactory.selectByNetworkId(walletNetworkName)
                const walletObj = await networkFactory.createWallet(
                  mnemonic,
                  currentAccountWallet[walletNetworkName].derivationPathIndex
                )
                encryptedPrivateKey = walletObj.encryptedPrivateKey
              }
            }
            if (encryptedPrivateKey) {
              const fromAddress = transaction.asset.address
              let tranData: any
              if (shouldCancelTransaction) {
                tranData = await NetworkFactory.selectByNetworkId(transaction.asset.shortName).sendTransaction({
                  maxPriorityFeePerGas,
                  maxFeePerGas,
                  gasLimit,
                  encryptedPrivateKey,
                  transaction,
                  fromAddress,
                  shouldCancelTransaction,
                  cancelTransactionObject,
                })
                tranData.value = Number(cancelTransactionObject.value as string)
              } else {
                tranData = await NetworkFactory.selectByNetworkId(transaction.asset.shortName).sendTransaction({
                  maxPriorityFeePerGas,
                  maxFeePerGas,
                  gasLimit,
                  encryptedPrivateKey,
                  transaction,
                  fromAddress,
                })
              }
              const { nonce, txHash, txDetails } = tranData
              set(
                produce((state: WalletState) => {
                  if (state.transaction) {
                    state.transaction.hash = txHash
                    state.transaction.nonce = nonce || ''
                  }
                  if (txDetails) {
                    state.pendingTransactions?.unshift({
                      ...txDetails,
                      hash: txHash,
                      nonce,
                      value:
                        tranData.value === 'undefined' || tranData.value === undefined
                          ? state.transaction?.amount
                          : tranData.value,
                      address: fromAddress,
                      from: fromAddress,
                      networkName: transaction.asset.networkName,
                      shortName: transaction.asset.shortName,
                      status: 'Pending',
                      isCustomToken: transaction.asset.tokenContractAddress ? true : false,
                    })
                  }
                })
              )
              return tranData
            } else {
              throw new Error('Transaction signer not found.')
            }
          } else {
            throw new Error('Current Account Or Transaction not found')
          }
        },

        cancelTransaction: async (
          network: string,
          txData: {
            nonce: number
            maxPriorityFeePerGas: number
            maxFeePerGas: number
          }
        ) => {
          try {
            const cancelTransactionObject = {
              ...txData,
              data: '0x',
              to: ethers.ZeroAddress,
              value: ethers.parseEther('0'),
              gasLimit: 58000,
            }
            const password = useSessionStore.getState().getPassword()
            if (password) {
              const cancelledResponse = await useWallet
                .getState()
                .sendTransaction(
                  txData.maxPriorityFeePerGas,
                  txData.maxFeePerGas,
                  58000,
                  password,
                  true,
                  cancelTransactionObject
                )
              return cancelledResponse
            }
          } catch (errorCancel) {
            throw new Error(errorCancel)
          }
        },

        setLockTimer: (lockTime: number) => {
          chrome.storage.local.set({ LOCK_TIME: lockTime })
          set({ lockTime })
        },

        setLockWallet: (lockWallet: boolean) => {
          set({ lockWallet })
        },
        changeAvatar: (avatar: string) => {
          set(
            produce((state: WalletState) => {
              state.avatar = avatar
            })
          )
        },
        addNFT: (nft: Asset) => {
          set(
            produce((state: WalletState) => {
              state.NFTs.push(nft)
            })
          )
        },

        removeNFT: (nft: Asset) => {
          set(
            produce((state: WalletState) => {
              state.NFTs = state.NFTs.filter((i) => i.id !== nft.id && i.contractAddress === nft.contractAddress)
            })
          )
        },

        setTokenProfitLoss: (data: TokenProfitCollection) => {
          const { tokenProfitLossCollection } = get()
          const token = tokenProfitLossCollection.find((v) => v.network === data.network && v.token === data.token)
          const tokenIndex = tokenProfitLossCollection.findIndex(
            (v) => v.network === data.network && v.token === data.token
          )
          const timeDifference = moment().diff(moment(data.time || token?.time), 'hours')
          if (!token) {
            set({
              tokenProfitLossCollection: [...tokenProfitLossCollection, data],
            })
          } else if (timeDifference >= 24) {
            // Replace value and Time to current
            set(
              produce((state: WalletState) => {
                state.tokenProfitLossCollection[tokenIndex].value = data.value
                state.tokenProfitLossCollection[tokenIndex].time = moment().toDate()
              })
            )
          }
        },
        setUsername: (username: string) => {
          set({
            username,
          })
        },
        setSelectedNetwork: (selectedNetwork: string) => {
          set({
            selectedNetwork: selectedNetwork,
          })
        },
        getPhrase: () => {
          const { accounts } = useSettings.getState()
          const { getPassword } = useSessionStore.getState()
          try {
            const primaryAccount = Object.values(accounts).find((acc) => acc.isPrimary)
            const password = getPassword()
            if (primaryAccount && primaryAccount.encryptedWallet && password) {
              return decryptData(primaryAccount.encryptedWallet as string, password)
            } else {
              return null
            }
          } catch (e) {
            console.log(e.message)
            return null
          }
        },
        setCreateWalletProcessCompleted: (isCreateWalletProcessCompleted: boolean) => {
          set({ isCreateWalletProcessCompleted })
        },
        setOnboardingBy: (onboardingBy: OnBoardingTypes) => {
          set({ onboardingBy })
        },
      }),
      {
        name: 'wallet-storage',
        getStorage: () => chromeLocalStorage,
        partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !['wallet'].includes(key))),
      }
    ),
    { name: 'Star Key - Wallet' }
  )
)
