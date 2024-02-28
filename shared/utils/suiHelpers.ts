import type { Ed25519KeypairData } from '@mysten/sui.js'
import nacl from 'tweetnacl'
import { Buffer } from 'buffer'

const pbkdf2_1 = require('pbkdf2')

export function pbkdf2Promise(password, saltMixin, iterations, keylen, digest) {
  return Promise.resolve().then(
    () =>
      new Promise((resolve, reject) => {
        const callback = (err, derivedKey) => {
          if (err) {
            return reject(err)
          } else {
            return resolve(derivedKey)
          }
        }
        pbkdf2_1.pbkdf2(password, saltMixin, iterations, keylen, digest, callback)
      })
  )
}

export function normalize(str) {
  return (str || '').normalize('NFKD')
}

function salt(password) {
  return 'mnemonic' + (password || '')
}

export function mnemonicToSeed(mnemonic, password) {
  return Promise.resolve().then(() => {
    const mnemonicBuffer = Buffer.from(normalize(mnemonic), 'utf8')
    const saltBuffer = Buffer.from(salt(normalize(password)), 'utf8')
    return pbkdf2Promise(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512')
  })
}

/**
 * Derive public key and private key from the Mnemonics
 * @param mnemonics a 12-word seed phrase
 * @returns public key and private key
 */
export async function getKeypairFromMnemonics(mnemonics: string): Ed25519KeypairData {
  const seed = await mnemonicToSeed(normalizeMnemonics(mnemonics))
  return nacl.sign.keyPair.fromSeed(
    // keyPair.fromSeed only takes a 32-byte array where `seed` is a 64-byte array
    new Uint8Array(seed.toJSON().data.slice(0, 32))
  )
}

/**
 * Sanitize the mnemonics string provided by user
 * @param mnemonics a 12-word string split by spaces that may contain mixed cases
 * and extra spaces
 * @returns a sanitized mnemonics string
 */
export function normalizeMnemonics(mnemonics: string): string {
  return mnemonics
    .trim()
    .split(/\s+/)
    .map((part) => part.toLowerCase())
    .join(' ')
}
