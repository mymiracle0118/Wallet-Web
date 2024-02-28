import React from 'react'
import { render, screen, act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { ethers } from 'ethers'
import { useWallet } from '@portal/shared/hooks/useWallet'

import i18n from '@portal/shared/i18n/config'
import * as etherscan from '@portal/shared/services/etherscan'

import { mockAssets, ethereumAddress } from 'utils/mockTestData'
import TokenAsset from 'pages/wallet/token/token-asset/TokenAsset'

const queryClient = new QueryClient()
const wrapper = (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <TokenAsset />
    </I18nextProvider>
  </QueryClientProvider>
)

const originalLocation = window.location as URL
const mockWindowLocation = (newLocation: URL) => {
  delete window.location
  window.location = newLocation
}
const setLocation = (path: string) => mockWindowLocation(new URL(`https://example.com${path}`))

const mockTransactionData = [
  {
    blockNumber: '7262406',
    time: 'Jul. 20 at 07:42 PM',
    hash: '0xea76c54c02ed88249e4037c0636b85509926b6572b1e250e24d8acac21f70d3c',
    nonce: 24,
    from: '0x63c100ac0c36549c7218070294b60c18d813675c',
    to: '0xeb38b1e8ecb39759704b96b88618ba54ca74d64f',
    value: '0.01',
    gas: ethers.BigNumber.from('0x2386f26fc10000'),
    gasPrice: ethers.BigNumber.from('0x59682f07'),
    gasUsed: ethers.BigNumber.from('0x5208'),
    cumulativeGasUsed: ethers.BigNumber.from('0x041d44'),
  },
]

describe('<TokenAsset />', () => {
  beforeEach(() => {
    const { result: walletResult } = renderHook(() => useWallet())
    walletResult.current.network = 'goerli'
    walletResult.current.assets = mockAssets
    walletResult.current.address = ethereumAddress

    act(() => {
      setLocation('/#/token/goerli/ethereum')
    })

    jest.spyOn(etherscan, 'getTransactions').mockResolvedValue(mockTransactionData)
  })

  afterEach(() => {
    // Restore window.location to not destroy other tests
    mockWindowLocation(originalLocation)
  })

  test('renders correctly', async () => {
    const { asFragment } = render(wrapper)
    await screen.findByTestId(mockTransactionData[0].hash)
    expect(asFragment()).toMatchSnapshot()
  })

  test('should show 1 transaction', async () => {
    render(wrapper)
    expect(await screen.findByTestId(mockTransactionData[0].hash)).toBeInTheDocument()
  })
})
