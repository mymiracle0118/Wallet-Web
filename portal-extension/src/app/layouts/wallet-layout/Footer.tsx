import classnames from 'classnames'
import { createLocationState, useNavigate } from 'lib/woozie'
import { FC, useCallback, useState } from 'react'

import { Button, Tooltip } from '@nextui-org/react'
import { SettingsIcon, WalletIcon } from '@src/app/components/Icons' //SwapIcon

const Footer: FC = () => {
  const { navigate } = useNavigate()
  const { pathname } = createLocationState()
  const [isShowing, setIsShowing] = useState<string>('')

  const getColor = useCallback(
    (value: string) => {
      const activeColor = 'fill-custom-white dark:fill-custom-white'
      const inactiveColor = 'fill-footer-light-inactive dark:fill-footer-dark-inactive'
      return (pathname?.includes(value) ? activeColor : inactiveColor) as string
    },
    [pathname]
  )

  const footerItems = [
    {
      path: '/',
      hoverText: 'Wallet',
      menuIcon: <WalletIcon hover={isShowing === '/'} className={classnames('text-4xl ', getColor('/'))} />,
    },
    // {
    //   path: '/swap',
    //   hoverText: 'Swap Token',
    //   menuIcon: <SwapIcon hover={isShowing === '/swap'} className={classnames('text-[2rem]', getColor('/swap'))} />,
    // },
    {
      path: '/settings',
      hoverText: 'Settings',
      menuIcon: (
        <SettingsIcon hover={isShowing === '/settings'} className={classnames('text-4xl', getColor('/settings'))} />
      ),
    },
  ]

  return (
    <div className="bg-surface-light dark:bg-surface-dark h-12 flex justify-between shadow-footer border-t-1 border-solid border-custom-grey40">
      {footerItems.map((item) => (
        <Tooltip content={item.hoverText} key={item.path} color="foreground" offset={-1}>
          <Button
            isIconOnly
            radius="none"
            className="w-full h-full z-50"
            data-test-id={item.path}
            variant="light"
            onClick={() => {
              navigate(item.path)
            }}
            onMouseEnter={() => setIsShowing(item.path)}
            onMouseLeave={() => setIsShowing('')}
          >
            {item.menuIcon}
          </Button>
        </Tooltip>
      ))}
    </div>
  )
}

export default Footer
