import React from 'react'
import { render, renderHook, screen, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@portal/shared/i18n/config'
import { useWallet } from '@portal/shared/hooks/useWallet'
import userEvent from '@testing-library/user-event'
import AddToken from './AddToken'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('AddToken Page', () => {
  const mock = function () {
    return {
      observe: jest.fn(),
      disconnect: jest.fn(),
    }
  }

  //--> assign mock directly without jest.fn
  // eslint-disable-next-line
  window.IntersectionObserver = mock

  test('renders correctly', () => {
    const tree = render(<AddToken />)
    expect(tree).toMatchSnapshot()
  })

  test('Add Custom Token Successfully', async () => {
    const user = userEvent.setup()
    const { result: useWalletResult } = renderHook(() => useWallet())
    const sandTokenAddress = '0x3845badade8e6dff049820680d1f14bd3903a5d0'
    const sandName = 'The Sandbox'

    const tokenData = {
      asset_platform_id: 'ethereum',
      image: {
        large: 'https://assets.coingecko.com/coins/images/12129/large/sandbox_logo.jpg?1597397942',
      },
      symbol: 'sand',
      id: 'the-sandbox',
      name: 'The Sandbox',
      contract_address: sandTokenAddress,
    }
    mockedAxios.get.mockResolvedValue({
      data: tokenData,
      status: 200,
      statusText: 'Ok',
      headers: {},
      config: {},
    })

    render(
      <I18nextProvider i18n={i18n}>
        <AddToken />
      </I18nextProvider>
    )

    await user.click(screen.getByTestId('tab-Custom-tokens'))
    expect(screen.getByText(i18n.t('Token.customTokenInformation'))).toBeInTheDocument()
    await user.type(screen.getByTestId('contract-address-input'), sandTokenAddress)
    await waitFor(() => {
      expect(screen.getByText(sandName)).toBeInTheDocument()
    })
    await user.click(screen.getByTestId('add-token-btn'))
    expect(useWalletResult.current.assets.find((a) => a.id === 'the-sandbox').name).toBe(sandName)
  })
})
