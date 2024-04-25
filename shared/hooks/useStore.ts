import { produce } from 'immer'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { chromeLocalStorage } from '../utils/chromeSyncStorage'
import { IAddressItemProps, NetworkToken, NetworkTokensList } from '../utils/types'
import { useSettings } from './useSettings'
import { AccountWallet, useWallet } from './useWallet'

export type CommonStoreState = {
  clearStore: () => Promise<void>
  currentTokenArrayWithBalance: NetworkTokensList
  walletsList: { [accountId: string]: { [networkKey: string]: AccountWallet } }
  getWalletListByAccountImported: (isAccountImported: boolean) => {
    [accountId: string]: { [networkKey: string]: AccountWallet }
  }
  addWalletToList: (accountId: string, networkKey: string, accountWallet: AccountWallet) => void
  addTokenToList: (accountId: string, tokenKey: string) => void
  removeTokenFromList: (tokenKey: string) => void
  updateCurrentAccountTokensList: (accountId: string) => void
  updateTokenBalance: (tokenKey: string, balance: number, formattedBalance: number) => void
  getNetworkToken: (tokenKey: string) => NetworkToken
  getAccountNetworkAddresses: (token: NetworkToken) => void
  addRemoveFavoriteAsset: (tokenKey: string, isFavoriteValue: boolean) => void
  getDerivationPathIndex: (networkName: string) => number
  removeWalletFromWalletList: (accountId: string) => void
  customNetworks: { [env: string]: { [key: string]: NetworkToken } }
  addCustomNetwork: (token: NetworkToken) => void
}

const initialState = {
  currentTokenArrayWithBalance: {},
  walletsList: {},
  customNetworks: { testNet: {}, mainNet: {} },
}

