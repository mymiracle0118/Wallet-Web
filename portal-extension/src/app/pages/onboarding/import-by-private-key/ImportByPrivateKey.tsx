import React from 'react'
import { useTranslation } from 'react-i18next'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import { CustomTypography } from 'app/components'
import ImportByPrivateKeyComponents from '@src/app/components/ImportAccount/ImportByPrivateKey'

const ImportByPrivateKey = () => {
  const { t } = useTranslation()

  return (
    <OnboardingLayout disableLogo>
      <CustomTypography dataAid="importWalletTitle" variant="h1" className="mb-4">
        {t('Onboarding.importWalletTitle')}
      </CustomTypography>

      <ImportByPrivateKeyComponents nextToFetchUsername="/onboarding/import-wallet/create" />
    </OnboardingLayout>
  )
}

export default ImportByPrivateKey
