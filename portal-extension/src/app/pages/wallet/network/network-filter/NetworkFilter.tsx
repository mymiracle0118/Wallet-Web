import React, { useState } from 'react'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { useTranslation } from 'react-i18next'

import AddSuccessModal from 'pages/wallet/AddSuccessModal'
import SearchNetwork from './searchNetwork'
import { useSettings } from '@portal/shared/hooks/useSettings'

const NetworkFilter = () => {
  const { t } = useTranslation()
  const [modalState, setModalState] = useState<boolean>(false)

  const { currentAccount } = useSettings()
  const showAddNetwork = currentAccount && currentAccount.networkName === 'ETH' ? true : false

  return (
    <SinglePageTitleLayout
      title={t('Network.networkFilter')}
      addNetwork={showAddNetwork ? true : false}
      paddingClass={false}
    >
      <div className="px-4 pt-4">
        <AddSuccessModal openModal={modalState} closeModal={() => setModalState(false)} name="Ethereum" />
        <SearchNetwork />
      </div>
    </SinglePageTitleLayout>
  )
}

export default NetworkFilter
