import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { IClientMeta, IWalletConnectSession } from '@walletconnect/legacy-types'
import WalletConnect from '@walletconnect/legacy-client'
import { ethers } from 'ethers'

import { chromeSyncStorage } from '@portal/shared/utils/chromeSyncStorage'
import { getNetworkProviderByChainId } from '@portal/shared/utils/getNetworkProvider'
import { useSettings } from './useSettings'

export type SessionRequest = {
  id: number
  method: string
  params: Array<{ peerId: string; peerMeta: IClientMeta; chainId: number }>
}

export type CallRequest = {
  id: number
  method: string
  params: Array<unknown>
}

export type WalletConnectState = {
  connector?: WalletConnect
  sessionRequest?: SessionRequest
  callRequest?: CallRequest
  session?: IWalletConnectSession
  selectedChainId: number
  createSession: (uri?: string) => void
  approveSession: (accounts: Array<string>) => void
  rejectSession: () => void
  approveCallRequest: (walletSigner: ethers.Wallet) => Promise<void>
  rejectCallRequest: () => void
  setSelectedChainId: (chainId: number) => void
  disconnect: () => void
  clear: () => void
}

const initialState = {
  selectedChainId: 1,
  connector: undefined,
  sessionRequest: undefined,
  callRequest: undefined,
  session: undefined,
}

const clientMeta = {
  description: 'Shuttle Wallet Developer App',
  url: 'https://walletconnect.org',
  icons: ['https://walletconnect.org/walletconnect-logo.png'],
  name: 'Shuttle Wallet',
}

export const useWalletConnect = create<WalletConnectState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        createSession: (uri?: string) => {
          let connector: WalletConnect

          const { session, selectedChainId } = get()
          if (session && session.connected) {
            connector = new WalletConnect({ session })
            if (selectedChainId !== 1) {
              connector.updateSession({ accounts: session.accounts, chainId: selectedChainId })
            }
          } else {
            connector = new WalletConnect({ uri, clientMeta })
          }

          set({ connector, session: connector.session })

          connector.on('session_request', (error, payload) => {
            set({ sessionRequest: payload })
          })

          connector.on('call_request', (error, payload) => {
            set({ callRequest: payload })
          })

          connector.on('disconnect', (error, payload) => {
            set(initialState)
          })
        },

        approveSession: (accounts: Array<string>) => {
          const { sessionRequest, connector, selectedChainId } = get()
          if (!sessionRequest) {
            throw new Error('No session request')
          }

          if (!connector) {
            throw new Error('No connector')
          }

          connector.approveSession({ accounts, chainId: selectedChainId })
          set({ sessionRequest: undefined, session: connector.session })
        },

        rejectSession: () => {
          const { connector, sessionRequest } = get()
          if (!sessionRequest) {
            throw new Error('No session request')
          }

          if (!connector) {
            throw new Error('No connector')
          }

          connector.rejectSession()
          set(initialState)
        },

        approveCallRequest: async (walletSigner: ethers.Wallet) => {
          try {
            const { connector, callRequest } = get()
            if (!callRequest) {
              throw new Error('No call request')
            }

            if (!connector) {
              throw new Error('No connector')
            }

            const verifyAddressMatch = (address: string) => {
              if (address.toLowerCase() !== walletSigner.address.toLowerCase()) {
                throw new Error('Address mismatch')
              }
            }

            let transaction: ethers.providers.TransactionRequest
            let dataToSign: string
            let result: string

            switch (callRequest.method) {
              case 'personal_sign': {
                dataToSign = callRequest.params[0] as string
                verifyAddressMatch(callRequest.params[1] as string)

                result = await walletSigner.signMessage(
                  ethers.utils.isHexString(dataToSign) ? ethers.utils.arrayify(dataToSign) : dataToSign
                )
                break
              }

              case 'eth_sign': {
                dataToSign = callRequest.params[1] as string
                verifyAddressMatch(callRequest.params[0] as string)

                result = await walletSigner.signMessage(
                  ethers.utils.isHexString(dataToSign) ? ethers.utils.arrayify(dataToSign) : dataToSign
                )
                break
              }

              case 'eth_signTransaction': {
                transaction = callRequest.params[0] as ethers.providers.TransactionRequest
                verifyAddressMatch(transaction.from as string)

                if ('gas' in transaction) {
                  // @ts-ignore
                  transaction.gasLimit = transaction.gas
                  // @ts-ignore
                  delete transaction.gas
                }

                result = await walletSigner.signTransaction(transaction)
                break
              }

              case 'eth_sendTransaction': {
                transaction = callRequest.params[0] as ethers.providers.TransactionRequest
                verifyAddressMatch(transaction.from as string)

                if ('gas' in transaction) {
                  // @ts-ignore
                  transaction.gasLimit = transaction.gas
                  // @ts-ignore
                  delete transaction.gas
                }

                result = (await walletSigner.sendTransaction(transaction)).hash
                break
              }

              case 'wallet_switchEthereumChain': {
                const { chainId } = callRequest.params[0] as { chainId: number }
                result = await walletSigner.signMessage(chainId.toString())
                break
              }

              default:
                throw new Error('Method not supported')
            }

            connector.approveRequest({ id: callRequest.id, result })
          } catch (error) {
            throw new Error(error.message)
          } finally {
            set({ callRequest: undefined })
          }
        },

        rejectCallRequest: () => {
          const { connector, callRequest } = get()
          if (!callRequest) {
            throw new Error('No  call request')
          }

          if (!connector) {
            throw new Error('No connector')
          }

          connector.rejectRequest({ id: callRequest.id, error: { message: 'User rejected request' } })

          set({ callRequest: undefined })
        },

        setSelectedChainId: (chainId: number) => {
          const { connector, session } = get()
          if (connector && session && session.connected) {
            connector.updateSession({ accounts: session.accounts, chainId: chainId })
          }

          set({ selectedChainId: chainId })
        },

        disconnect: async () => {
          const { connector } = get()
          if (!connector) {
            throw new Error('Connector is not initialized')
          }

          try {
            await connector.killSession()
          } catch (error) {
            console.error(error)
          } finally {
            set(initialState)

            const walletConnect = localStorage.getItem('walletconnect')
            if (walletConnect) {
              localStorage.removeItem('walletconnect')
            }
          }
        },

        clear: () => {
          set(initialState)
        },
      }),
      {
        name: 'wallet-connect-storage',
        getStorage: () => chromeSyncStorage,
      }
    ),
    { name: 'Shuttle - Wallet' }
  )
)

export const getWalletSigner = async (chainId: number, address: string, password: string) => {
  const account = Object.values(useSettings.getState().accounts)
    .map((a) => ({
      ...a,
      address: a.address.toLowerCase(),
    }))
    .find((a) => a.address === address.toLowerCase())

  if (!account) {
    throw new Error('Account not found')
  }

  try {
    const provider = getNetworkProviderByChainId(chainId)
    const wallet = await ethers.Wallet.fromEncryptedJson(account.encryptedWallet, password)
    return wallet.connect(provider)
  } catch (error) {
    throw new Error('Wrong password')
  }
}
