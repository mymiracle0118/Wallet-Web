import { produce } from 'immer'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { SAFETY_MEASURE } from '@portal/portal-extension/src/utils/constants'
import { generateRandomString } from '@portal/portal-extension/src/utils/generateRandomString'
import { decryptData, encryptData } from '@portal/shared/services/EncryptionService'
import { chromeLocalStorage } from '@portal/shared/utils/chromeSyncStorage'
import { EnvironmentType, NetworkToken } from '@portal/shared/utils/types'
import { useSessionStore } from './useSessionStore'
import { useStore } from './useStore'
import type { Asset } from './useWallet'
import { useWallet } from './useWallet'

export type AddressBookUser = {
  avatar?: string
  username: string
  address: string
  safety?: SAFETY_MEASURE
  network: string
}
export type AccountTokenType = {
  isFavorite: boolean
  recentInteractionAddress?: string[]
}

export interface IAccountUpdateProps {
  avatar: string
  username: string
}

export type TAccount = {
  id: string
  assets: Array<Asset>
  address: string
  username: string
  encryptedPrivateKey?: (string | number)[] | undefined | string
  encryptedWallet?: string | null
  avatar: string
  balance: number
  isAccountImported: boolean
  networkName: string
  tokens: { [env: string]: { [key: string]: AccountTokenType } }
  customTokens: { [env: string]: { [key: string]: NetworkToken } }
  isPrimary: boolean
}
export type IAccountSaveProps = {
  id: string
  address: string
  username: string
  networkName: string
  encryptedPrivateKey?: (string | number)[] | undefined | string
  encryptedWallet?: string | null
  isPrimary?: boolean
  isAccountImported?: boolean
  avatar?: string
}

type TAddressBook = {
  username: string
  address: string
}

export type SettingsState = {
  enablePasswordProtection: boolean
  isSavedRecoveryFile: boolean
  accounts: { [address: string]: TAccount }
  currentAccount: TAccount | null
  darkMode: boolean
  addressBook: AddressBookUser[]
  saveAccount: (accountObj: IAccountSaveProps) => void
  getNewAccountId: () => string
  clearAccounts: () => void
  clearAddressbook: () => void
  setDarkMode: (mode: boolean) => void
  setEnablePasswordProtection: (enable: boolean) => void
  hideAccount: (accountId: string) => void
  setIsSavedRecoveryFile: (enable: boolean) => void
  addToAddressBook: (user: AddressBookUser) => void
  removeToAddressBook: (address: string) => void
  updateAccountInfo: (accountId: string, accountInfo: IAccountUpdateProps) => void
  networkEnvironment: EnvironmentType
  setNetworkEnvironment: (envType: EnvironmentType) => void
  setCurrentAccount: (account: TAccount) => void
  addToken: (accountId: string, tokenKey: string) => void
  removeCustomTokensFromAccountList: (tokenKeys: string[]) => void
  updateTokens: (accountId: string, tokenKeys: string[]) => void
  addRemoveFavoriteToken: (accountId: string, tokenKey: string, isFavoriteValue: boolean) => void
  addCustomToken: (token: NetworkToken) => void
  reEncryptAccountsWhenChangedPassword: (currentPassword: string, newPassword: string) => void
  enableHideBalance: boolean
  setEnableHideBalance: (enable: boolean) => void
  enableHideLawBalance: boolean
  setEnableHideLawBalance: (enable: boolean) => void
  clearStore: () => Promise<void>
  setRecentIntractAddress: (address: string, network: string) => void
  getRecentIntractAddress: (network: string) => string[]
}

const initialState = {
  accounts: {},
  currentAccount: null,
  addressBook: [],
  enablePasswordProtection: false,
  isSavedRecoveryFile: false,
  darkMode: true,
  enableHideBalance: false,
  enableHideLawBalance: false,
  networkEnvironment: 'testNet' as EnvironmentType,
}

