/* eslint-disable @typescript-eslint/no-floating-promises */
// FIXME:
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { toUTF8Array } from '@portal/shared/utils/utf8'
import { ethers } from 'ethers'
import { browser } from 'webextension-polyfill-ts'
import { decryptData } from '@portal/portal-extension/src/utils/constants'

function openFullPage() {
  chrome.tabs.create({
    url: chrome.runtime.getURL('fullpage.html'),
  })
}
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    openFullPage()
  }
})

chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
  switch (req.message) {
    case 'startTimer':
      chrome.storage.sync.get(['wallet-storage'], (wallet) => {
        chrome.alarms.create('lock_timer', {
          periodInMinutes: JSON.parse(wallet['wallet-storage'] as string).state.lockTime,
        })
      })
      break
    case 'stopTimer':
      chrome.alarms.clear('lock_timer')
      break
    case 'login':
      chrome.storage.sync.get(['wallet-storage'], async (storage) => {
        try {
          if (req.isAccountCreatedByPrivateKey || req.address) {
            const checkPassword: string = await decryptData(req.encryptedWallet as string, req.password as string)
            sendResponse(checkPassword ? { success: true, privateKey: checkPassword } : { success: false })
          } else {
            const wallet = await ethers.Wallet.fromEncryptedJson(req.encryptedWallet as string, req.password as string)

            const encryptedPrivateKey = toUTF8Array(wallet.privateKey)
            const newWallet = JSON.parse(storage['wallet-storage'] as string)

            newWallet.state.wallet = wallet
            newWallet.state.encryptedPrivateKey = encryptedPrivateKey
            newWallet.state.lockWallet = false
            chrome.storage.sync.set({ 'wallet-storage': JSON.stringify(newWallet) })
            if (wallet.mnemonic && wallet.mnemonic.phrase) {
              sendResponse({ success: true, mnemonic: wallet.mnemonic.phrase })
            } else if (wallet.privateKey) {
              sendResponse({ success: true, privateKey: wallet.privateKey })
            }
            sendResponse({ success: false })
          }
        } catch (error) {
          sendResponse({ success: false })
        }
      })
      return true
  }
  sendResponse(true)
})
chrome.alarms.onAlarm.addListener((alarm) => {
  switch (alarm.name) {
    case 'lock_timer':
      chrome.storage.sync.get(['wallet-storage'], (wallet) => {
        const newWallet = JSON.parse(wallet['wallet-storage'] as string)
        newWallet.state.lockWallet = true
        chrome.storage.sync.set({ 'wallet-storage': JSON.stringify(newWallet) })
      })
      break
  }
})
const URL_BASE = 'extension://'

export const getChromePredicate = (port: any) => port.sender?.url?.includes(`${URL_BASE}${browser.runtime.id}`)
export const getFFPredicate = (port: any) => {
  const manifest: any = browser.runtime.getManifest()
  const fullUrl = manifest.background?.scripts[0]
  const edgeUrl = fullUrl.split('/scripts')[0].split('://')[1]
  return port.sender?.url?.includes(`${URL_BASE}${edgeUrl}`)
}

chrome.alarms.create({ periodInMinutes: 0.5, delayInMinutes: 0.5 })

// chrome.alarms.onAlarm.addListener(() => {
//   chrome.storage.sync.get(['GAS_FEE_ALERT'], ({ GAS_FEE_ALERT }) => {
//     if (GAS_FEE_ALERT?.length) {
//       const gasList = GAS_FEE_ALERT.sort((a1, a2) => a2.value - a1.value)
//       fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=CW67MTNJE76PWJBDY8VXNVVT85UF2DHEJJ`)
//         .then((response) => response.json())
//         .then((data) => {
//           if (gasList[0].value >= data.result.SafeGasPrice) {
//             chrome.notifications.create({
//               type: 'basic',
//               title: `Gas fee alert!`,
//               message: `the current gas fee is ${data.result.SafeGasPrice} Gwei! 💰\nYour alert was set to ${gasList[0].value} Gwei`,
//               priority: 1,
//               eventTime: Date.now(),
//               iconUrl: '../images/logo_48.png',
//             })
//             gasList.shift()
//             chrome.storage.sync.set({ GAS_FEE_ALERT: gasList })
//           }
//         })
//     }
//   })
// })
chrome.runtime.onConnect.addListener((externalPort) => {
  if (getChromePredicate(externalPort) || getFFPredicate(externalPort)) {
    chrome.storage.sync.get(['wallet-storage'], (wallet) => {
      const walletState = JSON.parse(wallet['wallet-storage'] as string).state

      chrome.alarms.get('lock_timer', (res) => {
        if (res && !walletState.lockWallet) {
          chrome.alarms.create('lock_timer', {
            periodInMinutes: walletState.lockTime,
          })
        }
      })
    })
  }
})
