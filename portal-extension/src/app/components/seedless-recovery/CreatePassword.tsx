import { yupResolver } from '@hookform/resolvers/yup'
import { useSessionStore } from '@portal/shared/hooks/useSessionStore'
import { ICreatePasswordProps } from '@portal/shared/utils/types'
import { passwordRegex } from '@src/utils/constants'
import { Button, CustomTypography, Form, Icon, PasswordInput } from 'app/components'
import { goBack } from 'lib/woozie'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import PasswordLock from '../../../assets/recovery/password-lock.svg'
import { ArrowLeftIcon, SpinnerIcon } from '../Icons'

export const CreatePassword = ({ handleNextStep }: ICreatePasswordProps) => {
  const { t } = useTranslation()
  const { setPassword } = useSessionStore()
  const [loading, setLoading] = useState<boolean>(false)

  const schema = yup.object().shape({
    password: yup
      .string()
      .required(t('Settings.setPassword') as string)
      .matches(passwordRegex.password, t('Onboarding.passwordRegexDontMatch') as string),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], t('Onboarding.passwordDontMatch') as string),
  })

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = methods

  const onCreatePassword = useCallback(
    (data: { password: string }) => {
      setLoading(true)
      setPassword(data.password)
      handleNextStep(data.password)
      setLoading(false)
    },
    [handleNextStep, setPassword]
  )

  return (
    <Form methods={methods} onSubmit={handleSubmit(onCreatePassword)}>
      <Button isIconOnly size="sm" variant="light" onClick={goBack} className="absolute -left-1 top-0 w-5 h-5">
        <ArrowLeftIcon className="text-lg stroke-custom-black dark:stroke-custom-white40" />
      </Button>
      <div className="flex justify-center mb-8">
        <Icon size="large" icon={<PasswordLock />} className="text-[7rem]" />
      </div>
      <div className="space-y-8">
        <CustomTypography dataAid="CreatePassword" variant="h1">
          {t('Onboarding.createPassword')}
        </CustomTypography>
        <CustomTypography dataAid="Desc" className="dark:text-custom-white80">
          {t('Onboarding.createPasswordDescription')}
        </CustomTypography>
      </div>
      <PasswordInput
        mainColor
        dataAid="password"
        id="enter-password"
        name="password"
        placeholder={t('Onboarding.setPassword')}
        error={errors.password?.message}
      />
      <PasswordInput
        mainColor
        dataAid="confirmPassword"
        name="confirmPassword"
        id="confirm-password"
        value="S1234567890*"
        placeholder={t('Onboarding.confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <Button
        data-aid="nextNavigation"
        className="mt-8"
        type="submit"
        color={`${!isDirty || !isValid || loading ? 'disabled' : 'primary'}`}
        isDisabled={!isDirty || !isValid || loading}
        isLoading={loading}
        spinner={<SpinnerIcon />}
      >
        {!loading && t('Actions.next')}
      </Button>
    </Form>
  )
}
