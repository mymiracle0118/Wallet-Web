import React, { FC, useEffect, useState } from 'react'
import { useNavigate } from 'lib/woozie'
import { useTranslation } from 'react-i18next'

import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import { Button, CustomTypography } from 'app/components'
import Robot from 'assets/images/robot.png'

const Congratulations: FC = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()

  const [isImported, setIsImported] = useState('')
  // const [isDefaultWallet, setIsDefaultWallet] = useState<boolean>(true)
  // const [isShareData, setIsShareData] = useState<boolean>(true)

  useEffect(() => {
    const [, query] = window.location.href.split('#')[1].split('?')
    const params = Object.fromEntries(new URLSearchParams(query))
    setIsImported(params.accountImported)
  }, [])

  return (
    <OnboardingLayout disableLogo>
      <div className="mb-10 flex justify-center items-center">
        <img src={Robot} alt="Robot" className="mx-auto" />
      </div>

      <div className="text-center space-y-3">
        <CustomTypography dataAid="congratsMsg" variant="h1">
          {t('Onboarding.congratulations')}
        </CustomTypography>
        <CustomTypography dataAid="setupMsg" className="dark:text-custom-white80" variant="body">
          {isImported && isImported === 'false' ? t('Onboarding.allSetUpCreate') : t('Onboarding.allSetUp')}
        </CustomTypography>

        {/* {isImported && isImported === 'false' ? (
          <div className="border border-custom-grey rounded-[1.5rem] mt-4 p-4 space-y-4">
            <div className="flex items-center justify-center gap-x-6">
              <div>
                <CustomTypography
                  dataAid="createWalletDataDefault"
                  variant="body"
                  className="!font-extrabold text-left"
                >
                  {t('Onboarding.setDefaultWallet')}
                </CustomTypography>

                <CustomTypography
                  dataAid="createWalletDataDefaultGuide"
                  variant="body"
                  className="dark:text-custom-white40 text-left"
                >
                  {t('Onboarding.setGuide')}
                </CustomTypography>
              </div>
              <div>
                <Switch id="setDefault" checked={isDefaultWallet} onChange={(e: boolean) => setIsDefaultWallet(e)} />
              </div>
            </div>
            <div className="flex items-center justify-center gap-x-6">
              <div>
                <CustomTypography dataAid="createWalletDataShare" variant="body" className="!font-extrabold text-left">
                  {t('Onboarding.shareData')}
                </CustomTypography>

                <CustomTypography
                  dataAid="createWalletDataShareGuide"
                  variant="body"
                  className="dark:text-custom-white40 text-left"
                >
                  {t('Onboarding.shareGuide')}
                </CustomTypography>
              </div>
              <div>
                <Switch id="shareData" checked={isShareData} onChange={(e: boolean) => setIsShareData(e)} />
              </div>
            </div>
          </div>
        ) : null} */}
      </div>
      <Button data-aid="walletHomeButton" onClick={() => navigate('/home')} className="mt-6" color="primary">
        {t('Actions.openWallet')}
      </Button>
    </OnboardingLayout>
  )
}

export default Congratulations
