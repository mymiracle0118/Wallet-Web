import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { getContractInterface } from '@portal/shared/utils/getContractInterface'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { Asset, GasOption, NetworkToken } from '@portal/shared/utils/types'

const getERC20GasLimit = async (asset: Asset, provider: any): Promise<number> => {
  if (asset.type === 'erc721') {
    return 100000
  }
  const contract = new ethers.Contract(asset.contractAddress!, getContractInterface(asset.type), provider)
  const deploymentData = contract.interface.encodeDeploy([])
  const estimatedGasLimit = await provider.estimateGas({ data: deploymentData })
  return Number(ethers.utils.formatUnits(estimatedGasLimit, 'wei'))
}

export const useGas = (asset: NetworkToken, option?: GasOption) => {
  const [gasLimit, setGasLimit] = useState(21000)
  const [gasOption, setGasOption] = useState(option || GasOption.Aggressive)
  const getNetwork = NetworkFactory.selectByNetworkId(asset.networkName)
  const provider = getNetwork.provider
  const { data: feeData } = useQuery(
    ['gas-fee-data', asset],
    () => {
      return getNetwork.getFeeData()
    },
    {
      staleTime: 15000,
      refetchInterval: 15000,
    }
  )

  const { data: gasLimitData } = useQuery(
    ['gas-limit-data', asset, provider],
    () => getERC20GasLimit(asset, provider),
    {
      enabled: asset.tokenContractAddress !== undefined,
      staleTime: 60 * 60000,
    }
  )

  useEffect(() => {
    if (gasLimitData) {
      setGasLimit(gasLimitData)
    }
  }, [gasLimitData])

  const maxFeePerGas = React.useMemo(() => {
    if (!feeData || feeData.gasPrice === null) {
      return ethers.utils.parseUnits('0', 'gwei')
    }

    let baseGas = parseFloat(ethers.utils.formatUnits(feeData.gasPrice || 0, 'gwei'))
    const baseGasPlusMultiplier = (multiplier: number) => {
      return baseGas * multiplier
    }

    switch (gasOption) {
      case GasOption.Low:
        baseGas = baseGasPlusMultiplier(1.0)
        break
      case GasOption.Market:
        baseGas = baseGasPlusMultiplier(1.5)
        break
      case GasOption.Aggressive:
        baseGas = baseGasPlusMultiplier(2.0)
        break
    }

    return ethers.utils.parseUnits(baseGas.toFixed(8), 'gwei')
  }, [gasOption, feeData])

  const maxPriorityFeePerGas = React.useMemo(() => {
    return getNetwork.getMaxPriorityFeePerGas({ maxFeePerGas, gasOption })
  }, [gasOption, maxFeePerGas])

  const marketGas = React.useMemo(async () => {
    return await getNetwork.marketGas(maxFeePerGas)
  }, [gasOption, maxFeePerGas])

  const estimatedTransactionCost = React.useMemo(async () => {
    return maxFeePerGas && (await getNetwork.getEstimatedTransactionCost(maxFeePerGas, maxPriorityFeePerGas, gasLimit))
  }, [gasLimit, gasOption, maxFeePerGas])

  const estimatedTransactionTime = React.useMemo(() => {
    switch (gasOption) {
      case GasOption.Low:
        return '30 seconds'
      case GasOption.Market:
        return '30 seconds'
      case GasOption.Aggressive:
        return '15 seconds'
    }
  }, [gasOption])

  return {
    gasLimit,
    gasOption,
    setGasOption,
    marketGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    estimatedTransactionCost,
    estimatedTransactionTime,
  }
}
