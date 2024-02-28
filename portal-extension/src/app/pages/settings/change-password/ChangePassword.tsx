import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { goBack } from 'lib/woozie'

import { useWallet } from '@portal/shared/hooks/useWallet'
import { CustomTypography, PasswordInput, Button } from 'app/components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import * as yup from 'yup'
import { Form } from 'components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { SpinnerIcon } from '@src/app/components/Icons'
import { useStore } from '@portal/shared/hooks/useStore'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { ethers } from 'ethers'
import { decryptData } from '@src/utils/constants'

const schema = yup.object().shape({
  currentPassword: yup.string().min(8).max(32).required(),
  newPassword: yup
    .string()
    .min(8)
    .max(32)
    .required()
    .notOneOf([yup.ref('currentPassword')], 'Current password cant be same as new password'),
  confirmNewPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'passwords must match'),
})
const ChangePassword = () => {
  const { t } = useTranslation()
  const { openWallet, storeWallet, username } = useWallet()

  const [loading, setLoading] = useState<boolean>(false)
  const [currentPasswordErrorText, setCurrentPasswordErrorText] = useState('')
  const [newPasswordErrorText, setNewPasswordErrorText] = useState('')
  const { currentAccount } = useSettings()

  const { walletsList } = useStore()

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = methods

  const handleChangePassword = async (data: {
    currentPassword: string
    confirmNewPassword: string
    newPassword: string
  }) => {
    try {
      setCurrentPasswordErrorText('')
      setNewPasswordErrorText('')

      if (data.newPassword === data.confirmNewPassword) {
        try {
          setLoading(true)
          if (currentAccount) {
            setLoading(true)

            const accountWallet = walletsList[currentAccount.address][currentAccount.networkName]
            const networkToken = useWallet.getState().getNetworkTokenWithCurrentEnv(currentAccount.networkName)
            let checkPassword: any
            if (networkToken.isEVMNetwork) {
              checkPassword = await ethers.Wallet.fromEncryptedJson(
                accountWallet.encryptedWallet as string,
                data.currentPassword as string
              )
            } else {
              checkPassword = await decryptData(accountWallet.encryptedWallet as string, data.currentPassword as string)
            }
            if (checkPassword) {
              await openWallet(data.currentPassword)
              await storeWallet(username as string, data.newPassword)
              goBack()
            }
          }
        } catch (error) {
          let message = 'Unknown Error'
          if (error instanceof Error) message = error.message
          setCurrentPasswordErrorText(message)
          setLoading(false)
        }
      } else {
        setNewPasswordErrorText(t('Security.passwordError'))
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
          <PasswordInput
            dataAid="newPassword"
            mainColor
            name="newPassword"
            placeholder={t('Security.newPassword')}
            error={errors.newPassword?.message}
          />
          <CustomTypography variant="body" type="secondary" className="ml-1 mt-2">
            {t('Onboarding.passwordErrorMsg')}
          </CustomTypography>
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
