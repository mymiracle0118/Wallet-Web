import React, { useState } from 'react'
import { Input, Button } from 'components'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'lib/woozie'
import NetworkItem, { INetworkItemProps } from '../NetworkItem'
import EthereumIcon from 'assets/networks/Ethereum.svg'
import BSCIcon from 'assets/networks/BSC.svg'
import SupraIcon from 'assets/networks/Supra.svg'

const networkAssets: Array<INetworkItemProps> = [
  {
    image: <SupraIcon />,
    coin: 'SUPRA',
    address: '0x5714b3e129224d3e547bB431bd316bd33f62E6cC',
    link: 'https://supraoracles.com/',
    testNetwork: false,
  },
  {
    image: <EthereumIcon />,
    coin: 'Ethereum',
    address: '0x1096b3e129224d3e547bB431bd316bd33f62b19q',
    link: 'https://ethereum.org/',
    testNetwork: false,
  },
  {
    image: <BSCIcon />,
    coin: 'Binance smart chain',
    address: '0x4960b3e129224d3e547bB431bd316bd33f62we4T',
    link: 'https://www.bnbchain.org/en',
    testNetwork: false,
  },
  {
    image: 'https://assets.coingecko.com/coins/images/4001/large/Fantom.png?1558015016',
    coin: 'Fantom',
    address: '0x4e15361fd6b4bb609fa63c81a2be19d873717870',
    link: 'https://fantom.foundation/',
    testNetwork: false,
  },
  {
    image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png?1624446912',
    coin: 'Polygon',
    address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
    link: 'https://polygon.technology/',
    testNetwork: false,
  },
  {
    image: 'https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png?1604021818',
    coin: 'Avalanche',
    address: 'FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z',
    link: 'https://www.avax.network/',
    testNetwork: false,
  },
  {
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png?1547034860',
    coin: 'Cardano',
    address: '',
    link: 'https://cardano.org/',
    testNetwork: false,
  },
  {
    image: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png?1547035066',
    coin: 'TRON',
    address: '',
    link: 'https://tron.network/',
    testNetwork: false,
  },
  {
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    coin: 'Goerli',
    address: '',
    link: 'https://goerli.etherscan.io',
    testNetwork: true,
  },
  {
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    coin: 'Kovan',
    address: '',
    link: 'https://kovan.etherscan.io',
    testNetwork: true,
  },
]

const SearchNetwork = (networkType: string) => {
  const network = networkType
  const { t } = useTranslation()
  const [activeNetwork, setActiveNetwork] = useState<string | null>(null)
  const { navigate } = useNavigate()

  const handleChangeNetwork = (value: string) => {
    setActiveNetwork(value)
  }

  return (
    <>
      <div className="p-2">
        <Input dataAid="networkSearch" placeholder={t('Network.networkName')} mainColor fullWidth />
      </div>
      <div className="h-[320px] overflow-scroll">
        {network &&
          networkAssets
            .filter((data) => (network['networkType'] === 'mainnet' ? !data.testNetwork : data.testNetwork))
            .map((data, idx) => (
              <NetworkItem
                key={idx}
                active={data.coin === activeNetwork}
                image={data.image}
                coin={data.coin}
                link={data.link}
                onClick={handleChangeNetwork}
              />
            ))}
      </div>
      <div className="flex px-2 gap-1 mt-3">
        <Button data-aid="cancelButton" variant="bordered" color="outlined" onClick={() => navigate('/network')}>
          {t('Actions.cancel')}
        </Button>
        <Button data-aid="addNetwork" color={`${!activeNetwork ? 'disabled' : 'primary'}`} disabled={!activeNetwork}>
          {t('Actions.add')}
        </Button>
      </div>
    </>
  )
}

export default SearchNetwork
