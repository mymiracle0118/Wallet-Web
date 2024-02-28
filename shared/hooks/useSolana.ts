import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { chromeSyncStorage } from '@portal/shared/utils/chromeSyncStorage'
import { getSolanaBalance, getSolonaWalletUsingSeed } from '@portal/shared/services/solanaService'
import { ethers } from 'ethers'
import { toUTF8Array } from '../utils/utf8'

type SolanaWalletState = {
  createSolanaWallet: (mnemonics?: string) => Promise<any>
  refreshBalance: () => Promise<void>
  _keypair?: Ed25519Keypair | null
  address?: string
  privateKey?: string
  secretKey?: Uint8Array
  balance: number
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
  secretKey: undefined,
  encryptedPrivateKey: [],
}

export const useSolana = create<SolanaWalletState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        createSolanaWallet: async (mnemonics?: string) => {
          const wallet = await getSolonaWalletUsingSeed(mnemonics)
          if (wallet) {
            const encryptedPrivateKey = toUTF8Array(wallet?.privateKey)
            set({ address: wallet?.address, encryptedPrivateKey, secretKey: wallet?.secretKey })
          }

          const { refreshBalance } = get()
          await refreshBalance()
          return wallet
        },
        refreshBalance: async () => {
          const { address } = get()
          if (!address) return
          const balance = await getSolanaBalance(address)
          set({ balance: +balance })
        },
      }),
      {
        name: 'Solana-storage',
        getStorage: () => chromeSyncStorage,
        partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !['wallet'].includes(key))), // Prevents decrypted wallet from being persisted in storage
      }
    ),
    { name: 'Solana - Wallet' }
  )
)
