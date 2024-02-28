import { useSettings } from '@portal/shared/hooks/useSettings'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { Button, CustomTypography, Form, Input } from 'components'
import SinglePageLayout from 'layouts/single-page-layout/SinglePageLayout'
import { goBack } from 'lib/woozie'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { yupResolver } from '@hookform/resolvers/yup'
import { Avatar } from '@nextui-org/react'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useStore } from '@portal/shared/hooks/useStore'
import ChangeProfileAvatar from '@src/app/components/ChangeProfileAvatar'
import { SpinnerIcon } from '@src/app/components/Icons'
import PasswordPromptModal from 'app/pages/wallet/PasswordPromptModal'
import defaultAvatar from 'assets/images/Avatar.png'
import { ethers } from 'ethers'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const CreateSubAccount = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const { storeWallet, changeAvatar } = useWallet()
  const { saveAccount, accounts } = useSettings()
  const { walletsList } = useStore()
  const [isShowAvatarModal, setShowAvatarModal] = useState<boolean>(false)
  const [selectedAvatar, setSelectedAvatar] = useState<null | string>(null)
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false)
  const [subUsername, setSubUsername] = useState('')

  const schema = yup.object().shape({
    username: yup
      .string()
      .min(3, t('Account.usernameMinimum'))
      .max(15, t('Account.usernameMaximum'))
      .required(t('Account.usernameRequired'))
      .matches(/^\S*$/, t('Account.usernameNoSpace')),
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

  const handleCreateAccount = ({ username }: { username: string }) => {
    if (selectedAvatar) {
      changeAvatar(selectedAvatar)
    }
    setSubUsername(username)
    setOpenPasswordModal(true)
  }

  const handlePasswordPromptSuccess = async (password: string) => {
    setOpenPasswordModal(false)
    try {
      setLoading(true)
      const primaryAccount = Object.values(accounts).find((acc) => acc.isPrimary)
      if (primaryAccount) {
        const accountWallet = walletsList[primaryAccount.address][primaryAccount.networkName]
        const currentWallet = await ethers.Wallet.fromEncryptedJson(
          accountWallet.encryptedWallet as string,
          password as string
        )
        if (currentWallet) {
          const { wallet, encryptedPrivateKey, deriveIndex } = await NetworkFactory.checkAndCreateNextDeriveWallet(
            currentWallet.mnemonic.phrase as string,
            primaryAccount.networkName
          )

          await storeWallet(
            { wallet, encryptedPrivateKey, deriveIndex },
            subUsername,
            password,
            primaryAccount.networkName,
            wallet.address
          )
          saveAccount(subUsername, wallet.address, primaryAccount.networkName)
        }
      }
      setLoading(false)
      goBack()
    } catch (error) {
      setLoading(false)
      let message = 'Something is wrong!'
      if (error instanceof Error) message = error.message
      setError('username', { type: 'custom', message: message })
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
              placeholder={t('Onboarding.accountName')}
              endAdornment={
                <div
                  className={`text-[12px] ${
                    watch('username')?.length > 15 ? 'text-feedback-negative' : 'text-fotter-dark-inactive'
                  }`}
                >
                  {watch('username')?.length || 0}/15
                </div>
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
            color={!isDirty || !isValid || loading || subUsername?.length > 4 ? 'disabled' : 'primary'}
            isDisabled={!isDirty || !isValid || loading || subUsername?.length > 4}
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
      <PasswordPromptModal
        modalState={openPasswordModal}
        closePromptModal={() => setOpenPasswordModal(false)}
        onPromptPassword={handlePasswordPromptSuccess}
      />
    </SinglePageLayout>
  )
}

export default CreateSubAccount
