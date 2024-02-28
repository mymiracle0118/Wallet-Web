import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { Button, CustomTypography, Icon } from 'components'
import { ArrowDownIcon } from '@src/app/components/Icons'
import { goBack } from 'lib/woozie'
import { Modal, ModalContent, ModalBody } from '@nextui-org/react'
import IconShield from 'assets/icons/shield.svg'
import RobotParty from 'assets/images/robot-party.svg'

const SwapReview = () => {
  const { t } = useTranslation()
  const [isShowModal, setShowModal] = useState<boolean>(false)
  return (
    <SinglePageTitleLayout disableBack bgOnboarding paddingClass={false} BorderBottom={false} topPanel={false}>
      <div className="flex flex-col justify-between h-full items-center px-4 pb-4 pt-8">
        <div className="space-y-4 w-full">
          <div className="space-y-2 text-center">
            <CustomTypography variant="h4" type="secondary">
              {t('Wallet.swap')}
            </CustomTypography>
            <CustomTypography variant="h1" className="flex items-center justify-center">
              <img
                src="https://assets.coingecko.com/coins/images/9956/large/4943.png"
                alt=""
                className="w-8 h-8 mr-2"
              />{' '}
              100 DAI
            </CustomTypography>
          </div>

          <div className="shadow-medium rounded-full p-1 w-8 h-8 mx-auto">
            <ArrowDownIcon />
          </div>

          <div className="space-y-2 text-center flex flex-col items-center">
            <CustomTypography variant="h4" type="secondary">
              {t('Token.receive')}
            </CustomTypography>
            <CustomTypography variant="h1" className="flex items-center">
              <img
                src="https://assets.coingecko.com/coins/images/9956/large/4943.png"
                alt=""
                className="w-8 h-8 mr-2"
              />
              0.02589 WETH
            </CustomTypography>
          </div>

          <div className="p-4 rounded-lg bg-surface-dark-alt mt-16 space-y-5 w-full">
            <div className="flex items-center justify-between">
              <CustomTypography variant="subtitle">{t('Swap.provider')}</CustomTypography>
              <CustomTypography variant="subtitle">{t('Swap.uniswap')}</CustomTypography>
            </div>
            <div className="flex items-center justify-between">
              <CustomTypography variant="subtitle">{t('Swap.rate')}</CustomTypography>
              <CustomTypography variant="subtitle">1 DAI ≈ 0.0002988 WETH</CustomTypography>
            </div>
            <div className="flex items-center justify-between">
              <CustomTypography variant="subtitle">{t('Token.estimatedFee')}</CustomTypography>
              <CustomTypography variant="subtitle">0.3448 DAI</CustomTypography>
            </div>
            <div className="flex items-center justify-between">
              <CustomTypography variant="subtitle">{t('Token.estimatedTime')}</CustomTypography>
              <CustomTypography variant="subtitle">1-5 minutes</CustomTypography>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 space-x-2 w-full">
          <Button variant="bordered" color="outlined" onClick={goBack}>
            {t('Actions.back')}
          </Button>
          <Button data-test-id="button-swap" color="primary" onClick={() => setShowModal(true)}>
            {t('Wallet.swap')}
          </Button>
        </div>
      </div>

      <Modal
        backdrop="opaque"
        isOpen={isShowModal}
        onClose={() => setShowModal(false)}
        hideCloseButton={true}
        placement="center"
        className="max-w-[20.625rem]"
      >
        <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
          <ModalBody>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="cursor-pointer rounded-full mx-auto mb-4 text-[2.5rem] h-16 w-16 flex items-center justify-center">
                <Icon icon={<IconShield />} size="inherit" />
              </div>
              <CustomTypography variant="h1">{t('Token.receivedModalTitle')}</CustomTypography>
              <CustomTypography variant="subtitle" type="secondary" className="my-4">
                Do you want to add WETH to your wallet?
              </CustomTypography>
              <div className="text-[10rem] h-40 w-40">
                <Icon icon={<RobotParty />} size="inherit" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button fullWidth variant="bordered" color="outlined" onClick={() => setShowModal(false)}>
                {t('Actions.notNow')}
              </Button>
              <Button data-test-id="button-confirm" color="primary">
                {t('Actions.add')}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SinglePageTitleLayout>
  )
}

export default SwapReview
