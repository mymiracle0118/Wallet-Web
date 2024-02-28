import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import type { BigNumber } from 'ethers'
import { mockAssets, mockTestProfit } from 'utils/mockTestData'

import i18n from '@portal/shared/i18n/config'
import * as useWalletHooks from '@portal/shared/hooks/useWallet'
import * as usePricingHooks from '@portal/shared/hooks/usePricing'
import * as useBalanceHooks from '@portal/shared/hooks/useBalance'

import Home from 'pages/wallet'

const queryClient = new QueryClient()
const wrapper = (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <Home />
    </I18nextProvider>
  </QueryClientProvider>
)

const mockAssetPricing = {
  ethereum: 1000,
  'usd-coin': 250,
}

describe('<TokenAsset />', () => {
  beforeEach(() => {
    jest.spyOn(useWalletHooks, 'useWallet').mockImplementation(() => ({
      network: 'goerli',
      assets: mockAssets,
      getAsset: (assetId: string) => mockAssets.find((asset) => asset.id === assetId),
      tokenProfitLossCollection: mockTestProfit,
      setTokenProfitLoss: () => mockAssets,
      getNetworkList: () => [
        {
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          network: 'mainnet',
        },
        {
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          network: 'goerli',
        },
      ],
    }))

    jest.spyOn(usePricingHooks, 'usePricing').mockImplementation(() => ({
      getMarketPrice: jest.fn(),
      getMarket24HourChange: jest.fn(),
      getAssetValue: (assetId: string) => mockAssetPricing[assetId],
      getAssetValueFormatted: jest.fn(),
    }))

    jest.spyOn(useBalanceHooks, 'useBalance').mockImplementation(() => ({
      balance: 1.3081210173493454 as BigNumber,
      balanceFormatted: 1.3081210173493454,
    }))
  })

  test('renders correctly', () => {
    const { asFragment } = render(wrapper)
    expect(asFragment()).toMatchSnapshot()
  })

  test('should render correct total', async () => {
    render(wrapper)
    expect(await screen.findByText('$2,000.0')).toBeInTheDocument()
  })

  test('should render correct asset value and percentage', async () => {
    render(wrapper)
    expect(await screen.findAllByText('$1,000')).toHaveLength(2)
  })
})
