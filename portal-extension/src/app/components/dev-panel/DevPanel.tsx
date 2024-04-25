import { useSessionStore } from '@portal/shared/hooks/useSessionStore'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { setLockUp } from '@src/../../shared/hooks/useLockUp'
import { ColorModeContext } from 'app/App'
import { useModalContext } from 'components'
import { useNavigate } from 'lib/woozie'
import moment from 'moment'
import React, { useState } from 'react'

const DevPanel = () => {
  const colorMode = React.useContext(ColorModeContext) // eslint-disable-line
  const { clearWallet, encryptedWallet, lockWallet, setTokenProfitLoss, tokenProfitLossCollection } = useWallet()

  const { clearAccounts, darkMode } = useSettings()
  const [expended, setExpended] = useState<boolean>(false)
  const [positiveProfit, setPositiveProfit] = useState<number>(0)
  const toggleBar = () => setExpended((prev) => !prev)
  const { setModalData } = useModalContext()
  const { navigate } = useNavigate()
  const { networkEnvironment } = useSettings()

  const setProfitLoss = () => {
    setPositiveProfit((prev) => (prev >= 2 ? 0 : prev + 1))
    const newCollection = tokenProfitLossCollection.map((v) => ({
      ...v,
      time: moment().subtract(2, 'days').toDate(),
      value: Number(v.value) + (positiveProfit === 1 ? -0.5 : 0.25),
    }))
    newCollection.forEach((data) => setTokenProfitLoss(data, true))
  }

  const handleClick = async () => {
    await clearWallet()
    clearAccounts()
    navigate('/')
  }

  const getStoreSize = (state: any) => {
    const stateString = JSON.stringify(state)
    const sizeInBytes = new Blob([stateString]).size
    const sizeInKilobytes = sizeInBytes / 1024
    return `${sizeInKilobytes.toFixed(2)} KB`
  }
  const showStateData = () => {
    console.log('All state data')
    console.log('useWallet :: ' + getStoreSize(useWallet.getState()), useWallet.getState())
    console.log('useStore :: ' + getStoreSize(useStore.getState()), useStore.getState())
    console.log('useSessionStore :: ' + getStoreSize(useSessionStore.getState()), useSessionStore.getState())
  }

  const showUseSettingStateData = () => {
    console.log('useSetting :: ' + getStoreSize(useSettings.getState()), useSettings.getState())
  }
  return (
    <div
      data-testid="dev-panel-btn"
      className={`w-${expended ? 'full' : 'w-8'} h-auto bg-custom-white40 top-0 flex flex-wrap gap-3 z-10 absolute`}
    >
      <button type="button" onClick={toggleBar} className="text-custom-black mt-1 ml-4 cursor-pointer">
        {lockWallet ? 'Locked' : 'Open'} {networkEnvironment} {expended ? `<` : `>`}
      </button>
      {expended && (
        <>
          <button className="text-custom-black p-1" type="button" onClick={handleClick}>
            {encryptedWallet ? 'disconnect' : 'connect'}
          </button>
          <button className="text-custom-black p-1" type="button" onClick={() => colorMode.toggleColorMode(!darkMode)}>
            mode
          </button>
          <button
            className="text-custom-black p-1"
            type="button"
            onClick={() =>
              setModalData({
                type: 'swap-cancel',
                amount: 100,
                token: 'DAI',
                tokenImage: '',
              })
            }
          >
            request
          </button>
          <button
            className="text-custom-black p-1"
            type="button"
            onClick={() =>
              setModalData({
                type: 'swap-schedule',
                amount: 100,
                token: 'DAI',
                tokenImage: '',
              })
            }
          >
            swap
          </button>
          <button
            className="text-custom-black p-1"
            type="button"
            onClick={() =>
              setModalData({
                type: 'received',
                amount: 0.04,
                token: 'WETH',
                tokenImage: '',
              })
            }
          >
            receive
          </button>
          <button
            className="text-custom-black p-1"
            type="button"
            onClick={() =>
              setModalData({
                type: 'send-cancel',
                amount: 1,
                token: 'ETH',
                tokenImage: '',
              })
            }
          >
            cancel send
          </button>{' '}
          <button className="text-custom-black p-1" type="button" onClick={() => navigate('/confirm/connect-request')}>
            connect req
          </button>
          <button className="text-custom-black p-1" type="button" onClick={() => setProfitLoss()}>
            profit/loss
          </button>
          <button className="text-custom-black p-1" type="button" onClick={() => setLockUp(false)}>
            keep unlocked
          </button>
          <button className="text-custom-grey100 p-1" type="button" onClick={() => showStateData()}>
            Show all state data
          </button>
          <button className="text-custom-grey100 p-1" type="button" onClick={() => showUseSettingStateData()}>
            useSetting Data
          </button>
        </>
      )}
    </div>
  )
}

export default DevPanel
