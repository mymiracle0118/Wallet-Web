import React from 'react'
import { IIconProps } from '@portal/shared/utils/types'

const CaretDownIcon = ({ className }: IIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.52876 5.52861C3.78911 5.26826 4.21122 5.26826 4.47157 5.52861L8.00016 9.0572L11.5288 5.52861C11.7891 5.26826 12.2112 5.26826 12.4716 5.52861C12.7319 5.78896 12.7319 6.21107 12.4716 6.47141L8.47157 10.4714C8.21122 10.7318 7.78911 10.7318 7.52876 10.4714L3.52876 6.47141C3.26841 6.21107 3.26841 5.78896 3.52876 5.52861Z"
      fill="white"
    />
  </svg>
)
export default CaretDownIcon
