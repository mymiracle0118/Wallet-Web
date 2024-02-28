import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, ModalComponent } from 'app/components'
import mascot from 'assets/images/mascot.png'

type NftScheduledModalProps = {
  modalState: boolean
  nftImage: string
  nftTitle: string
  closeModal: () => void
}

const NftScheduledModal = ({ modalState, nftImage, nftTitle, closeModal }: NftScheduledModalProps) => {
  const { t } = useTranslation()
  return (
    <ModalComponent
      small
      modalState={modalState}
      title={t('scheduledSending', {
        title: nftTitle,
      })}
      nftImage={nftImage}
      closeModal={closeModal}
      image={mascot}
    >
      <Button onClick={closeModal} color="primary">
        {t('Actions.ok')}
      </Button>
    </ModalComponent>
  )
}

export default NftScheduledModal
