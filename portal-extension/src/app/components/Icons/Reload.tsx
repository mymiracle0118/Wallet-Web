import { IIconProps } from '@portal/shared/utils/types'

const ReloadIcon = ({ className }: IIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M20 6V11H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 18V13H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M5.82545 9.66605C6.1943 8.55104 6.82119 7.55414 7.64761 6.76839C8.47404 5.98264 9.47307 5.43365 10.5515 5.17263C11.6299 4.91161 12.7525 4.94708 13.8147 5.27572C14.8768 5.60437 15.8438 6.21548 16.6255 7.05203L20 10.444M4 13.556L7.37455 16.948C8.15618 17.7845 9.12318 18.3956 10.1853 18.7243C11.2475 19.0529 12.3701 19.0884 13.4485 18.8274C14.5269 18.5664 15.526 18.0174 16.3524 17.2316C17.1788 16.4459 17.8057 15.449 18.1745 14.3339"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default ReloadIcon
