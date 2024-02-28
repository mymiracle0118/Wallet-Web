import axios from 'axios'
import { TRANSACTION } from '@portal/portal-extension/src/utils/constants'

export type PriceData = {
  [id: string]: { usd: number; usd_24h_change: number }
}

const COINGECK_URL = 'https://api.coingecko.com/api/v3/'
const COINGECK_CHART_URL = 'https://www.coingecko.com/en/coins/'

export const getSimplePrice = async (ids: string): Promise<PriceData> => {
  const query = `ids=${ids},${new Date().getTime()}&vs_currencies=usd&include_24hr_change=true`
  const { data } = await axios.get(`${COINGECK_URL}simple/price?x_cg_demo_api_key=&${query}`)
  if (ids.includes('SUPRA')) {
    data.SUPRA = { usd: TRANSACTION.SUPRA_TOKEN_PRICE, usd_24h_change: 0 }
  }
  return data
}

export type TokenDataProps = {
  id: string
  chain: string
  name: string
  contractAddress: string
  image: string
  acronym: string
  decimal: number
  percentage: number
  symbol: string
}

export type TokenInfo = {
  id: string
  name: string
  image: string
  symbol: string
}

export const getTokenData = async (address: string): Promise<TokenDataProps> => {
  try {
    const { data } = await axios.get(`${COINGECK_URL}coins/ethereum/contract/${address}?x_cg_demo_api_key`)

    return {
      id: data.id,
      chain: data.asset_platform_id,
      name: data.name,
      contractAddress: data.contract_address,
      image: data.image.large,
      acronym: String(data.symbol).toLocaleUpperCase(),
      decimal: 18,
      percentage: 0,
      symbol: String(data.symbol).toLocaleUpperCase(),
    }
  } catch (err) {
    throw err.response.data.error ? err.response.data.error : err.response.data.status.error_message
  }
}

export const getTokenInfoBySymbol = async (symbol: string): Promise<TokenInfo | null> => {
  try {
    const { data } = await axios.get(`${COINGECK_URL}coins/markets?x_cg_demo_api_key`, {
      params: {
        vs_currency: 'usd',
        ids: symbol,
      },
    })
    if (data && data.length > 0) {
      const networkInfo: TokenInfo = {
        id: data[0].id as string,
        name: data[0].name as string,
        image: data[0].image as string,
        symbol: data[0].symbol as string,
      }
      return networkInfo
    }
    return null
  } catch (err) {
    return null
  }
}

export const getTokenHistory = async (tokenId: string, date: string): Promise<number> => {
  const { data } = await axios.get(`${COINGECK_URL}coins/${tokenId}/history?date=${date}`)
  return data['market_data']['current_price']['usd']
}

export const getChartUrl = (coinName: string) => `${COINGECK_CHART_URL}${coinName}`
