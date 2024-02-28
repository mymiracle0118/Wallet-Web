import React from 'react'
import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import i18n from '@portal/shared/i18n/config'
import TokensTab from './TokensTab'

const queryClient = new QueryClient()
const wrapper = (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <TokensTab />
    </I18nextProvider>
  </QueryClientProvider>
)

describe('<TokensTab />', () => {
  test('renders correctly', () => {
    const tree = render(wrapper)
    expect(tree).toMatchSnapshot()
  })
})
