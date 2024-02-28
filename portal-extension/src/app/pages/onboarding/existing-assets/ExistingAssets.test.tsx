import React from 'react'
import { render, screen, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import i18n from '@portal/shared/i18n/config'
import ExistingAssets from 'pages/onboarding/existing-assets/ExistingAssets'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { mockAssets } from 'utils/mockTestData'

const queryClient = new QueryClient()

describe('<ExistingAssets />', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    const { result: walletResult } = renderHook(() => useWallet())

    walletResult.current.assets = mockAssets
  })

  test('it renders', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <ExistingAssets />
        </I18nextProvider>
      </QueryClientProvider>
    )
  })

  test('Set Default Assets', async () => {
    const { result: walletResult } = renderHook(() => useWallet())

    render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <ExistingAssets />
        </I18nextProvider>
      </QueryClientProvider>
    )
    const assetsBefore = walletResult.current.assets.map((v) => v.enabledAsDefault)
    expect(assetsBefore.every(Boolean)).toBe(false)

    await user.click(screen.getByTestId('switch-goerli-USDC'))
    await user.click(screen.getByTestId('submit-existing-assets'))

    const assetsAfter = walletResult.current.assets.map((v) => v.enabledAsDefault)
    expect(assetsAfter.every(Boolean)).toBe(true)
  })
})
