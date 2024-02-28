import React from 'react'
import { useNavigate } from 'lib/woozie'
import classNames from 'classnames'

import { CustomTypography, Icon } from 'app/components'
import { ITokenSwapActivityProps } from '@portal/shared/utils/types'

export const TokenSwapActivity = ({
  from,
  fromImage,
  to,
  toImage,
  date,
  price,
  status,
  divider,
  type = 'Token',
  disableRedirect = false,
}: ITokenSwapActivityProps) => {
  const { navigate } = useNavigate()

  const statusColor =
    status === 'Completed'
      ? 'dark:text-feedback-positive'
      : status === 'Pending'
      ? 'dark:text-secondary'
      : status === 'Saved'
      ? 'dark:text-feedback-positive'
      : 'text-secondary text-primary-alt'

  const url = type === 'Token' ? `/swap/activity` : '/settings/activity/DAI/WETH'

  return (
    <button
      type="button"
      className={classNames(
        'flex w-full height-[3.5rem] items-center pt-2 pb-2 pl-4 pr-4 dark:hover:bg-custom-white10 box-border',
        divider ? 'shadow-sm' : ''
      )}
      onClick={() => !disableRedirect && navigate(url)}
    >
      <div>
        <Icon icon={fromImage} size="large" />
        <Icon icon={toImage} size="large" className="-ml-2" />
      </div>
      <div className="ml-4 flex-1 text-left">
        <CustomTypography variant="subtitle">{`${from} to ${to}`}</CustomTypography>
        <CustomTypography variant="body" type="secondary">
          {date}
        </CustomTypography>
      </div>

      <div className="text-right">
        <CustomTypography variant="subtitle">{price}</CustomTypography>
        <CustomTypography className={`text-subtitle1 ${statusColor}`}>{status}</CustomTypography>
      </div>
    </button>
  )
}
