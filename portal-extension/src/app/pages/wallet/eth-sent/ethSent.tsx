import React, { useState } from 'react'
import { Button, ModalComponent } from 'app/components'
import EthIcon from 'assets/coins/ETH.svg'
import mascot from 'assets/images/mascot.png'

const EthSent = () => {
  const [modalState, setModalState] = useState<boolean>(false)
  const closeModal = () => setModalState(false)
  return (
    <ModalComponent
      modalState={modalState}
      closeModal={closeModal}
      image={mascot}
      title="You have sent 1 Eth"
      ModalIcon={<EthIcon />}
    >
      <div className="flex gap-2 ">
        <Button variant="bordered" color="outlined">
          Ok
        </Button>
        <Button color="primary">View Balance</Button>
      </div>
    </ModalComponent>
  )
}

export default EthSent
