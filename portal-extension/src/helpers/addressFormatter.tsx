export const formatAddress = (address: string) => {
  const addressLength = address.length || 0
  return [address.substring(0, 6), address.substring(addressLength - 4, addressLength)].join('...')
}
