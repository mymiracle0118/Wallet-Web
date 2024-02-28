import React from 'react'
import classnames from 'classnames'

import CheckIcon from 'assets/icons/check.svg'
import TrashIcon from 'assets/icons/trash-2.svg'
import { IAccountItemProps } from '@portal/shared/utils/types'

const AccountItem = ({ selected, onSelect, onDelete, address, username }: IAccountItemProps) => {
  const handleDelete = (event: React.MouseEvent<HTMLElement>) => {
    // eslint-disable-next-line
    event.stopPropagation()
    onDelete(address)
  }

  return (
    <button
      className="w-full h-14 flex justify-center items-center"
      type="button"
      onClick={() => onSelect && onSelect(address)}
    >
      <span className="flex items-center flex-1 text-left gap-2 text-custom-black dark:text-custom-white	font-extrabold">
        <div
          className={classnames(
            'text-[24px] rounded-full',
            selected
              ? 'bg-gradient-alt stroke-custom-white'
              : 'bg-custom-grey10 dark:bg-custom-white10 stroke-custom-white dark:stroke-custom-black'
          )}
        >
          <CheckIcon />
        </div>
        {`@${username}`}
      </span>

      {selected && <div className="p-1 mr-2 bg-[#19865F] rounded text-[#FFF]">Connected</div>}

      <button type="button" className="text-[24px] stroke-[#2C2D3C] dark:stroke-[#FFF]" onClick={handleDelete}>
        <TrashIcon />
      </button>
    </button>
  )
}

export default AccountItem
