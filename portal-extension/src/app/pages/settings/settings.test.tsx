/* eslint-disable @typescript-eslint/no-unsafe-call */

import React from 'react'
import { render, screen, renderHook, act } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { getDesignTheme } from 'theme'
import userEvent from '@testing-library/user-event'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { I18nextProvider } from 'react-i18next'
import i18n from '@portal/shared/i18n/config'

import Settings from './Settings'

describe('<Settings />', () => {
  test('Light mode', () => {
    render(
      <div id="modal">
        <ThemeProvider theme={getDesignTheme('light')}>
          <Settings />
        </ThemeProvider>
      </div>
    )
    expect(screen.getByTestId('light-mode')).toBeInTheDocument()
  })

  test('Dark mode', () => {
    render(
      <div id="modal">
        <ThemeProvider theme={getDesignTheme('dark')}>
          <Settings />
        </ThemeProvider>
      </div>
    )
    expect(screen.getByTestId('dark-mode')).toBeInTheDocument()
  })

  test('Logout Functionality', async () => {
    const user = userEvent.setup()
    const { result } = renderHook(() => useWallet())
    act(() => {
      result.current.lockWallet = false
    })

    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={getDesignTheme('dark')}>
          <Settings />
        </ThemeProvider>
      </I18nextProvider>
    )

    await user.click(screen.getByTestId('button-open-logout-modal'))
    expect(screen.getByText('You will need to enter the password to log in again')).toBeInTheDocument()
    await user.click(screen.getByTestId('button-logout'))
    expect(result.current.lockWallet).toBe(true)
  })
})
