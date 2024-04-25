import { useSettings } from '@portal/shared/hooks/useSettings'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { ArrowRight } from '@src/app/components/Icons'
import PasswordPromptModal from 'app/pages/wallet/PasswordPromptModal'
import { Switch } from 'components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { useNavigate } from 'lib/woozie'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SettingItem from '../SettingItem'

const Security = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { isAccountCreatedByPrivateKey } = useWallet()
  const {
    enablePasswordProtection,
    setEnablePasswordProtection,
    isSavedRecoveryFile,
    enableHideBalance,
    setEnableHideBalance,
  } = useSettings()
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false)
  const [checkedFeature, setCheckedFeature] = useState<string>('password')

  const passwordPromptFailure = (error: Error) => {
    console.log('Wrong Password', error)
  }
  const handlePasswordOnSuccess = () => {
    switch (checkedFeature) {
      case 'password':
        setEnablePasswordProtection(false)
        break
      case 'balance':
        setEnableHideBalance(false)
        break
    }
    setOpenPasswordModal(false)
  }

  const handleSaveRecoveryFile = () => {
    navigate('/settings/security/recovery-file')
  }

  return (
    <SinglePageTitleLayout title="Security" disableBack customGoBack onClickAction={() => navigate('/settings')}>
      <div className="border border-solid border-custom-white10 rounded-lg bg-surface-dark-alt">
        {!isAccountCreatedByPrivateKey && (
          <>
            <SettingItem
              dataAid="secretRecoveryPhraseNavigation"
              title={t('Security.secretRecoveryPhrase')}
              endAndorment={<ArrowRight />}
              onClick={() => navigate('/settings/security/secret-recovery-phrase')}
            />
            {!isSavedRecoveryFile && (
              <SettingItem
                dataAid="savedRecoveryFile"
                title={t('Security.filesRecovery')}
                endAndorment={<ArrowRight />}
                onClick={() => handleSaveRecoveryFile()}
              />
            )}
          </>
        )}
        <SettingItem
          dataAid="passwordProtectionPop"
          title={t('Security.passwordProtectionTitle')}
          subTitle={t('Security.passwordProtectionSubTitle') || ''}
          endAndorment={
            <Switch
              dataAid="passwordSwitch"
              id="switch-enable-password-protection"
              checked={enablePasswordProtection}
              onChange={(checked: boolean) => {
                setCheckedFeature('password')
                return checked ? setEnablePasswordProtection(checked) : setOpenPasswordModal(true)
              }}
            />
          }
        />
        <SettingItem
          dataAid="hideAccountBalance"
          title={t('Security.hideAccountBalance')}
          endAndorment={
            <Switch
              dataAid="hideAccountBalanceSwitch"
              id="hide-account-balance"
              checked={enableHideBalance}
              onChange={(checked: boolean) => {
                setCheckedFeature('balance')
                return checked ? setEnableHideBalance(checked) : setOpenPasswordModal(true)
              }}
            />
          }
        />
        <SettingItem
          dataAid="autoLockNavigation"
          title={t('Security.autoLockTimer')}
          onClick={() => navigate('/settings/security/auto-lock-timer')}
          endAndorment={<ArrowRight />}
        />
        <SettingItem
          dataAid="passwordChangeNavigation"
          title={t('Security.loginPassword')}
          endAndorment={<ArrowRight />}
          onClick={() => navigate('/settings/change-password')}
        />
      </div>

      <PasswordPromptModal
        modalState={openPasswordModal}
        closePromptModal={() => setOpenPasswordModal(false)}
        onSuccess={() => {
          handlePasswordOnSuccess()
        }}
        onFail={passwordPromptFailure}
      />
    </SinglePageTitleLayout>
  )
}

export default Security
