import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'lib/woozie'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { Switch } from 'components'
import { useSettings } from '@portal/shared/hooks/useSettings'
import SettingItem from '../SettingItem'
import PasswordPromptModal from 'app/pages/wallet/PasswordPromptModal'
import { ArrowRight } from '@src/app/components/Icons'

const Security = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { enablePasswordProtection, setEnablePasswordProtection } = useSettings()
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false)
  const [isHideAccountBlalance, setHideAccountBlalance] = useState<boolean>(false)

  const passwordPromptFailure = (error: Error) => {
    console.log('Wrong Password', error)
  }

  return (
    <SinglePageTitleLayout title="Security">
      <div className="border border-solid border-custom-white10 rounded-lg bg-surface-dark-alt">
        <SettingItem
          dataAid="secretRecoveryPhraseNavigation"
          title={t('Security.secretRecoveryPhrase')}
          endAndorment={<ArrowRight />}
          onClick={() => navigate('/settings/security/secret-recovery-phrase')}
        />
        <SettingItem
          dataAid="passwordProtectionPop"
          title={t('Security.passwordProtectionTitle')}
          subTitle={t('Security.passwordProtectionSubTitle') || ''}
          endAndorment={
            <Switch
              dataAid="passwordSwitch"
              id="switch-enable-password-protection"
              checked={enablePasswordProtection}
              onChange={(checked: boolean) =>
                checked ? setOpenPasswordModal(true) : setEnablePasswordProtection(checked)
              }
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
              checked={isHideAccountBlalance}
              onChange={(checked: boolean) =>
                checked ? setHideAccountBlalance(true) : setHideAccountBlalance(checked)
              }
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
          title={t('Security.changePassword')}
          endAndorment={<ArrowRight />}
          onClick={() => navigate('/settings/change-password')}
        />
      </div>

      <PasswordPromptModal
        modalState={openPasswordModal}
        closePromptModal={() => setOpenPasswordModal(false)}
        onSuccess={() => {
          setEnablePasswordProtection(true)
          setOpenPasswordModal(false)
        }}
        onFail={passwordPromptFailure}
      />
    </SinglePageTitleLayout>
  )
}

export default Security
