import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { chromeSyncStorage } from '@portal/shared/utils/chromeSyncStorage'
import { getAptosWalletUsingSeed, getBalance } from '@portal/shared/services/aptosService'
import { ethers } from 'ethers'
import { toUTF8Array } from '../utils/utf8'

type APTOSWalletState = {
  /** APTOS network - create wallet */
  createAptosWallet: (mnemonics?: string) => Promise<any>
  /** APTOS network - Update balance */
  refreshBalance: (aptosType?: string) => Promise<void>
  _keypair?: Ed25519Keypair | null
  /** APTOS network - Wallet Address */
  address?: string
  /** APTOS network - privateKey Address */
  privateKey?: string
  /** APTOS network - Total Balance of wallet */
  balance: number
  /** APTOS network - All objects owned by wallet */
  objectsOwned?: Array<any>

  wallet?: ethers.Wallet
  encryptedPrivateKey: (string | number)[]
  encryptedWallet?: string
}

const initialState = {
  address: undefined,
  balance: 0,
  _keypair: undefined,
  privateKey: undefined,
  encryptedPrivateKey: [],
}

export const useAptos = create<APTOSWalletState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        createAptosWallet: async (mnemonics?: string) => {
          const wallet = await getAptosWalletUsingSeed(mnemonics)
          if (wallet) {
            const encryptedPrivateKey = toUTF8Array(wallet?.privateKey)
            set({ address: wallet?.address, encryptedPrivateKey })
          }

          const { refreshBalance } = get()
          await refreshBalance()
          return wallet
        },
        refreshBalance: async (aptosType?: string) => {
          const { address } = get()
          if (!address) return
          const balance = await getBalance(address, aptosType)
          set({ balance: balance })
        },
      }),
      {
        name: 'APTOS-storage',
        getStorage: () => chromeSyncStorage,
        partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !['wallet'].includes(key))), // Prevents decrypted wallet from being persisted in storage
      }
    ),
    { name: 'APTOS - Wallet' }
  )
)
