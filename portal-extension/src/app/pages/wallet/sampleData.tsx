import { ITokenBalanceProps } from '@portal/shared/utils/types'
import BNB from 'assets/coins/BNB.svg'
import BSC from 'assets/coins/BSC.svg'
import BTC from 'assets/coins/BTC.svg'
import DAI from 'assets/coins/DAI.svg'
import ETH from 'assets/coins/ETH.svg'
import FTM from 'assets/coins/FTM.svg'
import POLY from 'assets/coins/POLY.svg'
import SOL from 'assets/coins/SOL.svg'
import SUP from 'assets/coins/SUP.svg'
import SUSHI from 'assets/coins/SUSHI.svg'
import USDC from 'assets/coins/USDC.svg'
import USDT from 'assets/coins/USDT.svg'
import WETH from 'assets/coins/WETH.svg'

const sampleData: Array<ITokenBalanceProps> = [
  {
    token: 'Bitcoin',
    acronym: 'BTC',
    balance: '$82,500',
    percentage: 53,
    image: <BTC />,
  },
  {
    token: 'Ethereum',
    acronym: 'ETH',
    balance: '$75,500',
    percentage: 40,
    image: <ETH />,
  },
  {
    token: 'USD Coin',
    acronym: 'USDC',
    balance: '$32,500',
    percentage: 35,
    image: <USDC />,
  },
  {
    token: 'Tether',
    acronym: 'USDT',
    balance: '$16,250',
    percentage: 20,
    image: <USDT />,
  },
  {
    token: 'Sushi',
    acronym: 'SUSHI',
    balance: '$10,000',
    percentage: 15,
    image: <SUSHI />,
  },
  {
    token: 'BNB',
    acronym: 'BNB',
    balance: '$8,250',
    percentage: 12,
    image: <BNB />,
  },
  {
    token: 'Dai',
    acronym: 'DAI',
    balance: '$5,000',
    percentage: 10,
    image: <DAI />,
  },
  {
    token: 'Weth',
    acronym: 'WETH',
    balance: '$3,500',
    percentage: 5,
    image: <WETH />,
  },
]

export const networksData: Array<{
  token: string
  acronym?: string
  balance: string
  percentage: number
  image?: Element
}> = [
  {
    acronym: 'Ethereum',
    balance: '$82,500',
    percentage: 53,
    image: <ETH />,
  },
  {
    acronym: 'Bitcoin',
    balance: '$82,500',
    percentage: 43,
    image: <BTC />,
  },
  {
    acronym: 'BSC',
    balance: '$82,500',
    percentage: 33,
    image: <BSC />,
  },
  {
    acronym: 'SUPRA',
    balance: '$82,500',
    percentage: 29,
    image: <SUP />,
  },
  {
    acronym: 'SOLANA',
    balance: '$82,500',
    percentage: 25,
    image: <SOL />,
  },
  {
    acronym: 'POLYGON',
    balance: '$82,500',
    percentage: 7,
    image: <POLY />,
  },
  {
    acronym: 'FANTOM',
    balance: '$82,500',
    percentage: 2,
    image: <FTM />,
  },
]

export default sampleData
