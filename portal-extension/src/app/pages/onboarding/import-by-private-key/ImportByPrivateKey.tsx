import { ArrowLeftIcon } from '@src/app/components/Icons'
import ImportByPrivateKeyComponents from '@src/app/components/ImportAccount/ImportByPrivateKey'
import { Button, CustomTypography } from 'app/components'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import { goBack } from 'lib/woozie'
import { useTranslation } from 'react-i18next'

const ImportByPrivateKey = () => {
  const { t } = useTranslation()

  return (
    <OnboardingLayout disableLogo>
      <Button isIconOnly size="sm" variant="light" onClick={goBack} className="w-5 h-5 -ml-1">
        <ArrowLeftIcon className="text-lg dark:stroke-white-40" />
      </Button>
      <CustomTypography dataAid="importWalletTitle" variant="h1" className="mb-4 pt-6">
        {t('Onboarding.importWalletTitle')}
      </CustomTypography>

      <ImportByPrivateKeyComponents nextToFetchUsername="/onboarding/import-wallet/create" />
    </OnboardingLayout>
  )
}

export default ImportByPrivateKey
