import React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'

import * as useSettingsHooks from '@portal/shared/hooks/useSettings'
import * as useWalletConnectHooks from '@portal/shared/hooks/useWalletConnect'

import i18n from '@portal/shared/i18n/config'
import { mockAccounts } from 'utils/mockTestData'

import WalletConnect from 'pages/wallet-connect/WalletConnect'

const queryClient = new QueryClient()
const wrapper = (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <WalletConnect />
    </I18nextProvider>
  </QueryClientProvider>
)

const chainId = 1

describe('<WalletConnect />', () => {
  test('renders correctly no connection', () => {
    const { asFragment } = render(wrapper)
    expect(asFragment()).toMatchSnapshot()
  })

  test('renders correctly with connection', () => {
    jest.spyOn(useSettingsHooks, 'useSettings').mockImplementation(() => ({
      accounts: mockAccounts,
    }))

    jest.spyOn(useWalletConnectHooks, 'useWalletConnect').mockImplementation(() => ({
      selectedChainId: chainId,
      session: {
        chainId: chainId,
        connected: true,
        accounts: [Object.keys(mockAccounts)[0]],
        peerMeta: {
          name: 'WalletConnect Example',
          url: 'https://example.walletconnect.org',
          icons: ['https://example.walletconnect.org/favicon.ico'],
        },
      },
    }))

    const { asFragment } = render(wrapper)
    expect(asFragment()).toMatchSnapshot()
  })
})
