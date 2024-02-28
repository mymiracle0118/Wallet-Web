import React from 'react'
import { Button, Tooltip } from '@nextui-org/react'
import { StarEmptyIcon, StarFillIcon } from '../Icons'
import { IFavouriteProps } from '@portal/shared/utils/types'
import { useTranslation } from 'react-i18next'

export const Favourite = ({ isFavToken, placement = 'top', handleFavorite }: IFavouriteProps) => {
  const { t } = useTranslation()

  return (
    <Tooltip
      content={isFavToken ? t('Actions.removeFavorites') : t('Actions.addFavorites')}
      placement={placement}
      color="foreground"
      offset={-3}
    >
      <Button isIconOnly variant="light" size="sm" onClick={handleFavorite}>
        {isFavToken ? <StarFillIcon className="text-xl w-4 h-4" /> : <StarEmptyIcon className="text-xl w-4 h-4" />}
      </Button>
    </Tooltip>
  )
}
