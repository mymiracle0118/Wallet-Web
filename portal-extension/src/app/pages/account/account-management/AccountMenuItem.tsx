import { IAccountMenuItemProps } from '@portal/shared/utils/types'
import { COLORS, CustomTypography, Icon } from 'app/components'

const AccountMenuItem = ({ icon, item, onClick }: IAccountMenuItemProps) => (
  <div
    onClick={onClick}
    className="px-4 flex items-center border-b-1 border-solid h-14 border-custom-white10 hover:bg-custom-white10"
  >
    <div
      className="cursor-pointer rounded-xl mx-auto mb-4 p-4 text-[4rem] h-16 w-64"
      style={{ background: COLORS.background.gradientLogoBg }}
    >
      <Icon icon={icon} size="large" />
    </div>
    <div className="flex w-full ">
      <CustomTypography className="flex-1 ml-8" variant="subtitle">
        {item}
      </CustomTypography>
    </div>
  </div>
)

export default AccountMenuItem
