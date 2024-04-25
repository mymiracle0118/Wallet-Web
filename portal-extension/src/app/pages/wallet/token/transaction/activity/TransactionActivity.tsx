import moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'

import { Divider } from '@nextui-org/react'
import { HyperlinkIcon, SpinnerIcon } from '@portal/portal-extension/src/app/components/Icons'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import { ContractTransaction } from '@portal/shared/services/etherscan'
import { ITransactionActivityProps, NetworkToken } from '@portal/shared/utils/types'
import DAI from 'assets/coins/DAI.svg'
import WETH from 'assets/coins/WETH.svg'
import { Button, CustomTypography, TokenActivity, TokenAddressButton, TokenSwapActivity } from 'components'
import { useNavigate } from 'lib/woozie'
import BlockDetails from './BlockDetails'

const TransactionActivity = ({
  txStatus = 'Pending 3/12',
  page,
  disableClick = false,
  swapTokens = false,
  openModal,
  network,
  transactionHash,
  assetId,
  blockNumber,
  matchedTransaction, // used to show failed transaction
}: ITransactionActivityProps) => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const [transaction, setTransaction] = useState<ContractTransaction>()
  const networkFactory = NetworkFactory.selectByNetworkId(assetId as string)
  const { enableHideBalance, currentAccount, addressBook } = useSettings()
  const { getNetworkToken, getAccountNetworkAddresses, walletsList } = useStore()
  const [isLoading, setLoading] = useState<boolean>(true)
  const asset: NetworkToken = getNetworkToken(assetId as string)
  const address = networkFactory.getAddress()
  const explorerURL = networkFactory?.getBlockExplorerURL(transactionHash as string)

  const accountAddresses = getAccountNetworkAddresses(asset) as any
  useEffect(() => {
    if (matchedTransaction && !transaction) {
      setTransaction(matchedTransaction as ContractTransaction)
      setLoading(false)
    }
  }, [matchedTransaction])

  useEffect(() => {
    if (txStatus && transactionHash && blockNumber) {
      if (txStatus !== 'Failed') {
        networkFactory
          .getTransaction(transactionHash)
          .then((tx: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            if (tx) {
              setTransaction(tx)
              setLoading(false)
            }
          })
          .catch((e: any) => {
            console.error('Error in getTransaction :: ', e)
          })
      } else {
        setLoading(false)
      }
    }
  }, [transactionHash, blockNumber, network, txStatus])

  const handleViewTransactionExplorer = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newWindow = window.open(explorerURL, '_blank')
    if (newWindow) {
      newWindow.focus()
    }
  }

  const transactionAmount = useMemo(() => {
    if (txStatus === 'Cancelled') {
      return '0'
    }
    return transaction ? transaction?.value || matchedTransaction?.value || '0' : matchedTransaction?.value || '0'
  }, [txStatus, transaction])

  const fromAddress = useMemo(
    () => (transaction ? transaction?.from || '' : matchedTransaction?.address || ''),
    [transaction, matchedTransaction]
  )
  const toAddress = useMemo(
    () => (transaction ? transaction?.to || '' : matchedTransaction?.to || ''),
    [transaction, matchedTransaction]
  )

  const getAddressUsername = (address: string): string => {
    const shortName = asset?.isEVMNetwork ? 'ETH' : assetId
    if (
      currentAccount &&
      shortName &&
      walletsList[currentAccount.id]?.[shortName]?.address.toLowerCase() === address.toLowerCase()
    ) {
      return `@${currentAccount.username}`
    }
    const account = accountAddresses.find((account: any) => account.address.toLowerCase() === address.toLowerCase())
    if (account && account.username) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `@${account?.username}`
    }

    const addressMatches = addressBook.find((user) => user.address.toLowerCase() === address.toLowerCase())
    if (addressMatches) {
      return `@${addressMatches?.username}`
    }
    return ''
  }

  return (
    <SinglePageTitleLayout
      title="Activity"
      paddingClass={false}
      customGoBack
      onClickAction={() => navigate(`/token/${network}/${assetId as string}`)}
      className="py-4 relative"
    >
      {isLoading && (
        <div className="absolute left-0 right-0 top-[12%] flex justify-center h-full w-full z-20 text-center">
          <div className="text-center flex flex-col items-center mx-auto">
            <SpinnerIcon className="w-8 h-7 block" />
            <CustomTypography variant="small" className="mt-1">
              {t('Actions.pleaseWait')}
            </CustomTypography>
          </div>
        </div>
      )}

      {!isLoading && txStatus && (
        <div className="flex flex-col h-full">
          <div>
            {!swapTokens ? (
              <TokenActivity
                page={page}
                type={
                  transaction
                    ? transaction?.from?.toLowerCase() === address.toLowerCase()
                      ? 'Send'
                      : 'Received'
                    : matchedTransaction?.from?.toLowerCase() === address.toLowerCase()
                    ? 'Send'
                    : 'Received'
                }
                date={
                  transaction?.time
                    ? moment.unix(transaction?.time as unknown as number).format('MMM. DD [at] hh:mm A')
                    : ''
                }
                price={transactionAmount}
                status={txStatus}
                disableClick={disableClick}
                hideBalance={enableHideBalance}
                tokenName={asset.title}
              />
            ) : (
              <TokenSwapActivity
                type="Settings"
                disableRedirect
                from="DAI"
                fromImage={<DAI />}
                to="WETH"
                toImage={<WETH />}
                date={moment.unix(transaction?.time as unknown as number).format('MMM. DD [at] hh:mm A')}
                price="≤ 0.04 WETH"
                status="Scheduled"
              />
            )}
          </div>

          {txStatus === 'Pending' && (
            <div className="px-4 pb-4">
              <BlockDetails />
            </div>
          )}

          <Divider />

          {explorerURL && (
            <div className="p-4">
              <Button
                variant="bordered"
                color="outlined"
                onClick={handleViewTransactionExplorer}
                className="flex items-center gap-2"
              >
                {t('Token.viewTransactionExplorer')} <HyperlinkIcon className="w-5 h-5" />
              </Button>
            </div>
          )}

          <div className="flex-1 divide-y divide-solid divide-custom-white10 [&>div]:min-h-[3.5rem]">
            <div className="flex items-center justify-between px-4">
              <CustomTypography variant="subtitle">{t('Labels.from')}</CustomTypography>
              <div className="flex items-center gap-2">
                <TokenAddressButton enableCopy address={fromAddress} className="text-xs" />
                <CustomTypography variant="subtitle">{fromAddress && getAddressUsername(fromAddress)}</CustomTypography>
              </div>
            </div>
            <div className="flex items-center justify-between px-4">
              <CustomTypography variant="subtitle">{t('Labels.to')}</CustomTypography>
              <div className="flex items-center gap-2">
                <TokenAddressButton enableCopy address={toAddress} className="text-xs" />
                <CustomTypography variant="subtitle">{toAddress && getAddressUsername(toAddress)}</CustomTypography>
              </div>
            </div>
            {!swapTokens &&
            transaction?.from === address &&
            transaction?.networkFees &&
            Number(transaction.networkFees) > 0 ? (
              <div className="flex items-center justify-between px-4">
                <CustomTypography variant="subtitle">{t('Network.networkFee')}</CustomTypography>
                <div className="text-right">
                  <CustomTypography variant="subtitle">
                    {!enableHideBalance ? `${transaction?.networkFees || ''} ${asset.title || ''}` : '**'}
                  </CustomTypography>
                </div>
              </div>
            ) : null}

            {page === 'Settings' && (
              <div className="p-3">
                <div className="rounded-md flex p-4 text-custom-white bg-gradient-bg">
                  <CustomTypography variant="subtitle">
                    {swapTokens
                      ? t('ScheduledTransaction.totalSavedByScheduling')
                      : t('ScheduledTransaction.feeSavedByScheduling')}
                  </CustomTypography>

                  <div className="w-2/4 text-right">
                    <CustomTypography variant="subtitle">0.0014 WETH</CustomTypography>
                    <CustomTypography variant="body" className="dark:text-custom-white80">
                      $5.2514
                    </CustomTypography>
                  </div>
                </div>
              </div>
            )}
          </div>

          {asset?.isEVMNetwork && transaction && txStatus === 'Pending' && (
            <div className="px-4">
              <Button onClick={openModal} color="outlined" className="hover:bg-custom-grey10">
                {t('Token.cancelTransaction')}
              </Button>
            </div>
          )}
        </div>
      )}
    </SinglePageTitleLayout>
  )
}

export default TransactionActivity
