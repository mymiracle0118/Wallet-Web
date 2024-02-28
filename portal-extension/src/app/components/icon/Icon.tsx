import React from 'react'
import classNames from 'classnames'

interface IIconProps extends ComponentProps {
  icon: React.ReactNode | Element
  size: 'small' | 'inherit' | 'large' | 'medium'
  strokeColor?: string
}

export const Icon = ({ className, icon, size, strokeColor }: IIconProps) => {
  const getFontSize = (fontSize: 'small' | 'inherit' | 'large' | 'medium' | 'extralarge') => {
    switch (fontSize) {
      case 'small':
        return 'text-[1.25rem]'
      case 'medium':
        return 'text-[1.5rem]'
      case 'large':
        return 'text-[2rem]'
      case 'extralarge':
        return 'text-[2.25rem]'
      default:
        return `text-[${fontSize}]]`
    }
  }

  const getColor = (color: string) => {
    switch (color) {
      case 'success':
        return 'stroke-feedback-positive'
      case 'negative':
        return 'stroke-feedback-negative'
      default:
        return `stroke-[${color}]`
    }
  }

  return (
    <svg
      style={{
        height: '1em',
        width: '1em',
      }}
      className={classNames(
        'inline-block select-none shrink-0',
        className ? className : '',
        strokeColor ? getColor(strokeColor) : 'fill-custom-black dark:fill-custom-white',
        size ? getFontSize(size) : ''
      )}
    >
      {icon}
    </svg>
  )
}
