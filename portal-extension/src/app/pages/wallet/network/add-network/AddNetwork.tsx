import React from 'react'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { useTranslation } from 'react-i18next'
import AddCustomNetwork from './customNetwork'

const AddNetwork = () => {
  const { t } = useTranslation()

  return (
    <SinglePageTitleLayout title={t('Network.addNetwork')} className="space-y-4">
      <AddCustomNetwork />
    </SinglePageTitleLayout>
  )
}

export default AddNetwork
