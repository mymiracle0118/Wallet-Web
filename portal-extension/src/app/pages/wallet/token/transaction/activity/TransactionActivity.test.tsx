import React from 'react'
import { render, renderHook, act } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@portal/shared/i18n/config'
import Activity from 'pages/wallet/token/transaction/activity/Activity'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
const wrapper = (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <Activity />
    </I18nextProvider>
  </QueryClientProvider>
)

describe('Transaction Activity UI', () => {
  const originalLocation = window.location as URL
  const mockWindowLocation = (newLocation: URL) => {
    delete window.location
    window.location = newLocation
  }
  const setLocation = (path: string) => mockWindowLocation(new URL(`https://example.com${path}`))

  beforeEach(() => {
    const { result } = renderHook(() => useWallet())

    act(() => {
      result.current.network = 'goerli'
      result.current.address = '0x63C100ac0C36549C7218070294b60C18d813675c'
      setLocation('#/token/goerli/activity/0x7a0c1749b3f55d0be14f38c406fbcae08094bf2a3079e1c459a819d1d57d916e')
    })
  })

  afterEach(() => {
    // Restore window.location to not destroy other tests
    mockWindowLocation(originalLocation)
  })

  test('renders correctly', () => {
    const tree = render(wrapper)
    expect(tree).toMatchSnapshot()
  })
})
