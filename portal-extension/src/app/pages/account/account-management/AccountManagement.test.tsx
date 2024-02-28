import React from 'react'
import { render, renderHook, act, screen } from '@testing-library/react'
import AccountManagement from 'pages/account/account-management/AccountManagement'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { useSettings } from '@portal/shared/hooks/useSettings'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '@portal/shared/i18n/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mockAccounts } from 'utils/mockTestData'

describe('Account Management Page UI', () => {
  const queryClient = new QueryClient()

  test('renders correctly Account Management Page', () => {
    const tree = render(
      <QueryClientProvider client={queryClient}>
        <AccountManagement />
      </QueryClientProvider>
    )
    expect(tree).toMatchSnapshot()
  })

  beforeEach(() => {
    const { result: walletResult } = renderHook(() => useWallet())
    const { result: walletSettings } = renderHook(() => useSettings())
    act(() => {
      walletResult.current.address = '0x63C100ac0C36549C7218070294b60C18d813675c'
      walletResult.current.username = 'Account 1'

      walletSettings.current.accounts = mockAccounts
    })
  })

  test('Change account', async () => {
    const { result: walletResult } = renderHook(() => useWallet())
    const user = userEvent.setup()
    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <AccountManagement />
        </I18nextProvider>
      </QueryClientProvider>
    )

    await user.click(screen.getByTestId('account-list-Account2'))
    expect(walletResult.current.address).toBe('0x1Aa2C1c6799d320c57a0613F1F66Ea9590257bA1')
    expect(walletResult.current.username).toBe('Account2')
  })

  test('Hide account', async () => {
    const { result: walletResult } = renderHook(() => useWallet())
    const { result: walletSettings } = renderHook(() => useSettings())
    const user = userEvent.setup()
    render(
      <QueryClientProvider client={queryClient}>
        <AccountManagement />
      </QueryClientProvider>
    )
    await user.click(screen.getByTestId('Account2-more-options'))
    await user.click(screen.getByTestId('open-hide-account-modal'))
    await user.click(screen.getByTestId('button-hide-account'))
    expect(walletResult.current.username).toBe('Account 1')
    expect(walletSettings.current.accounts['0x1Aa2C1c6799d320c57a0613F1F66Ea9590257bA1']).toBeUndefined()
  })
})
