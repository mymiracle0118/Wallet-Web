export const walletApiUrl = process.env.BFF_API_ENDPOINT || 'http://localhost:8080'
export const appEnv = process.env.NEXT_PUBLIC_VERCEL_ENV
export const appVersion = process.env.APP_VERSION ?? process.env.NEXT_PUBLIC_APP_VERSION ?? '0.0.0'
