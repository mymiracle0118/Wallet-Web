import React from 'react'
import { useTranslation } from 'react-i18next'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import ImportByPrivateKeyComponents from '@src/app/components/ImportAccount/ImportByPrivateKey'

const ImportViaPrivateKey = () => {
  const { t } = useTranslation()
  return (
    <SinglePageTitleLayout title={t('Account.importAccount')}>
      <ImportByPrivateKeyComponents nextToFetchUsername="account/import-account-private-key" />
    </SinglePageTitleLayout>
  )
}

export default ImportViaPrivateKey
