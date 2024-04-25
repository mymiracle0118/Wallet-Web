/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { ICustomThumbnail } from '@portal/shared/utils/types'
import { twMerge } from 'tailwind-merge'

const CustomThumbnail = ({ thumbName, className }: ICustomThumbnail) => {
  const stringToColor = (string: string): string => {
    let hash = 0
    let i

    /* eslint-disable no-bitwise */
    for (i = 0; i < string?.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 4)) & 0xff
      color += `00${value.toString(16)}`.substr(-2)
    }
    /* eslint-enable no-bitwise */

    return color
  }

  return (
    <div
      className={twMerge(
        `w-9 h-9 uppercase rounded-full text-custom-white flex items-center justify-center font-extrabold text-sm mx-auto ${className}`
      )}
      style={{ backgroundColor: `${stringToColor(thumbName as string)}` }}
    >
      {thumbName?.slice(0, 1)}
    </div>
  )
}

export default CustomThumbnail
