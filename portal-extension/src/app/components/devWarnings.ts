export const useWarnComponentUsage = (condition, message: string) => {
  if (process.env.NODE_ENV === 'development' && condition) {
    throw new Error(message)
  }
}
