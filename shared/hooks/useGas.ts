import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { getContractInterface } from '@portal/shared/utils/getContractInterface'
import { GasOption, NetworkToken } from '@portal/shared/utils/types'
import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'

const getERC20GasLimit = async (asset: NetworkToken, provider: any): Promise<number> => {
  const contract = new ethers.Contract(asset.tokenContractAddress!, getContractInterface(asset.tokenType), provider)
  const deploymentData = contract.interface.encodeDeploy([])
  const estimatedGasLimit = await provider.estimateGas({ data: deploymentData })
  return Number(ethers.formatUnits(estimatedGasLimit, 'wei'))
}

export const useGas = (asset: NetworkToken, option?: GasOption) => {
  const [gasLimit, setGasLimit] = useState(21000)
  const [gasOption, setGasOption] = useState(option || GasOption.Low)
  const getNetwork = NetworkFactory.selectByNetworkId(asset.shortName)
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
      enabled: !!asset.isEVMNetwork && asset.tokenContractAddress !== undefined,
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
      return ethers.parseUnits('0', 'gwei')
    }

    let baseGas = parseFloat(ethers.formatUnits(feeData.gasPrice || 0, 'gwei'))
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

    return ethers.parseUnits(baseGas.toFixed(8), 'gwei')
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
