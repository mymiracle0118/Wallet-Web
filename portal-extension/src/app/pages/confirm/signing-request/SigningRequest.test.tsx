import React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'

import * as useWalletConnectHooks from '@portal/shared/hooks/useWalletConnect'

import i18n from '@portal/shared/i18n/config'

import SigningRequest from './SigningRequest'

const queryClient = new QueryClient()
const wrapper = (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <SigningRequest />
    </I18nextProvider>
  </QueryClientProvider>
)

describe('Signing Request', () => {
  test('renders correctly Connect Request Page', () => {
    jest.spyOn(useWalletConnectHooks, 'useWalletConnect').mockImplementation(() => ({
      session: {
        connected: true,
        peerMeta: {
          name: 'WalletConnect Example',
          url: 'https://example.walletconnect.org',
          icons: ['https://example.walletconnect.org/favicon.ico'],
        },
      },
      callRequest: {
        params: '0x',
      },
    }))

    const { asFragment } = render(wrapper)
    expect(asFragment()).toMatchSnapshot()
  })
})
