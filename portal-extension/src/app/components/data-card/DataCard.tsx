import { getChartUrl } from '@portal/shared/services/coingecko'
import { NetworkToken } from '@portal/shared/utils/types'
import { CustomTypography, Icon } from 'app/components'
import TrendingDownIcon from 'assets/icons/trending-down.svg'
import TrendingUpIcon from 'assets/icons/trending-up.svg'
import classnames from 'classnames'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { HyperlinkIcon } from '../Icons'

export interface DataCardProps extends ComponentProps {
  title: string
  collapsed?: boolean
  amount?: string
  percentage?: number | string
  width?: number | string
  icon?: ReactElement
  onClick?: () => void
  asset?: NetworkToken
  getChartUrl?: string
}

export const DataCard = ({
  onClick,
  title,
  collapsed,
  amount,
  percentage,
  width,
  icon,
  children,
  asset,
}: DataCardProps) => {
  const formattedPercentage = percentage && percentage.toLocaleString('en-US')
  const getNumber = +formattedPercentage || 0
  const { t } = useTranslation()
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
        <CustomTypography variant="subtitle" type="" className="">
          {title}
        </CustomTypography>
        {icon && <>{icon}</>}
        {amount && (
          <CustomTypography className="mt-2 mb-2 text-[1.25rem]" variant="subtitle">
            {amount}
          </CustomTypography>
        )}
      </div>

      <div className="flex justify-between items-center">
        {asset && (
          <a
            href={getChartUrl(asset.coingeckoTokenId.toLocaleLowerCase().replace(/\s+/g, '-'))}
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary"
          >
            {asset && !asset.isCustom && asset.networkName !== 'SUPRA' && (
              <CustomTypography className="!text-secondary flex items-center gap-1">
                {t('Token.priceChart')} <HyperlinkIcon className="w-4 h-4" />
              </CustomTypography>
            )}
          </a>
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
            <Icon
              icon={percentage >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              size="small"
              strokeColor="success"
            />
            {`${getNumber}%`}
          </CustomTypography>
        )}
      </div>
      {collapsed && children}
    </div>
  )
}
