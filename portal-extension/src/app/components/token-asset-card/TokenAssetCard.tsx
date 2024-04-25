/* eslint-disable react/button-has-type */
import { CustomTypography, Favourite, Icon, useModalContext } from 'components'
import { useNavigate } from 'lib/woozie'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Modal,
  ModalBody,
  ModalContent,
} from '@nextui-org/react'
import { remove0xStartOfString } from '@portal/portal-extension/src/utils/constants'
import { useStore } from '@portal/shared/hooks/useStore'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { addBalanceFaucet } from '@portal/shared/services/supraService'
import { ITokenAssetCardProps } from '@portal/shared/utils/types'
import { useAppEnv } from '@src/env'
import { ethersCommify } from '@src/utils/ethersCommify'
import GasIcon from 'assets/icons/gas.svg'
import Warning from 'assets/icons/warning.svg'
import HideBalanceIcon from '../../../../public/images/backgrounds/hide-balance.png'
import CustomThumbnail from '../CustomThumbnail'
import {
  EyeOffIcon,
  MoreHorizontalIcon,
  ReceiveIcon,
  SendIcon,
  SpinnerIcon,
  StakeIcon,
  SwapLightIcon,
  TapIcon,
} from '../Icons'

const TranscationActions = ({ actionButtons }: { actionButtons: any }) => {
  return actionButtons.map((actionButtons: any, index: number) => (
    <div
      key={index}
      className="space-y-2 flex flex-col items-center group cursor-pointer"
      onClick={actionButtons.onClick}
    >
      <Button isIconOnly size="lg" radius="full" className="dark:bg-custom-white10" onClick={actionButtons.onClick}>
        <span className="transition-all ease-in-out duration-100 group-hover:scale-125">{actionButtons.icon}</span>
      </Button>
      <CustomTypography
        variant="small"
        className={`text-custom-white ${index === 2 || index === 3 ? 'opacity-50' : ''}`}
      >
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
  hideBalance,
  gasPriceInCurrency,
}: ITokenAssetCardProps) => {
  const appEnv = useAppEnv()
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { removeTokenFromList, addRemoveFavoriteAsset, getNetworkToken } = useStore()
  const { defaultPrimaryNetwork } = useWallet()
  const [isLoading, setLoading] = useState<boolean>(false)
  const [faucetIsLoading, setfaucetIsLoading] = useState<boolean>(false)

  const [confirmHideToken, setConfirmHideToken] = useState<boolean>(false)
  const asset = getNetworkToken(assetId)
  const { setModalData } = useModalContext()

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
      // TODO : remove comment when have swap functionality
      // onClick: () => {
      //   navigate(`/swap`)
      // },
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
  const addBalance = async () => {
    setfaucetIsLoading(true)
    const res = await addBalanceFaucet(remove0xStartOfString(asset.address), asset.providerNetworkRPC_URL)
    if (res.code) {
      setModalData({
        token: asset.title,
        networkName: asset.networkName,
        type: 'error',
        errorMsg: res.message,
        tokenImage: asset.image,
      })
    } else {
      setModalData({
        token: asset.title,
        networkName: asset.networkName,
        type: 'received',
        errorMsg: `You have received ${asset.title} token`,
        tokenImage: asset.image,
      })
    }
    setfaucetIsLoading(false)
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
        <div className="relative flex items-start mb-2">
          {image ? (
            <Avatar
              className="h-10 w-10 rounded-full overflow-hidden bg-custom-white mt-2"
              alt={asset.title}
              src={image}
            />
          ) : (
            <CustomThumbnail thumbName={coin} className="w-10 h-10 mt-2" />
          )}
          <div className="flex-1 ml-4">
            <CustomTypography
              variant="h3"
              color="text-custom-white"
              className={`break-all !font-medium 
              ${
                defaultPrimaryNetwork.includes(assetId)
                  ? `${appEnv.fullPage ? 'w-60' : 'w-52'}`
                  : `${appEnv.fullPage ? 'w-52' : 'w-44'}`
              }`}
            >
              {hideBalance ? (
                <Image width={32} height={32} src={HideBalanceIcon} fallbackSrc={HideBalanceIcon} alt="Alert" />
              ) : (
                <span>
                  {coinAmount ? ethersCommify(coinAmount) : '0'}
                  <span className="block">{coin ? coin : ''}</span>
                </span>
              )}
            </CustomTypography>
            <div>
              <CustomTypography variant="subtitle" type="secondary">
                {!hideBalance ? `${dollarAmount}` : '**'}
              </CustomTypography>
            </div>
          </div>

          <div className="absolute -right-2 -top-2">
            <div className="flex items-center">
              {!defaultPrimaryNetwork.includes(assetId) && (
                <Dropdown placement="bottom-end" showArrow>
                  <DropdownTrigger>
                    <Button isIconOnly variant="light" size="sm">
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownTrigger>

                  <DropdownMenu variant="flat" aria-label="Hide Token">
                    <DropdownItem
                      key="Hide Token"
                      onClick={() => {
                        if (asset.isCustom && asset.tokenType === 'Native') setConfirmHideToken(true)
                        else handleHideToken()
                      }}
                      className="font-extrabold"
                      startContent={<EyeOffIcon className="stroke-custom-white40 mr-3" />}
                    >
                      {t('Wallet.HideToken')}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              )}
              <Favourite isFavToken={isFavorite} handleFavorite={handleFavorite} showArrow />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4 mb-4 items-center justify-between">
          {asset.isSupraNetwork && (
            <button
              className={`space-y-2 flex flex-col items-center group ${
                faucetIsLoading ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              onClick={addBalance}
            >
              <Button
                isIconOnly
                size="lg"
                radius="full"
                className="dark:bg-custom-white10"
                onClick={addBalance}
                disabled={faucetIsLoading}
              >
                <span className="transition-all ease-in-out duration-100 group-hover:scale-125">
                  {faucetIsLoading ? <SpinnerIcon /> : <TapIcon />}
                </span>
              </Button>
              <CustomTypography
                variant="small"
                className={`text-custom-white ${faucetIsLoading ? 'pointer-events-none opacity-50' : ''}`}
              >
                {faucetIsLoading ? t('Actions.loading') : t('Token.collect')}
              </CustomTypography>
            </button>
          )}
          <TranscationActions actionButtons={TranscationActionsConfig} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            {exchange ? <Icon icon={<GasIcon />} size="medium" /> : null}
            <CustomTypography variant="subtitle">{exchange}</CustomTypography>
            {gasPriceInCurrency ? (
              <CustomTypography variant="subtitle">{`= ${gasPriceInCurrency}`}</CustomTypography>
            ) : null}
          </div>
          {/* <Button
            radius="sm"
            size="sm"
            color="primary"
            className="dark:bg-custom-white40 font-extrabold"
            onClick={() => navigate(`/transaction/gas-price-alert/${network}/${assetId}`)}
          >
            {t('Actions.alerts')}
          </Button> */}

          {confirmHideToken && (
            <Modal
              backdrop="opaque"
              isOpen={true}
              onClose={() => setConfirmHideToken(false)}
              hideCloseButton={true}
              placement="center"
              className="max-w-[19.625rem]"
              isKeyboardDismissDisabled={true}
              isDismissable={false}
            >
              <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
                <ModalBody>
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="cursor-pointer rounded-full mx-auto text-[4rem] flex items-center justify-center">
                      <Icon icon={<Warning />} size="inherit" />
                    </div>
                    <CustomTypography variant="h1" className="text-center">
                      {t('Token.hideCustomNetworkTitle')}
                    </CustomTypography>
                    <CustomTypography variant="body" className="text-center text-white" color="white">
                      {t('Token.hideCustomNetworkDescription')}
                    </CustomTypography>
                  </div>
                  <div className="flex gap-2 mt-4 justify-between items-center">
                    <Button
                      fullWidth
                      radius="sm"
                      variant="bordered"
                      onClick={() => {
                        setConfirmHideToken(false)
                      }}
                    >
                      {t('Actions.cancel')}
                    </Button>
                    <Button
                      fullWidth
                      radius="sm"
                      className="bg-gradient-button"
                      onClick={() => {
                        setConfirmHideToken(false)
                        handleHideToken()
                      }}
                      color="primary"
                    >
                      {t('Actions.hideNow')}
                    </Button>
                  </div>
                </ModalBody>
              </ModalContent>
            </Modal>
          )}
        </div>
      </div>
    </div>
  )
}
