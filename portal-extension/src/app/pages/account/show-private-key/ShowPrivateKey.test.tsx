import React from 'react'
import { render } from '@testing-library/react'
import ShowPrivateKey from './ShowPrivateKey'

describe('Show private key UI', () => {
  test('renders private key Page correctly', () => {
    const tree = render(<ShowPrivateKey />)
    expect(tree).toMatchSnapshot()
  })
})
