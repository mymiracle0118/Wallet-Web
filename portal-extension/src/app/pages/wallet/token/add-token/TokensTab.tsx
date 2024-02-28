/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable  @typescript-eslint/no-explicit-any */

import classnames from 'classnames'
import { useNavigate } from 'lib/woozie'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Listbox } from '@headlessui/react'
import { Tooltip } from '@nextui-org/react'
import { Button, CustomTypography, Input, TokenBalance } from 'components'

import RealodIcon from 'assets/icons/reload.svg'
import HighValueIcon from 'assets/icons/value-high.svg'
import LowValueIcon from 'assets/icons/value-low.svg'

import { useBalance } from '@portal/shared/hooks/useBalance'
import { usePricing } from '@portal/shared/hooks/usePricing'
import { useStore } from '@portal/shared/hooks/useStore'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { NetworkToken } from '@portal/shared/utils/types'
import { PlusIcon, SearchIcon, SortIcon, SpinnerIcon, StarEmptyIcon } from '@src/app/components/Icons'
import AlphabetIcon from 'assets/icons/alphabet.svg'
import NoTokenfound from '../../../../../assets/images/no-activity.png'

const TokenBalanceRow = ({
  assetId,
  // hideZeroBalance,
  token,
}: {
  assetId: string
  // hideZeroBalance: boolean
  token: NetworkToken
}) => {
  const { navigate } = useNavigate()
  const { getAssetValue } = usePricing()
  const { setTokenProfitLoss } = useWallet()
  const { balance, balanceFormatted } = useBalance(token)
  const assetBalance = useMemo(() => Number(token.formattedBalance) || 0, [token])
  const assetValue = useMemo(() => getAssetValue(token.coingeckoTokenId, assetBalance), [assetBalance, getAssetValue])

  useEffect(() => {
    if (balanceFormatted > 0) {
      setTokenProfitLoss({
        network: token.networkName,
        token: token.shortName || '',
        value: balanceFormatted,
        time: moment().toDate(),
      })
    }
  }, [balanceFormatted]) // eslint-disable-line

  return (
    <TokenBalance
      id={token.shortName}
      network={!token.isCustom ? token.networkName : ''}
      isFavorite={token.isFavorite}
      isFavIcon={true}
      token={token.shortName}
      isTestnet={false}
      acronym={token.title}
      // balance={`$${ethers.utils.commify(assetValue)}`}
      balance={`$${assetValue}`}
      nativeBalance={balanceFormatted}
      tokenFullName={token.subTitle}
      thumbnail={token.image}
      onClick={() => navigate(`/token/${token.networkName}/${assetId}`)}
    />
  )
}

