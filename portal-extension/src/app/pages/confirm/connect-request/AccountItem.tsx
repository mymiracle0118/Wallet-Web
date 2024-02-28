import React from 'react'
import { CustomTypography } from 'components'
import { IAccountItemProps } from '@portal/shared/utils/types'
import { Checkbox } from '@nextui-org/react'

const AccountItem = ({ accountName, selected, onSelected }: IAccountItemProps) => {
  return (
    <div className="w-full flex items-center p-4 -mx-4 hover:dark:bg-custom-white10 hover:bg-custom-grey10 shadow-sm dark:shadow-custom-white10 shadow-custom-grey10">
      <Checkbox isSelected={selected} onValueChange={onSelected} className="rounded-full" />
      <CustomTypography className="text-h4">{accountName}</CustomTypography>
    </div>
  )
}

export default AccountItem
