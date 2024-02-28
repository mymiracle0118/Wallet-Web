import { useNavigate } from 'lib/woozie'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useWallet } from '@portal/shared/hooks/useWallet'

import { Button, CustomTypography, SeedPhrase } from 'app/components'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'

const GenerateSeed: FC = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const { wallet } = useWallet()
  const [showSeedPhrase, setShowSeedPhrase] = useState<boolean>(false)

  return (
    <OnboardingLayout disableLogo>
      <CustomTypography dataAid="backUpPhrase" variant="h1" className="mb-8">
        {t('Onboarding.generateSeedTitle')}
      </CustomTypography>

      <div className="p-3.5 border rounded-[0.75rem] border-custom-grey40">
        <CustomTypography dataa-aid="phraseGuide" variant="subtitle">
          <span className="text-gradient text-grident-primary capitalize">Warning</span>
        </CustomTypography>
        <CustomTypography dataAid="phraseGuide" variant="body">
          <ul className="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-500 pt-2 [&>*]:text-white-80">
            <li>{t('Onboarding.generateSeedInstructionsOne')}</li>
            <li>{t('Onboarding.generateSeedInstructionsTwo')} </li>
            <li>{t('Onboarding.generateSeedInstructionsThree')}</li>
          </ul>
        </CustomTypography>
      </div>

      <SeedPhrase
        phrase={wallet?.mnemonic.phrase}
        showSeedPhrase={showSeedPhrase}
        setShowSeedPhrase={setShowSeedPhrase}
      />

      <div className="mt-4 flex gap-2">
        <Button
          data-aid="backNavigation"
          color="outlined"
          variant="bordered"
          onClick={() => navigate('/onboarding/create')}
        >
          {t('Actions.back')}
        </Button>
        <Button
          data-aid="nextNavigation"
          color={`${!showSeedPhrase ? 'disabled' : 'primary'}`}
          isDisabled={!showSeedPhrase}
          onClick={() => navigate('/onboarding/recovery-phrase')}
        >
          {t('Onboarding.savedIt')}
        </Button>
      </div>
    </OnboardingLayout>
  )
}

export default GenerateSeed
