import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BigNumber } from 'ethers'

import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { NetworkToken } from '../utils/types'
import { useStore } from './useStore'

type BalanceResponse = {
  balance: BigNumber | number
  balanceFormatted: number
  isLoading: boolean
}
const { updateTokenBalance } = useStore.getState()
export const useBalance = (token: NetworkToken): BalanceResponse => {
  let balance, balanceFormatted

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
      refetchInterval: 60000,
      staleTime: 30000,
    }
  )

  balance = useMemo(() => {
    return data || BigNumber.from(0)
  }, [data])
  balanceFormatted = useMemo(() => networkFactory.getBalanceFormattedValue(data), [data]) as number

  useEffect(() => {
    // Update asset balance in wallet to keep running total
    if (balance && balanceFormatted) {
      updateTokenBalance(token.shortName, balance, balanceFormatted)
    }
  }, [balance, balanceFormatted])

  return {
    balance,
    balanceFormatted,
    isLoading,
  }
}
