import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'lib/woozie'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import { Button, CustomTypography } from 'app/components'

const ProAccountVideo: FC = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  return (
    <OnboardingLayout disableLogo>
      <CustomTypography dataAid="easyRecovery" variant="h1" className="mb-4">
        {t('Onboarding.createProAccountVideoTitle')}
      </CustomTypography>
      <div className="rounded-lg overflow-hidden pb-[56.25%] relative h-0">
        <iframe
          className="h-full w-full absolute left-0 top-0"
          src="https://www.youtube.com/embed/gdOizkpWyN8"
          frameBorder="0"
          title="Create pro account video"
        />
      </div>
      <CustomTypography type="secondary" dataAid="eastRecoveryVideoHead" className="text-body mt-8 mb-4">
        {t('Onboarding.createProAccountVideoGuide')}
      </CustomTypography>
      <Button
        data-aid="greatButton"
        color="primary"
        onClick={() => navigate({ pathname: '/onboarding/congratulations', search: '?accountImported=false' })}
      >
        {t('Actions.great')}
      </Button>
    </OnboardingLayout>
  )
}

export default ProAccountVideo
