import { IRecoveryFileVideoProps } from '@portal/shared/utils/types'
import { ArrowLeftIcon } from '@src/app/components/Icons'
import { Button, CustomTypography } from 'app/components'
import { goBack } from 'lib/woozie'
import { useTranslation } from 'react-i18next'

export const RecoveryFileVideoComponent = ({ handleNextStep }: IRecoveryFileVideoProps) => {
  const { t } = useTranslation()

  return (
    <>
      <Button isIconOnly size="sm" variant="light" onClick={goBack} className="mr-2 w-6 -ml-2 h-5">
        <ArrowLeftIcon className="text-lg stroke-custom-black dark:stroke-custom-white40" />
      </Button>
      <CustomTypography dataAid="phraseQuestion" variant="h1" className="flex items-center my-8">
        {t('Onboarding.recoveryFileVideo')}
      </CustomTypography>
      <div className="overflow-hidden pb-[56.25%] relative h-0 rounded-lg">
        <iframe
          className="h-full w-full absolute left-0 top-0"
          src="https://www.youtube.com/embed/gdOizkpWyN8"
          frameBorder="0"
          title="Wallet demo video"
        />
      </div>
      <CustomTypography variant="body" dataAid="videoHead" className="text-body mt-4 dark:text-custom-white80">
        {t('Onboarding.videoGuideLineUp')}
      </CustomTypography>
      <CustomTypography variant="body" dataAid="videoHead" className="text-body dark:text-custom-white80">
        {t('Onboarding.videoGuideLineDown')}
      </CustomTypography>
      <Button data-aid="nextNavigation" color="primary" onClick={() => handleNextStep()} className="mt-8">
        {t('Actions.getStarted')}
      </Button>
    </>
  )
}
