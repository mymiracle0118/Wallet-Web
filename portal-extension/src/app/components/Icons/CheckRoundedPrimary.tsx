import { IIconProps } from '@portal/shared/utils/types'

const CheckRoundedPrimaryIcon = ({ className }: IIconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="12" fill="url(#paint0_linear_1_10)" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.7475 6.58579C19.5286 7.36683 19.5286 8.63316 18.7475 9.41421L11.4142 16.7475C10.6332 17.5286 9.36683 17.5286 8.58579 16.7475L5.25245 13.4142C4.4714 12.6332 4.4714 11.3668 5.25245 10.5858C6.0335 9.80474 7.29983 9.80474 8.08088 10.5858L10 12.5049L15.9191 6.58579C16.7002 5.80474 17.9665 5.80474 18.7475 6.58579Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1_10"
        x1="26.3361"
        y1="16.1802"
        x2="9.75386"
        y2="-2.75946"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.166667" stopColor="#E43FFF" />
        <stop offset="0.99" stopColor="#DA8FFF" />
      </linearGradient>
    </defs>
  </svg>
)

export default CheckRoundedPrimaryIcon
