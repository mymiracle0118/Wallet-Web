import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import produce from 'immer'

import type { Asset } from './useWallet'
import { AccountWallet, useWallet } from './useWallet'
import { SAFETY_MEASURE } from '@portal/portal-extension/src/utils/constants'
import { chromeSyncStorage } from '@portal/shared/utils/chromeSyncStorage'
import { setLockUp } from './useLockUp'
import { EnvironmentType, NetworkToken } from '@portal/shared/utils/types'
import { useStore } from './useStore'

export type AddressBookUser = {
  avatar?: string
  username: string
  address: string
  safety?: SAFETY_MEASURE
  network: string
}
export type AccountTokenType = {
  isFavorite: boolean
}
export type TAccount = {
  assets: Array<Asset>
  address: string
  username: string
  encryptedPrivateKey: string
  encryptedWallet: string
  avatar: string
  balance: number
  isAccountImported: boolean
  networkName: string
  tokens: { [env: string]: { [key: string]: AccountTokenType } }
  customTokens: { [env: string]: { [key: string]: NetworkToken } }
  isPrimary: boolean
}

type TAddressBook = {
  username: string
  address: string
}

export type SettingsState = {
  enablePasswordProtection: boolean
  accounts: { [address: string]: TAccount }
  currentAccount: TAccount | null
  darkMode: boolean
  addressBook: AddressBookUser[]
  saveAccount: (
    username: string,
    address: string,
    networkName: string,
    isPrimary?: boolean,
    isAccountImported?: boolean
  ) => void
  clearAccounts: () => void
  clearAddressbook: () => void
  setDarkMode: (mode: boolean) => void
  setEnablePasswordProtection: (enable: boolean) => void
  hideAccount: (address: string) => void
  addToAddressBook: (user: AddressBookUser) => void
  removeToAddressBook: (address: string) => void
  updateUsername: (username: string, address: string) => void
  networkEnvironment: EnvironmentType
  setNetworkEnvironment: (envType: EnvironmentType) => void
  setCurrentAccount: (account: TAccount) => void
  addToken: (accountKey: string, tokenKey: string) => void
  updateTokens: (accountKey: string, tokenKeys: string[]) => void
  addRemoveFavoriteToken: (accountKey: string, tokenKey: string, isFavoriteValue: boolean) => void
  addCustomToken: (token: NetworkToken) => void
}

