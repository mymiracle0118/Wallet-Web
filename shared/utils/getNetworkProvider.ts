import { ethers } from 'ethers'
import { default as networks } from '../data/networks.json'

export const getNetworkProvider = (network: string) => {
  const networkData = networks.find((n) => n.networkId === network)
  if (networkData && networkData.networkURL) {
    return new ethers.providers.JsonRpcProvider(networkData.networkURL)
  } else {
    return new ethers.providers.InfuraProvider(network)
  }
}

export const getNetworkProviderByChainId = (chainId: number) => {
  const network = networks.find((n) => n.chainId === chainId)
  if (network && network.networkURL) {
    return new ethers.providers.JsonRpcProvider(network.networkURL)
  } else if (network) {
    return new ethers.providers.InfuraProvider(network.networkId)
  } else {
    throw new Error('Network not found')
  }
}
