import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { useNavigate } from 'lib/woozie'
import { CustomTypography, Button, Switch } from 'components'
import SettingItem from './SettingItem'
import AlertIcon from 'assets/images/alert.png'
import { useWallet } from '@portal/shared/hooks/useWallet'
import DefaultWallet from './DefaultWallet'
import LangauageChange from './Language'
import Currency from './Currency'
import { Image, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { ArrowRight, HyperlinkIcon } from '@src/app/components/Icons'
import { useSettings } from '@portal/shared/hooks/useSettings'

const Settings = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { setLockWallet } = useWallet()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [isShareAnalytics, setShareAnalytics] = useState<boolean>(false)
  const [isHideZeroBlalanceToken, setHideZeroBlalanceToken] = useState<boolean>(false)
  const { networkEnvironment, setNetworkEnvironment } = useSettings()

  return (
    <SinglePageTitleLayout title={t('Settings.settings')} showMenu paddingClass={false}>
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
              dataAid="HideZeroBlalanceToken"
              title={t('Settings.hideZeroBalanceToken')}
              endAndorment={
                <Switch
                  id="Hide-Zero-Blalance-Token"
                  checked={isHideZeroBlalanceToken}
                  onChange={() => setHideZeroBlalanceToken(!isHideZeroBlalanceToken)}
                />
              }
            />
            <SettingItem
              dataAid="networkEnvironment"
              title={t('Settings.networkEnvironment')}
              endAndorment={
                <Switch
                  id="Hide-Zero-Blalance-Token"
                  checked={networkEnvironment === 'testNet'}
                  onChange={() => setNetworkEnvironment(networkEnvironment === 'mainNet' ? 'testNet' : 'mainNet')}
                />
              }
            />
          </div>

          <div className="border border-solid border-custom-white10 rounded-lg bg-surface-dark-alt">
            <SettingItem dataAid="currencyNavigation" title={t('Settings.currency')} endAndorment={<Currency />} />

            <LangauageChange />

            <SettingItem
              dataAid="HideZeroBlalanceToken"
              title={t('Settings.analyticsTitle')}
              subTitle={t('Settings.alalyticsDesc')}
              endAndorment={
                <Switch
                  id="Hide-Zero-Blalance-Token"
                  checked={isShareAnalytics}
                  onChange={() => setShareAnalytics(!isShareAnalytics)}
                />
              }
            />
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
        <div className="flex flex-col items-center py-2">
          <Button
            data-test-id="button-open-logout-modal"
            data-aid="logOut"
            variant="bordered"
            color="outlined"
            className="mb-2"
            onClick={() => setOpenModal(true)}
          >
            {t('Actions.logout')}
          </Button>
          <CustomTypography dataAid="versionInfo" variant="small" type="secondary">
            Version 1.3.2
          </CustomTypography>
        </div>
      </div>

      <Modal
        backdrop="opaque"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        hideCloseButton={true}
        placement="center"
        className="max-w-[20.625rem]"
        data-aid="logOutHead"
      >
        <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
          <ModalBody>
            <div className="space-y-4 text-center space-y-4">
              <div className="flex justify-center">
                <Image width={64} height={64} src={AlertIcon} fallbackSrc={AlertIcon} alt="Alert" />
              </div>

              <CustomTypography variant="h1">{t('Settings.logoutModalTitle')}</CustomTypography>
              <CustomTypography variant="body" type="secondary">
                {t('Settings.logoutModalSubTitle')}
              </CustomTypography>

              <div className="flex items-center justify-between gap-x-4">
                <Button
                  variant="bordered"
                  data-aid="cancelButton"
                  className="my-2"
                  color="outlined"
                  onClick={() => setOpenModal(false)}
                >
                  {t('Actions.cancel')}
                </Button>
                <Button
                  data-test-id="button-logout"
                  data-aid="logOutButton"
                  color="primary"
                  onClick={() => {
                    setLockWallet(true)
                    navigate('/login')
                  }}
                >
                  {t('Actions.logout')}
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SinglePageTitleLayout>
  )
}

export default Settings
