/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { FC } from 'react'
import { Icon } from 'app/components'
import Logo from 'assets/logos/logo_64.svg'
import { useAppEnv } from '@src/env'

interface OnboardingLayoutsProps extends ComponentProps {
  disableLogo?: boolean
  className?: string
}

const OnboardingLayout: FC<OnboardingLayoutsProps> = ({ disableLogo, children, className }) => {
  const appEnv = useAppEnv()
  return (
    <div className="relative flex flex-col h-full justify-start">
      <div
        className={`absolute w-full h-full z-[0] bg-cover ${appEnv.fullPage ? 'rounded-xl' : ''}`}
        style={{ background: '#2C2D3C url(/images/backgrounds/onboarding-bg.svg) no-repeat center' }}
      />
      <div className={`flex flex-col min-h-[26rem] rounded-xl p-8 bg-surface-dark z-10 ${className}`}>
        {!disableLogo && (
          <div className="mx-auto -mt-[4.5rem] w-20 text-[4rem] rounded-[50%] p-2 flex justify-center">
            <Icon icon={<Logo />} size="inherit" />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
export default OnboardingLayout
