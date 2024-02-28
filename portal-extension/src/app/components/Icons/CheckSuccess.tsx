import React from 'react'
import { IIconProps } from '@portal/shared/utils/types'

const CheckSuccessIcon = ({ className }: IIconProps) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="7" cy="7" r="7" fill="#30D158" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.3737 4.29289C10.7642 4.68342 10.7642 5.31658 10.3737 5.70711L6.70703 9.37377C6.3165 9.7643 5.68334 9.7643 5.29281 9.37377L3.62615 7.70711C3.23562 7.31658 3.23562 6.68342 3.62615 6.29289C4.01667 5.90237 4.64983 5.90237 5.04036 6.29289L5.99992 7.25245L8.95948 4.29289C9.35 3.90237 9.98317 3.90237 10.3737 4.29289Z"
      fill="white"
    />
  </svg>
)
export default CheckSuccessIcon