export const useSettings = create<SettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        clearStore: async () => {
          set(initialState)
        },
        setDarkMode: (mode) => {
          set({ darkMode: mode })
        },
        updateAccountInfo: async (accountId: string, accountInfo: IAccountUpdateProps) => {
          set(
            produce((state: SettingsState) => {
              state.accounts[accountId] = { ...state.accounts[accountId], ...accountInfo }
              if (state.currentAccount?.id === accountId) {
                state.currentAccount = { ...state.currentAccount, ...accountInfo }
              }
            })
          )
        },
        changeAvatar: async (accountId: string, avatar: string) => {
          set(
            produce((state: SettingsState) => {
              state.accounts[accountId].avatar = avatar
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
        getNewAccountId: (): string => {
          return `${Object.keys(get().accounts).length}${generateRandomString(5)}`
        },
        saveAccount: async (accountObj: IAccountSaveProps) => {
          const { username, address, networkName, isPrimary, isAccountImported, avatar } = accountObj
          const { avatar: defaultAvatar, encryptedWallet } = useWallet.getState()
          const { addTokenToList } = useStore.getState()

          if (username && address) {
            const account = {
              ...accountObj,
              id: accountObj.id || get().getNewAccountId(),
              isAccountImported: isAccountImported ? isAccountImported : false,
              tokens: { testNet: {}, mainNet: {} },
              customTokens: { testNet: {}, mainNet: {} },
              isPrimary: isPrimary || false,
              avatar: avatar || defaultAvatar,
            }
            set(
              produce((state: SettingsState) => {
                // @ts-ignore
                state.accounts[account.id] = account
              })
            )
            const { accounts, currentAccount } = get()
            if (!currentAccount || (currentAccount && !currentAccount.id)) {
              set({ currentAccount: accounts[account.id] })
            }
            addTokenToList(account.id, networkName)
          }
        },

        clearAccounts: () => {
          set({ accounts: {}, currentAccount: null })
        },

        clearAddressbook: () => {
          set({ addressBook: [] })
        },

        setEnablePasswordProtection: (enable: boolean) => {
          set({
            enablePasswordProtection: enable,
          })
        },
        setIsSavedRecoveryFile: (enable: boolean) => {
          set({
            isSavedRecoveryFile: enable,
          })
        },

        hideAccount: (accountId: string) => {
          const { removeWalletFromWalletList } = useStore.getState()
          const accountLists = { ...get().accounts }
          if (accountLists[accountId]) {
            delete accountLists[accountId]
          }
          set(
            produce((state: SettingsState) => {
              state.accounts = accountLists
            })
          )
          removeWalletFromWalletList(accountId)
        },
        setNetworkEnvironment: (envType: EnvironmentType) => {
          const fromEnv = envType === 'mainNet' ? 'testNet' : 'mainNet'
          const networksTokens = useWallet.getState().getNetworksTokenList(true)

          set(
            produce((state: SettingsState) => {
              state.networkEnvironment = envType

              /* Add tokens when environment changes for the first time */
              for (let account of Object.values(state.accounts)) {
                const accountTokens = account.tokens[envType]
                const fromEnvTokens = account.tokens[fromEnv]

                if (!Object.keys(accountTokens).length && fromEnvTokens) {
                  const newTokens = Object.fromEntries(
                    Object.entries(fromEnvTokens)
                      .filter(
                        ([tokenKey]) => networksTokens[tokenKey] && networksTokens[tokenKey].tokenType === 'Native'
                      )
                      .map(([tokenKey]) => [tokenKey, { isFavorite: false }])
                  )

                  state.accounts[account.id].tokens[envType] = newTokens
                }
              }
            })
          )

          const { currentAccount } = get()
          if (currentAccount) {
            useStore.getState().updateCurrentAccountTokensList(currentAccount.id)
          }
        },
        setCurrentAccount: (account: TAccount) => {
          const { updateCurrentAccountTokensList } = useStore.getState()
          set(
            produce((state: SettingsState) => {
              state.currentAccount = account
            })
          )
          updateCurrentAccountTokensList(account.id)
        },
        addToken: (accountId, tokenKey: string) => {
          const { networkEnvironment } = get()
          set(
            produce((state: SettingsState) => {
              const existingToken = { ...state.accounts[accountId].tokens[networkEnvironment] }
              const newToken: AccountTokenType = { isFavorite: false }
              existingToken[tokenKey] = newToken
              state.accounts[accountId].tokens[networkEnvironment] = existingToken
            })
          )
        },
        addRemoveFavoriteToken: (accountId: string, tokenKey: string, isFavoriteValue: boolean) => {
          const { networkEnvironment } = get()
          set(
            produce((state: SettingsState) => {
              const existingToken = { ...state.accounts[accountId].tokens[networkEnvironment] }
              existingToken[tokenKey] = { ...existingToken[tokenKey], isFavorite: isFavoriteValue }
              state.accounts[accountId].tokens[networkEnvironment] = existingToken
            })
          )
        },
        removeCustomTokensFromAccountList: (tokenKeys: string[]) => {
          const { networkEnvironment } = get()
          set(
            produce((state: SettingsState) => {
              for (const accountId in state.accounts) {
                const accountTokens = { ...state.accounts[accountId].customTokens[networkEnvironment] }
                for (const key of tokenKeys) {
                  if (accountTokens[key]) {
                    delete accountTokens[key]
                  }
                }
                state.accounts[accountId].customTokens[networkEnvironment] = accountTokens
              }
            })
          )
        },
        updateTokens: (accountId: string, tokenKeys: string[]) => {
          const { networkEnvironment } = get()
          set(
            produce((state: SettingsState) => {
              const existingTokens = { ...state.accounts[accountId].tokens[networkEnvironment] }
              for (const key in existingTokens) {
                if (!tokenKeys.includes(key)) {
                  delete existingTokens[key]
                }
              }
              state.accounts[accountId].tokens[networkEnvironment] = existingTokens
            })
          )
        },
        addCustomToken: async (token: NetworkToken) => {
          const { networkEnvironment, currentAccount } = get()
          if (currentAccount) {
            const accountId = currentAccount.id
            set(
              produce((state: SettingsState) => {
                if (!state.accounts[accountId].customTokens[networkEnvironment]) {
                  state.accounts[accountId].customTokens[networkEnvironment] = {}
                }
                const existingToken = { ...state.accounts[accountId].customTokens[networkEnvironment] }
                existingToken[token.shortName] = token
                state.accounts[accountId].customTokens[networkEnvironment] = existingToken
              })
            )

            const { addTokenToList } = useStore.getState()
            addTokenToList(accountId, token.shortName)
          }
        },

        reEncryptAccountsWhenChangedPassword: (currentPassword: string, newPassword: string) => {
          const { accounts } = get()
          // encrypt accounts with new password
          const updatedAccounts = Object.fromEntries(
            Object.keys(accounts).map((key) => {
              const account = accounts[key]
              let updatedAccount = { ...account }
              if (account.encryptedPrivateKey) {
                const decryptedPrivateKey = decryptData(account.encryptedPrivateKey as string, currentPassword)
                updatedAccount.encryptedPrivateKey = encryptData(decryptedPrivateKey, newPassword)
              }
              if (account.encryptedWallet) {
                const decryptedWallet = decryptData(account.encryptedWallet, currentPassword)
                updatedAccount.encryptedWallet = encryptData(decryptedWallet, newPassword)
              }
              return [key, updatedAccount]
            })
          )

          // update accounts with encrypted data by new password
          set(
            produce((state: SettingsState) => {
              // @ts-ignore
              state.accounts = updatedAccounts
            })
          )

          // set new password
          const { setPassword } = useSessionStore.getState()
          setPassword(newPassword)

          // logout when change password
          const { setLockWallet } = useWallet.getState()
          setLockWallet(true)
        },

        setEnableHideBalance: (enable: boolean) => {
          set({
            enableHideBalance: enable,
          })
        },

        setEnableHideLawBalance: (enable: boolean) => {
          set({
            enableHideLawBalance: enable,
          })
        },

        setRecentIntractAddress: (address: string, network: string) => {
          const { currentAccount, networkEnvironment } = get()
          set(
            produce((state: SettingsState) => {
              if (currentAccount) {
                const currentToken = state.accounts[currentAccount.id].tokens[networkEnvironment][network]

                // If recentInteractionAddress does not exist, create it as an empty array
                if (!currentToken.recentInteractionAddress) {
                  currentToken.recentInteractionAddress = []
                }

                // Remove address if it already exists in the array
                const existingIndex = currentToken.recentInteractionAddress.indexOf(address)
                if (existingIndex !== -1) {
                  currentToken.recentInteractionAddress.splice(existingIndex, 1)
                }

                // Add new address to the beginning of the array
                currentToken.recentInteractionAddress.unshift(address)

                // Remove oldest address if the array exceeds 5 elements
                if (currentToken.recentInteractionAddress.length > 5) {
                  currentToken.recentInteractionAddress.pop()
                }
              }
            })
          )
        },

        getRecentIntractAddress: (network: string) => {
          const { accounts, currentAccount, networkEnvironment } = get()
          if (currentAccount) {
            return accounts[currentAccount.id]?.tokens[networkEnvironment][network]?.recentInteractionAddress ?? []
          }
          return []
        },
      }),
      {
        name: 'account-storage',
        getStorage: () => chromeLocalStorage,
      }
    ),
    { name: 'Star Key - Accounts' }
  )
)
