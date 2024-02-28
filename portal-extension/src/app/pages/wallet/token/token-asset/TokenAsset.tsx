/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import classnames from 'classnames'
import SinglePageLayout from 'layouts/single-page-layout/SinglePageLayout'
import { CustomTypography, DataCard, Icon, Loader, TokenActivity, TokenAssetCard } from 'app/components'

import { useWallet } from '@portal/shared/hooks/useWallet'
import { usePricing } from '@portal/shared/hooks/usePricing'
// import { useGas } from '@portal/shared/hooks/useGas'
import { useBalance } from '@portal/shared/hooks/useBalance'
import { ContractTransaction } from '@portal/shared/services/etherscan'

import ExternalLinkIcon from 'assets/icons/external-link.svg'

import { getChartUrl } from '@portal/shared/services/coingecko'
import { createLocationState } from 'lib/woozie'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image } from '@nextui-org/react'
import NoActivity from 'assets/images/no-activity.png'
import {
  CaretDownIcon,
  CheckIcon,
  ReceiveIcon,
  RoundedWhiteIcon,
  SendIcon,
  SignInIcon,
  SwapDownIcon,
  SwapUpIcon,
} from '@src/app/components/Icons'
import { IActivityFilterProps, NetworkToken } from '@portal/shared/utils/types'
import { useStore } from '@portal/shared/hooks/useStore'
import { useGas } from '@portal/shared/hooks/useGas'

const ACTIVITY_FILTER: IActivityFilterProps[] = [
  {
    key: 'All',
    icon: <RoundedWhiteIcon />,
    name: 'All',
  },
  {
    key: 'Send',
    icon: <SendIcon />,
    name: 'Send',
  },
  {
    key: 'Receive',
    icon: <ReceiveIcon />,
    name: 'Receive',
  },
  {
    key: 'Swap_to_other_token',
    icon: <SwapUpIcon />,
    name: 'Swap to other token',
  },
  {
    key: 'Swap_from_other_token',
    icon: <SwapDownIcon />,
    name: 'Swap from other token',
  },
  {
    key: 'Sign',
    icon: <SignInIcon />,
    name: 'Sign',
  },
]

