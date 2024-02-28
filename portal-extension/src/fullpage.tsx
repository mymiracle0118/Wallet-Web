import React from 'react'

import ReactDOM from 'react-dom/client'

import App from './app/App'
import { WindowType } from '@src/env'
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(<App env={{ windowType: WindowType.FullPage }} />)
