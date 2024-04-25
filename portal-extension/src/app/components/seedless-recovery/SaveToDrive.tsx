import { User } from '@nextui-org/react'
import {
  getProfileUserInfo,
  GoogleUserProfile,
  revokeGoogleDriveAPIToken,
} from '@portal/shared/services/googleApiService'
import { ISaveToDriveProps } from '@portal/shared/utils/types'
import { Button, CustomTypography, Icon, Input } from 'app/components'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Gdrive from '../../../assets/recovery/gdrive.svg'
import { ArrowLeftIcon, SpinnerIcon } from '../Icons'

export const SaveToDrive = ({ defaultFileName, handleBackStep, handleNextStep }: ISaveToDriveProps) => {
  const { t } = useTranslation()
  const [fileName, setFileName] = useState<string>(defaultFileName)
  const [errorMessage, setErrorMessage] = useState<string | null>()
  const [googleUserInfo, setGoogleUserInfo] = useState<GoogleUserProfile>()
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const handleSubmit = () => {
    setLoading(true)
    handleNextStep(fileName.trim())
  }

  const logInToGoogle = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const userInfo = await getProfileUserInfo()
      setGoogleUserInfo(userInfo)
      setLoading(false)
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }
  }
  const handleBack = () => {
    if (googleUserInfo) {
      revokeGoogleDriveAPIToken()
    }
    handleBackStep('create_password')
  }

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = event.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
    setFileName(updatedValue)
    setErrorMsg(updatedValue.length > 24 ? (t('Onboarding.fileNameMax24Characters') as string) : '')
  }

  return (
    <div>
      <Button isIconOnly size="sm" variant="light" onClick={handleBack} className="absolute -left-1 top-0 w-5 h-5">
        <ArrowLeftIcon className="text-lg stroke-custom-black dark:stroke-custom-white40" />
      </Button>
      <div className="flex justify-center items-center w-full h-[8rem]">
        <Icon size="large" icon={<Gdrive />} className="!text-[20rem]" />
      </div>
      <CustomTypography dataAid="phraseQuestion" variant="h1" className="my-8">
        {t('Onboarding.googleDrive')}
      </CustomTypography>
      <CustomTypography className="dark:text-custom-white80">{t('Onboarding.googleDriveDescription')}</CustomTypography>

      {errorMessage && (
        <div className="border border-danger text-red-700 px-4 py-3 rounded relative rounded-md mt-4" role="alert">
          <span className="block sm:inline break-words text-danger">{errorMessage}</span>
        </div>
      )}

      {!googleUserInfo && (
        <Button
          data-aid="loginToDrive"
          onClick={logInToGoogle}
          className="mt-8"
          color={loading ? 'disabled' : 'primary'}
          isDisabled={loading}
          isLoading={loading}
          spinner={<SpinnerIcon />}
        >
          {!loading && 'Log In to Google'}
        </Button>
      )}

      {googleUserInfo && (
        <div>
          {googleUserInfo.displayName && googleUserInfo.photoLink && (
            <User
              name={googleUserInfo.displayName}
              avatarProps={{
                src: googleUserInfo.photoLink,
              }}
              className="mt-4 mb-4 px-4 py-3 bg-surface-dark-alt flex justify-start"
            />
          )}
          <Input
            mainColor
            id="enter-password"
            className="mt-4 w-full font-extrabold"
            name="fileName"
            placeholder={t('Actions.fileName') as string}
            value={fileName}
            onChange={handleFileNameChange}
            endAdornment=".json"
            error={errorMsg}
          />

          <Button
            data-aid="backUp"
            onClick={handleSubmit}
            className="mt-8"
            color={loading || errorMsg ? 'disabled' : 'primary'}
            isDisabled={loading || errorMsg || !fileName.trim()}
            isLoading={loading}
            spinner={<SpinnerIcon />}
          >
            {!loading && t('Actions.backUp')}
          </Button>
        </div>
      )}
    </div>
  )
}
