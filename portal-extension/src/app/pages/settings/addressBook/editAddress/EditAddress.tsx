import { useSettings } from '@portal/shared/hooks/useSettings'
import { Button } from 'components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { useNavigate } from 'lib/woozie'
import { useTranslation } from 'react-i18next'
import AddressItem from '../AddressItem'

const EditAddress = () => {
  const { t } = useTranslation()
  const { addressBook } = useSettings()
  const { navigate } = useNavigate()

  return (
    <SinglePageTitleLayout
      dataAid="editAddressHead"
      title={t('Settings.editAddresses')}
      className="overflow-hidden py-4"
      paddingClass={false}
    >
      <div className="px-4">
        <Button
          data-aid="addButton"
          color="outlined"
          variant="bordered"
          className="mb-4 sticky top-0 z-50 bg-surface-dark"
          onClick={() => navigate(`/settings/add-address`)}
        >
          {t('Actions.add')}
        </Button>
      </div>
      <div className="overflow-y-auto max-h-[28.5rem] px-4">
        {addressBook.map(
          (data) =>
            data.username &&
            data.address && (
              <AddressItem key={data.address} username={`@${data.username}`} address={data.address} editMode />
            )
        )}
      </div>
    </SinglePageTitleLayout>
  )
}

export default EditAddress
