import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { CustomTypography, Icon } from 'components'
import Logo from 'assets/logos/logo.svg'
import { useTranslation } from 'react-i18next'

export const PageLayout: FC<ComponentProps> = () => (
  <div className="relative h-full overflow-hidden bg-surface-dark">
    <Outlet />
  </div>
)

export const ExtendedLayout: FC = () => {
  const { t } = useTranslation()
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center"
      style={{
        background: '#000000 url(/images/backgrounds/extended-view-bg.svg) center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-8">
          <div className="text-[4rem] h-16">
            <Icon icon={<Logo />} size="inherit" />
          </div>
          <CustomTypography variant="h1" fontSize={44} className="font-black">
            {t('Onboarding.shuttle')}
          </CustomTypography>
        </div>
        <div className="pt-8 pb-4 flex flex-col flex-grow-1 max-w-[20.5rem] min-h-[17.5rem] rounded-xl bg-black">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
