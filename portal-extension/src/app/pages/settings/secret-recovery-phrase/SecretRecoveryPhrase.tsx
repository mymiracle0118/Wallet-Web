import { goBack } from 'lib/woozie'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useWallet } from '@portal/shared/hooks/useWallet'

import { yupResolver } from '@hookform/resolvers/yup'
import { SpinnerIcon } from '@src/app/components/Icons'
import SinglePageTitleLayout from 'app/layouts/single-page-layout/SinglePageLayout'
import { Button, CustomTypography, Form, PasswordInput, SeedPhrase } from 'components'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const schema = yup.object().shape({
  password: yup.string().min(8).max(32).required(),
})
const SecretRecoveryPhrase: FC = () => {
  const { t } = useTranslation()
  const { wallet, openWallet } = useWallet()
  const [showSeedPhrase, setShowSeedPhrase] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [reveal, setReveal] = useState<boolean>(false)
  const [errorText, setErrorText] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      setReveal(false)
    }
  }, [])

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = methods
  const handleRevealPhrase = async (data: { password: string }) => {
    try {
      setLoading(true)
      // eslint-disable-next-line
      await openWallet(data.password)
      setReveal(true)
    } catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message
      setErrorText(message)
    } finally {
      setLoading(false)
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

          {wallet && reveal ? (
            <div className="mt-4">
              <CustomTypography className="my-2" variant="subtitle" type="secondary">
                {t('Security.secretRecoveryPhrase')}
              </CustomTypography>
              <SeedPhrase
                phrase={wallet.mnemonic.phrase}
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
                  error={errorText || errors?.password?.message}
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
