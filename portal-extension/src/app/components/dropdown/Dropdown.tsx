import { Menu, Transition } from '@headlessui/react'
import { Avatar } from '@nextui-org/react'
import { IDropdownItemProps } from '@portal/shared/utils/types'
import classnames from 'classnames'
import { Fragment, ReactElement } from 'react'
import { CheckRoundedGreyIcon, CheckRoundedPrimaryIcon } from '../Icons'

interface DropdownProps extends ComponentProps {
  anchor: ReactElement
  classDynamicChild?: string
  classDynamicMenu?: string
}

export const DropdownItem = ({ text, active, onSelect, icon, isImg }: IDropdownItemProps) => (
  <div
    className={classnames(
      'py-1 hover:bg-custom-grey10 cursor-pointer bg-surface-dark',
      active ? '!bg-custom-white10' : ''
    )}
  >
    <Menu.Item>
      <button
        type="button"
        className={classnames(
          'w-full flex items-center gap-4 block px-4 py-2 text-sm font-extrabold  hover:text-custom-white relative',
          active ? 'text-custom-white' : 'text-custom-white'
        )}
        onClick={() => onSelect && onSelect(text)}
      >
        {icon && !isImg && (
          <div>
            <Avatar src={icon} alt="icon" className="h-7 w-7 rounded-full overflow-hidden bg-custom-white" />
            {active && (
              <div className="absolute rounded-full top-3">
                <CheckRoundedPrimaryIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        )}

        {icon && typeof icon === 'string' && isImg && (
          <div>
            <Avatar alt="icon" src={icon} className="h-7 w-7 rounded-full overflow-hidden bg-custom-white" />
            <div className="absolute rounded-full right-4 top-3">
              {active ? <CheckRoundedPrimaryIcon className="w-4 h-4" /> : <CheckRoundedGreyIcon className="w-4 h-4" />}
            </div>
          </div>
        )}

        {text}
      </button>
    </Menu.Item>
  </div>
)

export const Dropdown = ({ anchor, children, classDynamicMenu = '', classDynamicChild = '' }: DropdownProps) => {
  return (
    <Menu as="div" className={`relative inline-block text-left ${classDynamicMenu}`}>
      <div>{anchor}</div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`bg-[#2C2D3C] z-[2] origin-top-right absolute right-0 mt-2 rounded-md shadow-lg focus:outline-none ${classDynamicChild}`}
        >
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
