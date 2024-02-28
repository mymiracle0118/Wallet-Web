import React from 'react'
import { IIconProps } from '@portal/shared/utils/types'

const ArrowDownIcon = ({ className }: IIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.5 4C13.0523 4 13.5 4.44772 13.5 5V19C13.5 19.5523 13.0523 20 12.5 20C11.9477 20 11.5 19.5523 11.5 19V5C11.5 4.44772 11.9477 4 12.5 4Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.79289 11.2929C5.18342 10.9024 5.81658 10.9024 6.20711 11.2929L12.5 17.5858L18.7929 11.2929C19.1834 10.9024 19.8166 10.9024 20.2071 11.2929C20.5976 11.6834 20.5976 12.3166 20.2071 12.7071L13.2071 19.7071C12.8166 20.0976 12.1834 20.0976 11.7929 19.7071L4.79289 12.7071C4.40237 12.3166 4.40237 11.6834 4.79289 11.2929Z"
      fill="white"
    />
  </svg>
)
export default ArrowDownIcon
