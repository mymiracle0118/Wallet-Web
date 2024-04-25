/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { goBack } from 'lib/woozie'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useGas } from '@portal/shared/hooks/useGas'
import { usePricing } from '@portal/shared/hooks/usePricing'
import { useWallet } from '@portal/shared/hooks/useWallet'

import { Avatar } from '@nextui-org/react'
import { useSessionStore } from '@portal/shared/hooks/useSessionStore'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { GasOption, ISendReviewProps } from '@portal/shared/utils/types'
import CustomThumbnail from '@src/app/components/CustomThumbnail'
import { SpinnerIcon } from '@src/app/components/Icons'
import { ethersCommify } from '@src/utils/ethersCommify'
import { generateRandomString } from '@src/utils/generateRandomString'
import { Button, CustomTypography, TokenAddressButton, useModalContext } from 'app/components'
import PasswordPromptModal from 'app/pages/wallet/PasswordPromptModal'
import NetworkETH from 'assets/nft-networks/network-eth.svg'
import { useNavigate } from 'lib/woozie'

const SendReview = ({ sendLater = false }: ISendReviewProps) => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const { setModalData } = useModalContext()
  const { sendTransaction, transaction, pendingTransactions, setPendingTransactions } = useWallet()
  const { getPassword } = useSessionStore()
  const [loading, setLoading] = useState<boolean>(false)
  const { enablePasswordProtection, setRecentIntractAddress } = useSettings()
  const { getGasValueFormatted } = usePricing(transaction?.asset)
  const { maxFeePerGas, maxPriorityFeePerGas, gasLimit, estimatedTransactionCost, estimatedTransactionTime } = useGas(
    transaction?.asset,
    transaction?.asset.shortName === 'ETH' ? transaction?.gasOption : GasOption.Low
  )
  const walletNetworkName = transaction?.asset.isEVMNetwork
    ? 'ETH'
    : transaction?.asset?.isSupraNetwork
    ? 'SUPRA'
    : transaction?.asset.networkName
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false)

  const [estimatedEtherFees, setEstimatedEthersFees] = useState<number>(0)
  const handleSendTransaction = async (password: string) => {
    try {
      setLoading(true)
      if (transaction) {
        setRecentIntractAddress(transaction?.to, walletNetworkName)
        const txnData = await sendTransaction(maxPriorityFeePerGas, maxFeePerGas, gasLimit, password)

        setLoading(false)
        if (txnData && txnData.txHash) {
          navigate(
            `/token/${transaction.asset.networkName}/${transaction.asset.shortName}/activity/${txnData.txHash}?showModal=true`
          )
        } else {
          setModalData({
            networkName: transaction?.asset.networkName,
            type: 'transaction_failed',
            errorMsg: 'Something went wrong',
          })
        }
      }
    } catch (error) {
      const failedTransaction = {
        address: transaction.asset.address,
        from: transaction.asset.address,
        hash: generateRandomString(64),
        networkName: transaction.asset.networkName,
        nonce: 0,
        shortName: transaction.asset.shortName,
        value: transaction.amount,
        status: 'Failed',
        to: transaction.to,
      }
      pendingTransactions.push(failedTransaction)
      setPendingTransactions(pendingTransactions)
      setLoading(false)

      let message = error
      if (error instanceof Error) message = error.message
      // const errMsg = message.match(/^(.*?)\s?\(/)
      setModalData({
        networkName: transaction?.asset.networkName,
        type: 'transaction_failed',
        errorMsg: message,
        url: `/token/${transaction?.asset.networkName}/${transaction?.asset.shortName}`,
      })
    }
  }
  const handlePasswordPromptSuccess = async () => {
    setOpenPasswordModal(false)
    const password = getPassword()
    await handleSendTransaction(password as string)
  }

  const checkPasswordAndSendTransaction = async () => {
    if (!transaction) {
      return
    }
    if (!enablePasswordProtection) {
      const password = getPassword()
      await handleSendTransaction(password as string)
    } else {
      setOpenPasswordModal(true)
    }
  }

  useEffect(() => {
    if (!transaction) {
      goBack()
    }
  }, [transaction])
  useEffect(() => {
    const fetchTransactionCost = async () => {
      try {
        const cost = await estimatedTransactionCost
        setEstimatedEthersFees(cost || 100)
      } catch (error) {
        console.error('Failed to fetch transaction cost:', error)
        setEstimatedEthersFees(100)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchTransactionCost()
  }, [estimatedTransactionCost])

  if (!transaction) {
    return null
  }

  const total = () => {
    let totalValue = ''
    const gasAmountUSD = getGasValueFormatted(transaction.asset.coingeckoTokenId, estimatedEtherFees)
    const transactionAmountUSD = getGasValueFormatted(transaction.asset.coingeckoTokenId, Number(transaction.amount))
    if (['Native', 'ERC20'].includes(transaction.asset.tokenType)) {
      totalValue = ethersCommify((transactionAmountUSD + gasAmountUSD).toFixed(8))
      return Number(totalValue) > 0 ? `$${totalValue}` : ''
    }
    totalValue = ethersCommify((transactionAmountUSD + gasAmountUSD).toFixed(8))
    return Number(totalValue) > 0 ? `$${totalValue}` : ''
  }

  const totalValue = (parseFloat(transaction.amount) + parseFloat(estimatedEtherFees.toString())).toFixed(6)
  const sendDollarAmount = getGasValueFormatted(transaction.asset.coingeckoTokenId, Number(transaction.amount))
  const estimatedFeeDollarValue = getGasValueFormatted(transaction.asset.coingeckoTokenId, estimatedEtherFees)
  return (
    <div
      className="h-[37.5rem] flex flex-col overflow-y-auto p-4 rounded-xl justify-between"
      style={{
        background: `${
          ['Native', 'ERC20'].includes(transaction.asset.tokenType)
            ? '#2C2D3C url(/images/backgrounds/onboarding-bg.svg) no-repeat center'
            : undefined
        }`,
      }}
    >
      {['Native', 'ERC20'].includes(transaction.asset.tokenType) && (
        <div className="my-4 space-y-2">
          <div className="h-14 w-14 flex justify-center items-center mx-auto text-[3rem]">
            {!transaction?.asset.image ? (
              <CustomThumbnail thumbName={transaction?.asset.title} className="w-12 h-12 text-md" />
            ) : (
              <Avatar
                src={transaction?.asset.image}
                alt={transaction?.asset.title}
                className="rounded-full w-12 h-12 mr-2 bg-custom-white"
              />
            )}
          </div>
          <div className="text-center">
            <CustomTypography variant="h4" type="secondary">
              {sendLater ? t('Token.requestSending') : t('Token.send')}
            </CustomTypography>
            <CustomTypography variant="h1">{`${transaction.amount} ${transaction?.asset.title}`}</CustomTypography>
            <CustomTypography type="secondary" variant="body">
              {sendDollarAmount > 0 ? `$${sendDollarAmount}` : ''}
            </CustomTypography>
          </div>
        </div>
      )}
      {['erc721'].includes(transaction.asset.tokenType) && (
        <div
          style={{ backgroundImage: `url(${transaction?.asset?.metadata?.image})` }}
          className="bg-cover bg-center rounded-lg w-full h-[17.5rem] flex justify-end mb-6"
        >
          <div className="justify-end w-[4.5rem] h-[4.5rem]">
            <NetworkETH />
          </div>
        </div>
      )}

      <div className="rounded-lg bg-surface-dark-alt p-4 -mt-24">
        <div className="flex justify-between items-center">
          <CustomTypography variant="subtitle" className="ml-1">
            {t('Labels.to')}
          </CustomTypography>
          <TokenAddressButton address={transaction.to} enableCopy className="text-xs" />
        </div>

        <CustomTypography variant="body" type="secondary" className="text-right mt-2 mb-4">
          {transaction.asset.subTitle} network
        </CustomTypography>

        {sendLater ? (
          <div className="p-4 rounded-[12px] bg-custom-grey10">
            <div className="flex">
              <CustomTypography variant="subtitle" className="flex-1">
                {t('Token.idealGasFeeLabel')}
              </CustomTypography>
              <div>
                <CustomTypography className="text-right" variant="subtitle">
                  ≤ 0.0002 ETH
                </CustomTypography>
                <CustomTypography className="text-right" variant="body" type="secondary">
                  $0.57
                </CustomTypography>
              </div>
            </div>
            <div className="flex mt-4">
              <CustomTypography variant="subtitle" className="flex-1">
                {t('Token.dueTime')}
              </CustomTypography>
              <div>
                <CustomTypography className="text-right" variant="subtitle">
                  Feb. 13 at 3:15 PM
                </CustomTypography>
              </div>
            </div>
            <div className="flex mt-4">
              <CustomTypography variant="subtitle" className="flex-1">
                {t('Token.totalCost')}
              </CustomTypography>
              <div>
                <CustomTypography className="text-right" variant="subtitle">
                  ≤ 1.0002 ETH
                </CustomTypography>
                <CustomTypography className="text-right" variant="body" type="secondary">
                  $2,893.57
                </CustomTypography>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex">
              <CustomTypography variant="subtitle" className="flex-1">
                {t('Token.estimatedGasFee')}
              </CustomTypography>
              <div>
                <CustomTypography className="text-right" variant="subtitle">
                  {estimatedEtherFees} {transaction.asset.title}
                </CustomTypography>
                <CustomTypography className="text-right" variant="body" type="secondary">
                  {estimatedFeeDollarValue ? `$${estimatedFeeDollarValue}` : ''}
                </CustomTypography>
              </div>
            </div>
            <div className="flex mt-4">
              <CustomTypography variant="subtitle" className="flex-1">
                {t('Token.estimatedTime')}
              </CustomTypography>
              <div>
                <CustomTypography className="text-right" variant="subtitle">
                  {`< ${estimatedTransactionTime}`}
                </CustomTypography>
              </div>
            </div>
            <div className="flex mt-4">
              <CustomTypography variant="subtitle" className="flex-1">
                {t('Token.totalCost')}
              </CustomTypography>
              <div>
                <CustomTypography className="text-right" variant="subtitle">
                  {`${totalValue} ${transaction?.asset.title}`}
                </CustomTypography>
                <CustomTypography className="text-right" variant="body" type="secondary">
                  {total()}
                </CustomTypography>
              </div>
            </div>
          </>
        )}

        {sendLater && (
          <div className="flex flex-1 mt-2">
            <CustomTypography variant="body">{t('Token.swapConfirmInstruction')}</CustomTypography>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 space-x-2">
        <Button
          variant="bordered"
          className="w-1/2"
          onClick={goBack}
          color={`${loading ? 'disabled' : 'outlined'}`}
          isDisabled={loading}
        >
          {t('Actions.back')}
        </Button>
        <Button
          data-test-id="button-send"
          className="w-1/2"
          onClick={checkPasswordAndSendTransaction}
          color={`${loading ? 'disabled' : 'primary'}`}
          isDisabled={loading}
          isLoading={loading}
          spinner={<SpinnerIcon />}
        >
          {!loading && t('Actions.send')}
        </Button>
      </div>

      <PasswordPromptModal
        modalState={openPasswordModal}
        closePromptModal={() => setOpenPasswordModal(false)}
        onSuccess={handlePasswordPromptSuccess}
      />
    </div>
  )
}

export default SendReview
