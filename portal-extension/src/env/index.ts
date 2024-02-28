import { FC, useCallback, useLayoutEffect, useRef } from 'react'

import constate from 'constate'

export const IS_DEV_ENV = process.env.NODE_ENV === 'development'

export type AppEnvironment = {
  windowType: WindowType
  confirmWindow?: boolean
}

export enum WindowType {
  Popup,
  FullPage,
}

export type BackHandler = () => void

export function createUrl(pathname = '/', search = '', hash = ''): string {
  if (search && !search.startsWith('?')) {
    search = `?${search}`
  }
  if (hash && !hash.startsWith('#')) {
    hash = `#${hash}`
  }
  return `${pathname}${search}${hash}`
}
export const [AppEnvProvider, useAppEnv] = constate((env: AppEnvironment) => {
  const fullPage = env.windowType === WindowType.FullPage
  const popup = env.windowType === WindowType.Popup
  const confirmWindow = env.confirmWindow ?? false

  const handlerRef = useRef<BackHandler>()
  const prevHandlerRef = useRef<BackHandler>()

  const onBack = useCallback(() => {
    if (handlerRef.current) {
      handlerRef.current()
    }
  }, [])

  const registerBackHandler = useCallback((handler: BackHandler) => {
    if (handlerRef.current) {
      prevHandlerRef.current = handlerRef.current
    }
    handlerRef.current = handler

    return () => {
      if (handlerRef.current === handler) {
        handlerRef.current = prevHandlerRef.current
      }
    }
  }, [])

  return {
    fullPage,
    popup,
    confirmWindow,
    onBack,
    registerBackHandler,
    runVercel: process.env.RUN_VERCEL,
  }
})

export function openInFullPage() {
  const { browser } = require('webextension-polyfill-ts')
  const { search, hash } = window.location

  const url = createUrl('fullpage.html', search, hash)
  // eslint-disable-next-line
  browser.tabs.create({
    url: browser.runtime.getURL(url),
  })
}

export const OpenInFullPage: FC = () => {
  const appEnv = useAppEnv()

  useLayoutEffect(() => {
    openInFullPage()
    if (appEnv.popup) {
      window.close()
    }
  }, [appEnv.popup])

  return null
}
