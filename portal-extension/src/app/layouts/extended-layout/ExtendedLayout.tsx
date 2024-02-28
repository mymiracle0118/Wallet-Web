import React, { FC } from 'react'
import { Icon } from 'app/components'
import Logo from 'assets/logos/logo.svg'

const ExtendedLayout: FC<ComponentProps> = ({ children }) => {
  const { href } = window.location
  const parts = href.split('/')
  const lastPart = parts[parts.length - 1]

  const bgImage = chrome.runtime.getURL('/images/backgrounds/extended-view-bg.svg')
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' }}
    >
      <div className="flex flex-col gap-8">
        <div className="gap-4 flex items-center justify-center">
          <div className="text-[4.375rem] h-16">
            <Icon icon={<Logo />} size="inherit" />
          </div>
          <h1 className="tracking-[0.45rem] text-4xl font-bold">SHUTTLE</h1>
        </div>
        <div
          className={`${
            lastPart === 'recovery-video-app'
              ? 'border border-solid border-custom-white40 bg-transparent'
              : 'bg-surface-dark'
          } w-[24.5rem] flex flex-col rounded-xl max-w-[24.5rem] bg-surface-dark min-h-[33.125rem] max-h-[37.5rem]`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default ExtendedLayout
