import { schema } from '@uniswap/token-lists'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import axios from 'axios'
import { TokenInfo } from '@solana/spl-token-registry'

const ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json'

export const validatedTokenList: () => Promise<TokenInfo[] | undefined> = async () => {
  const ajv = new Ajv({ allErrors: true, verbose: true })
  addFormats(ajv)
  const validator = ajv.compile(schema)
  const { data } = await axios.get(ARBITRUM_LIST)
  const valid = validator(data)
  if (valid) {
    return data.tokens as Array<TokenInfo>
  }
  if (validator.errors) {
    throw validator.errors.map((error) => {
      delete error.data
      return error
    })
  }
}
