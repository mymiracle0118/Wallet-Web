import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { RsDecode } from '@portal/shared/services/SeedPhraseFileDecoderService'
import { IChooseFilesProps, IRecoveryFilesProps } from '@portal/shared/utils/types'
import { CheckGreenIcon, CrossRoundedRed } from '@src/app/components/Icons'
import { Button, CustomTypography } from 'app/components'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeftIcon, CloseRoundedIcon, SpinnerIcon } from '../../Icons'

export const ChooseFiles = ({
  recoveryPassword,
  recoveryOptions,
  handleBackStep,
  handleNextStep,
}: IChooseFilesProps) => {
  const { t } = useTranslation()
  const [recoveryFiles, setRecoveryFiles] = useState<IRecoveryFilesProps[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [highlightedDragArea, setHighlightedDragArea] = useState<boolean>(false)
  const { clearWallet, defaultOnboardingNetwork } = useWallet()
  const { clearAccounts, clearAddressbook } = useSettings()

  useEffect(() => {
    if (errorMessage) {
      setRecoveryFiles((prevFiles) =>
        prevFiles.map((file: IRecoveryFilesProps): IRecoveryFilesProps => {
          return { ...file, isValid: false }
        })
      )
    }
  }, [errorMessage])

  const compareFiles = async () => {
    setLoading(true)
    setErrorMessage(null)
    const data = await RsDecode([recoveryFiles[0].content, recoveryFiles[1].content], recoveryPassword as string)
    if (data && data.recoveredSeed) {
      const networkFactory = NetworkFactory.selectByNetworkId(defaultOnboardingNetwork as string)
      try {
        await clearWallet().then()
        clearAccounts()
        clearAddressbook()
        networkFactory.recoverWallet(data.recoveredSeed)
        handleNextStep(data.recoveredSeed)
      } catch (error) {
        setErrorMessage(t('Onboarding.invalidRecoveryFiles'))
      }
    } else {
      setErrorMessage(t('Onboarding.invalidRecoveryFiles'))
    }
    setLoading(false)
  }

  const handleFileChange = (e: { target: { files: any } }) => {
    setErrorMessage(null)
    const files = e.target.files
    Array.from(files).forEach((file: any) => {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event?.target?.result
          if (content) {
            const fileData: IRecoveryFilesProps = {
              fileName: file.name,
              content: content as string,
              isValid: false,
            }
            setRecoveryFiles((prevData) => {
              if (prevData.length == 2) {
                return prevData
              }
              return [...prevData, fileData]
            })
          }
        }
        reader.readAsText(file)
      }
    })
  }

  const handleRemoveFile = (index: number) => {
    setErrorMessage(null)
    setRecoveryFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const validRecoveryFilesCount: number = useMemo(() => recoveryFiles.filter((f) => f.isValid).length, [recoveryFiles])
  const checkIsValidRecoveryFiles = () => {
    setRecoveryFiles((prevFiles) =>
      prevFiles.map((file) => {
        const fileData: IRecoveryFilesProps = { ...file }
        try {
          const data = JSON.parse(fileData.content)
          if (data.cipher && data.iv) {
            fileData.isValid = true
          }
        } catch (e) {}
        fileData.errorMessage = fileData.isValid ? '' : 'Incorrect file'
        return fileData
      })
    )
  }

  const handleDragOver = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setHighlightedDragArea(true)
  }

  const handleDragLeave = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setHighlightedDragArea(false)
  }

  const handleDrop = (e: {
    preventDefault: () => void
    dataTransfer: { files: Iterable<unknown> | ArrayLike<unknown> }
  }) => {
    e.preventDefault()
    setHighlightedDragArea(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileChange({ target: { files: files } })
  }

  return (
    <div>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onClick={() => handleBackStep('choose_option')}
        className="absolute -left-1 top-0 w-5 h-5"
      >
        <ArrowLeftIcon className="text-lg stroke-custom-black dark:stroke-custom-white" />
      </Button>

      <div className="rounded-lg bg-surface-dark-alt p-4">
        <CustomTypography variant="h4">From {recoveryOptions.join(' & ')}</CustomTypography>
        <CustomTypography className="my-4 dark:text-custom-white80">
          {t('Onboarding.selectFileToImport')}
        </CustomTypography>
        {recoveryFiles &&
          recoveryFiles.map((file, index) => (
            <Fragment key={file.fileName}>
              <div
                className={`mt-4 relative h-14 p-4 bg-surface-dark rounded-md flex items-center justify-between ${
                  file.errorMessage || errorMessage ? ' border border-feedback-negative' : ''
                }`}
              >
                <CustomTypography
                  variant="subtitle"
                  className={`${file.errorMessage || errorMessage ? '!text-feedback-negative' : ''} truncate`}
                >
                  {file.fileName}
                </CustomTypography>

                {(!file.isValid || errorMessage) && (
                  <Button variant="transparent" isIconOnly onClick={() => handleRemoveFile(index)} fullWidth={false}>
                    <CloseRoundedIcon className="w-6 h-6" />
                  </Button>
                )}

                {file.isValid && !errorMessage && (
                  <Button variant="transparent" isIconOnly fullWidth={false} className="cursor-auto">
                    <CheckGreenIcon className="w-6 h-6" />
                  </Button>
                )}
              </div>
              {file.errorMessage && (
                <CustomTypography variant="small" className="!text-feedback-negative flex items-center mt-1">
                  <CrossRoundedRed className="mr-1 w-3 h-3" /> {file.errorMessage}
                </CustomTypography>
              )}
            </Fragment>
          ))}
        {errorMessage && (
          <CustomTypography variant="small" className="!text-feedback-negative flex mt-3">
            <CrossRoundedRed className="mr-1 w-6 h-6" />
            {errorMessage}
          </CustomTypography>
        )}

        {recoveryFiles.length < 2 && (
          <div className="flex items-center justify-center w-full mt-4">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center cursor-pointer w-full z-50 relative"
            >
              <div
                className={`w-full h-44 border-2 border-custom-white40 border-dashed rounded-lg hover:bg-surface-dark ${
                  highlightedDragArea ? 'bg-surface-dark' : 'bg-surface-dark-alt'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 h-full">
                  <CustomTypography className="dark:text-custom-white40">
                    {t('Onboarding.dragAndDropFile')}
                  </CustomTypography>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".json"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
              <Button
                id="dropzone-file"
                data-aid="selectFile"
                color="outlined"
                className="border border-custom-white80 mt-4 -z-10 pointer-events-none"
              >
                {t('Onboarding.selectFile')}
              </Button>
            </label>
          </div>
        )}
      </div>
      {recoveryFiles.length >= 2 &&
        (validRecoveryFilesCount == 2 ? (
          <Button
            data-aid="recoverWallet"
            color={`${errorMessage ? 'disabled' : 'primary'}`}
            onClick={() => compareFiles()}
            className="mt-8"
            isDisabled={errorMessage}
            isLoading={loading}
            spinner={<SpinnerIcon />}
          >
            {t('Wallet.recoverWallet')}
          </Button>
        ) : (
          <Button
            data-aid="recoverWallet"
            color={`${errorMessage ? 'disabled' : 'primary'}`}
            onClick={() => checkIsValidRecoveryFiles()}
            className="mt-8"
            isDisabled={errorMessage}
            isLoading={loading}
            spinner={<SpinnerIcon />}
          >
            {t('Actions.import')}
          </Button>
        ))}
    </div>
  )
}
