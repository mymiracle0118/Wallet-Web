import CoinETH from 'assets/coins/ETH.svg'
import mascotFail from 'assets/images/mascot-fail.png'
import mascot from 'assets/images/mascot.png'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'
import { Button } from '../button/Button'
import { ModalComponent } from './ModalComponent'

type ModalProviderProps = {
  type: 'request' | 'send-cancel' | 'received' | 'swap-cancel' | 'swap-schedule' | 'error'
  amount?: number
  token?: string
  tokenImage?: JSX.Element
  errorMsg?: string
}

type ModalContextProps = {
  setModalData: Dispatch<SetStateAction<ModalProviderProps>>
}

export const ModalContext = createContext<ModalContextProps>({
  // eslint-disable-next-line
  setModalData: () => {},
})

export const useModalContext = () => useContext(ModalContext)

export const ModalProvider = ({ children }: ComponentProps) => {
  const [modalData, setModalData] = useState<ModalProviderProps>({})

  const values = {
    setModalData,
  }

  const getLabels = () => {
    const { amount, token, errorMsg } = modalData
    const tokenValue = amount && token ? `${amount} ${token}` : ''

    let title, subTitle, actionBtn1, actionBtn2, image
    switch (modalData.type) {
      case 'swap-schedule':
        title = `You have scheduled swapping ${tokenValue}`
        subTitle = undefined
        actionBtn1 = null
        actionBtn2 = 'OK'
        image = mascot
        break
      case 'received':
        title = `You have received ${tokenValue}`
        subTitle = `You saved 0.001 ${token || ''} by scheduling this transaction`
        actionBtn1 = 'OK'
        actionBtn2 = 'View Balance'
        image = mascot
        break
      case 'send-cancel':
        title = `Your request for sending ${tokenValue} has been canceled`
        subTitle = undefined
        actionBtn1 = 'Alright'
        actionBtn2 = 'Send Now'
        image = mascotFail
        break
      case 'swap-cancel':
        title = `You request for swapping ${tokenValue} has been canceled`
        subTitle = 'The swap rate does not meet the ideal rate before the due time'
        actionBtn1 = 'Alright'
        actionBtn2 = 'Swap Now'
        image = mascotFail
        break
      case 'error':
        title = 'Something is wrong!'
        subTitle = errorMsg
        actionBtn1 = null
        actionBtn2 = 'OK'
        image = mascotFail
        break
    }

    return { title, subTitle, actionBtn1, actionBtn2, image }
  }

  return (
    <ModalContext.Provider value={values}>
      {children}

      <ModalComponent
        small
        modalState={Boolean(modalData.type)}
        title={getLabels().title}
        subtitle={getLabels().subTitle}
        closeModal={() => {
          setModalData({})
        }}
        image={getLabels().image}
        ModalIcon={<CoinETH />}
      >
        <div className="flex gap-2">
          {getLabels().actionBtn1 && (
            <button
              type="button"
              className="w-full rounded-md p-3.5 border border-solid border-custom-white40 dark:text-custom-white text-primary"
              onClick={() => {
                setModalData({})
              }}
            >
              {getLabels().actionBtn1}
            </button>
          )}
          <Button
            type="button"
            className="w-full rounded-md p-3.5 bg-primary dark:bg-primary text-custom-white dark:text-custom-white"
            onClick={() => {
              setModalData({})
            }}
          >
            {getLabels().actionBtn2}
          </Button>
        </div>
      </ModalComponent>
    </ModalContext.Provider>
  )
}
