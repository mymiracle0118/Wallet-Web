import { CustomTypography, Favourite, Icon } from 'components'
import { useNavigate } from 'lib/woozie'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { useStore } from '@portal/shared/hooks/useStore'
import { ITokenAssetCardProps } from '@portal/shared/utils/types'
import GasIcon from 'assets/icons/gas.svg'
import MoreHorizontalIcon from 'assets/icons/more-horizontal.svg'
import { ethers } from 'ethers'
import { EyeOffIcon, ReceiveIcon, SendIcon, SpinnerIcon, StakeIcon, SwapLightIcon } from '../Icons'

const TranscationActions = ({ actionButtons }: string | ReactElement) => {
  return actionButtons.map((actionButtons, index) => (
    <div
      key={index}
      className="space-y-2 flex flex-col items-center group cursor-pointer"
      onClick={actionButtons.onClick}
    >
      <Button isIconOnly size="lg" radius="full" className="dark:bg-custom-white10" onClick={actionButtons.onClick}>
        <span className="transition-all ease-in-out duration-100 group-hover:scale-125">{actionButtons.icon}</span>
      </Button>
      <CustomTypography variant="small" className="text-custom-white">
        {actionButtons.label}
      </CustomTypography>
    </div>
  ))
}

export const TokenAssetCard = ({
  image,
  coin,
  dollarAmount,
  coinAmount,
  exchange,
  assetId,
  network,
  symbol,
  isFavorite,
}: ITokenAssetCardProps) => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { removeTokenFromList, addRemoveFavoriteAsset } = useStore()
  const [isLoading, setLoading] = useState<boolean>(false)

  const handleFavorite = () => {
    addRemoveFavoriteAsset(assetId, !isFavorite)
  }

  const TranscationActionsConfig = [
    {
      onClick: () => {
        navigate(`/token/${assetId}/receive/${network}?symbol=${symbol ? symbol : 'ETH'}`)
      },
      icon: <ReceiveIcon />,
      label: 'Receive',
    },
    {
      onClick: () => {
        navigate(`/transaction/send/${network}/${assetId}`)
      },
      icon: <SendIcon />,
      label: 'Send',
    },
    {
      onClick: () => {
        navigate(`/swap`)
      },
      icon: <SwapLightIcon />,
      label: 'Swap',
    },
    {
      icon: <StakeIcon />,
      label: 'Stack',
    },
  ]

  const handleHideToken = () => {
    setLoading(true)
    setTimeout(() => {
      removeTokenFromList(assetId)
      navigate('/home')
    }, 1000)
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute left-0 right-0 flex justify-center items-center h-full w-full z-20">
          <SpinnerIcon className="w-8 h-7" />
        </div>
      )}
      <div
        className={`rounded-lg p-4 ${isLoading ? 'opacity-20' : ''}`}
        style={{ background: 'url(./images/backgrounds/token-bg.svg) no-repeat center', backgroundSize: 'cover' }}
      >
        <div className="relative flex items-center mb-2">
          <img className="h-9 w-9 rounded-full" alt="token-thumbnail" src={image} />
          <div className="flex-1 ml-4">
            <CustomTypography variant="h3" color="text-custom-white" className="break-all !font-medium w-44">
              {ethers.utils.commify(coinAmount)} {coin}
            </CustomTypography>
            <div>
              <CustomTypography variant="subtitle" type="secondary">{`${dollarAmount}`}</CustomTypography>
            </div>
          </div>

          <div className="absolute -right-2 -top-2">
            <div className="flex items-center gap-x-2">
              <Dropdown placement="bottom-end" showArrow>
                <DropdownTrigger>
                  <Button isIconOnly variant="light" size="sm">
                    <MoreHorizontalIcon className="text-xl stroke-custom-white" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu variant="flat" aria-label="Hide Token">
                  <DropdownItem
                    key="Hide Token"
                    onClick={handleHideToken}
                    className="font-extrabold"
                    startContent={
                      <EyeOffIcon className="text-xl text-default-500 pointer-events-none flex-shrink-0 mr-3" />
                    }
                  >
                    {t('Wallet.HideToken')}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Favourite isFavToken={isFavorite} handleFavorite={handleFavorite} showArrow placement="left" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4 mb-4 items-center justify-between">
          <TranscationActions actionButtons={TranscationActionsConfig} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            {exchange ? <Icon icon={<GasIcon />} size="medium" /> : null}
            <CustomTypography variant="subtitle">{exchange}</CustomTypography>
          </div>
          <Button
            radius="sm"
            size="sm"
            color="primary"
            className="dark:bg-custom-white40 font-extrabold"
            onClick={() => navigate(`/transaction/gas-price-alert/${network}/${assetId}`)}
          >
            {t('Actions.alerts')}
          </Button>
        </div>
      </div>
    </div>
  )
}
