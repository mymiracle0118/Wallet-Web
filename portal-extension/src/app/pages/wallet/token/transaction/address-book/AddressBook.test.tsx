import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import i18n from '@portal/shared/i18n/config'

import AddressBook from './AddressBook'

const queryClient = new QueryClient()
const wrapper = (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <AddressBook />
    </I18nextProvider>
  </QueryClientProvider>
)

describe('Address book UI', () => {
  test('renders correctly', () => {
    render(wrapper)
    expect(screen).toMatchSnapshot()
  })
})
