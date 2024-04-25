import { yupResolver } from '@hookform/resolvers/yup'
import { useSessionStore } from '@portal/shared/hooks/useSessionStore'
import { ICreatePasswordProps } from '@portal/shared/utils/types'
import { Button, CustomTypography, Form, PasswordInput } from 'app/components'
import { goBack } from 'lib/woozie'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { ArrowLeftIcon, SpinnerIcon } from '../../Icons'

export const EnterPassword = ({ handleNextStep }: ICreatePasswordProps) => {
  const { t } = useTranslation()
  const { setPassword } = useSessionStore()
  const [loading, setLoading] = useState<boolean>(false)

  const schema = yup.object().shape({
    password: yup.string().required(t('Onboarding.passwordIsRequired') as string),
  })

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = methods

  const decryptFiles = useCallback(
    (data: { password: string }) => {
      setLoading(true)
      setPassword(data.password)
      handleNextStep(data.password)
      setLoading(false)
    },
    [handleNextStep, setPassword]
  )

  return (
    <>
      <Button isIconOnly size="sm" variant="light" onClick={goBack} className="absolute -left-1 top-0 w-5 h-5">
        <ArrowLeftIcon className="text-lg stroke-custom-black dark:stroke-custom-white" />
      </Button>
      <CustomTypography variant="h1">{t('Onboarding.decryptYourFiles')}</CustomTypography>
      <CustomTypography variant="body" className="mt-10 mb-10">
        {t('Onboarding.decryptYourFilesDescription')}
      </CustomTypography>

      <Form methods={methods} onSubmit={handleSubmit(decryptFiles)}>
        <PasswordInput
          mainColor
          dataAid="password"
          id="enter-password"
          name="password"
          placeholder={t('Onboarding.password')}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          data-aid="nextNavigation"
          className="mt-8"
          color={`${!isDirty || !isValid || loading ? 'disabled' : 'primary'}`}
          isDisabled={!isDirty || !isValid || loading}
          isLoading={loading}
          spinner={<SpinnerIcon />}
        >
          {!loading && t('Actions.next')}
        </Button>
      </Form>
    </>
  )
}
