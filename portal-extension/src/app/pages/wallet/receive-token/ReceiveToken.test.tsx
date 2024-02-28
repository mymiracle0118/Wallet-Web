import React from 'react'
import { render, renderHook, act } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@portal/shared/i18n/config'
import { useWallet } from '@portal/shared/hooks/useWallet'
import ReceiveToken from './ReceiveToken'

describe('<ReceiveToken />', () => {
  const ethAddress = '0x63C100ac0C36549C7218070294b60C18d813675c'
  const originalLocation = window.location as URL
  const mockWindowLocation = (newLocation: URL) => {
    delete window.location
    window.location = newLocation
  }
  const setLocation = (path: string) => mockWindowLocation(new URL(`https://example.com${path}`))

  beforeEach(() => {
    const { result: useWalletResult } = renderHook(() => useWallet())
    act(() => {
      useWalletResult.current.address = ethAddress
      setLocation('#/token/ethereum/receive')
    })
  })

  afterEach(() => {
    // Restore window.location to not destroy other tests
    mockWindowLocation(originalLocation)
  })

  test('The page renders QR code', () => {
    const { container } = render(
      <I18nextProvider i18n={i18n}>
        <ReceiveToken />
      </I18nextProvider>
    )
    const generatedQR = container.querySelector('.qr-code svg')

    expect(container).toHaveTextContent('Receive ETH')
    expect(generatedQR).toBeInTheDocument()
    expect(container).toHaveTextContent(ethAddress.slice(0, 6))
  })
})
