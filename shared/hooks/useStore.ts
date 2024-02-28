import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import produce from 'immer'

import { AccountWallet, useWallet } from './useWallet'
import { NetworkToken, NetworkTokensList } from '../utils/types'
import { useSettings } from './useSettings'
import { ethers } from 'ethers'
import { chromeLocalStorage } from '../utils/chromeSyncStorage'

export type CommonStoreState = {
  clearStore: () => void
  currentTokenArrayWithBalance: NetworkTokensList
  walletsList: { [accountKey: string]: { [networkKey: string]: AccountWallet } }
  addWalletToList: (accountKey: string, networkKey: string, accountWallet: AccountWallet) => void
  addTokenToList: (accountKey: string, tokenKey: string) => void
  removeTokenFromList: (tokenKey: string) => void
  updateCurrentAccountTokensList: (accountKey: string) => void
  updateTokenBalance: (
    tokenKey: string,
    balance: ethers.BigNumberish,
    formattedBalance: ethers.BigNumberish | number
  ) => void
  getNetworkToken: (tokenKey: string) => NetworkToken
  addRemoveFavoriteAsset: (tokenKey: string, isFavoriteValue: boolean) => void
  getDeriveIndex: (networkName: string) => number
  removeWalletFromWalletList: (walletLists: { [accountKey: string]: { [networkKey: string]: AccountWallet } }) => void
}

const initialState = {
  currentTokenArrayWithBalance: {},
  walletsList: {},
}

export const useStore = create<CommonStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        clearStore: () => {
          set(initialState)
        },
        addWalletToList: (accountKey: string, networkKey: string, accountWallet: AccountWallet) => {
          set(
            produce((state: CommonStoreState) => {
              if (!state.walletsList || Object.keys(state.walletsList).length === 0) {
                state.walletsList = { [accountKey]: { [networkKey]: accountWallet } }
              } else {
                if (!state.walletsList[accountKey]) {
                  state.walletsList[accountKey] = { [networkKey]: accountWallet }
                } else {
                  state.walletsList[accountKey][networkKey] = accountWallet
                }
              }
            })
          )
        },
        addTokenToList: (accountKey: string, tokenKey: string) => {
          const networkToken = useWallet.getState().getNetworkTokenWithCurrentEnv(tokenKey)
          const { currentAccount, addToken, accounts } = useSettings.getState()
          if (networkToken && accounts[accountKey]) {
            if (currentAccount && currentAccount.address == accountKey) {
              set(
                produce((state: CommonStoreState) => {
                  const tokenList = state.currentTokenArrayWithBalance
                  const { walletsList } = get()
                  const accountWallet = walletsList[accountKey][networkToken.networkName]
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
            addToken(accountKey, networkToken.shortName)
          }
        },
        updateCurrentAccountTokensList: (accountKey: string) => {
          const { networkEnvironment, accounts } = useSettings.getState()
          const { walletsList } = get()
          const tokenList = {}
          if (accounts[accountKey]) {
            const accountTokens = accounts[accountKey].tokens[networkEnvironment]
            for (const tokenKey in accountTokens) {
              const networkToken = useWallet.getState().getNetworkTokenWithCurrentEnv(tokenKey)
              if (networkToken) {
                const accountWallet = walletsList[accountKey][networkToken.networkName]
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
          set(
            produce((state: CommonStoreState) => {
              state.currentTokenArrayWithBalance = tokenList
            })
          )
        },
        removeTokenFromList: (tokenKey: string) => {
          const networkToken = useWallet.getState().getNetworkTokenWithCurrentEnv(tokenKey)
          const { currentAccount, updateTokens } = useSettings.getState()
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
              } else {
                const tokenList = state.currentTokenArrayWithBalance
                delete tokenList[tokenKey]
                state.currentTokenArrayWithBalance = tokenList
              }
              if (currentAccount) updateTokens(currentAccount?.address, Object.keys(state.currentTokenArrayWithBalance))
            })
          )
        },
        updateTokenBalance: (tokenKey: string, balance: ethers.BigNumberish, formattedBalance: ethers.BigNumberish) => {
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
        getNetworkToken: (tokenKey: string): NetworkToken => {
          const { currentTokenArrayWithBalance } = get()
          return currentTokenArrayWithBalance[tokenKey]
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
            addRemoveFavoriteToken(currentAccount.address, tokenKey, isFavoriteValue)
          }
        },
        getDeriveIndex: (networkName: string): number => {
          let deriveIndex = 0
          const { accounts } = useSettings.getState()
          const { walletsList } = get()
          const accountsCreatedByPhrase = Object.values(accounts).filter((acc) => !acc.isAccountImported)
          for (const acc of accountsCreatedByPhrase) {
            if (walletsList[acc.address] && walletsList[acc.address][networkName]) {
              deriveIndex++
            }
          }
          return deriveIndex
        },
        removeWalletFromWalletList: (walletLists: {
          [accountKey: string]: { [networkKey: string]: AccountWallet }
        }) => {
          set(
            produce((state: CommonStoreState) => {
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
    { name: 'Shuttle - Accounts' }
  )
)
