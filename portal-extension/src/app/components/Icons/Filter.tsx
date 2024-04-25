import { IIconProps } from '@portal/shared/utils/types'

const FilterIcon = ({ className }: IIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="rgba(255,255,255,0.4)"
    className={className}
  >
    <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"></path>
  </svg>
)

export default FilterIcon
