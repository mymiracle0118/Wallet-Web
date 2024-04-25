import { useNavigate } from 'lib/woozie'
import { FC } from 'react'

import { Button, CustomTypography } from 'app/components'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import { useTranslation } from 'react-i18next'

const WalletReset: FC = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  return (
    <OnboardingLayout disableLogo className="sapce-y-4">
      <CustomTypography variant="h1">You&apos;re all good!</CustomTypography>
      <CustomTypography variant="h3" fontWeight="extra-bold" color="text-custom-grey100">
        {t('Wallet.walletReset')}
      </CustomTypography>
      <Button onClick={() => navigate('/onboarding/create')} className="mt-8" color="primary">
        {t('Wallet.openWallet')}
      </Button>
    </OnboardingLayout>
  )
}

export default WalletReset
