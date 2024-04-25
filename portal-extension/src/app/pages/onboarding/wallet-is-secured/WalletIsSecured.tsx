import { Button, CustomTypography } from 'app/components'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import WalletSecure from 'assets/images/walletSecure.png'
import { useNavigate } from 'lib/woozie'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

const WalletIsSecured: FC = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  return (
    <OnboardingLayout disableLogo>
      <div className="mb-10 flex justify-center items-center">
        <img src={WalletSecure} alt="Robot" className="mx-auto" />
      </div>
      <div className="text-center space-y-2">
        <CustomTypography dataAid="phraseQuestion" variant="h1">
          {t('Wallet.securedWallet')}
        </CustomTypography>
        <CustomTypography dataAid="walletSecure" className="dark:text-custom-white80" variant="body">
          {t('Wallet.recoverySetting')}
        </CustomTypography>
      </div>

      <Button
        data-aid="nextNavigation"
        color="primary"
        onClick={() => navigate('/onboarding/congratulations')}
        className="mt-8"
      >
        {t('Actions.next')}
      </Button>
    </OnboardingLayout>
  )
}

export default WalletIsSecured
