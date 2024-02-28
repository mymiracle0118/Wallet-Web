import React from 'react'
import { IIconProps } from '@portal/shared/utils/types'

const CheckIcon = ({ className }: IIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.7475 2.58579C15.5286 3.36683 15.5286 4.63316 14.7475 5.41421L7.41417 12.7475C6.63312 13.5286 5.36679 13.5286 4.58575 12.7475L1.25241 9.41421C0.471364 8.63316 0.471364 7.36683 1.25241 6.58579C2.03346 5.80474 3.29979 5.80474 4.08084 6.58579L5.99996 8.50491L11.9191 2.58579C12.7001 1.80474 13.9665 1.80474 14.7475 2.58579Z"
      fill="white"
    />
  </svg>
)

export default CheckIcon
