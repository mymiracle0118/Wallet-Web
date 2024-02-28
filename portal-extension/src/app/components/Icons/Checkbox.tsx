/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from 'react'
import { IIconProps } from '@portal/shared/utils/types'

const CheckboxIcon = ({ className }: IIconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`!w-full !h-full ${className}`}
  >
    <path
      d="M0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4Z"
      fill="url(#paint0_linear_8059_10969)"
    />
    <rect width="18" height="18" transform="translate(3 3)" fill="url(#paint1_linear_8059_10969)" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19.591 5.90901C20.4697 6.78769 20.4697 8.21231 19.591 9.09099L11.341 17.341C10.4623 18.2197 9.03769 18.2197 8.15901 17.341L4.40901 13.591C3.53033 12.7123 3.53033 11.2877 4.40901 10.409C5.28769 9.53033 6.71231 9.53033 7.59099 10.409L9.75 12.568L16.409 5.90901C17.2877 5.03033 18.7123 5.03033 19.591 5.90901Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_8059_10969"
        x1="26.3361"
        y1="16.1802"
        x2="9.75386"
        y2="-2.75946"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.166667" stopColor="#E43FFF" />
        <stop offset="0.99" stopColor="#DA8FFF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_8059_10969"
        x1="19.7521"
        y1="12.1352"
        x2="7.3154"
        y2="-2.06959"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.166667" stopColor="#E43FFF" />
        <stop offset="0.99" stopColor="#DA8FFF" />
      </linearGradient>
    </defs>
  </svg>
)
export default CheckboxIcon
