import { IIconProps } from '@portal/shared/utils/types'
import React from 'react'

const AngleDownIcon = ({ className }: IIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.52864 5.52858C3.78899 5.26823 4.2111 5.26823 4.47145 5.52858L8.00004 9.05717L11.5286 5.52858C11.789 5.26823 12.2111 5.26823 12.4714 5.52858C12.7318 5.78892 12.7318 6.21103 12.4714 6.47138L8.47145 10.4714C8.2111 10.7317 7.78899 10.7317 7.52864 10.4714L3.52864 6.47138C3.26829 6.21103 3.26829 5.78892 3.52864 5.52858Z"
      fill="white"
    />
  </svg>
)

export default AngleDownIcon
