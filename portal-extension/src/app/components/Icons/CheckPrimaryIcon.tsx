import React from 'react'
import { IIconProps } from '@portal/shared/utils/types'

const CheckPrimaryIcon = ({ className }: IIconProps) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="6" cy="6" r="6" fill="url(#paint0_linear_1_3)" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.37377 3.29289C9.7643 3.68342 9.7643 4.31658 9.37377 4.70711L5.70711 8.37377C5.31658 8.7643 4.68342 8.7643 4.29289 8.37377L2.62623 6.70711C2.2357 6.31658 2.2357 5.68342 2.62623 5.29289C3.01675 4.90237 3.64992 4.90237 4.04044 5.29289L5 6.25245L7.95956 3.29289C8.35008 2.90237 8.98325 2.90237 9.37377 3.29289Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1_3"
        x1="13.1681"
        y1="8.09012"
        x2="4.87693"
        y2="-1.37973"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.166667" stopColor="#E43FFF" />
        <stop offset="0.99" stopColor="#DA8FFF" />
      </linearGradient>
    </defs>
  </svg>
)

export default CheckPrimaryIcon
