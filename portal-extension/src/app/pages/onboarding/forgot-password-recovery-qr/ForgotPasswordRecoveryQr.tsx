import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'lib/woozie'
import hrLogo from '../../../../../public/images/qr_logo.png'
import { QRCode } from 'react-qrcode-logo'
import { CustomTypography, Button } from 'app/components'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'

const ForgotPasswordRecoveryQr: FC = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const website = `https://www.apple.com/in/app-store/`

  return (
    <OnboardingLayout disableLogo className="text-left">
      <CustomTypography dataAid="chooseRecoveryHead" className="mb-6" variant="h1">
        {t('Onboarding.chooseRecoveryMethod')}
      </CustomTypography>
      <Button
        data-aid="useSecretBtn"
        variant="bordered"
        color="outlined"
        onClick={() => navigate('/onboarding/import-wallet-restore')}
      >
        {t('Onboarding.useSecretPhrase')}
      </Button>
      <CustomTypography dataAid="or" className="text-h3 dark:text-custom-white80 mt-6 text-center">
        Or
      </CustomTypography>
      <CustomTypography type="secondary" dataAid="qrCode" className="mt-6 m-auto w-max">
        <div className="rounded-[32px] p-3 h-[180px] w-[180px] bg-custom-white">
          <QRCode
            size={135}
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

      <CustomTypography dataAid="recoveryApp" variant="body" className="mt-10 text-custom-white80">
        {t('Onboarding.downloadIosAppRecovery')}
      </CustomTypography>
    </OnboardingLayout>
  )
}

export default ForgotPasswordRecoveryQr
