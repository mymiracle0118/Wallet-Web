import React, { FC } from 'react'
import { useNavigate } from 'lib/woozie'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import { RecoveryFileVideoComponent } from '@src/app/components/RecoveryFileVideo/RecoveryFileVideo'

const RecoveryFileVideo: FC = () => {
  const { navigate } = useNavigate()

  const redirectToRecoveryFile = () => {
    navigate('/onboarding/recovery-file')
  }

  return (
    <OnboardingLayout disableLogo>
      <RecoveryFileVideoComponent handleNextStep={redirectToRecoveryFile} />
    </OnboardingLayout>
  )
}

export default RecoveryFileVideo
