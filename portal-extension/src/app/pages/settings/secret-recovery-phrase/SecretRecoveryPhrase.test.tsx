import React from 'react'
import { render, screen, renderHook, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SecretRecoveryPhrase from 'pages/settings/secret-recovery-phrase/SecretRecoveryPhrase'

import { useWallet } from '@portal/shared/hooks/useWallet'

describe('<SecretRecoveryPhrase />', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useWallet())

    act(() => {
      result.current.wallet = undefined
      result.current.encryptedWallet =
        '{"address":"6b76c6a18e1a7c086dfdfa1249f67ca8ff6ebd2e","id":"d12b1e33-cc56-4d75-ad79-1e4618e98620","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"228a623e5e543153d6f95f6819d31a73"},"ciphertext":"e4dd5279bfc2019c0ccb4e57eecd7a02abe2a8f50e94f5a8ae329f4435bb628f","kdf":"scrypt","kdfparams":{"salt":"bac5f5c8d4d2ca160fbbda1046292655d54c67be1e7f204e68da4c26ab45438d","n":65536,"dklen":32,"p":1,"r":8},"mac":"d0a59ecb5132d8c3cd6b7ec67a83d5cfc2ed4ae7b5f314ea33b8d82d0fb27359"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2022-06-15T22-16-59.0Z--6b76c6a18e1a7c086dfdfa1249f67ca8ff6ebd2e","mnemonicCounter":"b1427dbaeb9b60f583345ff29ea94b56","mnemonicCiphertext":"e4041de3801ce69a0f31b131cb4c9f7e","path":"m/44\'/60\'/0\'/0/0","locale":"en","version":"0.1"}}'
    })
  })

  test('renders correctly', () => {
    const tree = render(<SecretRecoveryPhrase />)
    expect(tree).toMatchSnapshot()
  })

  test('should show recovery phrase', async () => {
    render(<SecretRecoveryPhrase />)

    await userEvent.type(screen.getByPlaceholderText('Password'), 'password')
    await userEvent.click(screen.getByTestId('button-show'))

    // Wait for the loading indicator to appear
    const loadingIndicator = await screen.findByTestId('progress-loading')
    expect(loadingIndicator).toBeInTheDocument()

    // Wait for the "done" button to appear
    jest.setTimeout(10000)
    const doneButton = await screen.findByTestId('button-done', {}, { timeout: 10000 })
    expect(doneButton).toBeInTheDocument()
  })

  test('should show invalid password', async () => {
    render(<SecretRecoveryPhrase />)

    await userEvent.type(screen.getByPlaceholderText('Password'), 'badddddd')
    await userEvent.click(screen.getByTestId('button-show'))

    await screen.findByTestId('progress-loading').then((el) => expect(el).toBeInTheDocument())
    jest.setTimeout(10000)
    await screen
      .findByText('Error: invalid password', {}, { timeout: 10000 })
      .then((el) => expect(el).toBeInTheDocument())
  })
})
