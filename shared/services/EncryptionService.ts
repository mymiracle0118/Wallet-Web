/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/await-thenable */
import * as CryptoJS from 'crypto-js'
interface EncryptedData {
  cipher: any
  iv: any
}
const SALT = 'salt'
const ITERATIONS = 5000
const KEY_SIZE = 256
const IV_SIZE = 16

const EncryptionService = () => {
  const encrypt = async (data: string, password: string): Promise<any | null> => {
    try {
      const iv = await CryptoJS.lib.WordArray.random(IV_SIZE)
      const cipher = CryptoJS.AES.encrypt(data, password, {
        iv,
        mode: CryptoJS.mode.CBC,
      }).toString()
      return {
        cipher: cipher,
        iv: iv.toString(),
      }
    } catch (error) {
      console.error('Encryption failed:', error)
      return null
    }
  }
  const decrypt = async (encryptedData: EncryptedData, password: string): Promise<any> => {
    try {
      const parsedIV = CryptoJS.enc.Hex.parse(encryptedData.iv)
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedData.cipher, password, {
        iv: parsedIV,
        mode: CryptoJS.mode.CBC,
      })
      return decryptedBytes.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error('Decryption failed:', error)
      return null
    }
  }

  return {
    encrypt,
    decrypt,
  }
}

export default EncryptionService

export const encryptData = (data: string, password: string) => {
  return CryptoJS.AES.encrypt(data, password).toString()
}
export const decryptData = (encryptedData: string, password: string) => {
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, password)
    return decryptedBytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption failed:', error)
    return null
  }
}
