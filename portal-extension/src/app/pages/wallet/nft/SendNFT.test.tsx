import React from 'react'
import { render, renderHook, act } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useWallet } from '@portal/shared/hooks/useWallet'
import i18n from '@portal/shared/i18n/config'

import SendNFT from './SendNFT'

const queryClient = new QueryClient()
const wrapper = (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <SendNFT />
    </I18nextProvider>
  </QueryClientProvider>
)

describe('<SendNFT />', () => {
  const originalLocation = window.location as URL
  const mockWindowLocation = (newLocation: URL) => {
    delete window.location
    window.location = newLocation
  }
  const setLocation = (path: string) => mockWindowLocation(new URL(`https://example.com${path}`))

  beforeEach(() => {
    const { result } = renderHook(() => useWallet())

    act(() => {
      result.current.address = '0x63C100ac0C36549C7218070294b60C18d813675c'
      result.current.NFTs = [
        {
          id: '1',
          name: 'test',
          image: 'test',
          network: 'goerli',
          assetType: 'ERC721',
          chain: 'ethereum',
          contractAddress: '0x7a0c1749b3f55d0be14f38c406fbcae08094bf2a3079e1c459a819d1d57d916e',
        },
      ]
      setLocation('#/nft/goerli/0x7a0c1749b3f55d0be14f38c406fbcae08094bf2a3079e1c459a819d1d57d916e/1')
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
