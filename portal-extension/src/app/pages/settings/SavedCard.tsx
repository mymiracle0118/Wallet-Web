import React from 'react'
import { CustomTypography, Icon } from 'components'
import RightArrowIcon from 'assets/icons/arrow-right.svg'
import { ISavedCardProps } from '@portal/shared/utils/types'

const SavedCard = ({ icon, title, amount, onClick }: ISavedCardProps) => {
  const formattedAmount = amount.toLocaleString('en-US')

  return (
    <div className="rounded-lg p-4 flex justify-between cursor-pointer bg-gradient-bg" onClick={onClick}>
      <div className="w-[80%] text-left">
        {icon && <Icon icon={icon} size="large" />}
        <CustomTypography dataAid="scheduledTransactionsHead" className="text-custom-white" variant="subtitle">
          {title}
        </CustomTypography>
        <CustomTypography
          dataAid="scheduledTransactionsValue"
          className="text-custom-white"
          variant="h2"
        >{`$${formattedAmount}`}</CustomTypography>
      </div>

      <Icon icon={<RightArrowIcon />} size="medium" />
    </div>
  )
}

export default SavedCard
