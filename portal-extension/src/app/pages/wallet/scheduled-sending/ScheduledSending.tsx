import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ModalComponent, Button } from 'app/components'
import EthIcon from 'assets/coins/ETH.svg'
import mascot from 'assets/images/mascot.png'

const ScheduledSending = () => {
  const { t } = useTranslation()
  const [modalState, setModalState] = useState<boolean>(false)
  const closeModal = () => setModalState(false)
  return (
    <ModalComponent
      modalState={modalState}
      closeModal={closeModal}
      image={mascot}
      title="You have schedueled sending 1 ETH"
      ModalIcon={<EthIcon />}
    >
      <div className="flex items-center justify-between">
        <Button variant="bordered" color="outlined">
          {t('Actions.ok')}
        </Button>
      </div>
    </ModalComponent>
  )
}

export default ScheduledSending
