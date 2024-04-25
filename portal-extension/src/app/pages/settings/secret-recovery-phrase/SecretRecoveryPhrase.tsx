import { goBack } from 'lib/woozie'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { yupResolver } from '@hookform/resolvers/yup'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { decryptData } from '@portal/shared/services/EncryptionService'
import { SpinnerIcon } from '@src/app/components/Icons'
import SinglePageTitleLayout from 'app/layouts/single-page-layout/SinglePageLayout'
import { Button, CustomTypography, Form, PasswordInput, SeedPhrase } from 'components'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const SecretRecoveryPhrase: FC = () => {
  const { t } = useTranslation()
  const [showSeedPhrase, setShowSeedPhrase] = useState<boolean>(false)

  const { accounts } = useSettings()
  const [loading, setLoading] = useState<boolean>(false)
  const [reveal, setReveal] = useState<boolean>(false)
  const [currentPhrase, setCurrentPhrase] = useState<string>('')

  useEffect(() => {
    return () => {
      setReveal(false)
    }
  }, [])

  const schema = yup.object().shape({
    password: yup.string().required(t('Account.enterPassword') as string),
  })

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const {
    handleSubmit,
    setError,
    formState: { errors, isValid, isDirty },
  } = methods

  const handleRevealPhrase = (data: { password: string }) => {
    try {
      setLoading(true)
      const primaryAccount = Object.values(accounts).find((acc) => acc.isPrimary)
      if (primaryAccount) {
        const phrase = decryptData(primaryAccount.encryptedWallet as string, data.password as string)
        if (phrase) {
          setCurrentPhrase(phrase)
          setReveal(true)
        } else {
          const message = t('Actions.invalidPassword')
          setError('password', { type: 'custom', message })
          setLoading(false)
        }
      }
    } catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message
      setError('password', { type: 'custom', message })
      setLoading(false)
      setCurrentPhrase('')
    }
  }

  return (
    <SinglePageTitleLayout dataAid="recoveryPhraseHead" title="Secret recovery phrase">
      <Form methods={methods} onSubmit={handleSubmit(handleRevealPhrase)}>
        <div>
          <div className="p-4 border rounded-lg border-custom-grey40">
            <CustomTypography dataa-aid="phraseGuide" variant="subtitle">
              <span className="text-gradient text-grident-primary capitalize">{t('Actions.warning')}</span>
            </CustomTypography>
            <CustomTypography dataAid="phraseGuide">
              <ul className="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-500 pt-2 [&>*]:text-white-80">
                <li>{t('Onboarding.generateSeedInstructionsOne')}</li>
                <li>{t('Onboarding.generateSeedInstructionsTwo')} </li>
                <li>{t('Onboarding.generateSeedInstructionsThree')}</li>
              </ul>
            </CustomTypography>
          </div>

          {currentPhrase && reveal ? (
            <div className="mt-4">
              <CustomTypography className="my-2" variant="subtitle" type="secondary">
                {t('Security.secretRecoveryPhrase')}
              </CustomTypography>
              <SeedPhrase
                phrase={currentPhrase}
                showSeedPhrase={showSeedPhrase}
                setShowSeedPhrase={setShowSeedPhrase}
              />
              <Button data-test-id="button-done" onClick={goBack} className="mt-2" color="primary">
                {t('Actions.done')}
              </Button>
            </div>
          ) : (
            <div className="flex-col mt-4">
              <div>
                <PasswordInput
                  mainColor
                  disabled={loading}
                  placeholder="Password"
                  name="password"
                  className="w-full"
                  error={errors?.password?.message}
                />
              </div>
              <div className="flex justify-between mt-8 gap-2">
                <Button data-aid="cancelButton" disabled={loading} variant="bordered" color="outlined" onClick={goBack}>
                  {t('Actions.cancel')}
                </Button>
                <Button
                  type="submit"
                  data-aid="showButton"
                  data-test-id="button-show"
                  color={`${loading || !isValid || !isDirty ? 'disabled' : 'primary'}`}
                  isDisabled={loading || !isValid || !isDirty}
                  isLoading={loading}
                  spinner={<SpinnerIcon />}
                >
                  {!loading && t('Actions.show')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Form>
    </SinglePageTitleLayout>
  )
}

export default SecretRecoveryPhrase
