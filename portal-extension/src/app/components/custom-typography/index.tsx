import React, { FC, LegacyRef, CSSProperties } from 'react'
import classNames from 'classnames'

type fontWeightTypes = 'light' | 'regular' | 'medium' | 'semi-bold' | 'bold' | 'extra-bold' | 'black'

export interface CustomTypographyProps extends ComponentProps {
  ref?: LegacyRef
  fontWeight?: fontWeightTypes
  lineClamp?: number
  ellipsis?: boolean
  capitalize?: boolean
  color?: string
  type?: 'secondary' | string
  fontSize?: number
  variant?: string
  style?: CSSProperties
  dataAid?: string
}

const translateFontWeight = (weight: fontWeightTypes) => {
  switch (weight) {
    case 'light':
      return 'font-light'
    case 'regular':
      return 'font-normal'
    case 'medium':
      return 'font-medium'
    case 'semi-bold':
      return 'font-semibold'
    case 'bold':
      return 'font-bold'
    case 'extra-bold':
      return 'font-extrabold'
    case 'black':
      return 'font-black'
    default:
      return 'font-normal'
  }
}

const translateVariant = (variant: string) => {
  switch (variant) {
    case 'h1':
      return 'text-[1.75rem] leading-[2rem] font-extrabold'
    case 'h2':
      return 'text-[1.75rem] leading-[2rem] font-light'
    case 'h3':
      return 'text-[1.5rem] leading-[2rem] font-extrabold'
    case 'h4':
      return 'text-[1.125rem] leading-[1.25rem] font-extrabold'
    case 'body':
      return 'text-[0.875rem] leading-[1.25rem] font-regular'
    case 'subtitle':
      return 'text-[0.875rem] leading-[1.25rem] font-extrabold'
    case 'small':
      return 'text-[0.75rem] leading-[1rem] font-normal'
  }
}

const TailwindTypography: FC<CustomTypographyProps> = (props: CustomTypographyProps, ref) => {
  const {
    variant,
    children,
    color,
    lineClamp = 3,
    ellipsis = false,
    capitalize = false,
    fontWeight,
    type,
    fontSize,
    className,
    style,
  } = props
  let getColor = color ? color : 'text-custom-black dark:text-custom-white'
  if (type === 'secondary') {
    getColor = 'dark:text-custom-white40'
  }

  return (
    <div
      ref={ref}
      className={classNames(
        className,
        getColor,
        variant ? translateVariant(variant) : '',
        capitalize ? 'uppercase' : '',
        ellipsis ? 'truncate' : '',
        fontWeight ? translateFontWeight(fontWeight) : '',
        fontSize ? `text-[${fontSize}px]` : ''
      )}
      data-aid={props.dataAid}
      style={{
        WebkitLineClamp: `${lineClamp}`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export const CustomTypography: FC<CustomTypographyProps> = React.forwardRef(TailwindTypography)
