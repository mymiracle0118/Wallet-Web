import { TAccount, useSettings } from '@portal/shared/hooks/useSettings'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { Button, CustomTypography, Form, Input } from 'components'
import SinglePageLayout from 'layouts/single-page-layout/SinglePageLayout'
import { goBack } from 'lib/woozie'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { yupResolver } from '@hookform/resolvers/yup'
import { Avatar } from '@nextui-org/react'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import ChangeProfileAvatar from '@src/app/components/ChangeProfileAvatar'
import { SpinnerIcon } from '@src/app/components/Icons'
import defaultAvatar from 'assets/images/Avatar.png'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const CreateSubAccount = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const { storeWallet, changeAvatar, getPhrase } = useWallet()
  const { saveAccount, getNewAccountId, accounts, setCurrentAccount } = useSettings()
  const [isShowAvatarModal, setShowAvatarModal] = useState<boolean>(false)
  const [selectedAvatar, setSelectedAvatar] = useState<null | string>(null)

  const schema = yup.object().shape({
    username: yup
      .string()
      .min(3, t('Account.usernameMinimum') as string)
      .required(t('Account.usernameRequired') as string)
      .matches(/^\S*$/, t('Account.usernameNoSpace') as string),
  })
  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isValid, isDirty },
  } = methods

  const handleCreateAccount = async ({ username }: { username: string }) => {
    const hasUsername = Object.values(accounts).some((account) => account.username === username)
    if (hasUsername) {
      setError('username', { type: 'custom', message: 'Account already added with same name' })
    } else {
      if (selectedAvatar) {
        changeAvatar(selectedAvatar)
      }

      const accountId = getNewAccountId()
      try {
        setLoading(true)
        const mnemonic = getPhrase()
        const primaryAccount = Object.values(accounts).find((acc) => acc.isPrimary)
        if (mnemonic && primaryAccount) {
          const { wallet, derivationPathIndex } = await NetworkFactory.checkAndCreateNextDeriveWallet(
            mnemonic,
            primaryAccount.networkName
          )

          await storeWallet(
            { address: wallet.address, derivationPathIndex },
            username,
            '',
            primaryAccount.networkName,
            accountId
          )
          const accountObj = {
            id: accountId,
            address: wallet.address,
            username,
            networkName: primaryAccount.networkName,
            avatar: selectedAvatar || defaultAvatar,
          }
          saveAccount(accountObj)
          setCurrentAccount(accountObj as TAccount)

          setTimeout(async () => {
            const {
              wallet: supWallet,
              encryptedPrivateKey: supEncryptedPrivateKey,
              derivationPathIndex,
            } = await NetworkFactory.checkAndCreateNextDeriveWallet(mnemonic, 'SUPRA')
            await storeWallet(
              {
                address: supWallet.address,
                wallet: supWallet,
                encryptedPrivateKey: supEncryptedPrivateKey,
                derivationPathIndex,
              },
              '',
              '',
              'SUPRA',
              accountId
            )
          }, 1000)
        }
        setLoading(false)
        goBack()
      } catch (error) {
        setLoading(false)
        let message = t('Actions.somethingWrong')
        if (error instanceof Error) message = error.message
        setError('username', { type: 'custom', message: message })
      }
    }
  }

  return (
    <SinglePageLayout title="Create sub account">
      <Form methods={methods} onSubmit={handleSubmit(handleCreateAccount)}>
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar src={selectedAvatar || defaultAvatar} className="w-24 h-24 rounded-full" />

            <Button
              variant="bordered"
              color="outlined"
              className="font-extrabold h-11 w-24"
              onClick={() => setShowAvatarModal(true)}
            >
              {t('Actions.change')}
            </Button>
          </div>

          <div className="space-y-1">
            <CustomTypography variant="subtitle" type="secondary">
              {t('Onboarding.accountName')}
            </CustomTypography>
            <Input
              autoComplete="off"
              dataTestId="username"
              mainColor
              id="username"
              placeholder={t('Onboarding.accountName') as string}
              endAdornment={
                <div
                  className={`text-xs ${
                    watch('username')?.length > 15 ? 'text-feedback-negative' : 'text-fotter-dark-inactive'
                  }`}
                >
                  {watch('username')?.length || 0}/15
                </div>
              }
              className={
                errors.username || watch('username')?.length > 15
                  ? '!text-feedback-negative !border !border-feedback-negative'
                  : ''
              }
              fullWidth
              disabled={loading}
              {...register('username')}
              error={errors.username?.message}
              dynamicColor={'text-feedback-negative'}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-between mt-8">
          <Button variant="bordered" color="outlined" onClick={() => goBack()}>
            {t('Actions.cancel')}
          </Button>
          <Button
            type="submit"
            data-test-id="create-subaccount-btn"
            color={!isDirty || !isValid || loading || watch('username')?.length > 15 ? 'disabled' : 'primary'}
            isDisabled={!isDirty || !isValid || loading || watch('username')?.length > 15}
            isLoading={loading}
            spinner={<SpinnerIcon />}
          >
            {!loading && t('Actions.create')}
          </Button>
        </div>

        <ChangeProfileAvatar
          openModal={isShowAvatarModal}
          closeModal={() => {
            setShowAvatarModal(false)
            setSelectedAvatar('')
          }}
          selectedAvatar={selectedAvatar}
          setSelectedAvatar={setSelectedAvatar}
          handleAvatarChange={() => setShowAvatarModal(false)}
        />
      </Form>
    </SinglePageLayout>
  )
}

export default CreateSubAccount
