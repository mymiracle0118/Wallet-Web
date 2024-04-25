export const walletApiUrl = process.env.BFF_API_ENDPOINT || 'http://localhost:8080'
export const appEnv = process.env.NEXT_PUBLIC_VERCEL_ENV
export const appVersion = process.env.APP_VERSION ?? process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0'
export const encryptionDataSalt: string = process.env.ENCRYPTION_DATA_SALT || 'salt'

export const isAlphaBuild = process.env.BUILD_ALPHA === 'true'
export const isBetaBuild = process.env.BUILD_BETA === 'true'
