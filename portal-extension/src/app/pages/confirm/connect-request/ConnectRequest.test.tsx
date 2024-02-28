import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from '@portal/shared/i18n/config'

import * as useSettingsHooks from '@portal/shared/hooks/useSettings'
import * as useWalletConnectHooks from '@portal/shared/hooks/useWalletConnect'

import ConnectRequest from 'pages/confirm/connect-request/ConnectRequest'

const mockAccountAddress = '0xcea68AdfE6D57Ff021EE9E999364b3Fb3B99Ad8d'
const mockSettingsHook = {
  accounts: {
    [mockAccountAddress]: {
      username: 'account-1',
      address: mockAccountAddress,
    },
  },
}

const mockWalletConnectHook = {
  approveSession: jest.fn(),
  rejectSession: jest.fn(),
  sessionRequest: {
    id: '',
    method: '',
    params: [
      {
        peerMeta: {
          name: 'WalletConnect',
          icons: ['https://walletconnect.org/walletconnect-logo.png'],
          url: 'https://walletconnect.org',
        },
      },
    ],
  },
}

const queryClient = new QueryClient()
const wrapper = (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <ConnectRequest />
    </I18nextProvider>
  </QueryClientProvider>
)

describe('<ConnectRequest />', () => {
  beforeEach(() => {
    jest.spyOn(useSettingsHooks, 'useSettings').mockImplementation(() => mockSettingsHook)
    jest.spyOn(useWalletConnectHooks, 'useWalletConnect').mockImplementation(() => mockWalletConnectHook)
  })

  test('renders correctly', () => {
    const { asFragment } = render(wrapper)
    expect(asFragment()).toMatchSnapshot()
  })

  test('should show 1 account', async () => {
    render(wrapper)
    expect(await screen.findByText('account-1')).toBeInTheDocument()
  })

  test('should call approve session', async () => {
    render(wrapper)

    await waitFor(() => userEvent.click(screen.getByText('Allow')))
    expect(mockWalletConnectHook.approveSession).toBeCalledWith([mockAccountAddress])
  })

  test('should call reject session', async () => {
    render(wrapper)
    await waitFor(() => userEvent.click(screen.getByText('Deny')))
    expect(mockWalletConnectHook.rejectSession).toBeCalled()
  })
})
