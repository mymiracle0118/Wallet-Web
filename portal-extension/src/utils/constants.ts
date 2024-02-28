const CryptoJS = require('crypto-js')

export const shortenedAddress = (address: string) =>
  [address?.substring(0, 6), address?.substring(address.length - 4, address.length)].join('...')

export const handleCopy = (event: React.MouseEventHandler<HTMLButtonElement>) => {
  // eslint-disable-next-line
  event.stopPropagation()
}

export enum SAFETY_MEASURE {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export const getWalletAddressRegex = (network: string) => {
  switch (network) {
    case 'APT':
    case 'SUI':
    case 'aptos':
    case 'SUPRA':
      return /^(0x)?[0-9A-Fa-f]{64}$/
    case 'SOL':
      return /^[1-9A-HJ-NP-Za-km-z]{32,}$/
    default:
      return /^0x[a-fA-F0-9]{40}$/
  }
}

export const remove0xStartOfString = (str: string) => {
  if (str.startsWith('0x') || str.startsWith('0X')) {
    str = str.substring(2)
  }
  return str
}

export const encryptData = (data: string, password: string) => {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data) as string, password).toString()
  return encryptedData
}

export const decryptData = (encryptedData: string, password: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, password)
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  return decryptedData
}

export enum TRANSACTION {
  COUNT = 15,
  NETWORK_FEE = 100,
  SUPRA_TOKEN_PRICE = 0.05,
}

export const add0xStartOfString = (str: string) => {
  if (!/^0x/i.test(str)) {
    return `0x${str}`
  }
  return str
}
