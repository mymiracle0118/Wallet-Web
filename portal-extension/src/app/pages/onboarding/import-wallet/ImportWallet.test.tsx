/* eslint-disable @typescript-eslint/no-unsafe-call */

import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ImportWallet from 'pages/onboarding/import-wallet/ImportWallet'

describe('<ImportWallet />', () => {
  test('it renders', () => {
    render(
      <Router>
        <ImportWallet />
      </Router>
    )

    expect(screen.getByText('Import wallet')).toBeInTheDocument()
  })

  test('submit valid recovery phrase', async () => {
    const user = userEvent.setup()
    const mnemonic = 'purchase coil endless give energy certain unfair fine rib inmate drip pottery'

    render(
      <Router>
        <ImportWallet />
      </Router>
    )

    await user.type(screen.getByTestId('input-recovery-phase'), mnemonic)
    await user.click(screen.getByTestId('button-next'))

    expect(screen.queryByText('Incorrect secret recovery phrase')).not.toBeInTheDocument()
  })

  test('submit invalid recovery phrase', async () => {
    const user = userEvent.setup()
    const mnemonic = 'purchase coil endless give energy certain unfair fine rib inmate drip'

    render(
      <Router>
        <ImportWallet />
      </Router>
    )

    await user.type(screen.getByTestId('input-recovery-phase'), mnemonic)
    await user.click(screen.getByTestId('button-next'))

    expect(screen.getByText('Incorrect secret recovery phrase')).toBeInTheDocument()
  })
})
