import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { ethers } from 'ethers'
import produce from 'immer'

import { default as defaultAssets } from '../data/assets.json'
import { default as networkTokens } from '../data/networkTokens.json'
import { default as networkUrls } from '../data/networkUrls.json'

import moment from 'moment'

import { toUTF8Array } from '@portal/shared/utils/utf8'
import { getNetworkProvider } from '@portal/shared/utils/getNetworkProvider'
import { chromeSyncStorage } from '@portal/shared/utils/chromeSyncStorage'
import { ContractTransaction } from '@portal/shared/services/etherscan'
import { NetworkFactory } from '../factory/network.factory'

import { useSettings } from './useSettings'
import { EnvironmentType, GasOption, NetworkToken, NetworkTokensList } from '@portal/shared/utils/types'
// @ts-ignore
import defaultAvatar from 'assets/images/Avatar.png'
import { useStore } from './useStore'
import { decryptData, encryptData } from '@portal/portal-extension/src/utils/constants'

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

export type WalletState = {
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
  clearWallet: () => void
  suiWallet?: any
  setSuiWallet?: (wallet: any) => void
  storeWallet: (
    walletObj: any,
    username: string,
    password: string,
    network?: string,
    accountKey?: string,
    deriveIndex?: number
  ) => Promise<string>
  openWallet: (password: string) => Promise<void>
  recoverWallet: (mnemonic: string) => void
  getAsset: (network: string, assetId: string) => Asset
  getDefaultAsset: (network: string, assetId: string) => Asset
  getNFTAsset: (network: string, contractAddress: string, assetId: string) => Asset
  setTransaction: (transaction: Transaction) => void
  addNetworkAsset: (networkAsset: NetworkAssetsCollection) => void
  removeNetworkAsset: (networkAssetId: string) => void
  setTransactionDetails: (transactionDetails: ContractTransaction) => void
  setPendingTransactions: (pendingTransactions: ContractTransaction[] | undefined) => void
  sendTransaction: (
    maxPriorityFeePerGas: ethers.BigNumber,
    maxFeePerGas: ethers.BigNumber,
    gasLimit: number
  ) => Promise<{}>
  cancelTransaction: (
    network: string,
    txData: {
      nonce: string
      maxPriorityFeePerGas: ethers.BigNumber
      maxFeePerGas: ethers.BigNumber
    }
  ) => Promise<void>
  setLockTimer: (lockTime: number) => void
  setLockWallet: (lock: boolean) => void
  setActiveWallet: (address: string) => void
  addCustomToken: (tokenData: Asset) => Promise<void>
  removeToken: (network: string, assetId: string) => void
  addNFT: (nft: Asset) => void
  removeNFT: (nft: Asset) => void
  changeAvatar: (avatar: string) => void
  getNetworkList: () => Array<{ network: string; image: string | undefined }>
  tokenProfitLossCollection: Array<TokenProfitCollection>
  setTokenProfitLoss: (data: TokenProfitCollection) => void
  setUsername: (username: string) => void
  selectedNetwork?: string
  setSelectedNetwork: (selectedNetwork: string) => void
  networkType: string
  setNetworkType: (type: any) => void
  defaultOnboardingNetwork: string
  defaultNetworkTokens: { [key: string]: { [x: string]: string } } | null
  defaultNetworkUrls: { [key: string]: { [envType: string]: { [key: string]: string } } } | null
  walletAddress: { [key: string]: { [key: string]: string } }
  tokenArrayWithBalance: NetworkTokensList
  currentSelectedToken: NetworkToken | null
  selectedTokensList: string[]
  tokensList: NetworkTokensList
  getNetworksList: () => NetworkToken[]
  getNetworksTokenList: () => NetworkTokensList
  refreshTokenList: (envType: EnvironmentType) => void
  getNetworkTokenWithCurrentEnv: (key: string) => NetworkToken
}

export type AccountWallet = {
  address: string
  encryptedWallet?: string | null
  encryptedPrivateKey?: (string | number)[] | undefined
  isPrimary: boolean
  deriveIndex?: number
}

