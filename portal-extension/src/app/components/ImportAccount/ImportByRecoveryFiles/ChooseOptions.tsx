import { Checkbox } from '@nextui-org/checkbox'
import { IChooseOptionsProps, IFileRecoveryOptions } from '@portal/shared/utils/types'
import { FILE_RECOVERY_OPTIONS } from '@src/constants/content'
import { Button, CustomTypography } from 'app/components'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeftIcon, CheckRoundedGreyIcon, CheckboxIcon, SpinnerIcon } from '../../Icons'

export const ChooseOptions = ({ handleNextStep, handleBackStep, defaultRecoveryOptions }: IChooseOptionsProps) => {
  const { t } = useTranslation()
  const [recoveryOptions, setRecoveryOptions] = useState<string[]>(defaultRecoveryOptions)
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = () => {
    setLoading(true)
    handleNextStep(recoveryOptions)
    setLoading(false)
  }

  const handleOptions = (event: { target: { checked: any; value: string } }) => {
    if (event.target.checked) {
      setRecoveryOptions((prevData) => [...prevData.slice(-1), event.target.value])
    } else {
      setRecoveryOptions((prevFiles) => prevFiles.filter((value) => value !== event.target.value))
    }
  }
  return (
    <>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onClick={() => handleBackStep('password')}
        className="absolute -left-1 top-0 w-5 h-5"
      >
        <ArrowLeftIcon className="text-lg stroke-custom-black dark:stroke-custom-white" />
      </Button>
      <CustomTypography variant="h1">{t('Onboarding.byFilesRecovery')}</CustomTypography>
      <CustomTypography variant="body" className="my-8">
        {t('Onboarding.filesRecoveryChooseDescription')}
      </CustomTypography>

      <div className="rounded-lg p-4 bg-surface-dark-alt grid gap-6">
        {FILE_RECOVERY_OPTIONS.map((recoveryOption: IFileRecoveryOptions, index: number) => (
          <Checkbox
            key={index}
            size="lg"
            radius="full"
            value={recoveryOption.optionType}
            onChange={handleOptions}
            className="font-extrabold text-white-80 relative"
            classNames={{
              label: 'pl-4 text-sm',
              wrapper: 'bg-custom-white10',
            }}
            icon={<CheckboxIcon />}
            isSelected={recoveryOptions.includes(recoveryOption.optionType)}
          >
            <span className="absolute -left-8 -top-[0.15rem]">
              {recoveryOptions.length <= 2 && <CheckRoundedGreyIcon className="w-6 h-6" />}
            </span>
            {recoveryOption.optionType}
          </Checkbox>
        ))}
      </div>

      <Button
        data-aid="nextNavigation"
        onClick={() => handleSubmit()}
        className="mt-8"
        color={`${!loading && recoveryOptions.length !== 2 ? 'disabled' : 'primary'}`}
        isDisabled={!loading && recoveryOptions.length !== 2}
        isLoading={loading}
        spinner={<SpinnerIcon />}
      >
        {!loading && t('Actions.next')}
      </Button>
    </>
  )
}
