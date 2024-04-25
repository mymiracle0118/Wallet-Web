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

export const passwordRegex = {
  password: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{9,24}$/, // do not allow spaces
}

// Format the price to USD using the locale, style, and currency.
export const USDollar = (digit = 2) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digit,
    minimumFractionDigits: 0,
  })

export const findValueByKey = (obj: any, key: string): any => {
  // Base case: if the current object has the key, return its value
  if (obj[key]) {
    return obj[key]
  }
  // Recursive case: iterate through all keys and recursively call the function if a nested object is found
  for (const k in obj) {
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      const foundValue = findValueByKey(obj[k], key)
      if (foundValue) {
        return foundValue
      }
    }
  }
  // If the key is not found, return null or handle it as required
  return null
}

export const getMinimumBalance = (networkType: string) => {
  switch (networkType) {
    case 'SOL':
      return 0.00089
    case 'SUI':
      return 0.01
    default:
      return 0
  }
}
