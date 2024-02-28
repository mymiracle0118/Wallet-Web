import React from 'react'
import { render } from '@testing-library/react'

import SendReview from './SendReview'

describe('Send Review UI', () => {
  test('renders correctly when there are no title', () => {
    const tree = render(<SendReview />)
    expect(tree).toMatchSnapshot()
  })
  test('renders correctly with Custom title', () => {
    const tree = render(<SendReview title="First NFT" />)
    expect(tree).toMatchSnapshot()
  })
})
