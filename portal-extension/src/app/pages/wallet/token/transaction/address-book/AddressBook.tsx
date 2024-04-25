import AddressBookComponent from '@src/app/components/AddressBook/AddressBook'
import { Button } from 'app/components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { useNavigate } from 'lib/woozie'
import { useTranslation } from 'react-i18next'

const AddressBook = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()

  return (
    <SinglePageTitleLayout dataAid="addressBookHead" title="Address Book">
      <div>
        <Button
          data-aid="editButton"
          variant="bordered"
          color="outlined"
          className="mb-4"
          onClick={() => navigate(`/settings/edit-address`)}
        >
          {t('Actions.edit')}
        </Button>

        <AddressBookComponent />
      </div>
    </SinglePageTitleLayout>
  )
}

export default AddressBook
