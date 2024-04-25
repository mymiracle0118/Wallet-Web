import { useSettings } from '@portal/shared/hooks/useSettings'
import { ArrowRight, HyperlinkIcon } from '@src/app/components/Icons'
import { Switch } from 'components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { useNavigate } from 'lib/woozie'
import { useTranslation } from 'react-i18next'
import DefaultWallet from './DefaultWallet'
import SettingItem from './SettingItem'
import LogOut from './security/logOut'

const Settings = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { networkEnvironment, setNetworkEnvironment, enableHideLawBalance, setEnableHideLawBalance } = useSettings()

  const handleChangeNetworkEnvironment = () => {
    setNetworkEnvironment(networkEnvironment === 'mainNet' ? 'testNet' : 'mainNet')
  }
  return (
    <SinglePageTitleLayout
      title={t('Settings.settings')}
      showMenu
      paddingClass={false}
      disableBack
      customGoBack
      onClickAction={() => navigate('/')}
    >
      <div className="flex flex-col justify-between h-[33.6rem] max-h-[33.6rem] pt-4 px-4">
        <div className="space-y-4 flex-1 overflow-y-auto">
          <DefaultWallet />

          <div className="border border-solid border-custom-white10 rounded-lg bg-surface-dark-alt">
            <SettingItem
              dataAid="addressBookNavigation"
              onClick={() => navigate('/settings/address-book')}
              title={t('Settings.addressBook')}
              endAndorment={<ArrowRight />}
            />
            <SettingItem
              dataAid="securityNavigation"
              title={t('Settings.security')}
              onClick={() => navigate('/settings/security')}
              endAndorment={<ArrowRight />}
            />
            <SettingItem
              dataAid="HideZeroBalanceToken"
              title={t('Settings.hideZeroBalanceToken')}
              endAndorment={
                <Switch
                  id="Hide-Zero-Balance-Token"
                  checked={enableHideLawBalance}
                  onChange={(checked: boolean) => setEnableHideLawBalance(checked)}
                />
              }
            />
            <SettingItem
              dataAid="networkEnvironment"
              title={t('Settings.networkEnvironment')}
              endAndorment={
                <Switch
                  id="Hide-Zero-Balance-Token"
                  checked={networkEnvironment === 'testNet'}
                  onChange={() => handleChangeNetworkEnvironment()}
                />
              }
            />
          </div>

          <div className="border border-solid border-custom-white10 rounded-lg bg-surface-dark-alt">
            {/* TODO */}
            {/* <SettingItem dataAid="currencyNavigation" title={t('Settings.currency')} endAndorment={<Currency />} /> */}

            {/* <LangauageChange /> */}

            {/* <SettingItem
              dataAid="HideZeroBalanceToken"
              title={t('Settings.analyticsTitle')}
              subTitle={t('Settings.alalyticsDesc')}
              endAndorment={
                <Switch
                  id="Hide-Zero-Balance-Token"
                  checked={isShareAnalytics}
                  onChange={() => setShareAnalytics(!isShareAnalytics)}
                />
              }
            /> */}
            <SettingItem
              dataAid="Feedback"
              onClick={() => window.open('#!', '_blank')}
              title={t('Settings.feedback')}
              endAndorment={<HyperlinkIcon />}
            />
            <SettingItem
              dataAid="Help"
              onClick={() => window.open('#!', '_blank')}
              title={t('Settings.help')}
              endAndorment={<HyperlinkIcon />}
            />
          </div>
        </div>
        <LogOut />
      </div>
    </SinglePageTitleLayout>
  )
}

export default Settings
