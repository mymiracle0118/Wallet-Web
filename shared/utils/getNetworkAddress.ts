import { useWallet } from '@portal/shared/hooks/useWallet'
import { useSUI } from '@portal/shared/hooks/useSUI'
import { useSolana } from '@portal/shared/hooks/useSolana'
import { useAptos } from '@portal/shared/hooks/useAptos'
import { NETWORKS } from '@portal/shared/utils/types'

/**
 * Input should be added here when adding new network
 * @param network ethereum | goerli | SUI
 * @returns string
 * Make sure to add the address of the specific network from the network hook
 */
export const getNetworkAddress = (network: string): string => {
  const { address: ethAddress } = useWallet()
  const { address: suiAddress } = useSUI()
  const { address: solanaAddress } = useSolana()
  const { address: aptosAddress } = useAptos()
  switch (network) {
    case NETWORKS.Goerli:
      return ethAddress || ''
    case NETWORKS.SUI:
      return suiAddress || ''
    case NETWORKS.Solana_Devnet:
      return solanaAddress || ''
    case NETWORKS.APTOS:
      return aptosAddress || ''
    default:
      return ethAddress || ''
  }
}
