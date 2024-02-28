import React from 'react'
import { IIconProps } from '@portal/shared/utils/types'

const ChevronRightIcon = ({ className }: IIconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M9 18L15 12L9 6" stroke="inherit" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
export default ChevronRightIcon
