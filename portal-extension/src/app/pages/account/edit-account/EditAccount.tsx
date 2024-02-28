import { useSettings } from '@portal/shared/hooks/useSettings'
import { useWallet } from '@portal/shared/hooks/useWallet'
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
  const { username: oldUsername, avatar, changeAvatar } = useWallet()
  const [username, setUsername] = useState<string>(oldUsername || '')
  const { saveAccount, accounts, updateUsername } = useSettings()
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true)
  const [isShowAvatarModal, setShowAvatarModal] = useState<boolean>(false)
  const [selectedAvatar, setSelectedAvatar] = useState<null | string>(null)
  const [address, setAddress] = useState('')

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = event.target.value
    if (updatedValue.length <= 15 && !/\s/.test(updatedValue)) {
      setIsButtonDisabled(false)
      setUsername(updatedValue)
    }
  }

  useEffect(() => {
    const parts = window.location.href.split('/')
    const addressUrl = parts.pop()
    const entry = Object.values(accounts).find((entry) => entry.address === addressUrl)
    if (entry && addressUrl) {
      setUsername(entry.username)
      setAddress(addressUrl)
    }
  }, [])

  const saveUsername = () => {
    updateUsername(username, address)
    saveAccount()
    if (selectedAvatar) {
      changeAvatar(selectedAvatar)
    }
    navigate('/account')
  }

  return (
    <SinglePageLayout title="Edit account">
      <div className="space-y-4 flex flex-col items-center">
        <img
          src={selectedAvatar ? selectedAvatar : avatar || defaultAvatar}
          alt="default-avatar"
          className="rounded-full h-20 w-20 overflow-hidden"
        />
        <Button color="outlined" variant="bordered" className="w-fit" onClick={() => setShowAvatarModal(true)}>
          {t('Actions.change')}
        </Button>
      </div>

      <div className="my-4 space-y-1">
        <CustomTypography variant="subtitle" type="secondary">
          {t('Onboarding.accountName')}
        </CustomTypography>
        <Input
          mainColor
          id="username"
          placeholder={t('Onboarding.accountName')}
          value={username}
          onChange={handleUsernameChange}
          endAdornment={`${username.length}/15`}
          fullWidth
        />
      </div>
      {/* <div className="flex items-baseline">
        <Checkbox
          size="lg"
          radius="sm"
          icon={<CheckboxIcon />}
          isSelected={isTermsConditionsChecked}
          onValueChange={() => {
            setIsTermsConditionsChecked(!isTermsConditionsChecked)
            setIsButtonDisabled(!isButtonDisabled)
          }}
        >
          <CustomTypography variant="subtitle">{t('Account.editAccoutNotify')}</CustomTypography>
        </Checkbox>
      </div> */}

      <div className="flex justify-between gap-x-2 mt-8">
        <Button color="outlined" variant="bordered" onClick={goBack}>
          {t('Actions.notNow')}
        </Button>
        <Button
          color={`${isButtonDisabled ? 'disabled' : 'primary'}`}
          isDisabled={isButtonDisabled}
          onClick={saveUsername}
        >
          {t('Actions.save')}
        </Button>
      </div>

      <ChangeProfileAvatar
        openModal={isShowAvatarModal}
        closeModal={() => {
          setShowAvatarModal(false)
          setSelectedAvatar(null)
        }}
        selectedAvatar={selectedAvatar}
        setSelectedAvatar={setSelectedAvatar}
        handleAvatarChange={() => {
          setIsButtonDisabled(false)
          setShowAvatarModal(false)
        }}
      />
    </SinglePageLayout>
  )
}

export default EditAccount
