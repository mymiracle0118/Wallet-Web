import React from 'react'
import Header from './Header'
import Footer from './Footer'

export type HomeNavSelection = 'home' | 'exchange' | 'credit' | 'settings'

interface HomeWalletProps extends ComponentProps {
  title?: string
  isConnected?: boolean
  noHeader?: boolean
  noBackground?: boolean
  showAccounts?: boolean
}

const WalletLayout = ({
  title,
  isConnected,
  children,
  noHeader,
  noBackground,
  showAccounts = true,
}: HomeWalletProps) => {
  return (
    <div
      className="h-[37.5rem] relative overflow-hidden rounded-xl flex flex-col bg-cover bg-center"
      style={{
        background: `${
          noBackground ? '#2C2D3B' : '#2C2D3B url(./images/backgrounds/onboarding-bg.svg) no-repeat center center'
        }`,
      }}
    >
      {!noHeader && <Header title={title} isConnected={isConnected} showAccounts={showAccounts} />}
      <div className="flex-1 overflow-scroll">{children}</div>
      <Footer />
    </div>
  )
}

export default WalletLayout
