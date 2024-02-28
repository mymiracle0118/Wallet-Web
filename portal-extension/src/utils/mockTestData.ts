export const ethereumAddress = '0x63C100ac0C36549C7218070294b60C18d813675c'

export const mockAssets = [
  {
    id: 'ethereum',
    network: 'mainnet',
    chain: 'ethereum',
    type: 'layer1',
    name: 'Ethereum',
    symbol: 'ETH',
    decimal: 18,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    enabledAsDefault: true,
  },
  {
    id: 'ethereum',
    network: 'goerli',
    chain: 'ethereum',
    type: 'layer1',
    name: 'GoerliETH',
    symbol: 'ETH',
    decimal: 18,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    enabledAsDefault: false,
  },
]

export const mockAccounts = {
  '0x63C100ac0C36549C7218070294b60C18d813675c': {
    username: 'Account 1',
    address: '0x63C100ac0C36549C7218070294b60C18d813675c',
    assets: [
      {
        chain: 'ethereum',
        decimal: 18,
        enabledAsDefault: true,
        formattedBalance: 0.000307848568706,
        id: 'ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        name: 'Ethereum',
        network: 'mainnet',
        symbol: 'ETH',
        type: 'layer1',
      },
      {
        chain: 'ethereum',
        decimal: 18,
        enabledAsDefault: true,
        formattedBalance: 2.034722077599812,
        id: 'ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        name: 'GoerliETH',
        network: 'goerli',
        symbol: 'ETH',
        type: 'layer1',
      },
    ],
  },
  '0x1Aa2C1c6799d320c57a0613F1F66Ea9590257bA1': {
    address: '0x1Aa2C1c6799d320c57a0613F1F66Ea9590257bA1',
    username: 'Account2',
    assets: [
      {
        chain: 'ethereum',
        decimal: 18,
        enabledAsDefault: true,
        formattedBalance: 0,
        id: 'ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        name: 'Ethereum',
        network: 'mainnet',
        symbol: 'ETH',
        type: 'layer1',
      },
      {
        chain: 'ethereum',
        decimal: 18,
        enabledAsDefault: true,
        formattedBalance: 0,
        id: 'ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        name: 'GoerliETH',
        network: 'goerli',
        symbol: 'ETH',
        type: 'layer1',
      },
    ],
  },
}

export const mockAssetsWithSUI = [
  {
    id: 'ethereum',
    network: 'mainnet',
    chain: 'ethereum',
    type: 'layer1',
    name: 'Ethereum',
    symbol: 'ETH',
    decimal: 18,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    enabledAsDefault: true,
  },
  {
    id: 'ethereum',
    network: 'goerli',
    chain: 'ethereum',
    type: 'layer1',
    name: 'GoerliETH',
    symbol: 'ETH',
    decimal: 18,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    enabledAsDefault: false,
  },
  {
    id: 'SUI',
    network: 'SUI',
    chain: 'SUI',
    name: 'SUI',
    symbol: 'SUI',
    decimal: 0,
    image: 'https://raw.githubusercontent.com/MystenLabs/sui/main/doc/static/Sui_Icon_Brand.png',
    enabledAsDefault: false,
  },
]

export const mockNetworkAssets = [
  {
    blockExplorer: 'https://goerli.etherscan.io',
    chainId: 5,
    coin: 'Goerli',
    enabledAsDefault: true,
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    name: 'Goerli Test Network',
    networkId: 'goerli',
    symbol: 'GoerliETH',
    testNetwork: true,
  },
]

export const mockTestProfit = [
  {
    network: 'goerli',
    time: 'Mon Sep 26 2022 20:49:21 GMT+0800 (Philippine Standard Time) {}',
    token: 'ETH',
    value: 2.524722077554242,
  },
  {
    network: 'mainnet',
    time: 'Mon Sep 26 2022 20:49:22 GMT+0800 (Philippine Standard Time) {}',
    token: 'ETH',
    value: 0.000307848568706,
  },
]
