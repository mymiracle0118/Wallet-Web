import { Button, ListboxItem } from '@nextui-org/react'
import { INetworkItemProps } from '@portal/shared/utils/types'
import { Icon, TokenAddressButton } from 'app/components'
import CheckIcon from 'assets/icons/check.svg'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'

const NetworkItem = ({ image, name, coin, address, active, link, networkId, onClick }: INetworkItemProps) => {
  const { t } = useTranslation()

  const handleOnClick = () => {
    if (onClick && networkId) {
      onClick(networkId)
    }
  }

  const NetworkPath = () => window.open(link, '_blank')

  return (
    <ListboxItem
      key={coin}
      onClick={handleOnClick}
      data-testid={`${coin}-btn`}
      className={classnames('font-sm font-extrabold', active ? 'active' : '')}
      startContent={
        <div className="flex items-center">
          {typeof image === 'string' ? (
            <img className="rounded-small justify-center w-8 h-8" src={image} alt="coin" />
          ) : (
            image && <Icon icon={image} size="large" />
          )}
          {!image && (
            <div className="w-8 h-8 uppercase rounded-full bg-gradient-bg text-custom-white flex items-center justify-center">
              {name.slice(0, 1)}
            </div>
          )}
          {active && (
            <div className="badge-check">
              <CheckIcon />
            </div>
          )}
        </div>
      }
      endContent={
        address ? (
          <TokenAddressButton address={address} enableCopy link={NetworkPath} />
        ) : (
          <Button variant="bordered" size="sm" className="rounded-xl">
            {t('Create.create')}
          </Button>
        )
      }
    >
      {name ? name : coin}
    </ListboxItem>
  )
}

export default NetworkItem
