import { Image, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { IAddSuccessModalProps } from '@portal/shared/utils/types'
import CustomThumbnail from '@src/app/components/CustomThumbnail'
import { Button, CustomTypography } from 'components'
import { useNavigate } from 'lib/woozie'
import { useTranslation } from 'react-i18next'

const AddSuccessModal = ({
  openModal,
  closeModal,
  tokenImage,
  name,
  alreadyAdded,
  hasMultipleTokens = false,
}: IAddSuccessModalProps) => {
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
            {!hasMultipleTokens && (
              <div className="flex justify-center">
                {tokenImage ? (
                  <Image
                    width={64}
                    height={64}
                    src={tokenImage}
                    fallbackSrc={tokenImage}
                    alt="Token Image"
                    className="rounded-full overflow-hidden"
                  />
                ) : (
                  <CustomThumbnail thumbName={name} className="w-14 h-14 text-lg" />
                )}
              </div>
            )}

            <CustomTypography variant="h1">
              {alreadyAdded
                ? t('Network.aleadyAddedTitle', {
                    network: name,
                  })
                : t('Network.modalTitle', {
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
