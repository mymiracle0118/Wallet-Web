import React from 'react'

import ETH from 'assets/coins/ETH.svg'
import USDC from 'assets/coins/USDC.svg'
import SUSHI from 'assets/coins/SUSHI.svg'
import UNI from 'assets/coins/SUP.svg'
import USDT from 'assets/coins/USDT.svg'
import WETH from 'assets/coins/WETH.svg'
import SUI from 'assets/coins/SUI.svg'
import APTOS from 'assets/coins/APTOS.svg'
import SOL from 'assets/coins/SOL.svg'
import SUP from 'assets/coins/SUP.svg'

export const tokenImage = (symbol: string) => {
  switch (symbol) {
    case 'ETH':
      return <ETH />
    case 'USDC':
      return <USDC />
    case 'SUSHI':
      return <SUSHI />
    case 'UNI':
      return <UNI />
    case 'WETH':
      return <WETH />
    case 'USDT':
      return <USDT />
    case 'SUI':
      return <SUI />
    case 'APTOS':
      return <APTOS />
    case 'SOL':
      return <SOL />
    case 'SUPRA':
      return <SUP />
    default:
      return <ETH />
  }
}
