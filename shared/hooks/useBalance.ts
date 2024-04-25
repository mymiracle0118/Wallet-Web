import { useQuery } from '@tanstack/react-query'
// import { BigNumber } from 'ethers'
import { useEffect, useMemo } from 'react'

import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { NetworkToken } from '../utils/types'
import { useStore } from './useStore'

type BalanceResponse = {
  balance: number
  balanceFormatted: number
  isLoading: boolean
}
const { updateTokenBalance } = useStore.getState()
export const useBalance = (token: NetworkToken, hideBalance?: boolean): BalanceResponse => {
  let balance: number, balanceFormatted: number
  if (hideBalance || !token) {
    return {
      balance: 0,
      balanceFormatted: 0,
      isLoading: false,
    }
  }
  const networkFactory = NetworkFactory.selectByNetworkId(token.shortName)
  if (!networkFactory) {
    return {
      balance: 0,
      balanceFormatted: 0,
      isLoading: false,
    }
  }

  const walletAddress = token.address
  const { data, isLoading } = useQuery(
    ['asset-balance', token.networkName, walletAddress, token.shortName],
    () => networkFactory.getTokenBalance(walletAddress as string, token),
    {
      refetchInterval: 10000,
      staleTime: 5000,
    }
  )
  balance = useMemo(() => {
    return data || 0 // BigNumber.from(0)
  }, [data])
  balanceFormatted = useMemo(() => networkFactory.getBalanceFormattedValue(data), [data]) as number
  useEffect(() => {
    updateTokenBalance(token.shortName, Number(balance), balanceFormatted)
  }, [balance, balanceFormatted])

  return {
    balance,
    balanceFormatted,
    isLoading,
  }
}
