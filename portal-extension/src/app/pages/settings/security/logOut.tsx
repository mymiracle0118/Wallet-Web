import { Image, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { isAlphaBuild } from '@src/app/services/config'
import AlertIcon from 'assets/images/alert.png'
import { Button, CustomTypography } from 'components'
import { useNavigate } from 'lib/woozie'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const LogOut = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const { setLockWallet } = useWallet()

  return (
    <div>
      <div className="flex flex-col items-center py-2">
        <Button
          data-test-id="button-open-logout-modal"
          data-aid="logOut"
          variant="bordered"
          color="outlined"
          className="mb-2"
          onClick={() => setOpenModal(true)}
        >
          {t('Actions.logout')}
        </Button>
        <CustomTypography dataAid="versionInfo" variant="small" type="secondary">
          {t('Wallet.version')} {isAlphaBuild ? '1.0.1' : '2.0.1'}
        </CustomTypography>
      </div>
      <Modal
        backdrop="opaque"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        hideCloseButton={true}
        placement="center"
        className="max-w-[20.625rem]"
        data-aid="logOutHead"
      >
        <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
          <ModalBody>
            <div className="space-y-4 text-center space-y-4">
              <div className="flex justify-center">
                <Image width={64} height={64} src={AlertIcon} fallbackSrc={AlertIcon} alt="Alert" />
              </div>

              <CustomTypography variant="h1">{t('Settings.logoutModalTitle')}</CustomTypography>
              <CustomTypography variant="body" type="secondary">
                {t('Settings.logoutModalSubTitle')}
              </CustomTypography>

              <div className="flex items-center justify-between gap-x-4">
                <Button
                  variant="bordered"
                  data-aid="cancelButton"
                  className="my-2"
                  color="outlined"
                  onClick={() => setOpenModal(false)}
                >
                  {t('Actions.cancel')}
                </Button>
                <Button
                  data-test-id="button-logout"
                  data-aid="logOutButton"
                  color="primary"
                  onClick={() => {
                    setLockWallet(true)
                    navigate('/login')
                  }}
                >
                  {t('Actions.logout')}
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default LogOut
