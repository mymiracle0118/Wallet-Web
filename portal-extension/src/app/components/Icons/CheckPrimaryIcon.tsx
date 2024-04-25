import React from 'react'
import { IIconProps } from '@portal/shared/utils/types'

const CheckPrimaryIcon = ({ className }: IIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18" className={className}>
    <circle cx="9" cy="9" r="9" fill="#1B1C24"></circle>
    <circle cx="9" cy="9" r="6" fill="url(#paint0_linear_40_1839)"></circle>
    <path stroke="#fff" strokeLinecap="round" strokeWidth="2" d="M6 9l2 2 3.5-4"></path>
    <defs>
      <linearGradient
        id="paint0_linear_40_1839"
        x1="16.168"
        x2="7.877"
        y1="11.09"
        y2="1.62"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.167" stopColor="#E43FFF"></stop>
        <stop offset="0.99" stopColor="#DA8FFF"></stop>
      </linearGradient>
    </defs>
  </svg>
)

export default CheckPrimaryIcon
