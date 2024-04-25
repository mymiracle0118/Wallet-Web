import React from 'react'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import ImportByRecoveryFilesComponents from '@src/app/components/ImportAccount/ImportByRecoveryFiles'

const ImportByRecoveryFiles = () => {
  return (
    <OnboardingLayout disableLogo>
      <ImportByRecoveryFilesComponents />
    </OnboardingLayout>
  )
}

export default ImportByRecoveryFiles
