import { encryptionDataSalt } from '@portal/portal-extension/src/app/services/config'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { decryptData, encryptData } from '../services/EncryptionService'
import { chromeSessionStorage } from '../utils/chromeSyncStorage'

export type SessionStoreState = {
  clearStore: () => Promise<void>
  encryptedPassword: string | null
  getPassword: () => string | null
  setPassword: (password: string) => void
  isValidPassword: (password: string) => boolean
}

const initialState = {
  encryptedPassword: null,
}

export const useSessionStore = create<SessionStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        clearStore: async () => {
          set(initialState)
        },
        getPassword: () => {
          const { encryptedPassword } = get()
          if (encryptedPassword) return decryptData(encryptedPassword as string, encryptionDataSalt)
          return null
        },
        isValidPassword: (password: string): boolean => {
          const exitingPassword = get().getPassword()
          return exitingPassword === password
        },
        setPassword: (password: string) => {
          const encryptedPassword: string = encryptData(password, encryptionDataSalt)
          set({ encryptedPassword })
        },
      }),
      {
        name: 'wallet-session-storage',
        getStorage: () => chromeSessionStorage,
      }
    ),
    { name: 'Star Key - Accounts' }
  )
)
