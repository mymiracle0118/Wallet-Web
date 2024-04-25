import { Avatar, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { useWallet } from '@portal/shared/hooks/useWallet'
import mascotFail from 'assets/images/robot-fail.png'
import mascot from 'assets/images/robot-party.png'
import { useNavigate } from 'lib/woozie'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'
import CustomThumbnail from '../CustomThumbnail'
import { Button } from '../button/Button'
import { CustomTypography } from '../custom-typography'

type ModalProviderProps = {
  type:
    | 'request'
    | 'send-cancel'
    | 'received'
    | 'swap-cancel'
    | 'swap-schedule'
    | 'error'
    | 'transaction_failed'
    | 'send'
  amount?: number | string
  token?: string
  tokenImage?: string
  errorMsg?: string
  networkName?: string
  url?: string
  button1Url?: string
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
  const { navigate } = useNavigate()
  const { transaction } = useWallet()
  const [modalData, setModalData] = useState<ModalProviderProps>({})

  const values = {
    setModalData,
  }

  const getLabels = () => {
    const { amount, token, errorMsg, tokenImage } = modalData
    const tokenValue = amount && token ? `${amount as string} ${token as string}` : ''

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
        // subTitle = `You saved 0.001 ${token || ''} by scheduling this transaction`
        subTitle = errorMsg
        actionBtn1 = null
        actionBtn2 = 'Ok'
        image = mascot
        break
      case 'send-cancel':
        title = `Your request for sending ${tokenValue} has been cancelled`
        subTitle = errorMsg
        actionBtn2 = 'Alright'
        image = mascot
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
      case 'transaction_failed':
        title = 'Transaction was failed'
        subTitle = tokenValue !== undefined ? `${errorMsg as string} ${tokenValue as string}` : errorMsg
        actionBtn1 = null
        actionBtn2 = 'OK'
        image = mascotFail
        break
      case 'send':
        title = `You have sent ${tokenValue}`
        subTitle = ''
        actionBtn1 = 'Ok'
        actionBtn2 = 'View Balance'
        image = mascot
        break
    }

    return { title, subTitle, actionBtn1, actionBtn2, image, tokenImage }
  }

  return (
    <ModalContext.Provider value={values}>
      {children}

      <Modal
        backdrop="opaque"
        isOpen={Boolean(modalData.type)}
        onClose={() => setModalData({})}
        hideCloseButton={true}
        placement="center"
        className="max-w-[20.625rem]"
        isKeyboardDismissDisabled={true}
        isDismissable={false}
      >
        <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
          <ModalBody>
            <div className="flex flex-col items-center justify-center space-y-4">
              {getLabels().tokenImage && (
                <div className="mx-auto rounded-full">
                  <Avatar
                    src={getLabels().tokenImage}
                    alt={getLabels().subTitle}
                    className="mx-auto rounded-full w-14 h-14 bg-custom-white"
                  />
                </div>
              )}
              {!getLabels().tokenImage &&
                (transaction?.asset?.image && transaction?.asset?.image !== '' ? (
                  <div className="mx-auto rounded-full">
                    <Avatar
                      src={transaction?.asset?.image}
                      alt={transaction?.asset?.title}
                      className="mx-auto rounded-full w-14 h-14 bg-custom-white"
                    />
                  </div>
                ) : (
                  <CustomThumbnail thumbName={transaction?.asset?.title} className="w-14 h-14 text-lg" />
                ))}
              <CustomTypography variant="h1" className="text-center">
                {getLabels().title}
              </CustomTypography>
              <CustomTypography variant="body" className="text-center" type="secondary">
                {getLabels().subTitle}
              </CustomTypography>

              <div className="mx-auto my-6">
                <Avatar src={getLabels().image} alt="icon" className="w-40 h-40 mx-auto bg-transparent" />
              </div>
            </div>
            <div className="flex gap-2">
              {getLabels().actionBtn1 && (
                <Button
                  type="button"
                  color="outlined"
                  variant="bordered"
                  onClick={() => {
                    if (modalData.button1Url) {
                      navigate(`${modalData.button1Url}`)
                    }
                    setModalData({})
                  }}
                >
                  {getLabels().actionBtn1}
                </Button>
              )}
              <Button
                type="button"
                color="primary"
                onClick={() => {
                  if (modalData.url) {
                    navigate(`${modalData.url}`)
                  }
                  setModalData({})
                }}
              >
                {getLabels().actionBtn2}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </ModalContext.Provider>
  )
}
