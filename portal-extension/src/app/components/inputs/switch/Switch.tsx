/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Switch as HeadlessSwitch } from '@headlessui/react'
import { ISwitchProps } from '@portal/shared/utils/types'
import classNames from 'classnames'
import { CustomTypography } from 'components'

export const Switch = ({ labels, disabled = false, checked, onChange, id, dataAid }: ISwitchProps) =>
  !labels ? (
    <HeadlessSwitch
      data-aid={dataAid}
      data-testid={`switch-${id}`}
      id={id || ''}
      disabled={disabled}
      checked={checked}
      onChange={onChange}
      className={classNames(
        checked ? '!bg-gradient-primary !dark:bg-gradient-primary' : '!bg-custom-grey10 dark:!bg-custom-white40',
        'relative inline-flex h-8 w-14 items-center rounded-[22px] transition-colors'
      )}
    >
      <span
        className={`${
          checked ? 'translate-x-7' : 'translate-x-1'
        } inline-block h-6 w-6 rounded-[18px] bg-custom-white transform transition ease-in-out duration-200 shadow-md`}
      />
    </HeadlessSwitch>
  ) : (
    <HeadlessSwitch
      id={id || ''}
      disabled={disabled}
      checked={checked}
      onChange={onChange}
      data-testid={`switch-${id}`}
      className="rounded-3xl !bg-custom-white40 relative inline-flex h-8 w-[134px] items-center rounded-[22px] transition-colors"
    >
      <span
        className={`${
          checked ? 'translate-x-[72px] w-[58px]' : 'translate-x-[4px] w-16'
        } inline-block h-6 rounded-[18px] bg-custom-white transform transition ease-in-out duration-200 shadow-md`}
      />
      <div className="absolute w-full flex flex-row justify-around items-center ">
        <CustomTypography
          variant="h4"
          color={
            checked ? 'text-custom-white dark:text-custom-custom-black' : 'text-custom-black dark:text-custom-black'
          }
        >
          {labels[0]}
        </CustomTypography>
        <CustomTypography
          variant="h4"
          color={
            !checked ? 'text-custom-white dark:text-custom-custom-black' : 'text-custom-black dark:text-custom-black'
          }
        >
          {labels[1]}
        </CustomTypography>
      </div>
    </HeadlessSwitch>
  )
