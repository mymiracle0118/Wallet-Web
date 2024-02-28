import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { ethers } from 'ethers'

import i18n from '@portal/shared/i18n/config'
import * as useGasHooks from '@portal/shared/hooks/useGas'
import * as useWalletHooks from '@portal/shared/hooks/useWallet'
import * as useSettingsHooks from '@portal/shared/hooks/useSettings'

import SendReview from './SendReview'

const sendTransactionMock = jest.fn()

const queryClient = new QueryClient()
const wrapper = (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <SendReview />
    </I18nextProvider>
  </QueryClientProvider>
)

const asset = {
  chain: 'ethereum',
  network: 'goerli',
  type: 'erc20',
  showInWallet: true,
  name: 'Ethereum',
  symbol: 'ETH',
  decimal: 18,
  balance: ethers.BigNumber.from('0x0d79d51f8983f1b8'),
}

describe('<SendReview />', () => {
  beforeEach(() => {
    jest.spyOn(useGasHooks, 'useGas').mockImplementation(() => ({
      gasLimit: 21000,
      gasOption: 2,
      setGasOption: jest.fn(),
      maxFeePerGas: ethers.BigNumber.from(0),
      maxPriorityFeePerGas: ethers.BigNumber.from(0),
      estimatedTransactionCost: ethers.BigNumber.from(0),
      estimatedTransactionTime: '30 seconds',
    }))

    jest.spyOn(useWalletHooks, 'useWallet').mockImplementation(() => ({
      getAsset: () => asset,
      transaction: {
        to: '0xeb38B1e8eCb39759704B96B88618Ba54cA74d64f',
        asset: asset,
        amount: '.01',
        gasOption: 2,
      },
      wallet: ethers.Wallet.createRandom(),
      sendTransaction: sendTransactionMock,
    }))
  })

  test('renders correctly', () => {
    render(wrapper)
    expect(screen).toMatchSnapshot()
  })

  test('should not call send transaction', async () => {
    jest.spyOn(useSettingsHooks, 'useSettings').mockImplementation(() => ({
      setEnablePasswordProtection: jest.fn(),
      enablePasswordProtection: true,
    }))

    render(wrapper)
    jest.setTimeout(10000)
    await userEvent.click(screen.getByTestId('button-send'))
    expect(sendTransactionMock).toHaveBeenCalledTimes(0)
  })

  test('should call send transaction', async () => {
    jest.spyOn(useSettingsHooks, 'useSettings').mockImplementation(() => ({
      setEnablePasswordProtection: jest.fn(),
      enablePasswordProtection: false,
    }))

    render(wrapper)

    await userEvent.click(screen.getByTestId('button-send'))
    expect(sendTransactionMock).toHaveBeenCalledTimes(1)
  })
})
