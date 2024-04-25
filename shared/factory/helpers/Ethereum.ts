import { getErrorMessage } from '@portal/portal-extension/src/utils/errorConstants'
import erc20Abi from '@portal/shared/data/ERC20.json'
import { getTransactionDetail } from '@portal/shared/services/etherscan'
import { getContractInterface } from '@portal/shared/utils/getContractInterface'
import { fromUTF8Array } from '@portal/shared/utils/utf8'
import { ethers } from 'ethers'
import {
  GetEncryptedJsonFromPrivateKey,
  GetWalletFromEncryptedjsonPayload,
  IGetTokenInfoPayload,
  IResponse,
  ITokenInfo,
  Transaction,
} from '../../utils/types'

interface GetContract {
  rpcUrl?: string
  privateKey?: string
  contractAddress?: string
  abi?: any[]
  providerInstance?: any
}

const successResponse = (args: IResponse) => {
  return args
}

const getContract = async ({ contractAddress, privateKey, abi, providerInstance }: GetContract) => {
  const gasPrice = await providerInstance.getGasPrice()
  // const gas = ethers.BigNumber.from(21000)
  const gas = 21000

  let nonce
  let contract
  let signer
  const contractAbi = abi || erc20Abi

  if (privateKey && contractAddress) {
    signer = new ethers.Wallet(privateKey, providerInstance)
    nonce = providerInstance.getTransactionCount(signer.getAddress())
    contract = new ethers.Contract(contractAddress, contractAbi, signer)
  } else if (privateKey && !contractAddress) {
    signer = new ethers.Wallet(privateKey, providerInstance)
    nonce = providerInstance.getTransactionCount(signer.getAddress())
  } else if (contractAddress && !privateKey) {
    contract = new ethers.Contract(contractAddress, contractAbi, providerInstance)
  }

  return {
    contract,
    signer,
    gasPrice,
    gas,
    nonce,
    providerInstance,
  }
}

const createWallet = () => {
  const wallet = ethers.Wallet.createRandom()
  return successResponse(wallet)
}

const getEstimatedTransactionCost = ({ maxFeePerGas, maxPriorityFeePerGas, gasLimit }: any): BigInt => {
  const baseFee = parseFloat(ethers.formatUnits(maxFeePerGas, 'gwei'))
  const tip = parseFloat(ethers.formatUnits(maxPriorityFeePerGas, 'gwei'))
  const total = (gasLimit * (baseFee + tip)).toFixed(4)
  return ethers.parseUnits(total, 'gwei')
}
const sendTransaction = async (
  maxPriorityFeePerGas: number,
  maxFeePerGas: number,
  gasLimit: number,
  encryptedPrivateKey: (string | number)[],
  transaction: Transaction,
  fromAddress: string,
  shouldCancelTransaction: boolean,
  cancelTransactionObject: any
) => {
  try {
    if (!encryptedPrivateKey) throw new Error('No private key')
    if (!transaction) throw new Error('No transaction')
    if (!transaction.amount) {
      throw new Error('No transaction amount specified')
    }
    let transactionRequest
    const wallet = new ethers.Wallet(fromUTF8Array(encryptedPrivateKey))
    const provider = new ethers.JsonRpcProvider(
      transaction.asset.providerNetworkRPC_URL,
      Number(transaction.asset.providerNetworkRPC_Network_Name)
    )
    const walletSigner = wallet.connect(provider)
    const feeData = await provider?.getFeeData()
    if (transaction.asset.tokenContractAddress) {
      const contractAddress = transaction.asset.tokenContractAddress
      const contract = new ethers.Contract(
        contractAddress,
        getContractInterface(transaction.asset.tokenType),
        walletSigner
      )
      const numberOfTokens = ethers.parseUnits(transaction.amount, transaction.asset.decimal)
      if (shouldCancelTransaction) {
        transactionRequest = await walletSigner.sendTransaction(cancelTransactionObject)
      } else {
        const txContract = {
          nonce: await provider?.getTransactionCount(transaction.asset.address, 'latest'),
          gasPrice: maxFeePerGas,
          gasLimit,
        }
        transactionRequest = await contract.transfer(transaction.to, numberOfTokens, txContract)
      }
    } else {
      if (shouldCancelTransaction) {
        transactionRequest = await walletSigner.sendTransaction(cancelTransactionObject)
      } else {
        const tx = {
          from: transaction.asset.address,
          to: transaction.to,
          value: ethers.parseEther(transaction.amount),
          gasPrice: maxFeePerGas ? maxFeePerGas : Number(feeData?.gasPrice),
          gasLimit: gasLimit || (transaction.asset.title !== 'BNB' ? 21000 : undefined),
          nonce: await provider?.getTransactionCount(transaction.asset.address, 'latest'),
        }
        transactionRequest = await walletSigner.sendTransaction(tx)
      }
    }
    const nonce = await provider?.getTransactionCount(transaction.asset.address, 'latest')
    const txHash = transactionRequest.hash
    const txDetails = await getTransactionDetail(transaction.asset.apiUrl, transaction.asset.networkName, txHash)
    return successResponse({ nonce, txHash, txDetails })
  } catch (error) {
    const validationCodeMatch = error.toString()

    const regex = /code=([A-Z_]+),/ // Regular expression to match the error code
    const match = validationCodeMatch.match(regex)

    let validationCode: string = ''
    if (match) {
      validationCode = match[1]
    }
    throw new Error(getErrorMessage(validationCode))
  }
}

const getEncryptedJsonFromPrivateKey = async (args: GetEncryptedJsonFromPrivateKey) => {
  const wallet = new ethers.Wallet(args.privateKey)
  const json = await wallet.encrypt(args.password)

  return successResponse({ json })
}

const getWalletFromEncryptedJson = async (args: GetWalletFromEncryptedjsonPayload) => {
  const wallet = await ethers.Wallet.fromEncryptedJson(args.json, args.password)

  return successResponse({
    privateKey: wallet.privateKey,
    address: wallet.address,
  })
}

const getTokenInfo = async ({ address, rpcUrl }: IGetTokenInfoPayload) => {
  const { contract } = await getContract({ contractAddress: address, rpcUrl })

  if (contract) {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
    ])

    const data: ITokenInfo = {
      name,
      symbol,
      decimals,
      address: contract.address,
      totalSupply: parseInt(ethers.formatUnits(totalSupply, decimals)),
    }
    return successResponse({ ...data })
  }
}

export default {
  getEstimatedTransactionCost,
  createWallet,
  getEncryptedJsonFromPrivateKey,
  getWalletFromEncryptedJson,
  getTokenInfo,
  sendTransaction,
}
