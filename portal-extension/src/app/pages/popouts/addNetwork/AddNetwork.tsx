import React from 'react'
import { useTranslation } from 'react-i18next'
import Header from 'app/layouts/wallet-layout/Header'
import DefaultAvatar from 'assets/images/Avatar.png'
import { Button, CustomTypography, Icon } from 'components'
import HelpIcon from 'assets/icons/help-circle.svg'
import { useWallet } from '@portal/shared/hooks/useWallet'

const AddNetworkPopOut = () => {
  const { t } = useTranslation()
  const { avatar } = useWallet()

  return (
    <div className="flex flex-col h-full bg-custom-white dark:bg-surface-dark relative overflow-x-hidden">
      <Header />

      <div className="py-4 flex-1 flex flex-col">
        <div className="flex items-center mb-5 px-4">
          <div className="mr-4 rounded-full h-[24px] w-[24px] overflow-hidden">
            <img src={avatar || DefaultAvatar} alt="default-avatar" />
          </div>
          <CustomTypography variant="h2">Trader Joe</CustomTypography>
        </div>

        <CustomTypography className="px-4" variant="h1">
          {t('Popouts.allowSiteToAddNetwork')}
        </CustomTypography>

        <div className="flex flex-col flex-1">
          <div className="flex-1">
            <div className="shadow-[inset_0px_-1px_0px_rgba(0,0,0,0.05)] dark:shadow-sm flex mt-4 px-4 pb-2">
              <img
                className="h-[32px] w-[32px] rounded-full"
                alt="token-thumbnail"
                src="https://assets.coingecko.com/coins/images/279/large/ethereum.png"
              />

              <div className="ml-4">
                <CustomTypography variant="subtitle">{t('Actions.name')}</CustomTypography>
                <CustomTypography variant="body" type="secondary">
                  Avalanche Mainnet C-Chain
                </CustomTypography>
              </div>
            </div>

            <div className="flex items-center py-2.5 shadow-[inset_0px_-1px_0px_rgba(0,0,0,0.05)] dark:shadow-sm px-4">
              <div className="flex-1">
                <CustomTypography variant="subtitle">{t('Network.networkUrl')}</CustomTypography>
                <CustomTypography className="mt-1" variant="body" type="secondary">
                  https://api.avax.network/ext/bc/C/rpc
                </CustomTypography>
              </div>

              <Icon icon={<HelpIcon className="stroke-custom-black" />} size="medium" />
            </div>

            <div className="flex items-center py-2.5 px-4 shadow-[inset_0px_-1px_0px_rgba(0,0,0,0.05)] dark:shadow-sm">
              <div className="flex-1">
                <CustomTypography variant="subtitle">{t('Network.chainId')}</CustomTypography>
                <CustomTypography className="mt-1" variant="body" type="secondary">
                  43114
                </CustomTypography>
              </div>
              <Icon icon={<HelpIcon className="stroke-custom-black" />} size="medium" />
            </div>

            <button type="button" className="mt-8 ml-4 underline text-primary dark:text-secondary font-bold">
              {t('Popouts.verifyNetworkDetails')}
            </button>
          </div>

          <div className="flex gap-2 p-4">
            <Button variant="bordered" color="outlined">
              {t('Actions.reject')}
            </Button>
            <Button color="primary">{t('Actions.add')}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddNetworkPopOut
