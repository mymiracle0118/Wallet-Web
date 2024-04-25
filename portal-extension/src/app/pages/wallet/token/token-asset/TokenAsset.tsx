/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { CustomTypography, DataCard, TokenActivity, TokenAssetCard } from 'app/components'
import classnames from 'classnames'
import SinglePageLayout from 'layouts/single-page-layout/SinglePageLayout'
import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Skeleton } from '@nextui-org/react'
import { useBalance } from '@portal/shared/hooks/useBalance'
import { useGas } from '@portal/shared/hooks/useGas'
import { usePricing } from '@portal/shared/hooks/usePricing'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { ContractTransaction } from '@portal/shared/services/etherscan'
import { IActivityFilterProps, NetworkToken } from '@portal/shared/utils/types'
import { CaretDownIcon, CheckRoundedGreyIcon, CheckRoundedPrimaryIcon } from '@src/app/components/Icons'
import { ACTIVITY_FILTER } from '@src/constants/content'
import NoActivity from 'assets/images/no-activity.png'
import { createLocationState, useNavigate } from 'lib/woozie'
const TokenAsset = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { pathname } = createLocationState()
  const { setPendingTransactions, pendingTransactions } = useWallet()
  const { getMarketPrice, getMarket24HourChange, getAssetValueFormatted, getGasValue } = usePricing()

  const [isTokenFilter, setTokenFilter] = useState(new Set(['All']))
  const [marketGasString, setMarketGasString] = useState<string>('')
  const { getNetworkToken } = useStore()
  const { enableHideBalance } = useSettings()
  const filterTokenActivity = useMemo(() => Array.from(isTokenFilter).join(', ').replaceAll('_', ' '), [isTokenFilter])

  const paths = pathname.split('/')
  const network: string = paths[paths.length - 2]
  const assetId: string = paths[paths.length - 1] // shortName

  const asset: NetworkToken = getNetworkToken(assetId)
  const networkAddress = asset?.address
  const networkFactory = NetworkFactory.selectByNetworkId(asset.shortName)

  const filteredPendingTransactions = pendingTransactions.filter(
    (transaction: ContractTransaction) =>
      transaction.shortName === asset.shortName && transaction?.address?.toLowerCase() === networkAddress.toLowerCase()
  )

  const [pendingTransactionList, setPendingTransactionList] =
    useState<ContractTransaction[]>(filteredPendingTransactions)
  const [transactions, setTransactions] = useState<ContractTransaction[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { balanceFormatted } = useBalance(asset)
  const { marketGas } = useGas(asset)

  const transactionsWithoutGasTransactions = useMemo(() => {
    return transactions.filter((v) => {
      return filterTokenActivity.toLowerCase() === 'all'
        ? true
        : // ? v.value !== '0' // NOTE : removed condition of 0 transaction bcoz when cancel transaction pending list shall be update with same hash
        filterTokenActivity.toLowerCase() === 'received'
        ? v.to.toLowerCase() === networkAddress?.toLowerCase()
        : filterTokenActivity.toLowerCase() === 'send'
        ? v.from.toLowerCase() === networkAddress?.toLowerCase()
        : false
    })
  }, [filterTokenActivity, transactions])

  useEffect(() => {
    if (transactionsWithoutGasTransactions.length > 0) {
      setIsLoading(false)
      if ((pendingTransactionList || []).length > 0) {
        const removeNotPendingTransaction: Array<ContractTransaction> = []
        pendingTransactionList?.forEach((tx) => {
          const completedTransaction = transactionsWithoutGasTransactions.find(
            (v) => (v.hash === tx.hash || Number(v.nonce) === tx.nonce) && tx.status !== 'Failed'
          )
          if (!completedTransaction) {
            removeNotPendingTransaction.push(tx)
          }
        })
        if (removeNotPendingTransaction.length === 0) {
          setPendingTransactions(removeNotPendingTransaction)
        }
        setPendingTransactionList(removeNotPendingTransaction)
      }
    }
  }, [transactionsWithoutGasTransactions]) // eslint-disable-line
  useEffect(() => {
    // Function to be executed on component mount
    const fetchData = async () => {
      const txs = await networkFactory.getTransactions(network, networkAddress, asset.tokenContractAddress)
      setTransactions(txs)
      setIsLoading(false)
    }
    fetchData()
    const intervalId = setInterval(() => {
      fetchData()
    }, 6000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const fetchMarketGas = async () => {
      const mGasData: string = await marketGas
      setMarketGasString(mGasData)
    }
    fetchMarketGas().then()
  }, [marketGas])

  const selectedIconClass = classnames('absolute right-2 top-4')
  const dollarAmount = getAssetValueFormatted(asset.coingeckoTokenId, balanceFormatted)
  return (
    <SinglePageLayout
      showMenu
      BorderBottom={false}
      paddingClass={false}
      disableBack
      customGoBack
      onClickAction={() => navigate(`/home`)}
    >
      <div className="px-4 pb-4">
        <div>
          <TokenAssetCard
            image={asset.image}
            dollarAmount={Number(dollarAmount) > 0 ? dollarAmount : ''}
            coin={asset.title}
            assetId={assetId}
            id={assetId}
            network={network}
            coinAmount={balanceFormatted}
            exchange={asset.tokenGasFeeUnitToDisplay ? `${marketGasString} ${asset.tokenGasFeeUnitToDisplay}` : ''}
            symbol={asset.title}
            isFavorite={asset.isFavorite}
            hideBalance={enableHideBalance}
            gasPriceInCurrency={getGasValue(asset.coingeckoTokenId, Number(marketGasString)) as string}
          />

          {asset && !asset.isCustom && asset.networkName !== 'SUPRA' && (
            <div className="my-4 gap-4 justify-between flex items-center">
              <DataCard
                width="100%"
                title={t('Token.tokenPrice', { token: asset.title })}
                amount={`$${getMarketPrice(asset.coingeckoTokenId)}`}
                percentage={getMarket24HourChange(asset.coingeckoTokenId)}
                asset={asset}
              />
            </div>
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
                onSelectionChange={setTokenFilter as any}
                itemClasses={{ selectedIcon: selectedIconClass }}
              >
                {ACTIVITY_FILTER.map((activityItems: IActivityFilterProps) => (
                  <DropdownItem
                    key={activityItems.key}
                    startContent={<div className="mr-3">{activityItems.icon}</div>}
                    className="py-3 font-extrabold pr-8"
                    selectedIcon={
                      activityItems.key === filterTokenActivity ? (
                        <CheckRoundedPrimaryIcon className="w-4 h-4 rounded-full mr-2" />
                      ) : (
                        <CheckRoundedGreyIcon className="w-4 h-4 rounded-full mr-2" />
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
              date={data.time ? moment.unix(data.time as number).format('MMM. DD [at] hh:mm A') : ''}
              price={data.value}
              status={data.status ?? 'Pending'}
              transactionHash={data.hash}
              network={network}
              assetId={assetId}
              hideBalance={enableHideBalance}
              tokenName={asset.title}
            />
          </div>
        ))}

        {isLoading
          ? [0, 1, 2].map((id) => (
              <div className="flex px-2 mt-4" key={id}>
                <div className="w-full flex items-center gap-3 mb-3">
                  <div>
                    <Skeleton className="flex rounded-full w-8 h-8" />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <Skeleton className="h-2.5 w-full rounded-lg" />
                    <Skeleton className="h-2.5 w-full rounded-lg" />
                  </div>
                </div>
              </div>
            ))
          : transactionsWithoutGasTransactions &&
            transactionsWithoutGasTransactions.length > 0 &&
            transactionsWithoutGasTransactions.map((data) => (
              <div key={data.hash} data-testid={data.hash}>
                <TokenActivity
                  transactionHash={data.hash}
                  page="Token"
                  type={
                    data.to.toLowerCase() === data.from.toLowerCase() && Array.from(isTokenFilter)[0] !== 'All'
                      ? Array.from(isTokenFilter)[0]
                      : data.from.toLowerCase() === (networkAddress?.toLowerCase() || '')
                      ? 'Send'
                      : 'Received'
                  }
                  date={moment.unix(data.time as number).format('MMM. DD [at] hh:mm A')}
                  price={data.value}
                  tokenName={asset.title}
                  // status={'Completed'}
                  status={
                    data.status && data.status !== 'Invalid'
                      ? 'Completed'
                      : !data.status
                      ? !data.status && Number(data.value) > 0
                        ? 'Completed'
                        : 'Cancelled'
                      : 'Failed'
                  }
                  network={network}
                  assetId={assetId}
                  tokenDecimal={data.tokenDecimal}
                  hideBalance={enableHideBalance}
                />
              </div>
            ))}

        {!isLoading && pendingTransactionList.length === 0 && transactionsWithoutGasTransactions.length === 0 && (
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
