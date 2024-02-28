import React from 'react'
import { CustomTypography, Icon, TokenAddressButton } from 'app/components'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { IAddressItemProps } from '@portal/shared/utils/types'
import { Button } from '@nextui-org/react'
import { TrashIcon } from '@src/app/components/Icons'

const AddressItem = ({ userName, address, image, editMode }: IAddressItemProps) => {
  const { removeToAddressBook } = useSettings()

  return (
    <div className="flex items-center justify-between h-14 hover:bg-surface-hover transition-all ease-in-out duration-100 rounded-md">
      {image && (
        <div className="mr-2">
          <Icon icon={image} size="large" />
        </div>
      )}
      <CustomTypography variant="subtitle" className="flex-1">
        {userName}
      </CustomTypography>
      <div className="space-x-2 flex items-center justify-between">
        <TokenAddressButton address={address} enableCopy className="text-xs" />
        {editMode && (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={() => removeToAddressBook(address)}
            data-testid="remove-address-btn"
          >
            <TrashIcon />
          </Button>
        )}
      </div>
    </div>
  )
}

export default AddressItem
