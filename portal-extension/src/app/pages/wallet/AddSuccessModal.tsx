import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, CustomTypography } from 'components'
import { Image, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { useNavigate } from 'lib/woozie'
import { IAddSuccessModalProps } from '@portal/shared/utils/types'

const AddSuccessModal = ({ openModal, closeModal, tokenImage, name }: IAddSuccessModalProps) => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()

  return (
    <Modal
      backdrop="opaque"
      isOpen={openModal}
      onClose={closeModal}
      hideCloseButton={true}
      isDismissable={false}
      placement="center"
      className="max-w-[20.625rem]"
    >
      <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
        <ModalBody>
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <Image width={64} height={64} src={tokenImage} fallbackSrc={tokenImage} alt="Gas Price Alert" />
            </div>

            <CustomTypography variant="h1">
              {t('Network.modalTitle', {
                network: name,
              })}
            </CustomTypography>

            <div className="flex items-center justify-between gap-x-4">
              <Button onClick={() => navigate('/home')} color="primary">
                {t('Actions.great')}
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AddSuccessModal
