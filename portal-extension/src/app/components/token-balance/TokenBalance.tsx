import { Avatar } from '@nextui-org/react'
import { useStore } from '@portal/shared/hooks/useStore'
import { ITokenBalanceProps } from '@portal/shared/utils/types'
import { ethersCommify } from '@src/utils/ethersCommify'
import { CustomTypography, Favourite, Icon } from 'app/components'
import { twMerge } from 'tailwind-merge'
import CustomThumbnail from '../CustomThumbnail'
import { CheckPrimaryIcon } from '../Icons'

export const TokenBalance = ({
  token,
  acronym,
  balance,
  image,
  onClick: handleOnClick,
  tokenFullName,
  active,
  thumbnail,
  nativeBalance = 0,
  isTestnet = false,
  isFavIcon = false,
  isFavorite = false,
  network,
  hideBalance,
  hideAmount = false,
  className,
  checkboxClass,
}: ITokenBalanceProps) => {
  const { addRemoveFavoriteAsset } = useStore()
  const handleFavorite = () => {
    addRemoveFavoriteAsset(token as string, !isFavorite)
  }
  return (
    <div
      id="tokenListWithBalance"
      className={twMerge(
        `w-full h-[3.5rem] flex items-center px-3 rounded-lg hover:bg-custom-white10 cursor-pointer ${
          active ? 'bg-custom-white10' : 'bg-surface-dark'
        } ${className as string}`
      )}
      onClick={() => {
        if (handleOnClick) handleOnClick(token || '')
      }}
    >
      <div className="relative">
        {isTestnet && (
          <div className="bg-feedback-negative/50 text-custom-white rounded-br-md rounded-tr-md absolute top-0 left-0 px-2 py-[2px] font-bold text-[0.5rem] z-20">
            Testnet
          </div>
        )}
        {image && <Icon icon={image} size="large" />}
        {thumbnail ? (
          <Avatar
            className="h-9 w-9 rounded-full bg-custom-white overflow-hidden"
            alt="token-thumbnail"
            src={thumbnail}
          />
        ) : (
          <CustomThumbnail thumbName={acronym} />
        )}
        {active && (
          <div
            className={twMerge(
              `absolute left-6 bottom-0 rounded-full border-3 border-solid border-surface-dark ${
                checkboxClass as string
              }`
            )}
          >
            <CheckPrimaryIcon />
          </div>
        )}
      </div>
      <div className="ml-6 flex-1">
        <div className="flex items-center space-x-1">
          {acronym && (
            <CustomTypography variant="subtitle" className="uppercase break-all">
              {acronym}
            </CustomTypography>
          )}

          <CustomTypography variant="subtitle" className="-mt-1">
            {network && <span className="text-gradient text-grident-primary capitalize">{network}</span>}
            {isFavIcon && <Favourite isFavToken={isFavorite} handleFavorite={handleFavorite} />}
          </CustomTypography>
        </div>
        {tokenFullName && (
          <CustomTypography className="text-left" type="secondary" variant="body">
            {tokenFullName}
          </CustomTypography>
        )}
      </div>
      {!hideAmount && (
        <div className="flex items-end flex-col space-y-1">
          <CustomTypography variant="subtitle">
            {hideBalance ? '**' : ethersCommify(nativeBalance.toFixed(6))}
          </CustomTypography>
          {balance ? (
            <CustomTypography variant="body" type="secondary">
              {hideBalance ? '**' : balance}
            </CustomTypography>
          ) : null}
        </div>
      )}
    </div>
  )
}
