import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import { Button, CustomTypography } from 'components'
import { useAppEnv } from 'env'
import { useNavigate } from 'lib/woozie'
import { useTranslation } from 'react-i18next'

const Onboarding = () => {
  const { t } = useTranslation()
  const appEnv = useAppEnv()
  const { navigate } = useNavigate()
  return (
    <OnboardingLayout disableLogo={appEnv.fullPage} className={appEnv.popup ? 'mt-32' : ''}>
      <div className="mx-auto text-center w-full">
        <div className="space-y-2">
          <CustomTypography variant="subtitle" dataAid="welcomeMsg">
            {t('Onboarding.welcomeTo')}
          </CustomTypography>
          <h1 className="text-custom-black dark:text-custom-white tracking-[0.45rem] text-[2.25rem] font-bold leading-[2rem]">
            {t('Onboarding.shuttleWallet')}
          </h1>

          <CustomTypography dataAid="deFiSlogan" variant="body" className="dark:text-custom-white80 mb-14 pt-2">
            {t('Onboarding.exploreMultiChain')}
          </CustomTypography>
        </div>

        <div className="flex flex-col gap-2 mt-14">
          <Button
            color="primary"
            data-aid="newWalletCreation"
            onClick={() => navigate('/onboarding/recovery-video-app')}
          >
            {t('Onboarding.getNewWallet')}
          </Button>
          <Button
            color="secondary"
            data-aid="loginButton"
            variant="light"
            onClick={() => navigate('/onboarding/choose-import-method')}
          >
            {t('Onboarding.haveWallet')}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )
}

export default Onboarding
