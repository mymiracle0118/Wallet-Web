import { ITokenActivityProps } from '@portal/shared/utils/types'
import { CustomTypography } from 'app/components'
import { useNavigate } from 'lib/woozie'
import { BoughtIcon, ListedIcon, MintedIcon, ReceiveIcon, SendIcon } from '../Icons'

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
  assetId,
  hideBalance,
  tokenName,
}: ITokenActivityProps) => {
  const { navigate } = useNavigate()

  const statusColor =
    status === 'Completed'
      ? 'dark:text-feedback-positive'
      : status === 'Pending'
      ? 'dark:text-secondary'
      : status === 'Saved'
      ? 'dark:text-feedback-positive'
      : status === 'Failed' || status === 'Cancelled'
      ? 'dark:text-feedback-negative'
      : 'text-secondary text-primary-alt'

  const settingsPage = page === 'Settings-Token' ? '/settings/activity/DAI' : '/settings/activity/DAI/WETH'

  let url = settingsPage
  if (transactionHash) {
    if (network && assetId) {
      url = `/token/${network as string}/${assetId as string}/activity/${transactionHash as string}`
    }
  }
  const handleClick = () => {
    if (!disableClick) navigate(url)
    if (onClick) onClick()
  }
  return (
    <div
      onClick={handleClick}
      className="min-h-14 flex items-center pl-1 pr-3 hover:bg-custom-white10 rounded-lg cursor-pointer"
    >
      <div>
        {['Send', 'Sent'].includes(type) && <SendIcon />}
        {['Receive', 'Received'].includes(type) && <ReceiveIcon />}
        {type === 'Bought' && <BoughtIcon />}
        {type === 'Listed' && <ListedIcon />}
        {type === 'Minted' && <MintedIcon />}
      </div>
      <div className="pl-3 flex-1">
        <CustomTypography variant="subtitle">{title || type}</CustomTypography>
        <CustomTypography variant="body" type="secondary">
          {date}
        </CustomTypography>
      </div>

      <div className="text-right">
        <CustomTypography variant="subtitle" className="text-right w-32 break-words line-clamp-2">
          {!hideBalance ? `${price as number | string} ${tokenName as string}` : '**'}
        </CustomTypography>
        <CustomTypography className={`text-subtitle1 ${statusColor}`}>{status}</CustomTypography>
      </div>
    </div>
  )
}
