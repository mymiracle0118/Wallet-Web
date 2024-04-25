import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import LogoText from 'assets/logos/logo-text.svg'
import { Button, CustomTypography, Icon } from 'components'
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
          <div className="text-[8.5rem] h-[5.5rem] !-mt-10">
            <Icon icon={<LogoText />} size="inherit" />
          </div>

          <CustomTypography dataAid="deFiSlogan" variant="body" className="dark:text-custom-white80 mb-14 pt-2">
            {t('Onboarding.exploreMultiChain')}
          </CustomTypography>
        </div>

        <div className="flex flex-col gap-2 mt-16">
          <Button color="primary" data-aid="newWalletCreation" onClick={() => navigate('/onboarding/create')}>
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
