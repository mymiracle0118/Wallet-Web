import axios from 'axios'
import { ethers } from 'ethers'
import { NetworkToken } from '../utils/types'

const apiKey = '3NH4NS54WSDEEPUS4PX1VNITFYRESTS1WS'

export type ContractTransaction = {
  blockNumber: string
  time: string | number
  hash: string
  nonce: number
  from: string
  to: string
  value: string
  gas: BigInt
  gasPrice: BigInt
  gasUsed: BigInt
  cumulativeGasUsed: BigInt
  tokenDecimal: number
  networkFees?: string
  status?: string
  address?: string
  networkName?: string
  shortName?: string
  isCustomToken?: boolean
}

export const getTransactions = async (
  provider: any,
  asset: NetworkToken,
  address: string,
  contractAddress?: string
): Promise<any> => {
  const transactions: Array<ContractTransaction> = []
  let txDataList: any = []
  try {
    let etherscanProvider = new ethers.EtherscanProvider(
      asset.networkName === 'ETH' ? asset.providerNetworkRPC_Network_Name : asset.networkName.toLowerCase()
    )
    if (contractAddress) {
      txDataList = await etherscanProvider.fetch('account', {
        action: 'tokentx',
        address: address,
        sort: 'desc',
        contractaddress: contractAddress,
        page: 1,
        offset: 20,
      })
    } else {
      txDataList = await etherscanProvider.fetch('account', {
        action: 'txlist',
        address: address,
        page: 1,
        offset: 20,
        sort: 'desc',
      })
    }
    for (const txData of txDataList) {
      transactions.push({
        blockNumber: txData.blockNumber,
        time: txData.timeStamp ? txData.timeStamp : '',
        hash: txData.hash,
        nonce: txData.nonce,
        from: txData.from,
        to: txData.to,
        value: ethers.formatUnits(
          txData.value,
          txData.tokenDecimal ? Number(txData.tokenDecimal) : Number(asset.decimal)
        ),
        gas: ethers.parseUnits(txData.value, 'wei'),
        gasPrice: ethers.parseUnits(txData.gasPrice, 'wei'),
        gasUsed: ethers.parseUnits(txData.gasUsed, 'wei'),
        cumulativeGasUsed: ethers.parseUnits(txData.cumulativeGasUsed, 'wei'),
        tokenDecimal: Number(txData.tokenDecimal || asset.decimal),
      })
    }
    return transactions
  } catch (error) {
    return []
  }
}

export const getTransactionDetail = async (apiUrl: string, network: string, txhash: string) => {
  let query = `?module=transaction`
  query += `&action=getstatus`
  query += `&txhash=${txhash}`
  query += `&apikey=${apiKey}`

  const { data } = await axios.get(`${apiUrl}${query}`)

  return data.result
}
