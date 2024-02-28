import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSettings } from '@portal/shared/hooks/useSettings'

import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { Button } from 'components'
import AddressItem from '../AddressItem'
import SupraIcon from 'assets/networks/Supra.svg'
import { useNavigate } from 'lib/woozie'

const AddressBooks = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const { addressBook } = useSettings()

  return (
    <SinglePageTitleLayout dataAid="addressBookHead" title={t('Settings.addressBookPageTitle')}>
      <Button
        data-aid="editButton"
        variant="bordered"
        color="outlined"
        className="mb-4"
        onClick={() => navigate(`/settings/edit-address`)}
      >
        {t('Actions.edit')}
      </Button>
      {addressBook.map(
        (data, idx) =>
          data.username &&
          data.address && (
            <AddressItem key={idx} image={<SupraIcon />} userName={`@${data.username}`} address={data.address} />
          )
      )}
    </SinglePageTitleLayout>
  )
}

export default AddressBooks
