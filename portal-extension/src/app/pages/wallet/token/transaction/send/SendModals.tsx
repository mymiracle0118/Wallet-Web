import { Avatar, Chip, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import {
  IAdjustGasAmountModalProps,
  IReceiveTokenModalProps,
  ISendSameAddressModal,
  ISendWithEstimateModalProps,
} from '@portal/shared/utils/types'
import CustomThumbnail from '@src/app/components/CustomThumbnail'
import { CalendarIcon } from '@src/app/components/Icons'
import LightBulb from 'assets/icons/lightbulb.svg'
import Warning from 'assets/icons/warning.svg'
import { Button, CustomTypography, Icon, Input, ModalComponent } from 'components'
import { useTranslation } from 'react-i18next'

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
      title={t('Token.sendTokenWithLowGasFee', { token: 'ETH' }) as string}
      subtitle={t('Token.cancelGasFeeWithNoMatch') as string}
      imgAlt="ETH"
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
          placeholder={t('Token.customTime') as string}
          onClick={openCalendar}
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
      className="max-w-[19.625rem]"
      isKeyboardDismissDisabled={true}
      isDismissable={false}
    >
      <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
        <ModalBody>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="cursor-pointer rounded-full mx-auto text-[4rem] flex items-center justify-center">
              <Icon icon={<LightBulb />} size="inherit" />
            </div>
            <CustomTypography variant="h1" className="text-center my-4">
              {t('Token.leaveGasFee')}
            </CustomTypography>
            <CustomTypography variant="body" className="text-center !font-extrabold" type="secondary">
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

export const ReceiveTokenModal = ({
  image,
  title,
  receivedTokenModal,
  closeReceiveTokenModal,
}: IReceiveTokenModalProps) => {
  const { t } = useTranslation()
  return (
    <Modal
      backdrop="opaque"
      isOpen={receivedTokenModal}
      onClose={closeReceiveTokenModal}
      hideCloseButton={true}
      placement="center"
      className="max-w-[19.625rem]"
      isKeyboardDismissDisabled={true}
      isDismissable={false}
    >
      <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
        <ModalBody>
          <div className="flex flex-col items-center justify-center space-y-4">
            {image && image !== '' ? (
              <div className="mx-auto mb-6 rounded-full">
                <Avatar src={image} alt={title} className="mx-auto rounded-full w-14 h-14 bg-custom-white10" />
              </div>
            ) : (
              <CustomThumbnail thumbName={title} className="w-14 h-14 text-lg" />
            )}
            <CustomTypography variant="h1" className="text-center">
              {t('Wallet.sendOnSameAddreess')}
            </CustomTypography>
            <CustomTypography variant="body" className="text-center" type="secondary">
              {t('Wallet.wishToContinue')}
            </CustomTypography>
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="bordered" color="outlined" onClick={closeReceiveTokenModal}>
              {t('Actions.ok')}
            </Button>
            <Button color="primary">{t('Token.viewBalance')}</Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export const SendSameAddressModal = ({
  isShowSameAddressModal,
  setShowSameAddressModal,
  onContinue,
}: ISendSameAddressModal) => {
  const { t } = useTranslation()
  return (
    <Modal
      backdrop="opaque"
      isOpen={isShowSameAddressModal}
      onClose={setShowSameAddressModal}
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
            <CustomTypography variant="h1" className="text-center my-4">
              {t('Wallet.sendOnSameAddreess')}
            </CustomTypography>
            <CustomTypography variant="body" className="text-center" type="secondary">
              {t('Wallet.wishToContinue')}
            </CustomTypography>
          </div>
          <div className="flex gap-2 mt-6">
            <Button variant="bordered" color="outlined" onClick={setShowSameAddressModal}>
              {t('Actions.cancel')}
            </Button>
            <Button color="primary" onClick={onContinue}>
              {t('Actions.continue')}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
