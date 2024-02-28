import React from 'react'

import ReactDOM from 'react-dom/client'
import { browser } from 'webextension-polyfill-ts'

import App from 'app/App'
import { WindowType, openInFullPage } from './env'
import { isPopupModeEnabled } from 'lib/popup-mode'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(<App env={{ windowType: WindowType.Popup }} />)

const popups = browser.extension.getViews({ type: 'popup' })
if (!popups.includes(window) || !isPopupModeEnabled()) {
  openInFullPage()
  window.close()
}

chrome.runtime.connect({ name: 'popup' })
