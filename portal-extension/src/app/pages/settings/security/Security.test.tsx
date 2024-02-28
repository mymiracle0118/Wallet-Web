import React from 'react'
import Security from 'pages/settings/security/Security'
import AutoLockTimer from 'pages/settings/security/AutoLockTimer'
import { MemoryRouter as Router } from 'react-router-dom'
import { createMocks } from 'react-idle-timer'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { FormProvider, useForm } from 'react-hook-form'

const walletMock = {
  lockTime: '1',
  setLockTimer: () => (walletMock['lockTime'] = '5'),
}

const WrapperForm = ({ children }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}
jest.mock('@portal/shared/hooks/useWallet', () => ({
  useWallet: () => walletMock,
}))

describe('Security Page UI', () => {
  test('renders correctly Security Page', () => {
    const tree = render(<Security />)
    expect(tree).toMatchSnapshot()
  })
})

describe('Auto Lock Timer Page UI', () => {
  test('renders correctly Auto Lock Timer Page', () => {
    const tree = render(
      <WrapperForm>
        <AutoLockTimer />
      </WrapperForm>
    )
    expect(tree).toMatchSnapshot()
  })

  test('Test auto lock timer', async () => {
    const user = userEvent.setup()
    createMocks()
    render(
      <Router>
        <WrapperForm>
          <AutoLockTimer />
        </WrapperForm>
      </Router>
    )

    const newTime = '5'
    await user.type(screen.getByTestId('input-lock-time'), newTime)
    await user.click(screen.getByTestId('button-save'))
    const { lockTime } = useWallet()
    expect(lockTime).toBe(newTime)
  })
})
