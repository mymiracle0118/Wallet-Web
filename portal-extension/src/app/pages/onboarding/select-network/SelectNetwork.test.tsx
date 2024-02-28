/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { render, screen, renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'

import { mockAssetsWithSUI, mockNetworkAssets } from 'utils/mockTestData'
import SelectNetwork from 'pages/onboarding/select-network/SelectNetwork'
import * as useWalletHooks from '@portal/shared/hooks/useWallet'
import { useSUI } from '@portal/shared/hooks/useSUI'
import i18n from '@portal/shared/i18n/config'

const queryClient = new QueryClient()

describe('<SelectNetwork />', () => {
  test('Test SUI network. Wallet should be imported', async () => {
    const user = userEvent.setup()
    const { result } = renderHook(() => useSUI())

    act(() => {
      jest.spyOn(useWalletHooks, 'useWallet').mockImplementation(() => ({
        network: 'goerli',
        assets: mockAssetsWithSUI,
        networkAssets: mockNetworkAssets,
        addNetworkAsset: jest.fn((asset) => mockNetworkAssets.push(asset)),
        wallet: {
          address: '0x63C100ac0C36549C7218070294b60C18d813675c',
          mnemonic: {
            phrase: 'wallet oven cigar apology become okay nice soldier right situate trend runway baby',
          },
        },
      }))

      result.current.address = undefined
      result.current.createSUIWallet = jest.fn()
    })
    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <SelectNetwork />
        </I18nextProvider>
      </QueryClientProvider>
    )

    // switch-network-SUI
    await user.click(screen.getByTestId('switch-network-SUI'))
    await user.click(screen.getByTestId('select-network-next-btn'))
    const networkAssets = useWalletHooks.useWallet().networkAssets
    expect(networkAssets.find((asset) => asset.name === 'SUI' && asset.networkId === 'SUI')).not.toBeNull()
  })
})
