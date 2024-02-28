const GetNetworkName = (network: string) => {
  switch (network) {
    case 'mainnet':
      return 'Ethereum'
    case 'goerli':
      return 'Goerli'
    case 'ropsten':
      return 'Ropsten'
    case 'kovan':
      return 'Kovan'
    default:
      return network
  }
}

export default GetNetworkName
