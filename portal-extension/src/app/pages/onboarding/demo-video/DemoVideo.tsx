import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'lib/woozie'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'

import { Button, CustomTypography } from 'app/components'

const DemoVideo: FC = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()

  return (
    <OnboardingLayout disableLogo>
      <CustomTypography dataAid="phraseQuestion" variant="h1">
        {t('Onboarding.secretRecoveryPhaseTitle')}
      </CustomTypography>
      <div className="overflow-hidden pb-[56.25%] relative h-0 mt-8 rounded-lg">
        <iframe
          className="h-full w-full absolute left-0 top-0"
          src="https://www.youtube.com/embed/gdOizkpWyN8"
          frameBorder="0"
          title="Wallet demo video"
        />
      </div>
      <CustomTypography variant="body" dataAid="videoHead" className="text-body mt-4 dark:text-custom-white80">
        {t('Onboarding.videoGuide')}
      </CustomTypography>
      <Button
        data-aid="nextNavigation"
        color="primary"
        onClick={() => navigate('/onboarding/generate-seed')}
        className="mt-8"
      >
        {t('Actions.next')}
      </Button>
      {/* <Link to="#!">
        <h5 className="text-center mt-6 text-white-only">{t('Onboarding.otherSecretRecoveryPhaseTitle')}</h5>
      </Link> */}
    </OnboardingLayout>
  )
}

export default DemoVideo
