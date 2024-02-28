import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '@portal/shared/i18n/config'
import RecoveryPhrase from 'pages/onboarding/recovery-phrase/RecoveryPhrase'

const walletMock = {
  wallet: {
    mnemonic: {
      phrase: 'purchase coil endless give energy certain unfair fine rib inmate drip pottery',
    },
  },
}

jest.mock('@portal/shared/hooks/useWallet', () => ({
  useWallet: () => walletMock,
}))

describe('<RecoveryPhrase />', () => {
  test('it renders', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <RecoveryPhrase />
      </I18nextProvider>
    )

    await screen
      .findByText('Verify your secret recovery phrase', {}, { timeout: 30000 })
      .then((el) => expect(el).toBeInTheDocument())
  })

  test('invalid verification', async () => {
    const user = userEvent.setup({ skipHover: true })

    render(<RecoveryPhrase />)

    await user.click(screen.getByTestId('chip-1'))
    await user.click(screen.getByTestId('chip-3'))
    await user.click(screen.getByTestId('chip-8'))

    expect(screen.getByTestId('create-next-btn')).toBeDisabled()
  })

  test('valid verification', async () => {
    const user = userEvent.setup({ skipHover: true })

    render(<RecoveryPhrase />)

    await user.click(screen.getByTestId('chip-10'))
    await user.click(screen.getByTestId('chip-11'))
    await user.click(screen.getByTestId('chip-12'))

    expect(screen.getByTestId('create-next-btn')).toBeEnabled()
  })
})
