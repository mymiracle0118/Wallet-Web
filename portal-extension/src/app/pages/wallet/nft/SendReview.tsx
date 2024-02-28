import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import HomeWalletLayout from 'layouts/wallet-layout/WalletLayout'
import { CustomTypography, Button } from 'components'
import Copy from 'assets/icons/copy.svg'
import nftDemo from 'assets/demo/nft-demo.png'

import NftScheduledModal from './NftScheduledModal'
import { Divider } from '@nextui-org/react'

type ISendNFTProps = {
  title?: string
}
const SendReview = ({ title = "Machine Hallucinations - Huble Dreams - NG Collector's Edit..." }: ISendNFTProps) => {
  const { t } = useTranslation()
  const [openNftModal, setOpenModal] = useState<boolean>(false)

  const handleSendRequest = () => {
    setOpenModal(true)
    setTimeout(() => {
      setOpenModal(false)
    }, 5000)
  }

  return (
    <HomeWalletLayout>
      <img src={nftDemo} className="fixed" alt="nft-cover" />
      <div className="relative p-4 !bg-custom-white80 backdrop-blur shadow-md mt-[10.625rem]">
        <div className="flex items-center flex-col text-center">
          <CustomTypography variant="h3" color="text-primary" className="my-3">
            {t('Token.send')}
          </CustomTypography>
          <CustomTypography variant="h3" color="text-custom-black">
            {title}
          </CustomTypography>
          <CustomTypography variant="body" color="text-custom-black" className="mt-2">
            Edition 4 of 10
          </CustomTypography>
        </div>
      </div>

      <div className="relative min-h-[16.875rem] -mt-2 p-4">
        <div className="flex items-center justify-between my-1">
          <div className="flex gap-2">
            <CustomTypography variant="subtitle" color="secondary">
              {t('Labels.to')}
            </CustomTypography>
            <div className="flex items-center gap-2">
              <CustomTypography variant="subtitle">@chani1732</CustomTypography>
              <CustomTypography variant="body">0x1527...d0ee</CustomTypography>
            </div>
          </div>
          <Copy />
        </div>

        <Divider />

        <CustomTypography variant="body" className="my-2">
          Ethereum network
        </CustomTypography>

        <div className="flex flex-col rounded-lg p-4 gap-2 my-4 bg-custom-white10">
          <div className="flex justify-between">
            <CustomTypography variant="subtitle">{t('Token.estimatedGasFee')}</CustomTypography>
            <div className="flex items-end gap-4 flex-col">
              <CustomTypography variant="subtitle">0.00437 ETH</CustomTypography>
              <CustomTypography variant="body" color="text-custom-grey100">
                $14
              </CustomTypography>
            </div>
          </div>
          <div className="flex justify-between">
            <CustomTypography variant="subtitle">{t('Token.estimatedTime')}</CustomTypography>
            <CustomTypography variant="subtitle">{`< 30 seconds`}</CustomTypography>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <Button variant="bordered" color="outlined">
            {t('Actions.cancel')}
          </Button>
          <Button onClick={handleSendRequest} color="primary">
            {t('Actions.request')}
          </Button>
        </div>

        {/* TODO - Put in NFT Details page when created */}
        <NftScheduledModal
          modalState={openNftModal}
          nftImage={nftDemo}
          nftTitle="Machine Hallucinations - Huble Dreams"
          closeModal={() => {
            setTimeout(() => {
              setOpenModal(false)
            }, 5000)
          }}
        />
      </div>
    </HomeWalletLayout>
  )
}

export default SendReview
