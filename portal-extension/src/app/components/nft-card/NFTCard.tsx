import React, { useState } from 'react'
import classnames from 'classnames'
import { COLORS, CustomTypography, Icon } from 'app/components'
import HeartIcon from 'assets/icons/heart.svg'
import SolidHeartIcon from 'assets/icons/heart_solid.svg'

type INFTCardProps = {
  title: string
  image: string
  price: string
  color?: string
  currency: string
  liked?: boolean
  onClick?: () => void
}

export const NFTCard = ({
  title,
  image,
  currency,
  price,
  color = COLORS.custom.grey100,
  liked = false,
  onClick,
}: INFTCardProps) => {
  const [showOverlay, setShowOverlay] = useState<boolean>(false)
  return (
    <button
      type="button"
      className="w-40 flex flex-col gap-2 relative h-40 relative w-fill radius-[2px] p-0"
      onClick={onClick}
      onMouseLeave={() => setShowOverlay(false)}
      onMouseEnter={() => setShowOverlay(true)}
    >
      {showOverlay && (
        <>
          <div className="absolute top-3.5 right-3 z-20">
            <Icon icon={liked ? <SolidHeartIcon /> : <HeartIcon />} size="medium" />
          </div>
          <div className="absolute z-10 max-h-[70px] bottom-8 color-white w-full">
            <CustomTypography variant="subtitle" lineClamp={4} className="pl-3 pr-3 leading-4 h-auto text-left">
              {title}
            </CustomTypography>
          </div>
        </>
      )}
      <div
        className={classnames('cover bg-cover bg-no-repeat h-40 w-full rounded-md', showOverlay ? 'brightness-50' : '')}
        style={{
          backgroundImage: `url(${image})`,
        }}
      ></div>

      <div className="h-6 flex justify-between items-center w-full">
        <CustomTypography variant="subtitle">{price}</CustomTypography>
        <div className="py-[2px] px-3 rounded-xl bg-custom-grey10  dark:bg-custom-white10">
          <CustomTypography variant="subtitle" style={{ color }}>
            {currency}
          </CustomTypography>
        </div>
      </div>
    </button>
  )
}
