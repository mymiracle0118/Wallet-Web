import { ILoaderProps } from '@portal/shared/utils/types'
import classnames from 'classnames'

export const Loader = ({ className, size, variant }: ILoaderProps) => {
  return variant ? (
    <div
      className={classnames(
        className,
        'animate-pulse bg-custom-black dark:bg-custom-white',
        variant === 'rectangle' ? 'w-full h-6 rounded-md' : '',
        variant === 'text' ? 'w-full h-4 rounded-md' : '',
        variant === 'rounded' ? 'h-5 w-5 rounded-full' : ''
      )}
    />
  ) : (
    <svg
      className={classnames(
        'animate-spin -ml-1 mr-3 h-5 w-5 text-white',
        size ? `h-[${size as number}px] w-[${size as number}px]` : ''
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}
