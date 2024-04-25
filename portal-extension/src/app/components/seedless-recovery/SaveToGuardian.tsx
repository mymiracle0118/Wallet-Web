import { ISaveToDeviceProps } from '@portal/shared/utils/types'
import { Button, CustomTypography, Icon, Input } from 'app/components'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Guardian from '../../../assets/recovery/Guardian.svg'
import { ArrowLeftIcon } from '../Icons'

export const SaveToGuardian = ({ defaultFileName, handleBackStep, handleNextStep }: ISaveToDeviceProps) => {
  const { t } = useTranslation()
  const [fileName, setFileName] = useState<string>(defaultFileName)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const handleSubmit = () => {
    handleNextStep(fileName.trim(), 2, 'create_account')
  }
  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = event.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
    setFileName(updatedValue)
    setErrorMsg(updatedValue.length > 24 ? (t('Onboarding.fileNameMax24Characters') as string) : '')
  }
  return (
    <div>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onClick={() => handleBackStep('save_to_device')}
        className="absolute -left-1 top-0 w-5 h-5"
      >
        <ArrowLeftIcon className="text-lg stroke-custom-black dark:stroke-custom-white40" />
      </Button>
      <div className="flex justify-center items-center w-full h-[7rem]">
        <Icon size="large" icon={<Guardian />} className="!text-[8rem]" />
      </div>
      <CustomTypography dataAid="phraseQuestion" variant="h1" className="my-8">
        {t('Onboarding.guardian')}
      </CustomTypography>
      <CustomTypography className="dark:text-custom-white80 mb-6">
        {t('Onboarding.guardianDescription')}
      </CustomTypography>
      <CustomTypography className="dark:text-custom-white80">{t('Onboarding.guardianAssets')}</CustomTypography>

      <Input
        mainColor
        id="enter-password"
        className="w-full mt-4 font-extrabold"
        name="fileName"
        placeholder={t('Actions.fileName') as string}
        value={fileName}
        onChange={handleFileNameChange}
        endAdornment=".json"
        error={errorMsg}
      />

      <Button
        data-aid="nextNavigation"
        color={errorMsg ? 'disabled' : 'primary'}
        isDisabled={errorMsg || !fileName.trim()}
        onClick={() => handleSubmit()}
        className="mt-8"
      >
        {t('Onboarding.download')}
      </Button>
    </div>
  )
}
