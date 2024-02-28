import { default as networks } from '../data/networks.json'

export const getBlockExplorerURL = (network: string) => {
  const networkData = networks.find((n) => n.networkId === network)
  if (networkData) {
    return networkData.blockExplorer
  } else {
    return `https://${network}.etherscan.io`
  }
}
