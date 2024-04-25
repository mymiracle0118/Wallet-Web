import { IAccountUpdateProps, useSettings } from '@portal/shared/hooks/useSettings'
import ChangeProfileAvatar from '@src/app/components/ChangeProfileAvatar'
import defaultAvatar from 'assets/images/Avatar.png'
import { Button, CustomTypography, Input } from 'components'
import SinglePageLayout from 'layouts/single-page-layout/SinglePageLayout'
import { goBack, useNavigate } from 'lib/woozie'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const EditAccount = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const [username, setUsername] = useState<string>('')
  const { accounts, updateAccountInfo } = useSettings()
  const [isShowAvatarModal, setShowAvatarModal] = useState<boolean>(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = event.target.value
    setErrorMsg('')
    // setIsButtonDisabled(true)
    setUsername(updatedValue)
    if (updatedValue.length < 3) {
      setErrorMsg(t('Account.usernameMinimum') as string)
    }
    if (/\s/.test(updatedValue)) {
      setErrorMsg(t('Account.usernameNoSpace') as string)
    }
  }

  const parts = window.location.href.split('/')
  const accountId: any = parts.pop()
  useEffect(() => {
    const account = Object.values(accounts).find((entry) => entry.id === accountId)
    if (account && accountId) {
      setUsername(account.username)
      // setAddress(accountId)
      if (account.avatar) {
        setSelectedAvatar(account.avatar)
      }
    }
  }, [accounts])

  const saveUsername = () => {
    const hasUsername = Object.values(accounts).some(
      (account) => account.username === username && account.id !== accountId
    )
    if (hasUsername) {
      setErrorMsg('Duplicated label')
    } else {
      const accountInfo: IAccountUpdateProps = { username, avatar: selectedAvatar as string }
      updateAccountInfo(accountId, accountInfo)

      navigate('/account')
    }
  }

  return (
    <SinglePageLayout title="Edit account">
      <div className="space-y-4 flex flex-col items-center">
        <img
          src={selectedAvatar ? selectedAvatar : defaultAvatar}
          alt="default-avatar"
          className="rounded-full h-20 w-20 overflow-hidden"
        />
        <Button color="outlined" variant="bordered" className="w-fit" onClick={() => setShowAvatarModal(true)}>
          {t('Actions.change')}
        </Button>
      </div>

      <div className="my-4 space-y-1 h-20">
        <CustomTypography variant="subtitle" type="secondary">
          {t('Onboarding.accountName')}
        </CustomTypography>
        <Input
          mainColor
          id="username"
          placeholder={t('Onboarding.accountName') as string}
          value={username}
          onChange={handleUsernameChange}
          endAdornment={
            <div className={`text-xs ${username.length > 15 ? 'text-feedback-negative' : 'text-custom-white'}`}>
              {username.length}/15
            </div>
          }
          className={username.length > 15 ? '!text-feedback-negative !border !border-feedback-negative' : ''}
          fullWidth
          error={errorMsg}
        />
      </div>

      <div className="flex justify-between gap-x-2 mt-8">
        <Button color="outlined" variant="bordered" onClick={goBack}>
          {t('Actions.cancel')}
        </Button>
        <Button
          color={`${errorMsg || username.length > 15 ? 'disabled' : 'primary'}`}
          isDisabled={errorMsg || username.length > 15}
          onClick={saveUsername}
        >
          {t('Actions.save')}
        </Button>
      </div>

      <ChangeProfileAvatar
        openModal={isShowAvatarModal}
        closeModal={() => {
          setShowAvatarModal(false)
        }}
        selectedAvatar={selectedAvatar}
        setSelectedAvatar={setSelectedAvatar}
        handleAvatarChange={() => {
          setShowAvatarModal(false)
        }}
      />
    </SinglePageLayout>
  )
}

export default EditAccount
