import React, { useEffect, useState, useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import format from 'date-fns/format'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DevPanel from 'app/components/dev-panel/DevPanel'
import { PageLayout, ExtendedLayout } from 'layouts/Vercel'
import { ColorModeContext } from 'app/App'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { I18nextProvider } from 'react-i18next'
import i18n from '@portal/shared/i18n/config'
import { ModalProvider } from 'components'
import { useSettings } from '@portal/shared/hooks/useSettings'

import { routes } from 'app/PageRouter'
import Wallet from 'pages/wallet'
import Login from 'pages/login/Login'
import Onboarding from 'pages/onboarding'
import './assets/style/normalize.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const queryClient = new QueryClient()

const App = () => {
  const { darkMode, setDarkMode } = useSettings()
  const [mode, setMode] = useState<boolean>(false)
  const addClasslistDarkMode = () => document.documentElement.classList.add('dark')
  const removeClasslistDarkMode = () => document.documentElement.classList.remove('dark')
  const colorMode = useMemo(
    () => ({
      toggleColorMode: (_mode: boolean) => {
        setMode(_mode)
        setDarkMode(_mode)
        if (_mode) {
          addClasslistDarkMode()
          localStorage.setItem('TEMP_DARKMODE', 'true')
        } else {
          removeClasslistDarkMode()
          localStorage.setItem('TEMP_DARKMODE', 'false')
        }
      },
      darkMode: mode,
    }),
    [mode, setDarkMode]
  )

  useEffect(() => {
    const hour = format(new Date(), 'H')
    const isNightTime = Number(hour) >= 20 || Number(hour) <= 6
    if (localStorage.getItem('TEMP_DARKMODE') === 'false') {
      setMode(isNightTime)
      setDarkMode(isNightTime)
      if (isNightTime) {
        addClasslistDarkMode()
      } else {
        removeClasslistDarkMode()
      }
    } else {
      colorMode.toggleColorMode(darkMode)
    }
  }, []) // eslint-disable-line

  const fullPages = routes.filter((v) => v.fullpage)
  const popupPages = routes.filter((v) => !v.fullpage)
  const { encryptedWallet, lockWallet } = useWallet()

  const lockedRoute = lockWallet ? <Login /> : <Wallet />

  return (
    <I18nextProvider i18n={i18n}>
      <ColorModeContext.Provider value={colorMode}>
        <ModalProvider>
          <QueryClientProvider client={queryClient}>
            <HashRouter>
              {process.env.NODE_ENV === 'development' && <DevPanel />}
              <Routes>
                <Route element={<PageLayout />}>
                  <Route path="/" element={encryptedWallet ? lockedRoute : <Onboarding />} />

                  {popupPages.map((route, idx) => (
                    <Route key={idx} path={route.url} element={route.component} />
                  ))}
                </Route>
                <Route element={<ExtendedLayout />}>
                  {fullPages.map((route, idx) => (
                    <Route key={idx} path={route.url} element={route.component} />
                  ))}
                </Route>
              </Routes>
            </HashRouter>
          </QueryClientProvider>
        </ModalProvider>
      </ColorModeContext.Provider>
    </I18nextProvider>
  )
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
