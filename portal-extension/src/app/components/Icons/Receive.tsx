import React from 'react'
import { IIconProps } from '@portal/shared/utils/types'

const ReceiveIcon = ({ className }: IIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M9.41421 16L17.7071 7.70711C18.0976 7.31658 18.0976 6.68342 17.7071 6.29289C17.3166 5.90237 16.6834 5.90237 16.2929 6.29289L8 14.5858V7C8 6.44772 7.55228 6 7 6C6.44772 6 6 6.44772 6 7V16.9998C6 17.1354 6.02699 17.2649 6.07588 17.3828C6.12432 17.4999 6.19595 17.6096 6.29078 17.705C6.29219 17.7064 6.2936 17.7078 6.29502 17.7092C6.48924 17.9023 6.74301 17.9992 6.997 18C6.998 18 6.999 18 7 18H17C17.5523 18 18 17.5523 18 17C18 16.4477 17.5523 16 17 16H9.41421Z"
      fill="white"
    />
  </svg>
)
export default ReceiveIcon