export const useStore = create<CommonStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        clearStore: async () => {
          set(initialState)
        },
        getWalletListByAccountImported: (isAccountImported) => {
          const { currentAccount, addToken, accounts } = useSettings.getState()
          const { walletsList } = get()
          const { isAccountCreatedByPrivateKey } = useWallet.getState()
          const createdAccounts = Object.values(accounts).filter((account) =>
            isAccountImported
              ? account.isAccountImported || (account.isPrimary && isAccountCreatedByPrivateKey)
              : !account.isAccountImported
          )

          const filteredWalletsList =
            walletsList &&
            Object.fromEntries(
              Object.entries(walletsList).filter(([accountId]) => createdAccounts.some((acc) => acc.id === accountId))
            )
          return filteredWalletsList
        },
        addWalletToList: (accountId: string, networkKey: string, accountWallet: AccountWallet) => {
          set(
            produce((state: CommonStoreState) => {
              if (!state.walletsList || Object.keys(state.walletsList).length === 0) {
                state.walletsList = { [accountId]: { [networkKey]: accountWallet } }
              } else {
                if (!state.walletsList[accountId]) {
                  state.walletsList[accountId] = { [networkKey]: accountWallet }
                } else {
                  state.walletsList[accountId][networkKey] = accountWallet
                }
              }
            })
          )
        },
        addTokenToList: (accountId: string, tokenKey: string) => {
          const networkToken = useWallet.getState().getNetworkTokenWithCurrentEnv(tokenKey)
          const { currentAccount, addToken, accounts } = useSettings.getState()
          if (networkToken && accounts[accountId]) {
            if (currentAccount && currentAccount.id == accountId) {
              set(
                produce((state: CommonStoreState) => {
                  const tokenList = state.currentTokenArrayWithBalance
                  const { walletsList } = get()
                  const networkName = networkToken.isEVMNetwork ? 'ETH' : networkToken.networkName
                  const accountWallet = walletsList[accountId][networkName]
                  if (accountWallet) {
                    tokenList[tokenKey] = {
                      ...networkToken,
                      address: accountWallet.address,
                    } as NetworkToken
                    state.currentTokenArrayWithBalance = tokenList
                  }
                })
              )
            }
            addToken(accountId, networkToken.shortName)
          }
        },
        updateCurrentAccountTokensList: (accountId: string) => {
          const { networkEnvironment, accounts } = useSettings.getState()
          const { getNetworkTokenWithCurrentEnv, getNetworksTokenList } = useWallet.getState()
          const networkTokenList = getNetworksTokenList()
          const { walletsList } = get()
          const tokenList = {}
          if (accounts[accountId]) {
            const accountTokens = accounts[accountId].tokens[networkEnvironment]
            for (const tokenKey in accountTokens) {
              if (networkTokenList[tokenKey]) {
                const networkToken = getNetworkTokenWithCurrentEnv(tokenKey)
                if (networkToken) {
                  const walletNetworkName = networkToken.isEVMNetwork ? 'ETH' : networkToken.networkName
                  const accountWallet = walletsList[accountId][walletNetworkName]
                  if (accountWallet) {
                    tokenList[tokenKey] = {
                      ...networkToken,
                      address: accountWallet.address,
                      ...accountTokens[tokenKey],
                    } as NetworkToken
                  }
                }
              }
            }
          }
          set(
            produce((state: CommonStoreState) => {
              state.currentTokenArrayWithBalance = tokenList
            })
          )
        },
        removeTokenFromList: (tokenKey: string) => {
          const networkToken = useWallet.getState().getNetworkTokenWithCurrentEnv(tokenKey)
          const { currentAccount, updateTokens, networkEnvironment, removeCustomTokensFromAccountList } =
            useSettings.getState()
          set(
            produce((state: CommonStoreState) => {
              if (networkToken.tokenType === 'Native') {
                const tokenList = Object.values(state.currentTokenArrayWithBalance)
                  .filter((a) => !(a.networkName === networkToken.networkName))
                  .reduce((result, token) => {
                    result[token.shortName] = token
                    return result
                  }, {})
                state.currentTokenArrayWithBalance = tokenList
                if (networkToken.isCustom) {
                  if (state.customNetworks[networkEnvironment][tokenKey]) {
                    delete state.customNetworks[networkEnvironment][tokenKey]
                  }
                  removeCustomTokensFromAccountList([tokenKey])
                  const { selectedNetwork, setSelectedNetwork } = useWallet.getState()
                  if (networkToken.networkName === selectedNetwork) {
                    setSelectedNetwork('')
                  }
                }
              } else {
                const tokenList = state.currentTokenArrayWithBalance
                delete tokenList[tokenKey]
                if (networkToken.isCustom) {
                  removeCustomTokensFromAccountList([tokenKey])
                }
                state.currentTokenArrayWithBalance = tokenList
              }
              if (currentAccount) updateTokens(currentAccount?.id, Object.keys(state.currentTokenArrayWithBalance))
            })
          )
        },
        updateTokenBalance: (tokenKey: string, balance: number, formattedBalance: number) => {
          set(
            produce((state: CommonStoreState) => {
              const currentTokensList = state.currentTokenArrayWithBalance
              if (currentTokensList[tokenKey]) {
                currentTokensList[tokenKey] = {
                  ...currentTokensList[tokenKey],
                  balance,
                  formattedBalance,
                }
              }
              state.currentTokenArrayWithBalance = currentTokensList
            })
          )
        },
        addCustomNetwork: async (token: NetworkToken) => {
          const { networkEnvironment, currentAccount } = useSettings.getState()
          set(
            produce((state: CommonStoreState) => {
              const existingToken = { ...state.customNetworks[networkEnvironment] }
              existingToken[token.shortName] = token
              state.customNetworks[networkEnvironment] = existingToken
            })
          )
          if (currentAccount) {
            const accountId = currentAccount.id
            const { addTokenToList } = get()
            addTokenToList(accountId, token.shortName)
          }
        },
        getNetworkToken: (tokenKey: string): NetworkToken => {
          const { currentTokenArrayWithBalance } = get()
          return currentTokenArrayWithBalance[tokenKey]
        },
        getAccountNetworkAddresses: (token: NetworkToken) => {
          if (!token) {
            return []
          }
          const { accounts } = useSettings.getState()
          const { walletsList } = get()
          const walletNetworkName = token.isEVMNetwork ? 'ETH' : token?.isSupraNetwork ? 'SUPRA' : token.networkName
          const networkAddresses = Object.entries(accounts).reduce<IAddressItemProps[]>((acc, [id, account]) => {
            const address = walletsList[account.id]?.[walletNetworkName]?.address
            if (address && address !== token.address) {
              acc.push({
                username: account.username,
                address,
                avatar: account.avatar,
              })
            }
            return acc
          }, [])

          return networkAddresses
        },

        addRemoveFavoriteAsset: (tokenKey: string, isFavoriteValue: boolean) => {
          set(
            produce((state: CommonStoreState) => {
              const currentTokensList = state.currentTokenArrayWithBalance
              if (currentTokensList[tokenKey]) {
                currentTokensList[tokenKey] = {
                  ...currentTokensList[tokenKey],
                  isFavorite: isFavoriteValue,
                }
              }
              state.currentTokenArrayWithBalance = currentTokensList
            })
          )
          const { currentAccount, addRemoveFavoriteToken } = useSettings.getState()
          if (currentAccount) {
            addRemoveFavoriteToken(currentAccount.id, tokenKey, isFavoriteValue)
          }
        },
        getDerivationPathIndex: (networkName: string): number => {
          const filteredWalletsList = Object.values(get().getWalletListByAccountImported(false))

          const indexes: number[] = filteredWalletsList
            .map((walletList) => walletList[networkName]?.derivationPathIndex)
            .filter((index) => typeof index === 'number') as number[]

          const findNextMissingIndex = (indexes: number[]): number => {
            const sortedIndexes = [...indexes].sort((a, b) => a - b)
            for (let i = 0; i < sortedIndexes.length; i++) {
              if (sortedIndexes[i] !== i) {
                return i
              }
            }
            return sortedIndexes.length
          }

          return findNextMissingIndex(indexes)
        },
        removeWalletFromWalletList: (accountId: string) => {
          set(
            produce((state: CommonStoreState) => {
              let walletLists = state.walletsList
              if (walletLists[accountId]) {
                delete walletLists[accountId]
              }
              state.walletsList = walletLists
            })
          )
        },
      }),
      {
        name: 'common-wallet-storage',
        getStorage: () => chromeLocalStorage,
      }
    ),
    { name: 'Star Key - Accounts' }
  )
)