const getTokensListWithEnvUrls = (envType: EnvironmentType): NetworkTokensList => {
  let tokens: NetworkTokensList = {}
  for (const key in networkTokens) {
    const token = networkTokens[key]
    tokens[key] = { ...token, ...networkUrls[token.networkName][envType] }
  }
  return tokens
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
  defaultNetworkTokens: null, // networkTokens as any,
  defaultNetworkUrls: null, //networkUrls as any,
  walletAddress: {},
  tokenArrayWithBalance: {},
  currentSelectedToken: null,
  selectedTokensList: [],
  tokensList: getTokensListWithEnvUrls('testNet'),
}

const encryptOptions = {
  scrypt: {
    N: 1 << 16,
  },
}

export const defaultNetworkTokens = networkTokens as any
export const defaultNetworkUrls = networkUrls as any

export const useWallet = create<WalletState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        refreshTokenList: (envType: EnvironmentType) => {
          const tokens: { [key: string]: NetworkToken } = getTokensListWithEnvUrls(envType)
          set({ tokensList: tokens })
        },
        getNetworkTokenWithCurrentEnv: (key: string): NetworkToken => {
          const { networkEnvironment } = useSettings.getState()
          const networkTokenList = get().getNetworksTokenList()
          const token = networkTokenList[key] as NetworkToken
          if (token) {
            const networkUrlsObject =
              networkUrls[token.networkName] && networkUrls[token.networkName][networkEnvironment]
                ? { ...networkUrls[token.networkName][networkEnvironment] }
                : {}
            return { ...token, ...networkUrlsObject }
          }
          throw new Error(`Invalid network token :: ${key}`)
        },
        getNetworksTokenList: (): NetworkTokensList | any => {
          const { networkEnvironment, currentAccount, accounts } = useSettings.getState()

          const defaultNetworkTokensList = networkTokens as unknown as NetworkTokensList
          let accountsCustomToken: NetworkTokensList =
            currentAccount && accounts[currentAccount.address]
              ? accounts[currentAccount.address].customTokens[networkEnvironment]
              : {}
          return { ...defaultNetworkTokensList, ...accountsCustomToken }
        },
        getNetworksList: (): NetworkToken[] => {
          const { tokensList } = get()
          const networkTokenList = get().getNetworksTokenList()
          const tokens: NetworkToken[] = Object.values(networkTokenList).filter((token) => {
            return token.tokenType === 'Native'
          }) as NetworkToken[]
          return tokens
        },
        setNetworkType: (type) => {
          set({ networkType: type })
        },
        createWallet: () => {
          const asset = defaultAssets.find((n) => n.network === 'mainnet') as Asset
          const wallet = NetworkFactory.selectNetwork(asset).createWallet()
          set(wallet)
        },
        setSuiWallet: (wallet) => {
          set({ suiWallet: wallet })
        },
        clearWallet: () => {
          set(initialState)
          useStore.getState().clearStore()
        },

        addNetworkAsset: (networkAsset: NetworkAssetsCollection) => {
          set(
            produce((state: WalletState) => {
              state.networkAssets.push(networkAsset)
            })
          )
        },
        removeNetworkAsset: (networkAssetId: string) => {
          set(
            produce((state: WalletState) => {
              state.networkAssets = state.networkAssets.filter((n) => n.networkId !== networkAssetId)
            })
          )
        },
        storeWallet: async (
          walletObj: any,
          username: string,
          password: string,
          network: string,
          accountKey?: string
        ) => {
          const { wallet, encryptedPrivateKey, address, deriveIndex } = walletObj
          const networkToken = get().getNetworkTokenWithCurrentEnv(network)

          if (!wallet) {
            throw new Error('no wallet created')
          }

          const walletAddress = address ? address : wallet.address
          let encryptedWallet = null

          if (networkToken.isEVMNetwork) {
            encryptedWallet = await wallet.encrypt(password, encryptOptions)
          } else {
            encryptedWallet = encryptData(wallet, password)
          }

          const newWalletObj: AccountWallet = {
            address: walletAddress,
            encryptedPrivateKey: encryptedPrivateKey,
            encryptedWallet,
            isPrimary: false,
            deriveIndex: deriveIndex,
          }
          const { addWalletToList, addTokenToList } = useStore.getState()
          await addWalletToList(accountKey || walletAddress, networkToken.networkName, newWalletObj)
          await addTokenToList(accountKey || walletAddress, networkToken.shortName)

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
          const { currentAccount } = useSettings.getState()
          const { walletsList } = useStore.getState()
          try {
            if (currentAccount) {
              const accountWallet = walletsList[currentAccount.address][currentAccount.networkName]
              const networkToken = useWallet.getState().getNetworkTokenWithCurrentEnv(currentAccount.networkName)
              let checkPassword: any
              if (networkToken.isEVMNetwork) {
                checkPassword = await ethers.Wallet.fromEncryptedJson(
                  accountWallet.encryptedWallet as string,
                  password as string
                )
              } else {
                checkPassword = await decryptData(accountWallet.encryptedWallet as string, password as string)
              }
              if (checkPassword) {
                set({
                  lockWallet: false,
                })
              }
            }
            throw new Error('Invalid password.')
          } catch (error) {
            throw new Error(`Error: ${error.message}`)
          }
        },

        recoverWallet: (mnemonic: string) => {
          if (!ethers.utils.isValidMnemonic(mnemonic)) {
            throw new Error('Incorrect secret recovery phrase')
          }

          const wallet = ethers.Wallet.fromMnemonic(mnemonic)
          set({ wallet, encryptedPrivateKey: toUTF8Array(wallet.privateKey) })
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
          maxPriorityFeePerGas: ethers.BigNumber,
          maxFeePerGas: ethers.BigNumber,
          gasLimit: number
        ) => {
          const { transaction } = get()
          const getCurrentAccount = useSettings.getState().currentAccount
          if (getCurrentAccount && transaction) {
            const currentAccountWallet = useStore.getState().walletsList[getCurrentAccount?.address]
            const encryptedPrivateKey = currentAccountWallet[transaction.asset.shortName]?.encryptedPrivateKey

            const fromAddress = transaction.asset.address

            const tranData = await NetworkFactory.selectByNetworkId(transaction.asset.shortName).sendTransaction({
              maxPriorityFeePerGas,
              maxFeePerGas,
              gasLimit,
              encryptedPrivateKey,
              transaction,
              fromAddress,
            })
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
                    value: state.transaction?.amount,
                  })
                }
              })
            )
            return tranData
          } else {
            throw new Error('Current Account Or Transaction not found')
          }
        },

        cancelTransaction: async (
          network: string,
          txData: {
            nonce: string
            maxPriorityFeePerGas: ethers.BigNumber
            maxFeePerGas: ethers.BigNumber
          }
        ) => {
          const { wallet } = get()
          if (wallet) {
            const provider = getNetworkProvider(network)
            const walletSigner = wallet.connect(provider)
            await walletSigner.sendTransaction({
              ...txData,
              data: '0x',
              to: ethers.constants.AddressZero,
              value: ethers.utils.parseEther('0.1'),
              gasLimit: 58000,
            })
          }
        },

        setLockTimer: (lockTime: number) => {
          chrome.storage.local.set({ LOCK_TIME: lockTime })
          set({ lockTime })
        },

        setLockWallet: (lockWallet: boolean) => {
          set({ lockWallet })
        },

        addCustomToken: async (tokenData: Asset) => {
          set(
            produce((state: WalletState) => {
              state.assets.push(tokenData)
            })
          )

          useSettings.getState().saveAccount()
        },

        removeToken: (network: string, assetId: string) => {
          set(
            produce((state: WalletState) => {
              state.assets = state.assets.filter((a) => !(a.id === assetId && a.network === network))
            })
          )

          useSettings.getState().saveAccount()
        },

        changeAvatar: (avatar: string) => {
          set(
            produce((state: WalletState) => {
              state.avatar = avatar
            })
          )

          useSettings.getState().saveAccount()
        },

        addNFT: (nft: Asset) => {
          set(
            produce((state: WalletState) => {
              state.NFTs.push(nft)
            })
          )

          useSettings.getState().saveAccount()
        },

        removeNFT: (nft: Asset) => {
          set(
            produce((state: WalletState) => {
              state.NFTs = state.NFTs.filter((i) => i.id !== nft.id && i.contractAddress === nft.contractAddress)
            })
          )

          useSettings.getState().saveAccount()
        },

        getNetworkList: () => {
          const { assets } = get()
          const assetsWithImage = assets.map(({ image, network }) => ({
            network,
            image,
          }))

          return [...new Map(assetsWithImage.map((item) => [item['network'], item])).values()]
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
      }),
      {
        name: 'wallet-storage',
        getStorage: () => chromeSyncStorage,
        partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !['wallet'].includes(key))),
      }
    ),
    { name: 'Shuttle - Wallet' }
  )
)
