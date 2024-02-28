import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { chromeSyncStorage } from '@portal/shared/utils/chromeSyncStorage'
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { SuiObjectInfo } from '@mysten/sui.js/src/types'
import { getSuiWalletUsingSeed } from '../services/suiService'
import { CoinBalance } from '@mysten/sui.js/src/client/types'
import { ethers } from 'ethers'
import { toUTF8Array } from '../utils/utf8'
import { remove0xStartOfString } from '@portal/portal-extension/src/utils/constants'

export const SUI_FIXED_GAS_COST = 100

export type SUIWalletState = {
  createSUIWallet: (mnemonic?: string) => Promise<void>
  refreshBalance: () => Promise<void>
  _keypair: Ed25519Keypair | null
  address: string
  encryptedWallet?: string
  wallet?: ethers.Wallet
  encryptedPrivateKey: (string | number)[]
  openWallet: (password: string) => Promise<void>
  privateKey?: string
  balance: CoinBalance
  objectsOwned?: Array<SuiObjectInfo>
  storeWallet: (keypair: Ed25519Keypair, privateKey: string) => Promise<void>
  isAccountCreatedByPrivateKey: boolean
}

const initialState: any = {
  address: undefined,
  balance: undefined,
  _keypair: undefined,
  privateKey: undefined,
  isAccountCreatedByPrivateKey: false,
}

export const suiProvider = new SuiClient({ url: getFullnodeUrl('testnet') })

export const useSUI = create<SUIWalletState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        balance: 0,

        createSUIWallet: async (mnemonic: string) => {
          const wallet = await getSuiWalletUsingSeed(mnemonic)

          const encryptedPrivateKey = wallet ? toUTF8Array(wallet.privateKey) : null
          return { wallet, encryptedPrivateKey }
        },
        openWallet: async (password: string) => {
          const { encryptedWallet } = get()
          if (!encryptedWallet) {
            throw new Error('no stored wallet sui')
          }

          try {
            const response = await chrome.runtime.sendMessage({ message: 'login', password, encryptedWallet })
            if (response.success) {
              const wallet = ethers.Wallet.fromMnemonic(response.mnemonic)
              const encryptedPrivateKey = toUTF8Array(wallet.privateKey)
              set({
                encryptedPrivateKey,
              })
            } else {
              throw new Error('invalid password')
            }
          } catch (error) {
            throw new Error(`Error: ${error.message}`)
          }
        },

        refreshBalance: async () => {
          const { address } = get()
          const totalBalance = await suiProvider.getBalance({ owner: address })
          set({ balance: totalBalance })
        },

        storeWallet: async (keypair: Ed25519Keypair, privateKey: string) => {
          privateKey = remove0xStartOfString(privateKey)
          const encryptedPrivateKey = toUTF8Array(privateKey)
          const suiAddress = keypair.getPublicKey().toSuiAddress()
          set({ address: suiAddress, encryptedPrivateKey, isAccountCreatedByPrivateKey: true })
          return keypair
        },
      }),
      {
        name: 'sui-storage',
        getStorage: () => chromeSyncStorage,
        partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !['wallet'].includes(key))), // Prevents decrypted wallet from being persisted in storage
      }
    ),
    { name: 'SUI - Wallet' }
  )
)
