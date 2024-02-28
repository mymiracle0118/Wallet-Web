/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { ethers } from 'ethers'
import { go, goBack } from 'lib/woozie'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useGas } from '@portal/shared/hooks/useGas'
import { usePricing } from '@portal/shared/hooks/usePricing'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useWallet } from '@portal/shared/hooks/useWallet'

import { NetworkFactory } from '@portal/shared/factory/network.factory'

import { Button, CustomTypography, Icon, TokenAddressButton, useModalContext } from 'app/components'
import PasswordPromptModal from 'app/pages/wallet/PasswordPromptModal'
import { shortenedAddress } from 'utils/constants'
import { tokenImage } from 'utils/tokenImage'

import { Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { ISendReviewProps } from '@portal/shared/utils/types'
import { SpinnerIcon } from '@src/app/components/Icons'
import MascotFail from 'assets/images/robot-fail.svg'
import RogotParty from 'assets/images/robot-party.svg'
import NetworkETH from 'assets/nft-networks/network-eth.svg'

// import { FormProvider } from 'react-hook-form'

const SendReview = ({ sendLater = false }: ISendReviewProps) => {
  const { t } = useTranslation()
  const { setModalData } = useModalContext()
  const { sendTransaction, transaction } = useWallet()
  const [loading, setLoading] = useState<boolean>(false)
  const { enablePasswordProtection } = useSettings()
  const { getAssetValue, getAssetValueFormatted } = usePricing()

  const { maxFeePerGas, maxPriorityFeePerGas, gasLimit, estimatedTransactionCost, estimatedTransactionTime } = useGas(
    transaction.asset
  )
  const networkFactory = useMemo(() => NetworkFactory.selectByNetworkId(transaction?.asset.networkName))

  const [modalSendTransactionSuccess, setModalSendTransactionSuccess] = useState<boolean>(false)
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false)

  const [estimatedEtherFees, setEstimatedEthersFees] = useState<number>(0)
  const [transactionSuccess, setTransactionSuccess] = useState(true)
  const handlePasswordPromptSuccess = async () => {
    setOpenPasswordModal(false)
    try {
      setLoading(true)
      if (transaction) {
        const txnData = await sendTransaction(maxPriorityFeePerGas, maxFeePerGas, gasLimit)
        setTransactionSuccess(txnData?.status === 'Invalid' ? false : true)
        setModalSendTransactionSuccess(true)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      let message = 'Something is wrong!'
      if (error instanceof Error) message = error.message
      const errMsg = message.match(/^(.*?)\s?\(/)
      setModalData({
        type: 'error',
        errorMsg: errMsg && errMsg[1] ? errMsg[1] : message,
      })
    }
  }

  const handleSendTransaction = async () => {
    if (!transaction) {
      return
    }

    if (!enablePasswordProtection) {
      try {
        setLoading(true)
        const txnData = await sendTransaction(maxPriorityFeePerGas, maxFeePerGas, gasLimit)
        setTransactionSuccess(txnData?.status === 'Invalid' ? false : true)
        setModalSendTransactionSuccess(true)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setModalData({
          type: 'error',
          errorMsg: 'Something is wrong!',
        })
        console.error('Error - ', error.message)
      }
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
    const gasAmountUSD = getAssetValue(transaction.asset.coingeckoTokenId, estimatedEtherFees)
    const transactionAmountUSD = getAssetValue(transaction.asset.coingeckoTokenId, Number(transaction.amount))
    if (['Native', 'ERC20'].includes(transaction.asset.tokenType)) {
      return ethers.utils.commify((transactionAmountUSD + gasAmountUSD).toFixed(2))
    }
    return ethers.utils.commify((transactionAmountUSD + gasAmountUSD).toFixed(2))
  }

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
            <Icon icon={tokenImage(transaction?.asset.shortName || 'ETH')} size="inherit" />
          </div>
          <div className="text-center">
            <CustomTypography variant="h4" type="secondary">
              {sendLater ? t('Token.requestSending') : t('Token.send')}
            </CustomTypography>
            <CustomTypography variant="h1">{`${transaction.amount} ${transaction?.asset.title}`}</CustomTypography>
            <CustomTypography type="secondary" variant="body">
              {`${getAssetValueFormatted(transaction.asset.coingeckoTokenId, Number(transaction.amount))}`}
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
          <TokenAddressButton address={shortenedAddress(transaction.to)} enableCopy className="text-xs" />
        </div>

        <CustomTypography variant="body" type="secondary" className="text-right mt-2 mb-4">
          {transaction.asset.network} network
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
                  {`${getAssetValueFormatted(transaction.asset.coingeckoTokenId, estimatedEtherFees)}`}
                </CustomTypography>
              </div>
            </div>
            <div className="flex mt-4">
              <CustomTypography variant="subtitle" className="flex-1">
                {t('Token.estimatedTime')}
              </CustomTypography>
              <div>
                <CustomTypography className="text-right" variant="subtitle">
                  {estimatedTransactionTime}
                </CustomTypography>
              </div>
            </div>
            <div className="flex mt-4">
              <CustomTypography variant="subtitle" className="flex-1">
                {t('Token.totalCost')}
              </CustomTypography>
              <div>
                <CustomTypography className="text-right" variant="subtitle">
                  {`${transaction.amount} ${transaction?.asset.title} + Gas`}
                </CustomTypography>
                <CustomTypography className="text-right" variant="body" type="secondary">
                  {`$${total()}`}
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
        <Button variant="bordered" color="outlined" className="w-1/2" onClick={goBack}>
          {t('Actions.back')}
        </Button>
        <Button
          data-test-id="button-send"
          className="w-1/2"
          onClick={handleSendTransaction}
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

      <Modal
        backdrop="opaque"
        isOpen={modalSendTransactionSuccess}
        onClose={() => undefined}
        hideCloseButton={true}
        placement="center"
        className="max-w-[20.625rem]"
      >
        <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
          <ModalBody>
            <div className="flex flex-col items-center justify-center">
              <div className="cursor-pointer rounded-full mx-auto text-[3.5rem] h-16 w-16 flex items-center justify-center">
                <Icon icon={tokenImage(transaction?.asset.title)} size="inherit" />
              </div>
              <CustomTypography variant="h1" className="text-center my-2">
                {transactionSuccess
                  ? t('Token.youHaveSent', {
                      amount: transaction.amount,
                      token: transaction.asset.title,
                    })
                  : t('Token.failedSent', {
                      amount: transaction.amount,
                      token: transaction.asset.title,
                    })}
              </CustomTypography>

              <div className="w-40 h-40 text-[10rem] my-4">
                <Icon icon={transactionSuccess ? <RogotParty /> : <MascotFail />} size="inherit" />
              </div>

              <TokenAddressButton
                address={transaction.hash}
                enableCopy
                link={`${transaction.hash && networkFactory.getBlockExplorerURL(transaction.hash)}`}
                className="mb-2"
              />
            </div>
            <div className="flex justify-between items-center gap-2">
              <Button variant="bordered" color="outlined" onClick={() => go(-2)}>
                {t('Actions.ok')}
              </Button>
              <Button onClick={() => go(-2)} color="primary">
                {t('Token.viewBalance')}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default SendReview
