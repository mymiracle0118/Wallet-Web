/* eslint-disable react/display-name */
import { IToolTipProps } from '@portal/shared/utils/types'
import classnames from 'classnames'
import { ForwardedRef, forwardRef } from 'react'

export const ToolTip = forwardRef(
  (
    { children, title, placement = 'top', containerClass = '', className = '' }: IToolTipProps,
    ref: ForwardedRef<HTMLDivElement>
  ): JSX.Element => {
    const classContainer = `w-max max-w-[18rem] absolute z-10 opacity-0 group-hover/tooltip:opacity-100 shadow-tooltip bg-custom-white text-custom-grey100 
    text-sm px-3 py-[0.3rem] rounded-[0.75rem]  flex items-center transition-all duration-150 pointer-events-none ${classnames(
      {
        'top-0 left-full ml-2': placement === 'right',
        'top-2 right-full mr-0': placement === 'left',
        'bottom-full left-[50%] -translate-x-[50%] -translate-y-0': placement === 'top',
        'top-full left-[50%] -translate-x-[50%] translate-y-0': placement === 'bottom',
        [containerClass]: containerClass !== '',
      }
    )}`

    return (
      <div className={`group/tooltip relative flex items-center ${className}`} ref={ref}>
        <div className={classContainer}>{title}</div>
        {children}
      </div>
    )
  }
)
