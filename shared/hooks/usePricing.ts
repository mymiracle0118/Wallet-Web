import { USDollar } from '@portal/portal-extension/src/utils/constants'
import { ethersCommify } from '@portal/portal-extension/src/utils/ethersCommify'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { getSimplePrice } from '@portal/shared/services/coingecko'
import { NetworkToken } from '../utils/types'
import { useStore } from './useStore'

export const usePricing = (asset?: NetworkToken) => {
  const { currentTokenArrayWithBalance } = useStore()
  const { data } = useQuery(
    ['asset-pricing'],
    () =>
      getSimplePrice(
        [...new Set(Object.values(currentTokenArrayWithBalance).map((a) => a.coingeckoTokenId))].join(',')
      ),
    {
      refetchInterval: 40000,
      staleTime: 30000,
    }
  )

  const getMarketPrice = React.useCallback(
    (assetId: string) => {
      if (data && data[assetId]) {
        const total = Math.round((data[assetId].usd + Number.EPSILON) * 100) / 100
        return ethersCommify(total)
      }

      return '0'
    },
    [data]
  )

  const getMarket24HourChange = React.useCallback(
    (assetId: string) => {
      if (data && data[assetId]) {
        return data[assetId].usd_24h_change
      }

      return 0
    },
    [data]
  )

  const getAssetValue = React.useCallback(
    (assetId: string, units: number) => {
      if (data && data[assetId]) {
        const value = Math.round((data[assetId].usd * units + Number.EPSILON) * 100) / 100
        return Math.max(value, 0)
      }

      return 0
    },
    [data]
  )

  const getAssetValueFormatted = React.useCallback(
    (assetId: string, units: number) => {
      return `$${getAssetValue(assetId, units)}`
    },
    [data]
  )
  const getAssetGasValueFormatted = React.useCallback(
    (assetId: string, units: number) => {
      let gasTotal = '0'
      if (data && data[assetId] && asset) {
        gasTotal = (data[assetId].usd * units).toFixed(parseInt(<string>asset?.decimal || '8'))
      }
      return `$${gasTotal}`
    },
    [data]
  )

  const getGasValue = React.useCallback(
    (assetId: string, units: number) => {
      if (data && data[assetId]) {
        const convertGasToCoinValueAndCurrency = USDollar(15).format(
          Number(units) * Math.pow(10, asset?.shortName === 'APT' ? -8 : -9) * data[assetId].usd
        )
        return convertGasToCoinValueAndCurrency
      }
      return 0
    },
    [data]
  )

  const getGasValueFormatted = React.useCallback(
    (assetId: string, units: number) => {
      if (data && data[assetId] && assetId !== '') {
        const value = Number((data[assetId].usd * units + Number.EPSILON).toFixed(8))
        return value
      }
      return 0
    },
    [data]
  )

  return {
    getMarketPrice,
    getMarket24HourChange,
    getAssetValue,
    getAssetValueFormatted,
    getAssetGasValueFormatted,
    getGasValue,
    getGasValueFormatted,
  }
}
