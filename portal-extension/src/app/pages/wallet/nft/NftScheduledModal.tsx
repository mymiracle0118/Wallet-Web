import { INftScheduledModalProps } from '@portal/shared/utils/types'
import { Button, ModalComponent } from 'app/components'
import mascot from 'assets/images/mascot.png'
import { useTranslation } from 'react-i18next'

const NftScheduledModal = ({ modalState, nftImage, nftTitle, closeModal }: INftScheduledModalProps) => {
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
