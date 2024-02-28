import React from 'react'
import classnames from 'classnames'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { Icon, CustomTypography } from 'components'
import { createLocationState, useNavigate } from 'lib/woozie'
import DefaultAvatar from 'assets/logos/logo.svg'
import { IHeaderProps } from '@portal/shared/utils/types'

const Header = ({ title, isConnected, showAccounts = true }: IHeaderProps) => {
  const { avatar } = useWallet()
  const { navigate } = useNavigate()
  const { pathname } = createLocationState()
  const textColor =
    pathname.includes('settings') || pathname.includes('wallet-connect')
      ? 'text-custom-grey100 dark:text-custom-white80'
      : 'text-custom-white80'

  return (
    <div
      className="px-4 h-[3.75rem] flex items-center bg-transparent"
      style={{
        justifyContent: title || !isConnected ? 'space-between' : 'flex-end',
      }}
    >
      {!isConnected && (
        <button type="button" className="flex items-center gap-2" onClick={() => navigate('/account/list')}>
          <div className="w-1 h-1 rounded-full bg-[#30D158] p-1" />
          <CustomTypography variant="subtitle" color={textColor}>
            Connected
          </CustomTypography>
        </button>
      )}

      {title && (
        <CustomTypography variant="h3" color={textColor}>
          {title}
        </CustomTypography>
      )}

      {showAccounts && (
        <button
          type="button"
          className={classnames(
            'profile-btn flex items-center dark:text-custom-white font-bold hover:bg-custom-grey10 dark:hover:bg-custom-white10 p-1 pr-0 rounded-full',
            pathname.includes('settings') ? 'text-custom-black' : 'text-custom-white'
          )}
          onClick={() => navigate('/account')}
        >
          {avatar ? (
            <img src={avatar} alt="user-avatar" className=" w-8 h-8 rounded-full" />
          ) : (
            <Icon icon={<DefaultAvatar />} size="large" />
          )}
        </button>
      )}
    </div>
  )
}

export default Header
