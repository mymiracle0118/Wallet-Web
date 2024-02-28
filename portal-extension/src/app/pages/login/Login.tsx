import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'lib/woozie'

import { useWallet } from '@portal/shared/hooks/useWallet'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import { CustomTypography, PasswordInput, Form, Button } from 'app/components'
import { useAppEnv } from 'env'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { SpinnerIcon } from '@src/app/components/Icons'

// form schema
const schema = yup.object().shape({
  password: yup.string().min(8).max(32).required(),
})

const Login = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const { openWallet } = useWallet()
  const { navigate } = useNavigate()
  const { popup, fullPage } = useAppEnv()

  // init form
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setError,
  } = methods

  const handleLoginClick = (data: { password: string }) => {
    setLoading(true)
    openWallet(data.password)
      .then(() => navigate('/home'))
      .catch((error: Error) => {
        setError('password', { type: 'custom', message: error.message })
        setLoading(false)
      })
  }
  return (
    <OnboardingLayout disableLogo={fullPage} className={popup ? 'mt-32' : ''}>
      <div>
        <Form methods={methods} onSubmit={handleSubmit(handleLoginClick)}>
          <CustomTypography variant="h1" className={`mb-16 ${popup ? 'text-center' : ''}`}>
            {t('Login.welcomeBack')}
          </CustomTypography>

          <div className="h-[4.25rem]">
            <PasswordInput
              error={errors.password?.message}
              mainColor
              placeholder="Password"
              name="password"
              fullWidth
            />
          </div>

          <Button
            type="submit"
            className="mt-4"
            isLoading={loading}
            color={`${!isValid || !isDirty || loading ? 'disabled' : 'primary'}`}
            isDisabled={!isValid || !isDirty || loading}
            spinner={<SpinnerIcon />}
          >
            {!loading && t('Login.login')}
          </Button>

          <div className="flex items-center absolute bottom-6 -left-4 translate-y-1/2 translate-x-1/2">
            <Link to="/onboarding/forgot-password-recovery-qr" className="no-underline hover:underline">
              <CustomTypography variant="subtitle" className="cursor-pointer">
                {t('Login.forgotPassword')}
              </CustomTypography>
            </Link>
            <a
              target="_blank"
              href="https://www.portalwallet.io"
              rel="noreferrer"
              className="ml-8 no-underline hover:underline"
            >
              <CustomTypography variant="subtitle">{t('Login.getHelp')}</CustomTypography>
            </a>
          </div>
        </Form>
      </div>
    </OnboardingLayout>
  )
}
export default Login
