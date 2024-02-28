import { ISendTokenCardProps } from '@portal/shared/utils/types'
import { COLORS, CustomTypography } from 'components'
import React from 'react'

export const SendTokenCard = ({ title, subtitle, img, icon, content }: ISendTokenCardProps) => {
  return (
    <div
      className="py-6 px-4 m-2 rounded flex flex-row gap-2 backdrop-blur"
      style={{ background: COLORS.background.gradientBg, boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.25)' }}
    >
      <img src={img} className="mt-3 h-8 w-16" alt="coin" />
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col gap-1">
            <CustomTypography dataAid="buyCrypto" variant="body" color="text-custom-white80">
              {subtitle}
            </CustomTypography>
            <CustomTypography dataAid="buyWithBank" variant="h1">
              {title}
            </CustomTypography>
          </div>
          {icon}
        </div>

        <CustomTypography variant="body" color="text-custom-white80">
          {content}
        </CustomTypography>
      </div>
    </div>
  )
}
