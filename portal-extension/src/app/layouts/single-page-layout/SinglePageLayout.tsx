import React, { FC } from 'react'
import classnames from 'classnames'
import { goBack, useNavigate } from 'lib/woozie'
import { CustomTypography, Icon } from 'components'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useWalletConnect } from '@portal/shared/hooks/useWalletConnect'
import ArrowLeft from 'assets/icons/arrow-left.svg'
import ChevronRight from 'assets/icons/chevron-right.svg'
import { Button, Tooltip } from '@nextui-org/react'
import DefaultAvatar from 'assets/logos/logo.svg'
import { useTranslation } from 'react-i18next'
import { PlusIcon } from '@src/app/components/Icons'

interface ISinglePageTitleLayoutProps extends ComponentProps {
  title?: string | React.ReactNode
  showMenu?: boolean
  showWalletConnectMenu?: boolean
  dataAid?: string
  className?: string
  disableBack?: boolean
  addNetwork?: boolean
  paddingClass?: boolean
  bgOnboarding?: boolean
  BorderBottom?: boolean
  topPanel?: boolean
}

const SinglePageLayout: FC<ISinglePageTitleLayoutProps> = ({
  title,
  showMenu,
  showWalletConnectMenu,
  children,
  dataAid,
  className = '',
  bgOnboarding = false,
  disableBack = false,
  addNetwork = false,
  paddingClass = true,
  BorderBottom = true,
  topPanel = true,
}) => {
  const { session } = useWalletConnect()
  const { avatar } = useWallet()
  const { accounts } = useSettings()
  const { navigate } = useNavigate()
  const { t } = useTranslation()

  const renderWalletConnectMenu = () => {
    const connectedAccounts = session?.accounts
    const account = connectedAccounts?.length ? accounts[connectedAccounts[0]] : undefined
    return (
      <button
        type="button"
        className="profile-btn flex items-center mr-1 text-inherit font-bold hover:bg-custom-grey10 dark:hover:bg-custom-white10 p-3 rounded-md"
        onClick={() => navigate('/account/list')}
      >
        {`@${account?.username ? account.username : ''}`}
        <ChevronRight className="stroke-custom-black dark:stroke-custom-white" />
      </button>
    )
  }

  return (
    <div
      className="flex flex-col h-[600px] dark:text-custom-white text-custom-black rounded-xl"
      style={{
        background: `${
          bgOnboarding
            ? '#2C2D3C url(/images/backgrounds/onboarding-bg.svg) no-repeat center'
            : 'dark:bg-surface-dark bg-custom-white'
        }`,
      }}
    >
      <div
        className={`${BorderBottom ? 'border-b border-solid border-custom-white10' : '!border-none !border-0'} ${
          topPanel ? 'h-[4.356rem]' : 'h-0'
        } flex flex-row relative justify-between items-center px-4`}
      >
        {!disableBack && (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={goBack}
            className={classnames(showMenu ? '' : 'absolute')}
          >
            <ArrowLeft className="text-lg stroke-custom-black dark:stroke-custom-white" />
          </Button>
        )}

        {title && (
          <div className="flex-1 text-center">
            <CustomTypography dataAid={dataAid} variant="subtitle">
              {title}
            </CustomTypography>
          </div>
        )}

        {showMenu && (
          <button
            type="button"
            className="profile-btn flex items-center mr-3 text-inherit font-bold hover:bg-custom-grey10 dark:hover:bg-custom-white10 p-1 rounded-full"
            onClick={() => navigate('/account')}
          >
            {avatar ? (
              <img src={avatar} alt="user-avatar" className=" w-8 h-8 rounded-full" />
            ) : (
              <Icon icon={<DefaultAvatar />} size="large" />
            )}
          </button>
        )}

        {showWalletConnectMenu && renderWalletConnectMenu()}
        {addNetwork && (
          <Tooltip content={t('Network.addNetwork')} placement="left" showArrow color="foreground">
            <Button isIconOnly size="sm" variant="light" onClick={() => navigate('/network/add')}>
              <PlusIcon />
            </Button>
          </Tooltip>
        )}
      </div>
      <div className={`h-full overflow-auto ${paddingClass ? 'p-4' : 'px-0 rounded-xl'} ${className}`}>{children}</div>
    </div>
  )
}

export default SinglePageLayout