const TokenAsset = () => {
  const { t } = useTranslation()
  const { pathname } = createLocationState()
  const { setPendingTransactions, pendingTransactions, tokenProfitLossCollection } = useWallet()
  const { getMarketPrice, getMarket24HourChange, getAssetValueFormatted } = usePricing()

  const [isTokenFilter, setTokenFilter] = useState(new Set(['All']))
  const [marketGasString, setMarketGasString] = useState('')
  const [pendingTransactionList, setPendingTransactionList] = useState<ContractTransaction[]>([])
  const { getNetworkToken } = useStore()
  // Token Activity Filter
  const filterTokenActivity = useMemo(() => Array.from(isTokenFilter).join(', ').replaceAll('_', ' '), [isTokenFilter])

  const paths = pathname.split('/')
  const network: string = paths[paths.length - 2]
  const assetId: string = paths[paths.length - 1]

  // const asset = useMemo(() => getAsset(network, assetId), [getAsset, network, assetId])
  const asset: NetworkToken = getNetworkToken(assetId)
  const networkAddress = asset?.address
  const enableQuery = Boolean(network && networkAddress && asset)
  const networkFactory = NetworkFactory.selectByNetworkId(asset.networkName)

  const { data: transactions = [], isLoading } = useQuery(
    ['transaction-data', asset.shortName, asset.tokenContractAddress],
    () => networkFactory.getTransactions(network, networkAddress, asset.tokenContractAddress),
    {
      refetchInterval: 6000,
      staleTime: 3000,
      enabled: enableQuery,
    }
  )

  const { balanceFormatted } = useBalance(asset)

  // const assetBalance = useMemo(
  //   () => Math.round((Number(balanceFormatted) + Number.EPSILON) * 10000) / 10000,
  //   [balanceFormatted]
  // )
  // const marketGas = 0
  const { marketGas } = useGas(asset)
  const transactionsWithoutGasTransactions = transactions.filter((v) => {
    return filterTokenActivity.toLowerCase() === 'all'
      ? v.value !== '0'
      : filterTokenActivity.toLowerCase() === 'receive'
      ? v.value !== '0' && v.to.toLowerCase() === networkAddress?.toLowerCase()
      : filterTokenActivity.toLowerCase() === 'send'
      ? v.value !== '0' && v.from.toLowerCase() === networkAddress?.toLowerCase()
      : false
  })
  const comparedValue = useMemo(() => {
    const token = tokenProfitLossCollection.find((v) => v.network === asset.networkName && v.token === asset.shortName)
    return token?.value ? token?.value - balanceFormatted : 0
  }, [balanceFormatted, tokenProfitLossCollection, asset])

  const plValue = useMemo(() => {
    return getAssetValueFormatted(asset.coingeckoTokenId, comparedValue)
  }, [getAssetValueFormatted, asset.coingeckoTokenId, comparedValue])
  const plPercentage = useMemo(
    () => (comparedValue / balanceFormatted) * 100,
    [balanceFormatted, comparedValue]
  ).toFixed(3)

  useEffect(() => {
    if (transactionsWithoutGasTransactions.length > 0 && (pendingTransactions || []).length > 0) {
      const removeNotPendingTransaction: Array<ContractTransaction> = []
      pendingTransactions?.forEach((tx) => {
        const completedTransaction = transactionsWithoutGasTransactions.find((v) => v.hash === tx.hash)
        if (!completedTransaction) {
          removeNotPendingTransaction.push(tx)
        }
      })
      if (removeNotPendingTransaction.length === 0) {
        setPendingTransactions(removeNotPendingTransaction)
      }
      setPendingTransactionList(removeNotPendingTransaction)
    }
  }, [transactionsWithoutGasTransactions]) // eslint-disable-line

  useEffect(() => {
    const fetchMarketGas = async () => {
      const mGasData: string = await marketGas
      setMarketGasString(mGasData)
    }
    fetchMarketGas().then()
  }, [marketGas])

  const selectedIconClass = classnames('absolute right-2 top-4')

  return (
    <SinglePageLayout showMenu BorderBottom={false} paddingClass={false}>
      <div className="px-4 pb-4">
        <div>
          <TokenAssetCard
            image={asset.image}
            dollarAmount={getAssetValueFormatted(asset.coingeckoTokenId, balanceFormatted)}
            coin={asset.title}
            assetId={assetId}
            id={assetId}
            network={network}
            coinAmount={balanceFormatted}
            exchange={asset.tokenGasFeeUnitToDisplay ? `${marketGasString} ${asset.tokenGasFeeUnitToDisplay}` : ''}
            symbol={asset.title}
            isFavorite={asset.isFavorite}
          />

          <div className="my-4 gap-4 justify-between flex items-center">
            <DataCard
              width="50%"
              title={t('Token.tokenPrice', { token: asset.title })}
              amount={`$${getMarketPrice(asset.coingeckoTokenId)}`}
              percentage={getMarket24HourChange(asset.coingeckoTokenId)}
            />
            <DataCard width="50%" title={t('Token.profitLoss')} amount={plValue} percentage={plPercentage} />
          </div>

          {asset && (
            <a
              href={getChartUrl(asset.coingeckoTokenId.toLocaleLowerCase().replace(/\s+/g, '-'))}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <DataCard
                title={t('Token.priceChart')}
                icon={
                  <Icon
                    icon={<ExternalLinkIcon className="dark:fill-custom-white fill-custom-black" />}
                    size="medium"
                  />
                }
              />
            </a>
          )}

          <div className="flex items-center justify-between mt-4">
            <CustomTypography type="secondary" variant="subtitle">
              {t('Token.activity')}
            </CustomTypography>

            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button variant="light" className="font-extrabold" size="md">
                  {filterTokenActivity} <CaretDownIcon />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Token Activity filter"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={isTokenFilter}
                onSelectionChange={setTokenFilter}
                itemClasses={{ selectedIcon: selectedIconClass }}
              >
                {ACTIVITY_FILTER.map((activityItems) => (
                  <DropdownItem
                    key={activityItems.key}
                    startContent={<div className="mr-3">{activityItems.icon}</div>}
                    className="py-3 font-extrabold pr-8"
                    selectedIcon={
                      activityItems.key === isTokenFilter && (
                        <CheckIcon className="w-4 h-4 bg-gradient-primary rounded-full" />
                      )
                    }
                  >
                    {activityItems.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {pendingTransactionList.map((data) => (
          <div key={data.hash} data-testid={data.hash}>
            <TokenActivity
              page="Token"
              type="Send"
              date={moment.unix(data.time as number).format('MMM. DD [at] hh:mm A')}
              price={`${data.value} ${asset.title}`}
              status={'Pending'}
              transactionHash={data.hash}
              network={network}
              assetId={assetId}
            />
          </div>
        ))}

        {isLoading ? (
          [0, 1, 2].map((id) => (
            <div className="flex px-4 mt-4" key={id}>
              <Loader variant="rounded" className="w-8 h-8" />
              <div className="flex flex-1">
                <div className="flex flex-col w-1/2 pl-5 gap-1">
                  <Loader variant="text" className="!w-9/12" />
                  <Loader variant="text" />
                </div>
                <div className="flex flex-col gap-1 w-1/2 pl-12">
                  <Loader variant="text" />
                  <Loader variant="text" />
                </div>
              </div>
            </div>
          ))
        ) : transactionsWithoutGasTransactions && transactionsWithoutGasTransactions.length > 0 ? (
          transactionsWithoutGasTransactions.map((data) => (
            <div key={data.hash} data-testid={data.hash}>
              <TokenActivity
                transactionHash={data.hash}
                page="Token"
                type={data.from.toLowerCase() === (networkAddress?.toLowerCase() || '') ? 'Send' : 'Received'}
                date={moment.unix(data.time as number).format('MMM. DD [at] hh:mm A')}
                price={`${data.value} ${asset.title}`}
                // status={'Completed'}
                status={data.status && data.status !== 'Invalid' ? 'Completed' : !data.status ? 'Completed' : 'Failed'}
                network={network}
                assetId={assetId}
                tokenDecimal={data.tokenDecimal}
              />
            </div>
          ))
        ) : (
          <div className="flex space-y-3 flex-col items-center mt-4">
            <Image width={160} height={80} src={NoActivity} fallbackSrc={NoActivity} alt="No Activity" />
            <CustomTypography type="secondary" variant="body">
              {t('Token.noActivitiesYet')}
            </CustomTypography>
          </div>
        )}
      </div>
    </SinglePageLayout>
  )
}

export default TokenAsset
