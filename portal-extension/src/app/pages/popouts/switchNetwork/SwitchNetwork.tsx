import React from 'react'
import { useTranslation } from 'react-i18next'
import Header from 'app/layouts/wallet-layout/Header'
import DefaultAvatar from 'assets/images/Avatar.png'
import { CustomTypography, TokenAddressButton, Icon, Button } from 'components'
import ArrowDownIcon from 'assets/icons/arrow-down.svg'
import { useWallet } from '@portal/shared/hooks/useWallet'

const SwitchNetworkPopOut = () => {
  const { t } = useTranslation()
  const { avatar } = useWallet()

  return (
    <div className="flex flex-col h-full bg-custom-white dark:bg-surface-dark relative overflow-x-hidden">
      <Header />

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center mb-5">
          <div className="mr-4 rounded-full h-[24px] w-[24px] overflow-hidden">
            <img src={avatar || DefaultAvatar} alt="default-avatar" />
          </div>
          <CustomTypography variant="h2">Trader Joi</CustomTypography>
        </div>

        <CustomTypography variant="h1">{t('Popouts.allowSiteToSwitchNetwork')}</CustomTypography>
        <CustomTypography className="mt-4 mb-4" variant="body">
          {t('Popouts.allowSiteToSwitchNetworkSubtitle')}
        </CustomTypography>

        <div className="flex flex-col flex-1">
          <div className="flex-1">
            <div className="flex items-center">
              <img
                className="h-[36px] w-[36px] rounded-full"
                alt="token-thumbnail"
                src="https://assets.coingecko.com/coins/images/279/large/ethereum.png"
              />
              <CustomTypography className="flex-1 ml-4" variant="subtitle">
                Ethereum
              </CustomTypography>
              <TokenAddressButton address="0x63C100ac0C36549C7218070294b60C18d813675c" enableCopy />
            </div>

            <div className="flex justify-center mt-4 mb-4">
              <Icon size="medium" icon={<ArrowDownIcon className="stroke-custom-black dark:stroke-custom-white" />} />
            </div>

            <div className="flex items-center">
              <img
                className="h-[36px] w-[36px] rounded-full"
                alt="token-thumbnail"
                src="https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png"
              />
              <CustomTypography className="flex-1 ml-4" variant="subtitle">
                Avalanche
              </CustomTypography>
              <TokenAddressButton address="0x63C100ac0C36549C7218070294b60C18d813675c" enableCopy />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="bordered" color="outlined">
              {t('Actions.reject')}
            </Button>
            <Button color="primary">{t('Actions.switch')}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwitchNetworkPopOut
