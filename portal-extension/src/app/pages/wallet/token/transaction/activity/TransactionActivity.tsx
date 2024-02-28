import moment from 'moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// import { useWallet } from '@portal/shared/hooks/useWallet'
// import { usePricing } from '@portal/shared/hooks/usePricing'

import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'

import { Divider } from '@nextui-org/react'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { ContractTransaction } from '@portal/shared/services/etherscan'
import { ITransactionActivityProps } from '@portal/shared/utils/types'
import DAI from 'assets/coins/DAI.svg'
import WETH from 'assets/coins/WETH.svg'
import { Button, CustomTypography, TokenActivity, TokenAddressButton, TokenSwapActivity } from 'components'
import BlockDetails from './BlockDetails'

const TransactionActivity = ({
  txStatus = 'Pending 3/12',
  page,
  disableClick = false,
  swapTokens = false,
  openModal,
  network,
  // assetId,
  transactionHash,
}: ITransactionActivityProps) => {
  const { t } = useTranslation()

  // const { getAsset } = useWallet()
  // const { getAssetValueFormatted } = usePricing()

  const [transaction, setTransaction] = useState<ContractTransaction>()
  // const [receipt, setReceipt] = useState<string>()

  const networkFactory = NetworkFactory.selectByNetworkId(network)
  // const asset: NetworkToken = getNetworkToken(assetId)
  const { tokensList } = useWallet()

  const address = networkFactory.getAddress()
  useEffect(() => {
    if (transactionHash) {
      networkFactory
        .getTransaction(transactionHash)
        .then((tx: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          setTransaction(tx)
        })
        .catch((e: any) => {
          console.error('Error in getTransaction :: ', e)
        })
    }
  }, [transactionHash, network])

  // useEffect(() => {
  //   if (transaction) {
  //     //const [, query] = window.location.href.split('#')[1].split('?')
  //     //const params = Object.fromEntries(new URLSearchParams(query))
  //     //tokenDecimal = params.tokenDecimal
  //   }
  // }, [transaction])

  const handleViewTransactionExplorer = () => {
    const url = networkFactory?.getBlockExplorerURL(transactionHash)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newWindow = window.open(url, '_blank')
    if (newWindow) {
      newWindow.focus()
    }
  }

  return (
    <SinglePageTitleLayout title="Activity" paddingClass={false} className="py-4">
      {txStatus && (
        <div className="flex flex-col h-full">
          <div>
            {!swapTokens ? (
              <TokenActivity
                page={page}
                type={transaction?.from.toLowerCase() === address.toLowerCase() ? 'Send' : 'Received'}
                date={moment.unix(transaction?.time as unknown as number).format('MMM. DD [at] hh:mm A')}
                price={transaction?.value || '0'}
                status={txStatus}
                disableClick={disableClick}
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

          {network !== 'SUPRA' && (
            <div className="p-4">
              <Button variant="bordered" color="outlined" onClick={handleViewTransactionExplorer}>
                {t('Token.viewTransactionExplorer')}
              </Button>
            </div>
          )}

          <div className="flex-1 divide-y divide-solid divide-custom-white10 [&>div]:min-h-[3.5rem]">
            <div className="flex items-center justify-between px-4">
              <CustomTypography variant="subtitle">{t('Labels.from')}</CustomTypography>
              <TokenAddressButton enableCopy address={transaction?.from || ''} className="text-xs" />
            </div>
            <div className="flex items-center justify-between px-4">
              <CustomTypography variant="subtitle">{t('Labels.to')}</CustomTypography>
              <TokenAddressButton enableCopy address={transaction?.to || ''} className="text-xs" />
            </div>
            {
              !swapTokens && transaction?.from === address ? (
                <div className="flex items-center justify-between px-4">
                  <CustomTypography variant="subtitle">{t('Network.networkFee')}</CustomTypography>
                  <div className="text-right">
                    <CustomTypography variant="subtitle">
                      {transaction?.networkFees} {tokensList[network]?.title}
                    </CustomTypography>
                    {/* <CustomTypography variant="body" className="dark:text-custom-white40">
                      {getAssetValueFormatted('ethereum', Number(transaction?.networkFees))}
                    </CustomTypography> */}
                  </div>
                </div>
              ) : null
              // TODO :: Swap Functionality code update when use swap
              // (
              //   <>
              //     <DetailsWrapper>
              //       <CustomTypography variant="h4">{t('Labels.rate')}</CustomTypography>
              //       <div style={{ textAlign: 'right' }}>
              //         <CustomTypography variant="h4">1 DAI ≥ 0.0004 WETH</CustomTypography>
              //       </div>
              //     </DetailsWrapper>
              //     <DetailsWrapper>
              //       <CustomTypography variant="h4">{t('Token.gasFee')}</CustomTypography>
              //       <div style={{ textAlign: 'right' }}>
              //         <CustomTypography variant="h4">{t('Token.reatTimePrice')}</CustomTypography>
              //       </div>
              //     </DetailsWrapper>
              //     <DetailsWrapper>
              //       <CustomTypography variant="h4">{t('Token.dueTime')}</CustomTypography>
              //       <div style={{ textAlign: 'right' }}>
              //         <CustomTypography variant="h4">Oct. 5 at 9:36 PM</CustomTypography>
              //         <CustomTypography variant="body1">6 hours from now</CustomTypography>
              //       </div>
              //     </DetailsWrapper>
              //   </>
              // )
            }

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

          {txStatus !== 'Completed' && (
            <div className="px-4">
              <Button onClick={openModal} color="primary">
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
