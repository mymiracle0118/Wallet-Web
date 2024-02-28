import React, { FC } from 'react'
import { useNavigate } from 'lib/woozie'

import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import { Button, CustomTypography } from 'app/components'

const WalletReset: FC = () => {
  const { navigate } = useNavigate()
  return (
    <OnboardingLayout disableLogo className="sapce-y-4">
      <CustomTypography variant="h1">You&apos;re all good!</CustomTypography>
      <CustomTypography variant="h3" fontWeight="extra-bold" color="text-custom-grey100">
        Your wallet has been restored
      </CustomTypography>
      <Button onClick={() => navigate('/onboarding/create')} className="mt-8" color="primary">
        Open Wallet
      </Button>
    </OnboardingLayout>
  )
}

export default WalletReset
