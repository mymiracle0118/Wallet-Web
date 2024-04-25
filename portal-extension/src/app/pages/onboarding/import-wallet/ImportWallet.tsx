import { ImportWalletProps } from '@portal/shared/utils/types'
import { ArrowLeftIcon } from '@src/app/components/Icons'
import ImportByRecoveryPhase from '@src/app/components/ImportAccount/ImportByRecoveryPhase'
import { Button, CustomTypography } from 'app/components'
import { goBack } from 'lib/woozie'
import { useTranslation } from 'react-i18next'

const ImportWallet = ({ restoreAccount = false }: ImportWalletProps) => {
  const { t } = useTranslation()
  return (
    <div className="p-8 space-y-6">
      <Button isIconOnly size="sm" variant="light" onClick={goBack} className="w-5 h-5 -ml-1">
        <ArrowLeftIcon className="text-lg dark:stroke-white-40" />
      </Button>
      <CustomTypography dataAid="importWalletHead" variant="h1">
        {restoreAccount ? 'Recover Wallet' : 'Import wallet'}
      </CustomTypography>

      {restoreAccount ? (
        <div className="p-3.5 border rounded-[0.75rem] border-custom-grey40 space-y-2">
          <CustomTypography dataa-aid="phraseGuide" variant="subtitle" className="text-gradient bg-gradient-text">
            {t('Actions.warning')}
          </CustomTypography>
          <CustomTypography dataAid="importWalletSubHead" className="dark:text-custom-white80">
            {t('Onboarding.restorGuide')}
          </CustomTypography>
        </div>
      ) : (
        <CustomTypography dataAid="importWalletSubHead" className="mb-6 dark:text-custom-white80" variant="body">
          {t('Onboarding.toAddMultiChain')}
        </CustomTypography>
      )}

      <ImportByRecoveryPhase />
    </div>
  )
}

export default ImportWallet
