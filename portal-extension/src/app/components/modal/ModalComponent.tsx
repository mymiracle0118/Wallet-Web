import { Dialog } from '@headlessui/react'
import { IModalComponentProps } from '@portal/shared/utils/types'
import { COLORS, CustomTypography, Icon } from 'components'

export const ModalComponent = ({
  ModalIcon,
  modalIconImage,
  tokenImage,
  title = '',
  subtitle = '',
  image,
  nftImage,
  children,
  modalState,
  dataAid,
  closeModal,
}: IModalComponentProps) => {
  return (
    <Dialog data-aid={dataAid} open={modalState} onClose={closeModal} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-surface-dark-alt/80" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="mx-auto bg-surface-light dark:bg-surface-dark p-8 rounded-lg w-[21.875rem] text-center">
          {ModalIcon && (
            <div
              className="cursor-pointer rounded-full mx-auto mb-4 p-4 text-[4rem] h-20 w-20 flex items-center justify-center"
              style={{ background: COLORS.background.gradientLogoBg }}
            >
              <Icon icon={ModalIcon} size="inherit" />
            </div>
          )}
          {tokenImage && (
            <img className="mx-auto mb-4 h-[64px] w-[64px] rounded-full" alt="token-thumbnail" src={tokenImage} />
          )}

          {modalIconImage && (
            <div className="mx-auto mb-6 w-16 h-16 rounded-xl">
              <img className="h-full w-full" src={modalIconImage} alt="modal-icon-img" />
            </div>
          )}

          {nftImage && <img src={nftImage} alt="nft-cover" className="h-16 w-16 mb-2 rounded-full" />}

          <CustomTypography variant="h1" className="mb-4">
            {title}
          </CustomTypography>
          <CustomTypography variant="body" type="secondary" className="mb-4">
            {subtitle}
          </CustomTypography>
          {image && (
            <div className="mx-auto mb-6 h-40 w-28">
              <img src={image} alt="icon" />
            </div>
          )}

          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
