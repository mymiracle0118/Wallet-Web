import { useNavigate } from 'lib/woozie'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { OnBoardingTypes, useWallet } from '@portal/shared/hooks/useWallet'
import { Button, CustomTypography } from 'app/components'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import Robot from 'assets/images/robot.png'

const Congratulations: FC = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const { onboardingBy } = useWallet()

  const getTitle = () => {
    switch (onboardingBy) {
      case OnBoardingTypes.recoveryPhrase:
      case OnBoardingTypes.privateKey:
      case OnBoardingTypes.createdAccount:
        return t('Onboarding.congratulations')
      case OnBoardingTypes.fileRecovery:
        return t('Onboarding.waletRecoveredTitle')
      default:
        return t('Onboarding.congratulations')
    }
  }
  const getDescription = () => {
    switch (onboardingBy) {
      case OnBoardingTypes.recoveryPhrase:
      case OnBoardingTypes.privateKey:
        return t('Onboarding.allSetUp')
      case OnBoardingTypes.createdAccount:
        return t('Onboarding.allSetUpCreate')
      case OnBoardingTypes.fileRecovery:
        return t('Onboarding.waletRecoveredDescription')
      default:
        return t('Onboarding.allSetUpFileRecovery')
    }
  }

  return (
    <OnboardingLayout disableLogo>
      <div className="mb-10 flex justify-center items-center">
        <img src={Robot} alt="Robot" className="mx-auto" />
      </div>

      <div className="text-center space-y-3">
        <CustomTypography dataAid="congratsMsg" variant="h1">
          {getTitle()}
        </CustomTypography>
        <CustomTypography dataAid="setupMsg" className="dark:text-custom-white80" variant="body">
          {getDescription()}
        </CustomTypography>
      </div>
      <Button data-aid="walletHomeButton" onClick={() => navigate('/home')} className="mt-6" color="primary">
        {t('Actions.openWallet')}
      </Button>
    </OnboardingLayout>
  )
}

export default Congratulations
