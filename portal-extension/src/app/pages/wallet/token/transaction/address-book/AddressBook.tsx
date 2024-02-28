import React from 'react'
import { useTranslation } from 'react-i18next'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { Button, CustomTypography, TokenAddressButton } from 'app/components'
import { AddressBookUser, useSettings } from '@src/../../shared/hooks/useSettings'
import { Avatar } from '@nextui-org/react'
import { useNavigate } from 'lib/woozie'

const AddressBook = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const { addressBook } = useSettings()
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
        {addressBook.map((user: AddressBookUser) => (
          <div
            className="flex items-center justify-between h-14 hover:bg-custom-white10 rounded-[0.75rem] px-1 transition-all ease-in-out duration-100"
            key={user.username}
          >
            <div className="flex items-center space-x-3">
              <Avatar alt={user.username} src={user.avatar} className="w-7 h-7" />
              <CustomTypography variant="subtitle" className="w-36 !line-clamp-2">
                {user.username}
              </CustomTypography>
            </div>
            <TokenAddressButton enableCopy address={user.address} className="text-xs whitespace-nowrap" />
          </div>
        ))}
      </div>
    </SinglePageTitleLayout>
  )
}

export default AddressBook
