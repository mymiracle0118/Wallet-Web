import React from 'react'
import { IIconProps } from '@portal/shared/utils/types'

const EditIcon = ({ className }: IIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.2929 1.29289C13.6834 0.902369 14.3166 0.902369 14.7071 1.29289L18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L7.70711 17.7071C7.51957 17.8946 7.26522 18 7 18H3C2.44772 18 2 17.5523 2 17V13C2 12.7348 2.10536 12.4804 2.29289 12.2929L13.2929 1.29289ZM4 13.4142V16H6.58579L16.5858 6L14 3.41421L4 13.4142Z"
      fill="white"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 22C2 21.4477 2.44772 21 3 21H21C21.5523 21 22 21.4477 22 22C22 22.5523 21.5523 23 21 23H3C2.44772 23 2 22.5523 2 22Z"
      fill="white"
    />
  </svg>
)
export default EditIcon
