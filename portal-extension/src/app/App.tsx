import { Buffer } from 'buffer'
import 'regenerator-runtime/runtime'
window.Buffer = window.Buffer || Buffer

import { NextUIProvider } from '@nextui-org/react'
import { useSettings } from '@portal/shared/hooks/useSettings'
import i18n from '@portal/shared/i18n/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ModalProvider } from 'components'
import format from 'date-fns/format'
import { AppEnvProvider } from 'env'
import * as Woozie from 'lib/woozie'
import React, { FC, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import Modal from 'react-modal'
import { BrowserRouter } from 'react-router-dom'
import PageRouter from './PageRouter'
import DevPanel from './components/dev-panel/DevPanel'

import { ApolloProvider } from '@apollo/client'
import '@portal/shared/i18n/config'
import { IAppProps } from '@portal/shared/utils/types'
import 'assets/style/normalize.css'
import '../main.css'
import getClient from './services/apollo'

// const client = createClient({
//   url: process.env.BFF_API_ENDPOINT || 'http://localhost:8080/graphql',
// })

const queryClient = new QueryClient()

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#modal')

const AppProvider: FC<IAppProps> = ({ children, env }) => (
  <AppEnvProvider {...env}>
    <Woozie.Provider>{children}</Woozie.Provider>
  </AppEnvProvider>
)

export const ColorModeContext = React.createContext({ toggleColorMode: (_mode: boolean) => {}, darkMode: true }) // eslint-disable-line

const App: FC<IAppProps> = ({ env }) => {
  const { darkMode, setDarkMode } = useSettings()
  const [mode, setMode] = React.useState<boolean>(true)
  const addClasslistDarkMode = () => document.documentElement.classList.add('dark')
  const removeClasslistDarkMode = () => document.documentElement.classList.remove('dark')
  const colorMode = React.useMemo(
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
      colorMode.toggleColorMode(darkMode as boolean)
    }
  }, []) // eslint-disable-line

  return (
    <NextUIProvider>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <ColorModeContext.Provider value={colorMode}>
            <ApolloProvider client={getClient()}>
              <ModalProvider>
                <AppProvider env={env}>
                  {/* <URQLProvider value={client}> */}
                  <QueryClientProvider client={queryClient}>
                    {process.env.NODE_ENV === 'development' && <DevPanel />}
                    <PageRouter />
                    <ReactQueryDevtools initialIsOpen={false} />
                  </QueryClientProvider>
                  {/* </URQLProvider> */}
                </AppProvider>
              </ModalProvider>
            </ApolloProvider>
          </ColorModeContext.Provider>
        </I18nextProvider>
      </BrowserRouter>
    </NextUIProvider>
  )
}

export default App
