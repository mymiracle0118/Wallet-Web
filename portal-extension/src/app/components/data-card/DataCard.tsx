import { CustomTypography, Icon } from 'app/components'
import TrendingDownIcon from 'assets/icons/trending-down.svg'
import TrendingUpIcon from 'assets/icons/trending-up.svg'
import classnames from 'classnames'
import { ReactElement } from 'react'

export interface DataCardProps extends ComponentProps {
  title: string
  collapsed?: boolean
  amount?: string
  percentage?: number | string
  width?: number | string
  icon?: ReactElement
  onClick?: () => void
}

export const DataCard = ({ onClick, title, collapsed, amount, percentage, width, icon, children }: DataCardProps) => {
  const formattedPercentage = percentage && percentage.toLocaleString('en-US')
  const getNumber = +formattedPercentage || 0
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : ''}
      tabIndex={0}
      className="flex flex-col p-3 rounded-lg dark:bg-surface-dark-alt group"
      style={{
        width: width || 'auto',
      }}
    >
      <div className="flex justify-between items-center">
        <CustomTypography variant="subtitle" type="secondary" className="group-hover:text-secondary">
          {title}
        </CustomTypography>
        {icon && <>{icon}</>}
      </div>
      {amount && (
        <CustomTypography className="mt-2 mb-2" variant="subtitle">
          {amount}
        </CustomTypography>
      )}
      {formattedPercentage && (
        <CustomTypography
          variant="subtitle"
          className="flex items-center gap-1"
          color={classnames(
            percentage >= 0
              ? 'text-feedback-positive dark:text-feedback-positive'
              : 'text-feedback-negative dark:text-feedback-negative'
          )}
        >
          <Icon icon={percentage >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />} size="small" strokeColor="success" />
          {`${getNumber}%`}
        </CustomTypography>
      )}
      {collapsed && children}
    </div>
  )
}
