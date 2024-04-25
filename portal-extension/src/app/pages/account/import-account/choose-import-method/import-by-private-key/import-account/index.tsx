import { yupResolver } from '@hookform/resolvers/yup'
import { Avatar } from '@nextui-org/react'
import { useWallet } from '@portal/shared/hooks/useWallet'
import ChangeProfileAvatar from '@src/app/components/ChangeProfileAvatar'
import { Button, Form, Input } from 'app/components'
import defaultAvatar from 'assets/images/Avatar.png'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { createLocationState, useNavigate } from 'lib/woozie'
import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

const ImportPrivateKeyAccount: FC<{ importWallet?: boolean }> = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { username: storedUsername, createWallet, storeWallet, changeAvatar } = useWallet()

  const [loading, setLoading] = useState<boolean>(false)
  const { pathname } = createLocationState()
  const paths = pathname.split('/')
  const isCreateAccount = paths[paths.length - 2] === 'onboarding'
  const [isShowAvatarModal, setShowAvatarModal] = useState<boolean>(false)
  const [selectedAvatar, setSelectedAvatar] = useState<null | string>(null)

  const schema = yup.object().shape({
    username: yup
      .string()
      .min(3, t('Account.usernameMinimum') as string)
      .notRequired()
      .matches(/^\S*$/, t('Account.usernameNoSpace') as string),
  })

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
  } = methods

  const onCreateAccount = useCallback(
    async (data: { username: string; password: string }) => {
      if (!isCreateAccount) {
        try {
          await storeWallet(storedUsername || data.username, data.password)
        } catch (e) {
          console.log(e.message)
        }
        if (selectedAvatar) {
          changeAvatar(selectedAvatar)
        }
        navigate('/onboarding/congratulations')
      } else {
        setLoading(true)
        createWallet()
        try {
          await storeWallet(data.username, data.password)
        } catch (e) {
          console.log(e.message)
        }
        navigate('/onboarding/demo-video')
      }
    },
    [createWallet, storeWallet, navigate] // eslint-disable-line
  )

  return (
    <SinglePageTitleLayout title={t('Account.importAccount')}>
      <Form methods={methods} onSubmit={handleSubmit(onCreateAccount)}>
        <div className="flex flex-col items-center space-y-5">
          <div className="space-y-4">
            <Avatar src={selectedAvatar || defaultAvatar} className="w-24 h-24 rounded-full" />

            <Button
              variant="bordered"
              radius="sm"
              color="outlined"
              className="font-extrabold h-11 w-24"
              onClick={() => setShowAvatarModal(true)}
            >
              {t('Actions.change')}
            </Button>
          </div>

          <div className="w-full pb-10">
            <Input
              dataAid="username"
              mainColor
              id="username"
              {...register('username')}
              dynamicColor={'text-feedback-negative'}
              error={errors.username?.message}
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
            />
          </div>

          <Button
            id="create-next-btn"
            data-aid="nextNavigation"
            type="submit"
            color={`${!isDirty || !isValid ? 'disabled' : 'primary'}`}
            isDisabled={!isDirty || !isValid || loading}
          >
            {t('Actions.import')}
          </Button>
        </div>
      </Form>

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
    </SinglePageTitleLayout>
  )
}

export default ImportPrivateKeyAccount