export const useSettings = create<SettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        accounts: {},
        currentAccount: null,
        addressBook: [],
        enablePasswordProtection: false,
        darkMode: true,
        networkEnvironment: 'testNet',
        setDarkMode: (mode) => {
          set({ darkMode: mode })
        },

        updateUsername: async (newUsername: string, address: string) => {
          set(
            produce((state: SettingsState) => {
              state.accounts[address].username = newUsername
            })
          )
        },

        addToAddressBook: (user: AddressBookUser) => {
          set(
            produce((state: SettingsState) => ({
              addressBook: [...state.addressBook, user],
            }))
          )
        },

        removeToAddressBook: (address: string) => {
          set(
            produce((state: SettingsState) => {
              state.addressBook = state.addressBook.filter((v) => v.address !== address)
            })
          )
        },

        saveAccount: async (username, address, networkName, isPrimary, isAccountImported) => {
          const { avatar, encryptedWallet } = useWallet.getState()
          const { addTokenToList } = useStore.getState()
          if (username && address) {
            const account = {
              address,
              username,
              encryptedWallet,
              avatar,
              networkName,
              isAccountImported: isAccountImported ? isAccountImported : false,
              tokens: { testNet: {}, mainNet: {} },
              customTokens: { testNet: {}, mainNet: {} },
              isPrimary: isPrimary || false,
            }
            set(
              produce((state: SettingsState) => {
                // @ts-ignore
                state.accounts[address] = account
              })
            )
            const { accounts, currentAccount } = get()
            if (!currentAccount || (currentAccount && !currentAccount.address)) {
              set({ currentAccount: accounts[address] })
            }
            addTokenToList(address, networkName)
          }
        },

        clearAccounts: () => {
          set({ accounts: {}, currentAccount: null })
        },

        clearAddressbook: () => {
          set({ addressBook: [] })
        },

        setEnablePasswordProtection: (enable: boolean) => {
          setLockUp(enable)
          set({
            enablePasswordProtection: enable,
          })
        },

        hideAccount: (addressHide: string) => {
          const accountLists = { ...get().accounts }
          if (accountLists[`${addressHide}`]) {
            delete accountLists[`${addressHide}`]
          }

          set(
            produce((state: SettingsState) => {
              state.accounts = accountLists
            })
          )

          const { walletsList } = useStore.getState()
          if (walletsList[`${addressHide}`]) {
            delete walletsList[`${addressHide}`]
            useStore.getState().removeWalletFromWalletList(walletsList)
          }

          const { address } = useWallet.getState()
          if (address) {
            const account = useSettings.getState().accounts[address]
            useSettings.getState().setCurrentAccount(account)
          }
        },
        setNetworkEnvironment: (envType: EnvironmentType) => {
          set(
            produce((state: SettingsState) => {
              state.networkEnvironment = envType
            })
          )
        },
        setCurrentAccount: (account: TAccount) => {
          const { updateCurrentAccountTokensList } = useStore.getState()
          set(
            produce((state: SettingsState) => {
              state.currentAccount = account
            })
          )
          updateCurrentAccountTokensList(account.address)
        },
        addToken: (accountKey, tokenKey: string) => {
          const { networkEnvironment } = get()
          set(
            produce((state: SettingsState) => {
              const existingToken = { ...state.accounts[accountKey].tokens[networkEnvironment] }
              const newToken: AccountTokenType = { isFavorite: false }
              existingToken[tokenKey] = newToken
              state.accounts[accountKey].tokens[networkEnvironment] = existingToken
            })
          )
        },
        addRemoveFavoriteToken: (accountKey: string, tokenKey: string, isFavoriteValue: boolean) => {
          const { networkEnvironment } = get()
          set(
            produce((state: SettingsState) => {
              const existingToken = { ...state.accounts[accountKey].tokens[networkEnvironment] }
              const newToken: AccountTokenType = { isFavorite: false }
              existingToken[tokenKey] = { ...existingToken[tokenKey], isFavorite: isFavoriteValue }
              state.accounts[accountKey].tokens[networkEnvironment] = existingToken
            })
          )
        },
        updateTokens: (accountKey: string, tokenKeys: string[]) => {
          const { networkEnvironment } = get()
          set(
            produce((state: SettingsState) => {
              const existingTokens = { ...state.accounts[accountKey].tokens[networkEnvironment] }
              for (const key in existingTokens) {
                if (!tokenKeys.includes(key)) {
                  delete existingTokens[key]
                }
              }
              state.accounts[accountKey].tokens[networkEnvironment] = existingTokens
            })
          )
        },
        addCustomToken: async (token: NetworkToken) => {
          const { networkEnvironment, currentAccount } = get()
          if (currentAccount) {
            const accountKey = currentAccount.address
            set(
              produce((state: SettingsState) => {
                if (!state.accounts[accountKey].customTokens[networkEnvironment]) {
                  state.accounts[accountKey].customTokens[networkEnvironment] = {}
                }
                const existingToken = { ...state.accounts[accountKey].customTokens[networkEnvironment] }
                existingToken[token.shortName] = token
                state.accounts[accountKey].customTokens[networkEnvironment] = existingToken
              })
            )

            const { addTokenToList, addWalletToList, walletsList } = useStore.getState()

            const newWalletObj: AccountWallet = { ...walletsList[accountKey]['ETH'] }
            await addWalletToList(accountKey, token.networkName, newWalletObj)
            addTokenToList(accountKey, token.shortName)
          }
        },
      }),
      {
        name: 'account-storage',
        getStorage: () => chromeSyncStorage,
      }
    ),
    { name: 'Shuttle - Accounts' }
  )
)
