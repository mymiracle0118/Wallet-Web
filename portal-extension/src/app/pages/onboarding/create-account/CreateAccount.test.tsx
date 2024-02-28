import React from 'react'
import { render } from '@testing-library/react'
import CreateAccount from 'pages/onboarding/create-account/CreateAccount'

describe('Create Account UI', () => {
  test('renders correctly Create Account Page', () => {
    const tree = render(<CreateAccount />)
    expect(tree).toMatchSnapshot()
  })

  test('renders correctly Create Account Page - Import Wallet flow', () => {
    const tree = render(<CreateAccount importWallet />)
    expect(tree).toMatchSnapshot()
  })
})
