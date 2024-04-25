import APTOS from 'assets/coins/APTOS.svg'
import ETH from 'assets/coins/ETH.svg'
import SOL from 'assets/coins/SOL.svg'
import SUI from 'assets/coins/SUI.svg'
import { default as SUP, default as UNI } from 'assets/coins/SUP.svg'
import SUSHI from 'assets/coins/SUSHI.svg'
import USDC from 'assets/coins/USDC.svg'
import USDT from 'assets/coins/USDT.svg'
import WETH from 'assets/coins/WETH.svg'

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
    case 'APT':
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
