import React from 'react'
import { useTranslation } from 'react-i18next'
import { CustomTypography, Input, ModalComponent, Button, COLORS, Icon } from 'components'
import CalendarIcon from 'assets/icons/calendar.svg'
import { tokenImage } from 'utils/tokenImage'
import mascot from 'assets/images/mascot.png'
import LightBulb from 'assets/icons/lightbulb.svg'
import { Chip, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import {
  IAdjustGasAmountModalProps,
  IReceiveTokenModalProps,
  ISendWithEstimateModalProps,
} from '@portal/shared/utils/types'

export const SendWithEstimateModal = ({
  modalState,
  closeModal,
  openCalendar,
  handleReview,
}: ISendWithEstimateModalProps) => {
  const { t } = useTranslation()
  return (
    <ModalComponent
      modalState={modalState}
      closeModal={closeModal}
      title={t('Token.sendTokenWithLowGasFee', { token: 'ETH' })}
      subtitle={t('Token.cancelGasFeeWithNoMatch')}
    >
      <div className="flex justify-between mb-2">
        <div className="flex flex-col">
          <CustomTypography className="text-left" variant="body">
            {t('Token.currentEstimated')}
          </CustomTypography>
          <CustomTypography className="text-left" variant="body">
            {t('Token.gasFee')}
          </CustomTypography>
        </div>
        <div className="flex flex-col">
          <CustomTypography variant="body" className="text-right">
            0.00027 ETH
          </CustomTypography>
          <CustomTypography variant="body" type="secondary" className="text-right">
            $10
          </CustomTypography>
        </div>
      </div>
      <div className="mb-4">
        <CustomTypography variant="body" className="text-left mb-4">
          {t('Token.idealGasFee')}
        </CustomTypography>
        <div className="flex items-center ga-2">
          <Input mainColor />
          <CustomTypography variant="body">Or</CustomTypography>
          <Input mainColor />
        </div>
      </div>
      <div>
        <CustomTypography variant="body" className="text-left mb-4">
          {t('Token.dueTime')}
        </CustomTypography>
        <div className="flex items-center justify-center mb-2 gap-2">
          <Chip>6H</Chip>
          <Chip>12H</Chip>
          <Chip>24H</Chip>
          <Chip>7D</Chip>
          <Chip>14D</Chip>
        </div>
        <Input
          fullWidth
          placeholder={t('Token.customTime')}
          onClick={openCalendar}
          iconSize="1.5em"
          icon={<CalendarIcon />}
          mainColor
        />
        <div className="flex mt-3 gap-1">
          <Button variant="bordered" color="outlined" onClick={closeModal}>
            {t('Actions.cancel')}
          </Button>
          <Button onClick={handleReview} color="primary">
            {t('Actions.review')}
          </Button>
        </div>
      </div>
    </ModalComponent>
  )
}

export const AdjustGasAmountModal = ({
  setMaxWarning,
  maxWarning,

  closeReceiveTokenModal,
  setMaxAmount,
}: IAdjustGasAmountModalProps) => {
  const { t } = useTranslation()
  return (
    <Modal
      backdrop="opaque"
      isOpen={maxWarning}
      onClose={() => setMaxWarning(false)}
      hideCloseButton={true}
      placement="center"
      className="max-w-[18.625rem]"
    >
      <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
        <ModalBody>
          <div className="flex flex-col items-center justify-center space-y-4">
            <CustomTypography variant="h1" className="text-center">
              {t('Token.leaveGasFee')}
            </CustomTypography>
            <div
              className="cursor-pointer rounded-full mx-auto mb-4 text-[2.5rem] h-16 w-16 flex items-center justify-center"
              style={{ background: COLORS.background.gradientLogoBg }}
            >
              <Icon icon={<LightBulb />} size="inherit" />
            </div>
            <CustomTypography variant="body" className="text-center" type="secondary">
              {t('Token.adjustMaxGasFee')}
            </CustomTypography>
          </div>
          <div className="flex gap-2 mt-4 justify-between items-center">
            <Button fullWidth variant="bordered" color="outlined" onClick={closeReceiveTokenModal}>
              {t('Labels.noThanks')}
            </Button>
            <Button onClick={setMaxAmount} color="primary">
              {t('Actions.adjust')}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export const ReceiveTokenModal = ({ coin, receivedTokenModal, closeReceiveTokenModal }: IReceiveTokenModalProps) => {
  const { t } = useTranslation()
  return (
    <ModalComponent
      modalState={receivedTokenModal}
      closeModal={closeReceiveTokenModal}
      title={t('Token.receivedModalTitle', {
        amount: '1,300.00',
        token: 'ETH',
      })}
      image={mascot}
      ModalIcon={tokenImage(coin.symbol)}
      small
    >
      <div className="flex gap-2 mt-3">
        <Button variant="bordered" color="outlined" onClick={closeReceiveTokenModal}>
          {t('Actions.ok')}
        </Button>
        <Button color="primary">{t('Token.viewBalance')}</Button>
      </div>
    </ModalComponent>
  )
}
