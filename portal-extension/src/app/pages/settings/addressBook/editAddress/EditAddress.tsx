import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { Button } from 'components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import AddressItem from '../AddressItem'
import { useNavigate } from 'lib/woozie'

const EditAddress = () => {
  const { t } = useTranslation()
  const { addressBook } = useSettings()

  const { navigate } = useNavigate()
  return (
    <SinglePageTitleLayout dataAid="editAddressHead" title={t('Settings.editAddresses')}>
      <Button
        data-aid="addButton"
        color="outlined"
        variant="bordered"
        className="mb-4"
        onClick={() => navigate(`/settings/add-address`)}
      >
        {t('Actions.add')}
      </Button>
      {addressBook.map(
        (data) =>
          data.username &&
          data.address && (
            <AddressItem key={data.address} userName={`@${data.username}`} address={data.address} editMode />
          )
      )}
    </SinglePageTitleLayout>
  )
}

export default EditAddress
