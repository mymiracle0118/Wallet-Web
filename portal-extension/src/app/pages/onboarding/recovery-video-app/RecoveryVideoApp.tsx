import { Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/react'
import { Button, CustomTypography } from 'app/components'
import { useNavigate } from 'lib/woozie'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QRCode } from 'react-qrcode-logo'
import hrLogo from '../../../../../public/images/qr_logo.png'

const RecoveryVideoApp: FC = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const [isModalShow, setIsModalShow] = useState<boolean>(false)

  const website = `https://www.apple.com/in/app-store/`

  return (
    <div className="p-8">
      <CustomTypography dataAid="easyRecovery" className="!font-extrabold mb-6 -tracking-[0.0175rem]" variant="h2">
        {t('Onboarding.easyRecoveryVideoAppTitle')}
      </CustomTypography>
      <div className="overflow-hidden pb-[56.25%] relative h-0">
        <iframe
          className="rounded-[1.5rem] h-full w-full absolute left-0 top-0"
          src="https://www.youtube.com/embed/gdOizkpWyN8"
          frameBorder="0"
          title="Wallet recovery app video"
        />
      </div>
      <CustomTypography variant="body" dataAid="eastRecoveryVideoHead" className="mt-4 mb-4 text-custom-white80">
        {t('Onboarding.videoGuideEasyRecoveryApp')}
      </CustomTypography>
      <div className="mt-4 mr-1 space-y-1">
        <Button variant="light" color="transparent" data-aid="nextNavigation" onClick={() => setIsModalShow(true)}>
          {t('Onboarding.downloadIosApp')}
        </Button>
        <Button color="secondary" variant="light" data-aid="loginButton" onClick={() => navigate('/onboarding/create')}>
          {t('Onboarding.continueWithWebExtension')}
        </Button>
      </div>

      <Modal
        backdrop="opaque"
        isOpen={isModalShow}
        onClose={() => setIsModalShow(false)}
        hideCloseButton={true}
        placement="center"
        className="max-w-[20.625rem]"
      >
        <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
          <ModalBody>
            <div>
              <CustomTypography dataAid="qrAppHead" variant="h1">
                {t('Onboarding.shuttleForIphone')}
              </CustomTypography>
              <CustomTypography type="secondary" dataAid="qrCode" className="mt-8 m-auto w-max">
                <div className="qr-code p-5 rounded-[2rem] bg-custom-white">
                  <QRCode
                    size={178}
                    qrStyle="dots"
                    value={website}
                    viewBox={`0 0 140 140`}
                    logoImage={hrLogo}
                    eyeRadius={8}
                    removeQrCodeBehindLogo={true}
                    logoPadding={10}
                  />
                </div>
              </CustomTypography>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              data-aid="closeModal"
              color="outlined"
              variant="bordered"
              className="mt-2"
              onClick={() => setIsModalShow(false)}
            >
              {t('Onboarding.close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default RecoveryVideoApp
