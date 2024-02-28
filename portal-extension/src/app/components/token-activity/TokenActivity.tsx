import React from 'react'
import { useNavigate } from 'lib/woozie'
import { CustomTypography } from 'app/components'
import { BoughtIcon, ListedIcon, MintedIcon, ReceiveIcon, SendIcon } from '../Icons'

export type TokenActivityProps = {
  type: 'Send' | 'Sent' | 'Received' | 'Bought' | 'Listed' | 'Minted'
  title?: string
  date: string
  price: string | number
  status: 'Scheduled' | 'Pending' | 'Completed' | 'Saved' | string
  page: 'Settings' | 'Settings-Token' | 'Token'
  disableClick?: boolean
  transactionHash?: string
  onClick?: () => void
  network?: string
  tokenDecimal?: string | number
  assetId?: string
}

export const TokenActivity = ({
  type,
  title,
  date,
  price,
  status,
  page,
  disableClick,
  transactionHash,
  onClick,
  network,
  // tokenDecimal,
  assetId,
}: TokenActivityProps) => {
  const { navigate } = useNavigate()

  const statusColor =
    status === 'Completed'
      ? 'dark:text-feedback-positive'
      : status === 'Pending'
      ? 'dark:text-secondary'
      : status === 'Saved'
      ? 'dark:text-feedback-positive'
      : status === 'Failed'
      ? 'dark:text-feedback-negative'
      : 'text-secondary text-primary-alt'

  // '/settings/activity/:fromToken/:toToken' for Swap page
  const settingsPage = page === 'Settings-Token' ? '/settings/activity/DAI' : '/settings/activity/DAI/WETH'

  let url = settingsPage
  if (transactionHash) {
    if (network && assetId) {
      url = `/token/${network}/${assetId}/activity/${transactionHash}`
    }
  }
  const handleClick = () => {
    if (!disableClick) navigate(url)
    if (onClick) onClick()
  }

  return (
    <div
      onClick={handleClick}
      className="h-14 flex items-center px-3 hover:bg-custom-white10 rounded-lg cursor-pointer"
    >
      <div>
        {['Send', 'Sent'].includes(type) && <SendIcon />}
        {type === 'Received' && <ReceiveIcon />}
        {type === 'Bought' && <BoughtIcon />}
        {type === 'Listed' && <ListedIcon />}
        {type === 'Minted' && <MintedIcon />}
      </div>
      <div className="pl-6 flex-1">
        <CustomTypography variant="subtitle">{title || type}</CustomTypography>
        <CustomTypography variant="body" type="secondary">
          {date}
        </CustomTypography>
      </div>

      <div className="text-right">
        <CustomTypography variant="subtitle">{price}</CustomTypography>
        <CustomTypography className={`text-subtitle1 ${statusColor}`}>{status}</CustomTypography>
      </div>
    </div>
  )
}
