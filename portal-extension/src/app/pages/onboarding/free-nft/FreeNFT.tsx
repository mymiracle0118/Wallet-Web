import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'lib/woozie'

import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import { CustomTypography, Button } from 'app/components'
import { Avatar } from '@nextui-org/react'
import { IFreeNFTProps } from '@portal/shared/utils/types'

const FreeNFT = ({ image, title, createdBy }: IFreeNFTProps) => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()

  return (
    <OnboardingLayout disableLogo className="text-left">
      <CustomTypography dataAid="freeNFTHead" variant="h1">
        {t('Onboarding.freeNftTitle')}
      </CustomTypography>
      <CustomTypography variant="body" fontWeight="regular" className="mt-6 mb-8">
        {t('Onboarding.freeNftTitleSubTitle')}
      </CustomTypography>
      <div className="flex flex-row items-center">
        <div className="w-full">
          <Avatar src={image} radius="full" className="h-36 w-36" />
        </div>
        <div className="w-full">
          <CustomTypography dataAid="freeNFTSubHead" variant="h3" className="ml-4 mb-8">
            {title}
          </CustomTypography>
          <CustomTypography dataAid="createdBy" variant="subtitle" className="ml-4">
            {t('Onboarding.createdBy')} {createdBy}
          </CustomTypography>
        </div>
      </div>
      <div className="flex mt-4 justify-between gap-2">
        <Button
          data-aid="skipNavigation"
          variant="bordered"
          color="outlined"
          onClick={() => navigate('/onboarding/congratulations')}
        >
          {t('Actions.skip')}
        </Button>
        <Button data-aid="showOffNavigation" onClick={() => navigate('/onboarding/congratulations')} color="primary">
          {t('Actions.showOff')}
        </Button>
      </div>
    </OnboardingLayout>
  )
}

export default FreeNFT
