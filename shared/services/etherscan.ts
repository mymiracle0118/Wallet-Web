import axios from 'axios'
import { BigNumber, ethers } from 'ethers'
import Decimal from 'decimal.js'

const apiKey = '3NH4NS54WSDEEPUS4PX1VNITFYRESTS1WS'

export type ContractTransaction = {
  blockNumber: string
  time: string | number
  hash: string
  nonce: number
  from: string
  to: string
  value: string
  gas: BigNumber
  gasPrice: BigNumber
  gasUsed: BigNumber
  cumulativeGasUsed: BigNumber
  tokenDecimal: number
  networkFees?: string
  status?: string
}

export const getTransactions = async (
  apiUrl: string,
  address: string,
  contractAddress?: string
): Promise<Array<ContractTransaction>> => {
  let query = `?module=account`
  query += `&action=${contractAddress ? 'tokentx' : 'txlist'}`
  query += `&address=${address}`
  if (contractAddress) {
    query += `&contractaddress=${contractAddress}`
  }
  query += `&startblock=0`
  query += `&endblock=99999999`
  query += `&page=1`
  query += `&offset=100`
  query += `&sort=desc`
  query += `&apikey=${apiKey}`

  const { data } = await axios.get(`${apiUrl}${query}`)
  const transactions: Array<ContractTransaction> = []

  for (const txData of data.result) {
    transactions.push({
      blockNumber: txData.blockNumber,
      time: txData.timeStamp,
      hash: txData.hash,
      nonce: txData.nonce,
      from: txData.from,
      to: txData.to,
      value: new Decimal(ethers.utils.formatUnits(txData.value, txData.tokenDecimal)).toDecimalPlaces(18).toString(),
      gas: ethers.utils.parseUnits(txData.value, 'wei'),
      gasPrice: ethers.utils.parseUnits(txData.gasPrice, 'wei'),
      gasUsed: ethers.utils.parseUnits(txData.gasUsed, 'wei'),
      cumulativeGasUsed: ethers.utils.parseUnits(txData.cumulativeGasUsed, 'wei'),
      tokenDecimal: txData.tokenDecimal,
    })
  }

  return transactions
}

export const getTransactionDetail = async (apiUrl: string, network: string, txhash: string) => {
  let query = `?module=transaction`
  query += `&action=getstatus`
  query += `&txhash=${txhash}`
  query += `&apikey=${apiKey}`

  const { data } = await axios.get(`${apiUrl}${query}`)

  return data.result
}
