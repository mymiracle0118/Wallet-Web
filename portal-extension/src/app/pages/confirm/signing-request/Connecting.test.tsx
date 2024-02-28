import React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from '@portal/shared/i18n/config'

import * as useWalletConnectHooks from '@portal/shared/hooks/useWalletConnect'
import Connecting from './Connecting'

const mockWalletConnectHook = {
  session: {
    peerMeta: {
      name: 'WalletConnect',
      icons: ['https://walletconnect.org/walletconnect-logo.png'],
      url: 'https://walletconnect.org',
    },
  },
}

const queryClient = new QueryClient()
const wrapper = (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <Connecting />
    </I18nextProvider>
  </QueryClientProvider>
)

describe('<Connecting />', () => {
  beforeEach(() => {
    jest.spyOn(useWalletConnectHooks, 'useWalletConnect').mockImplementation(() => mockWalletConnectHook)
  })

  test('renders correctly', () => {
    const { asFragment } = render(wrapper)
    expect(asFragment()).toMatchSnapshot()
  })
})
