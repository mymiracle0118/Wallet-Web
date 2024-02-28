import React, { FC } from 'react'
import { useNavigate } from 'lib/woozie'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import ChooseWalletImportMethod from '@src/app/components/ImportAccount/ChooseImportMethod'

const ChooseImportMethod: FC = () => {
  const { navigate } = useNavigate()
  return (
    <OnboardingLayout disableLogo>
      <ChooseWalletImportMethod
        importWallet={() => navigate('/onboarding/import-wallet')}
        importByPrivateKey={() => navigate('/onboarding/import-by-private-key')}
      />
    </OnboardingLayout>
  )
}

export default ChooseImportMethod
