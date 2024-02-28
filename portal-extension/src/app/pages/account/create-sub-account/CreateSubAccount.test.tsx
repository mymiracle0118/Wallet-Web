/* eslint-disable @typescript-eslint/no-unsafe-call */

import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen, renderHook, act } from '@testing-library/react'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { useSettings } from '@portal/shared/hooks/useSettings'
import CreateSubAccount from 'pages/account/create-sub-account/CreateSubAccount'
import { I18nextProvider } from 'react-i18next'
import i18n from '@portal/shared/i18n/config'

describe('<CreateSubAccount />', () => {
  test('renders correctly Create Sub Account Page', () => {
    const tree = render(<CreateSubAccount />)
    expect(tree).toMatchSnapshot()
  })

  test('Create Sub Account functionality', async () => {
    const user = userEvent.setup()
    const { result: walletResult } = renderHook(() => useWallet())
    const { result: walletSettings } = renderHook(() => useSettings())

    act(() => {
      walletResult.current.address = '0x6886e372363bA8718993EbF49f1a7324F9b273bd'
      walletResult.current.encryptedWallet =
        '{"address":"6886e372363ba8718993ebf49f1a7324f9b273bd","id":"62d90545-71b7-4ed3-9338-6cb2b587f475","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"b5f0c3d1d24cd9cea36528de0605bad3"},"ciphertext":"887a2a44586a339a347379f3107580cb8c2709d832b1628d499a0cb4ad2223ef","kdf":"scrypt","kdfparams":{"salt":"c3d6770af197cecc644086460bf1f9ddb504cd993eb903e49d2ada7714b5b381","n":65536,"dklen":32,"p":1,"r":8},"mac":"b2517acaa5781bb513a0087b24cb933d7228641bb12a716fa8df50091773fb11"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2022-07-01T06-29-13.0Z--6886e372363ba8718993ebf49f1a7324f9b273bd","mnemonicCounter":"fb5ea5b9bc34a33a0ca6deb287333f0c","mnemonicCiphertext":"35bffda94500f27dfc6245f0c3ba7cc0","path":"m/44\'/60\'/0\'/0/0","locale":"en","version":"0.1"}}'
      walletResult.current.lockTime = 5
      walletResult.current.lockWallet = false
      walletResult.current.username = 'Test 1'

      walletSettings.current.accounts = [
        {
          address: '0x6886e372363bA8718993EbF49f1a7324F9b273bd',
          encryptedWallet:
            '{"address":"6886e372363ba8718993ebf49f1a7324f9b273bd","id":"62d90545-71b7-4ed3-9338-6cb2b587f475","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"b5f0c3d1d24cd9cea36528de0605bad3"},"ciphertext":"887a2a44586a339a347379f3107580cb8c2709d832b1628d499a0cb4ad2223ef","kdf":"scrypt","kdfparams":{"salt":"c3d6770af197cecc644086460bf1f9ddb504cd993eb903e49d2ada7714b5b381","n":65536,"dklen":32,"p":1,"r":8},"mac":"b2517acaa5781bb513a0087b24cb933d7228641bb12a716fa8df50091773fb11"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2022-07-01T06-29-13.0Z--6886e372363ba8718993ebf49f1a7324f9b273bd","mnemonicCounter":"fb5ea5b9bc34a33a0ca6deb287333f0c","mnemonicCiphertext":"35bffda94500f27dfc6245f0c3ba7cc0","path":"m/44\'/60\'/0\'/0/0","locale":"en","version":"0.1"}}',
          username: 'Test 1',
        },
      ]
    })

    render(
      <I18nextProvider i18n={i18n}>
        <CreateSubAccount />
      </I18nextProvider>
    )

    expect(screen.getByTestId('create-subaccount-btn')).toBeDisabled()
    await user.type(screen.getByTestId('username'), 'Test 2')
    await user.type(screen.getByTestId('password'), '12341234')
  })
})
