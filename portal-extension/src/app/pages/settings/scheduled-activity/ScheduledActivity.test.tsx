import React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import ScheduledActivity from './ScheduledActivity'

describe('Send Review UI', () => {
  const queryClient = new QueryClient()

  test('renders correctly for Single Token Activity', () => {
    const tree = render(
      <QueryClientProvider client={queryClient}>
        <ScheduledActivity swapTokens={false} />
      </QueryClientProvider>
    )
    expect(tree).toMatchSnapshot()
  })
  test('renders correctly for Swap Activity', () => {
    const tree = render(
      <QueryClientProvider client={queryClient}>
        <ScheduledActivity swapTokens />
      </QueryClientProvider>
    )
    expect(tree).toMatchSnapshot()
  })
})
