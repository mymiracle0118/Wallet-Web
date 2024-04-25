/* eslint-disable @typescript-eslint/no-floating-promises */
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
      chrome.storage.local.get(['wallet-storage'], (wallet) => {
        const walletState = JSON.parse(wallet['wallet-storage'] as string).state
        if (!walletState.lockWallet) {
          chrome.alarms.create('lock_timer', {
            periodInMinutes: walletState.lockTime,
          })
        }
      })
      break
    case 'stopTimer':
      chrome.alarms.clear('lock_timer')
      break
    case 'login':
      chrome.storage.local.get(['wallet-storage'], async (storage) => {
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
            chrome.storage.local.set({ 'wallet-storage': JSON.stringify(newWallet) })
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
      chrome.storage.local.get(['wallet-storage'], (wallet) => {
        const newWallet = JSON.parse(wallet['wallet-storage'] as string)
        newWallet.state.lockWallet = true
        chrome.storage.local.set({ 'wallet-storage': JSON.stringify(newWallet) })
        /* Lock wallet and trigger to extension side auto redirect to log out screen and stop lock_timer*/
        chrome.runtime.sendMessage({ lockWalletUpdated: true }, () => {
          chrome.alarms.clear('lock_timer')
        })
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

chrome.runtime.onConnect.addListener((externalPort) => {
  if (getChromePredicate(externalPort) || getFFPredicate(externalPort)) {
    chrome.storage.local.get(['wallet-storage'], (wallet) => {
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
