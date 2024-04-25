import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import { useNavigate } from 'lib/woozie'
import { FC } from 'react'

import { Chip } from '@nextui-org/react'
import { DocumentGradientIcon } from '@src/app/components/Icons'
import DriveWithLockIcon from '@src/app/components/Icons/DriveWithLockIcon'
import { CustomTypography } from 'app/components'
import { useTranslation } from 'react-i18next'

const RecoveryOptions: FC = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()

  return (
    <OnboardingLayout disableLogo>
      <CustomTypography dataAid="phraseQuestion" variant="h1">
        {t('Onboarding.secureYourWallet')}
      </CustomTypography>
      <div className="space-y-2 mt-8">
        <CustomTypography className="dark:text-custom-white80">
          {t('Onboarding.secureYourWalletDescription')}
        </CustomTypography>
        <CustomTypography className="dark:text-custom-white80">
          {t('Onboarding.secureYourWalletAccess')}
        </CustomTypography>
      </div>
      <div
        className="bg-surface-dark-alt cursor-pointer rounded-lg mt-8 p-4"
        onClick={() => navigate('/onboarding/recovery-file-video')}
      >
        <div className="flex items-start justify-between gap-x-4">
          <div>
            <CustomTypography dataAid="phraseGuide" variant="h4" className="pb-2">
              {t('Onboarding.byFilesRecovery')}{' '}
              <Chip size="sm" className="uppercase text-success bg-gray-dark">
                {t('Actions.easy')}
              </Chip>
            </CustomTypography>
            <CustomTypography dataAid="phraseGuide" variant="body" type="secondary">
              {t('Onboarding.fileRecoveryDescription')}
            </CustomTypography>
          </div>
          <div className="text-[1.5rem]">
            <DriveWithLockIcon />
          </div>
        </div>
      </div>

      <div
        className="bg-surface-dark-alt cursor-pointer rounded-lg mt-4 p-4"
        onClick={() => navigate('/onboarding/demo-video')}
      >
        <div className="flex items-start justify-between gap-x-4">
          <div>
            <CustomTypography dataAid="phraseGuide" variant="h4" className="pb-2">
              {t('Onboarding.bySecretRecoveryPhrase')}
            </CustomTypography>
            <CustomTypography dataAid="phraseGuide" variant="body" type="secondary">
              {t('Onboarding.fileRecoveryOwnkey')}
            </CustomTypography>
          </div>
          <div className="text-[1.5rem]">
            <DocumentGradientIcon />
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default RecoveryOptions
