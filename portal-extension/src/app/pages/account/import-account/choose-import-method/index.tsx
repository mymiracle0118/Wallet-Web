import React from 'react'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { useNavigate } from 'lib/woozie'
import ChooseWalletImportMethod from '@src/app/components/ImportAccount/ChooseImportMethod'

const ImportAccountMethod = () => {
  const { navigate } = useNavigate()

  return (
    <SinglePageTitleLayout>
      <ChooseWalletImportMethod
        importWallet={() => navigate('/account/import-account')}
        importByPrivateKey={() => navigate('/account/import-by-private-key')}
      />
    </SinglePageTitleLayout>
  )
}

export default ImportAccountMethod
