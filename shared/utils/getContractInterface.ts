import ERC20ABI from '@portal/shared/data/ERC20.json'
import ERC721ABI from '@portal/shared/data/ERC721.json'

export const getContractInterface = (assetType: string): any => {
  if (assetType === 'erc721') {
    return ERC721ABI
  } else if (assetType === 'ERC20') {
    return ERC20ABI
  } else {
    return ERC20ABI
  }
}
