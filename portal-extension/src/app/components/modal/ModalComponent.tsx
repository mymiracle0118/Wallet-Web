import { Dialog } from '@headlessui/react'
import { Avatar } from '@nextui-org/react'
import { IModalComponentProps } from '@portal/shared/utils/types'
import { CustomTypography } from 'components'
import CustomThumbnail from '../CustomThumbnail'

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
  imgAlt,
  closeModal,
  thubmTitle,
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
            <div className="cursor-pointer rounded-full mx-auto mb-4 p-4 text-[3rem] h-20 w-20 flex items-center justify-center bg-gradient-dark">
              <Avatar src={ModalIcon} alt={imgAlt} className="rounded-full bg-custom-white10" />
            </div>
          )}
          {tokenImage && (
            <Avatar className="mx-auto mb-4 h-14 w-14 rounded-full" alt="token-thumbnail" src={tokenImage} />
          )}

          {modalIconImage && modalIconImage !== '' ? (
            <div className="mx-auto mb-6 rounded-full">
              <Avatar src={modalIconImage} alt={imgAlt} className="mx-auto rounded-full w-14 h-14 bg-custom-white10" />
            </div>
          ) : (
            <CustomThumbnail thumbName={thubmTitle} className="w-14 h-14 text-lg" />
          )}

          {nftImage && <Avatar src={nftImage} alt="nft-cover" className="h-14 w-14 mb-2 rounded-full" />}

          <CustomTypography variant="h1" className="mb-4 mt-2">
            {title}
          </CustomTypography>
          <CustomTypography variant="body" type="secondary" className="mb-4">
            {subtitle}
          </CustomTypography>
          {image && (
            <div className="mx-auto my-6">
              <Avatar src={image} alt="icon" className="w-40 h-40 mx-auto bg-transparent" />
            </div>
          )}

          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
