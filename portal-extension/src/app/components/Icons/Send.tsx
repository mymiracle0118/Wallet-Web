import React from 'react'
import { IIconProps } from '@portal/shared/utils/types'

const SendIcon = ({ className }: IIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M17.9241 6.61722C17.8757 6.50014 17.804 6.3904 17.7092 6.29502C17.7078 6.2936 17.7064 6.29219 17.705 6.29078C17.5242 6.11106 17.2751 6 17 6H7C6.44772 6 6 6.44772 6 7C6 7.55228 6.44772 8 7 8H14.5858L6.29289 16.2929C5.90237 16.6834 5.90237 17.3166 6.29289 17.7071C6.68342 18.0976 7.31658 18.0976 7.70711 17.7071L16 9.41421V17C16 17.5523 16.4477 18 17 18C17.5523 18 18 17.5523 18 17V7.00069C18 6.99969 18 6.998 18 6.997C17.9996 6.8625 17.9727 6.73425 17.9241 6.61722Z"
      fill="white"
    />
  </svg>
)
export default SendIcon
