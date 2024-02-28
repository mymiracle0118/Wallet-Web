import React from 'react'
import { useTranslation } from 'react-i18next'
import { CustomTypography } from '../../custom-typography'
import { IChooseImportMethodProps } from '@portal/shared/utils/types'
import { DocumentGradientIcon, KeyGradientIcon } from '../../Icons'

const ChooseWalletImportMethod = ({ importWallet, importByPrivateKey }: IChooseImportMethodProps) => {
  const { t } = useTranslation()

  // TODO :: NOTE temporary disabled when import after logged in , as functionality need to be implented.
  const myArray = window.location.href.split('/')
  const fromPage = myArray[myArray.length - 2]
  const disabled = fromPage === 'account' ? true : false

  return (
    <>
      <CustomTypography dataAid="recoveryQuestion" variant="h1">
        {t('Onboarding.chooseImortMethodTitle')}
      </CustomTypography>

      <div className="bg-surface-dark-alt cursor-pointer rounded-lg mt-8 p-4" onClick={disabled ? '' : importWallet}>
        <div className="flex items-start justify-between gap-x-4">
          <div>
            <CustomTypography dataAid="phraseGuide" variant="subtitle" className="pb-2">
              {t('Onboarding.bySecretRecoveryPhrase')}
            </CustomTypography>
            <CustomTypography dataAid="phraseGuide" variant="body" type="secondary">
              {t('Onboarding.toAddMultiChain')}
            </CustomTypography>
          </div>
          <div className="text-[1.5rem]">
            <DocumentGradientIcon />
          </div>
        </div>
      </div>
      <div className="bg-[#1B1C24] cursor-pointer rounded-lg mt-4 p-4" onClick={importByPrivateKey}>
        <div className="flex items-start justify-between space-x-4">
          <div>
            <CustomTypography dataAid="phraseGuide" variant="subtitle" className="pb-2">
              {t('Onboarding.byPrivateKey')}
            </CustomTypography>
            <CustomTypography dataAid="phraseGuide" variant="body" type="secondary">
              {t('Onboarding.toAddSingleChain')}
            </CustomTypography>
          </div>
          <div className="text-[1.5rem]">
            <KeyGradientIcon />
          </div>
        </div>
      </div>
    </>
  )
}

export default ChooseWalletImportMethod
