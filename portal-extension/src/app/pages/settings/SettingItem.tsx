import { ISettingItemProps } from '@portal/shared/utils/types'
import { CustomTypography } from 'components'

const SettingItem = ({ title, subTitle, endAndorment, onClick, dataAid }: ISettingItemProps) => (
  <div
    className="flex items-center justify-between min-h-[3.5rem] max-h-[4.5rem] hover:bg-custom-white10 px-4 first:hover:rounded-t-lg last:hover:rounded-b-lg cursor-pointer py-2"
    onClick={onClick}
  >
    <div className="w-3/4">
      <CustomTypography dataAid={dataAid} variant="subtitle" className="text-custom-white">
        {title}
      </CustomTypography>
      {subTitle && (
        <CustomTypography dataAid={dataAid} type="secondary" variant="body">
          {subTitle}
        </CustomTypography>
      )}
    </div>
    {endAndorment}
  </div>
)

export default SettingItem
