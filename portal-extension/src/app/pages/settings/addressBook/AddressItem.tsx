import { Button } from '@nextui-org/react'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { IAddressItemProps } from '@portal/shared/utils/types'
import { TrashIcon } from '@src/app/components/Icons'
import { CustomTypography, Icon, TokenAddressButton } from 'app/components'

const AddressItem = ({ username, address, image, editMode }: IAddressItemProps) => {
  const { removeToAddressBook } = useSettings()

  return (
    <div className="flex items-center justify-between h-14 hover:bg-custom-grey px-2 -mx-2 transition-all ease-in-out duration-100 rounded-md">
      {image && (
        <div className="mr-2">
          <Icon icon={image} size="large" />
        </div>
      )}
      <CustomTypography variant="subtitle" className="flex-1">
        {username}
      </CustomTypography>
      <div className="space-x-2 flex items-center justify-between">
        <TokenAddressButton address={address} enableCopy className="text-xs" placement="left" />
        {editMode && (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={() => removeToAddressBook(address)}
            data-testid="remove-address-btn"
          >
            <TrashIcon className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default AddressItem
