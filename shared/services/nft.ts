import { ethers } from 'ethers'
import axios from 'axios'

import { getContractInterface } from '@portal/shared/utils/getContractInterface'
import { getNetworkProvider } from '@portal/shared/utils/getNetworkProvider'
import { getIpfsLink } from '@portal/shared/services/ipfs'

export const fetchNFT = async (network: string, contractAddress: string, tokenId: string) => {
  const provider = getNetworkProvider(network)
  const contract = new ethers.Contract(contractAddress, getContractInterface('erc721'), provider)

  const tokenUri = await contract.tokenURI(tokenId)
  const { data: metadata } = await axios.get(getIpfsLink(tokenUri))

  const nft = {
    network,
    chain: 'ethereum',
    type: 'erc721',
    id: tokenId,
    contractAddress,
    metadata: { ...metadata, image: getIpfsLink(metadata.image) },
  }

  return nft
}

export const isNFTOwner = async (walletAddress: string, network: string, contractAddress: string, tokenId: string) => {
  const provider = getNetworkProvider(network)
  const contract = new ethers.Contract(contractAddress, getContractInterface('erc721'), provider)
  const owner = await contract.ownerOf(tokenId)
  return owner === walletAddress
}
