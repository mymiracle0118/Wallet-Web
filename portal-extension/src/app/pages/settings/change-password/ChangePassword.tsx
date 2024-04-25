import { yupResolver } from '@hookform/resolvers/yup'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { decryptData } from '@portal/shared/services/EncryptionService'
import { SpinnerIcon } from '@src/app/components/Icons'
import { Button, CustomTypography, PasswordInput } from 'app/components'
import { Form } from 'components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { goBack } from 'lib/woozie'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { passwordRegex } from 'utils/constants'
import * as yup from 'yup'

const ChangePassword = () => {
  const { t } = useTranslation()

  const schema = yup.object().shape({
    currentPassword: yup
      .string()
      .required()
      .required(t('Account.curentPasswordRequired') as string),
    newPassword: yup
      .string()
      .required(t('Account.newPasswordRequired') as string)
      .matches(passwordRegex.password, t('Onboarding.passwordRegexDontMatch') as string)
      .notOneOf([yup.ref('currentPassword')], t('Account.matchCurrentPassword') as string),
    confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], t('Onboarding.passwordMustMatch') as string),
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [currentPasswordErrorText, setCurrentPasswordErrorText] = useState<string>('')
  const [newPasswordErrorText, setNewPasswordErrorText] = useState<string>('')
  const { accounts, reEncryptAccountsWhenChangedPassword } = useSettings.getState()

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = methods

  const handleChangePassword = (data: { currentPassword: string; confirmNewPassword: string; newPassword: string }) => {
    try {
      setCurrentPasswordErrorText('')
      setNewPasswordErrorText('')

      if (data.newPassword === data.confirmNewPassword) {
        try {
          setLoading(true)

          const primaryAccount = Object.values(accounts).find((acc) => acc.isPrimary)
          try {
            if (primaryAccount) {
              const { encryptedWallet, encryptedPrivateKey } = primaryAccount
              const isPasswordValid = decryptData(
                (encryptedWallet || encryptedPrivateKey) as string,
                data.currentPassword
              )
              if (!isPasswordValid) {
                setCurrentPasswordErrorText(t('Actions.invalidCurrentPassword') as string)
              } else {
                // Update encrypted fields with new password
                reEncryptAccountsWhenChangedPassword(data.currentPassword, data.newPassword)
              }
            }
          } catch (error) {
            setCurrentPasswordErrorText(t('Actions.invalidCurrentPassword') as string)
          }
        } catch (error) {
          let message = 'Unknown Error'
          if (error instanceof Error) message = error.message
          setCurrentPasswordErrorText(message)
          setLoading(false)
        }
      } else {
        setNewPasswordErrorText(t('Security.passwordError') as string)
      }
    } catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message
      setCurrentPasswordErrorText(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SinglePageTitleLayout dataAid="passwordChangeHead" title={t('Security.loginPassword')}>
      <Form methods={methods} onSubmit={handleSubmit(handleChangePassword)}>
        <div className="space-y-4">
          <PasswordInput
            dataAid="currentPassword"
            error={currentPasswordErrorText || errors.currentPassword?.message}
            mainColor
            name="currentPassword"
            placeholder={t('Security.currentPassword')}
            className="mt-0"
          />
          <div>
            <PasswordInput
              dataAid="newPassword"
              mainColor
              name="newPassword"
              placeholder={t('Security.newPassword')}
              error={errors.newPassword?.message}
            />
            <CustomTypography variant="body" type="secondary" className="ml-1 mt-1">
              {t('Onboarding.passwordErrorMsg')}
            </CustomTypography>
          </div>
          <PasswordInput
            dataAid="confirmPassword"
            name="confirmNewPassword"
            error={newPasswordErrorText || errors.confirmNewPassword?.message}
            mainColor
            placeholder={t('Security.confirmPassword')}
          />

          <div className="flex gap-2 pt-4">
            <Button data-aid="cancelButton" isDisabled={loading} color="outlined" variant="bordered" onClick={goBack}>
              {t('Actions.cancel')}
            </Button>
            <Button
              data-aid="changeButton"
              data-test-id="button-change"
              color={`${loading || !isValid || !isDirty ? 'disabled' : 'primary'}`}
              isDisabled={loading || !isValid || !isDirty}
              type="submit"
              isLoading={loading}
              spinner={<SpinnerIcon />}
            >
              {!loading && t('Actions.change')}
            </Button>
          </div>
        </div>
      </Form>
    </SinglePageTitleLayout>
  )
}

export default ChangePassword