export const sortFilters = [
  {
    id: 1,
    icon: <StarEmptyIcon className="fill-custom-black dark:fill-custom-white mr-3" />,
    name: 'favorites',
    label: 'Favorites',
  },
  {
    id: 2,
    icon: (
      <HighValueIcon className="stroke-custom-black dark:stroke-custom-white fill-custom-black dark:fill-custom-white mr-3" />
    ),
    name: 'highestValue',
    label: 'Highest value',
  },
  {
    id: 3,
    icon: (
      <LowValueIcon className="stroke-custom-black dark:stroke-custom-white fill-custom-black dark:fill-custom-white mr-3" />
    ),
    name: 'lowestValue',
    label: 'Lowest value',
  },
  {
    id: 4,
    icon: <AlphabetIcon className="fill-custom-black dark:fill-custom-white mr-3" />,
    name: 'alphabetically',
    label: 'Alphabetically',
  },
]
type totatBalance = {
  totalBalance: number
}
const TokensTab = (totalBalance: totatBalance) => {
  const { getAssetValue } = usePricing()
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { selectedNetwork } = useWallet() // eslint-disable-line
  const { currentTokenArrayWithBalance } = useStore() // eslint-disable-line
  const [selectedSort, setSelectedSort] = useState<string>('highestValue')
  const [searchValue, setSearchValue] = useState<string>('')
  const [isRefreshToken, setRefreshToken] = useState<boolean>(false)
  // const [hideZeroBalance, setHideZeroBalance] = useState<boolean>(false)
  // const { assets, setAssets } = useState<NetworkToken[] | undefined>([])
  // useEffect(() => {
  //   setAssets(Object.values(currentTokenArrayWithBalance) as NetworkToken[])
  // }, [currentTokenArrayWithBalance])

  const assets = useMemo(() => {
    return Object.values(currentTokenArrayWithBalance)
  }, [currentTokenArrayWithBalance])

  const sortedList = useMemo(() => {
    const sorted = {
      alphabetically: [...assets].sort((a, b) => a.title.localeCompare(b.title)),

      // Sort by isFavorite=true first
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      favorites: [...assets].sort((a, b) => (b.isFavorite || 0) - (a.isFavorite || 0)),

      // highestValue: [...assets].sort(
      //   (key1, key2) => getAssetValue(key2.id, key2.formattedBalance) - getAssetValue(key1.id, key1.formattedBalance)
      // ),
      // lowestValue: [...assets].sort(
      //   (key1, key2) => getAssetValue(key1.id, key1.formattedBalance) - getAssetValue(key2.id, key2.formattedBalance)
      // ),
    }[selectedSort]

    return sorted || assets
  }, [selectedSort, assets, getAssetValue]).filter((v: NetworkToken) =>
    selectedNetwork ? v.networkName.toLowerCase() == selectedNetwork.toLowerCase() : v
  )

  const filteredTokensWithSort = !searchValue
    ? sortedList
    : sortedList.filter(
        (a: NetworkToken) =>
          a.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          a.networkName.toLowerCase().includes(searchValue.toLowerCase())
      )
  useEffect(() => {
    if (isRefreshToken) setTimeout(() => setRefreshToken(false), 3000)
  }, [isRefreshToken])

  return (
    <div className="py-4 min-h-[17.3125rem] px-1">
      <div className="flex justify-between mb-4 pl-4 pr-2">
        <div className="flex items-center justify-between w-full gap-x-2">
          <div>
            <Input
              dataAid="searchBar"
              placeholder={t('Actions.search')}
              className="search-input font-bold h-10"
              icon={<SearchIcon />}
              mainColor
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value as string)}
            />
          </div>
          <div className="flex items-center justify-between w-[6.5rem]">
            <Tooltip content="Refresh Tokens" color="foreground">
              <Button
                size="sm"
                variant="light"
                isIconOnly
                onClick={() => setRefreshToken(!isRefreshToken)}
                isDisabled={!filteredTokensWithSort.length === true}
              >
                <RealodIcon
                  className={`fill-custom-black text-xl transition-all ease-in-out duration-200 ${
                    isRefreshToken && 'animate-spin'
                  }`}
                />
              </Button>
            </Tooltip>
            <Listbox className="relative px-1 flex" as="div" value={selectedSort} onChange={setSelectedSort}>
              <Listbox.Button className="relative">
                <SortIcon className="fill-custom-black dark:fill-custom-white text-[1.6rem]" />
              </Listbox.Button>

              <Listbox.Options className="absolute z-10 shadow-md right-0 dark:bg-surface-dark-alt bg-surface-light rounded-md overflow-hidden w-48">
                {sortFilters.map((filter) => (
                  <Listbox.Option
                    key={filter.id}
                    value={filter.name}
                    className={classnames(
                      'text-sm text-custom-black dark:text-custom-white font-extrabold px-6 py-3.5 flex justify-start items-center gap-1 [&>svg]:w-5 [&>svg]:h-5 stroke-custom-black dark:stroke-custom-white hover:bg-custom-grey10 dark:hover:bg-custom-white10 cursor-pointer',
                      filter.name === selectedSort ? 'bg-custom-grey10 dark:bg-custom-white10' : ''
                    )}
                  >
                    {filter.icon} {filter.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
            <Tooltip content="Add Token" color="foreground" placement="top-end">
              <Button isIconOnly variant="light" size="sm" onClick={() => navigate('/token/add')}>
                <PlusIcon className="fill-custom-black text-xl" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className={`${isRefreshToken && 'relative opacity-30'}`}>
        {isRefreshToken && (
          <div className="relative">
            <CustomTypography
              className="absolute pt-24 left-0 right-0 flex justify-center text-custom-white z-50"
              variant="subtitle"
            >
              <SpinnerIcon />
            </CustomTypography>
          </div>
        )}
        {filteredTokensWithSort.length > 0 ? (
          filteredTokensWithSort.map((asset) => (
            <TokenBalanceRow
              key={`${asset.shortName}:${asset.networkName}`}
              // hideZeroBalance={hideZeroBalance}
              assetId={asset.shortName}
              token={asset}
            />
          ))
        ) : (
          <div className="mx-auto flex flex-col items-center space-y-2 pt-4">
            <img src={NoTokenfound} alt="no token found" />
            <CustomTypography variant="body" type="secondary">
              {t('Wallet.noTokenfound')}
            </CustomTypography>
          </div>
        )}
      </div>
      {filteredTokensWithSort.length <= 0 && (
        <div className="py-6 flex justify-center">
          <Button
            variant="bordered"
            data-aid="addToken"
            className="w-40"
            color="outlined"
            onClick={() => navigate('/token/add')}
          >
            <PlusIcon /> {t('Wallet.addToken')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default TokensTab
