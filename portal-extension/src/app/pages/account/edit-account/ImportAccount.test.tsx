/* eslint-disable @typescript-eslint/no-unsafe-call */

import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen, renderHook, act } from '@testing-library/react'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { useSettings } from '@portal/shared/hooks/useSettings'
import ImportAccount from 'pages/account/edit-account/ImportAccount'
import { I18nextProvider } from 'react-i18next'
import i18n from '@portal/shared/i18n/config'

describe('<ImportPrivateKey />', () => {
  test('renders correctly ImportPrivateKey Page', () => {
    const tree = render(<ImportAccount />)
    expect(tree).toMatchSnapshot()
  })

  test('Import Private key', async () => {
    const user = userEvent.setup()
    const { result: walletResult } = renderHook(() => useWallet())
    const { result: walletSettings } = renderHook(() => useSettings())

    act(() => {
      walletResult.current.address = '0xcea68AdfE6D57Ff021EE9E999364b3Fb3B99Ad8d'
      walletResult.current.encryptedWallet =
        '{"address":"cea68adfe6d57ff021ee9e999364b3fb3b99ad8d","id":"ac94190a-a0d0-4eee-a248-455853da00db","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"f787434fc33eeb392d6f21c7a0a6ff56"},"ciphertext":"1378d19477d26b7312f995bb8640d3f02cde6906950c4c984b756a552df3ffe6","kdf":"scrypt","kdfparams":{"salt":"0d53d628bca9550b5ff2aaebd0b78a41fdaaaa25f8c97700f32abf9c1c59552c","n":65536,"dklen":32,"p":1,"r":8},"mac":"41506475afdb6723d8f7c1487906af21fabffcaf16b08c1cd016274b1401cbd0"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2022-07-26T05-09-34.0Z--cea68adfe6d57ff021ee9e999364b3fb3b99ad8d","mnemonicCounter":"ca31b478c7c0119d0167e44103165518","mnemonicCiphertext":"49d03b450a1b9105c767b2c5c8a33e30","path":"m/44\'/60\'/0\'/0/0","locale":"en","version":"0.1"}}'
      walletResult.current.lockTime = 5
      walletResult.current.lockWallet = false
      walletResult.current.username = 'Test 1'

      walletSettings.current.accounts = {
        '0xcea68AdfE6D57Ff021EE9E999364b3Fb3B99Ad8d': {
          address: '0xcea68AdfE6D57Ff021EE9E999364b3Fb3B99Ad8d',
          encryptedWallet:
            '{"address":"cea68adfe6d57ff021ee9e999364b3fb3b99ad8d","id":"ac94190a-a0d0-4eee-a248-455853da00db","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"f787434fc33eeb392d6f21c7a0a6ff56"},"ciphertext":"1378d19477d26b7312f995bb8640d3f02cde6906950c4c984b756a552df3ffe6","kdf":"scrypt","kdfparams":{"salt":"0d53d628bca9550b5ff2aaebd0b78a41fdaaaa25f8c97700f32abf9c1c59552c","n":65536,"dklen":32,"p":1,"r":8},"mac":"41506475afdb6723d8f7c1487906af21fabffcaf16b08c1cd016274b1401cbd0"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2022-07-26T05-09-34.0Z--cea68adfe6d57ff021ee9e999364b3fb3b99ad8d","mnemonicCounter":"ca31b478c7c0119d0167e44103165518","mnemonicCiphertext":"49d03b450a1b9105c767b2c5c8a33e30","path":"m/44\'/60\'/0\'/0/0","locale":"en","version":"0.1"}}',
          username: 'Account 1',
        },
      }
    })

    render(
      <I18nextProvider i18n={i18n}>
        <ImportAccount />
      </I18nextProvider>
    )

    const privateKey = '93ffbdb1ce74b3832cee32444d3880f2f3ee1e457c27ee3b925c960827c7aa82'
    await user.type(screen.getByTestId('private-key-input'), privateKey)
    await user.type(screen.getByTestId('password'), '12341234')
    await user.click(screen.getByTestId('import-privatekey-btn'))
    await screen.findByTestId('progress-loading').then((el) => expect(el).toBeInTheDocument())
  }, 30000)
})
