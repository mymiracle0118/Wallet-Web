import { Progress } from '@nextui-org/react'
import EncodeDataAndStoreDataToFile from '@portal/shared/services/SeedPhraseFileEncoderService'
import { revokeGoogleDriveAPIToken, uploadFileToDrive } from '@portal/shared/services/googleApiService'
import { ISeedLessProps } from '@portal/shared/utils/types'
import { CreatePassword } from '@src/app/components/seedless-recovery/CreatePassword'
import { SaveToDevice } from '@src/app/components/seedless-recovery/SaveToDevice'
import { SaveToDrive } from '@src/app/components/seedless-recovery/SaveToDrive'
import { SaveToGuardian } from '@src/app/components/seedless-recovery/SaveToGuardian'
import { convertToSlug } from '@src/utils/convertToSlug'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const SeedlessRecovery = ({ phrase, username, onSuccessSaveRecoveryFile }: ISeedLessProps) => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState<string>('create_password')
  const [fileName, setFileName] = useState<string>(convertToSlug(username || ''))
  const [encryptedFiles, setEncryptedFiles] = useState<string[]>()
  const [progressValue, setProgressValue] = useState<number>(0)

  const generateEncryptedFiles = async (password: string) => {
    const files = await EncodeDataAndStoreDataToFile(phrase, password)
    setEncryptedFiles(files)
    setCurrentStep('save_to_drive')
  }

  const handleSaveToDrive = async (fileName: string) => {
    if (encryptedFiles) {
      setFileName(fileName)
      const encryptData = encryptedFiles[0]
      try {
        await uploadFileToDrive(`${fileName}_0.json`, encryptData)
        setCurrentStep('save_to_device')
        revokeGoogleDriveAPIToken()
      } catch (error) {
        console.error(t('Onboarding.errorUploadingFileGoogleDrive'), error)
      }
    }
  }

  const handleCreateAccount = () => {
    onSuccessSaveRecoveryFile()
  }

  const handleDownloadFile = (fileName: string, fileIndex: number, nextStep: string) => {
    if (encryptedFiles) {
      setFileName(fileName)

      const encryptData = encryptedFiles[fileIndex]
      const element = document.createElement('a')
      const file = new Blob([encryptData], {
        type: 'text/plain',
      })
      element.href = URL.createObjectURL(file)
      element.download = `${fileName}_${fileIndex}.json`
      document.body.appendChild(element)
      element.click()

      if (nextStep === 'create_account') {
        handleCreateAccount()
      } else {
        setCurrentStep(nextStep)
      }
    }
  }

  useEffect(() => {
    switch (currentStep) {
      case 'create_password':
        setProgressValue(25)
        break
      case 'save_to_drive':
        setProgressValue(50)
        break
      case 'save_to_device':
        setProgressValue(75)
        break
      default:
        setProgressValue(100)
        break
    }
  }, [currentStep])

  let stepComponent
  switch (currentStep) {
    case 'create_password':
      stepComponent = <CreatePassword handleNextStep={generateEncryptedFiles} />
      break
    case 'save_to_drive':
      stepComponent = (
        <SaveToDrive defaultFileName={fileName} handleNextStep={handleSaveToDrive} handleBackStep={setCurrentStep} />
      )
      break
    case 'save_to_device':
      stepComponent = (
        <SaveToDevice defaultFileName={fileName} handleNextStep={handleDownloadFile} handleBackStep={setCurrentStep} />
      )
      break
    case 'save_to_guardian':
      stepComponent = (
        <SaveToGuardian
          defaultFileName={fileName}
          handleNextStep={handleDownloadFile}
          handleBackStep={setCurrentStep}
        />
      )
      break
    default:
      stepComponent = null
      break
  }

  const ProgressbaClass = `w-3 h-1 rounded-xl bg-custom-white10 absolute top-0`

  return (
    <div className="w-full relative">
      <div className="w-16 justify-end ml-auto relative mb-10">
        <Progress
          size="sm"
          color="secondary"
          className="max-w-md mt-2"
          value={progressValue}
          classNames={{ track: 'bg-transparent' }}
        />
        <div className={`${ProgressbaClass} left-5`} />
        <div className={`${ProgressbaClass} left-[2.2rem]`} />
        <div className={`${ProgressbaClass} left-[3.1rem]`} />
      </div>
      {stepComponent}
    </div>
  )
}
