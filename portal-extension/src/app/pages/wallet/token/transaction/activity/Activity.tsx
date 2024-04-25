import { Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useStore } from '@portal/shared/hooks/useStore'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { ContractTransaction } from '@portal/shared/services/etherscan'
import { NetworkToken } from '@portal/shared/utils/types'
import { SpinnerIcon } from '@src/app/components/Icons'
import PasswordPromptModal from 'app/pages/wallet/PasswordPromptModal'
import Warning from 'assets/icons/warning.svg'
import { Button, CustomTypography, Icon, useModalContext } from 'components'
import { ethers } from 'ethers'
import { createLocationState, useNavigate } from 'lib/woozie'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TransactionActivity from './TransactionActivity'

const Activity = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [openRequestModal, setOpenRequestModal] = useState<boolean>(false)
  const { address, cancelTransaction, setPendingTransactions, pendingTransactions } = useWallet() //,getAsset
  const [transaction, setTransaction] = useState<ethers.TransactionResponse>()
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false)
  const [transactionStatus, setTransactionStatus] = useState<string>('')
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)

  const { setModalData } = useModalContext()
  const { getNetworkToken } = useStore()
  const { pathname, search } = createLocationState()
  useEffect(() => {
    if (search) {
      const value = search.split('=')[1]
      if (value) setShowSuccessModal(true)
    }
  }, [])
  const paths = pathname.split('/')
  const network: string = paths[paths.length - 4]
  const assetId: string = paths[paths.length - 3]
  const transactionHash = paths[paths.length - 1]
  const blockNumber = paths[paths.length - 1]
  const asset: NetworkToken = getNetworkToken(assetId)

  const networkFactory = useMemo(() => NetworkFactory.selectByNetworkId(asset.shortName), [asset])
  const fetchData = () => {
    if (transactionHash) {
      networkFactory
        .getTransaction(transactionHash)
        .then((tx: any) => {
          if (tx === null) {
            const removeCancelledTransaction = pendingTransactions?.filter((v: any) => v.hash !== transactionHash)
            setPendingTransactions(removeCancelledTransaction)
            // goBack() NOTE : sending back to review page if getting tx null so commented this
          } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument

            setTransaction(tx)
            if (tx.blockNumber) {
              if (tx.value == 0) {
                const updatedPedingTransaction = pendingTransactions.map((txn: any) => {
                  const trans = { ...txn }
                  if (txn.hash === transactionHash && txn.status !== 'Cancelled') {
                    trans.status = 'Cancelled'
                  }
                  return trans
                })
                setPendingTransactions(updatedPedingTransaction)
              }
              setTransactionStatus('complete')
              setOpenRequestModal(false)
            }
          }
        })
        .catch((e: any) => console.log(e))
    }
  }

  useEffect(() => {
    fetchData()
    if (transactionStatus !== 'complete') {
      const pollInterval = setInterval(() => {
        fetchData()
        if (transactionStatus === 'complete') {
          clearInterval(pollInterval) // Stop polling when status is complete
        }
      }, 5000) // Poll every 5 seconds

      return () => {
        clearInterval(pollInterval) // Clean up interval when component unmounts
      }
    }
  }, [transactionStatus, transactionHash, network])

  const type = useMemo(
    () => (transaction?.from?.toLowerCase() === address?.toLowerCase() ? 'Sent' : 'Received'),
    [address, transaction]
  )

  const matchedTransaction = pendingTransactions.find((transaction: any) => transaction.hash === transactionHash)

  useEffect(() => {
    if (matchedTransaction) setTransactionStatus(matchedTransaction.status)
  }, [matchedTransaction, pendingTransactions])

  const txStatus = useMemo(() => {
    if (!transaction) return ''
    if (transaction?.status) {
      if (transaction.status === 'Invalid') return 'Failed'
      if (transaction.status === 'Success') return 'Completed'
    } else if (transaction.blockNumber) {
      return Number(transaction.value) <= 0 ? 'Cancelled' : 'Completed'
    }

    return 'Pending'
  }, [transaction])

  // Check and remove pending transaction if the transfer is completed.
  useEffect(() => {
    if (txStatus === 'Pending') {
      setShowSuccessModal(true)
    }
    if (pendingTransactions && txStatus === 'Completed') {
      const isExist = pendingTransactions?.some(
        (t: ContractTransaction) => t.hash === transactionHash && t.shortName === asset.shortName
      )
      if (isExist) {
        const updatedTransactions = pendingTransactions?.filter(
          (t: ContractTransaction) => !(t.hash === transactionHash && t.shortName === asset.shortName)
        )
        setPendingTransactions(updatedTransactions)
      }
    }
    if (showSuccessModal && txStatus === 'Completed') {
      setModalData({
        type: 'send',
        amount: Number(transaction?.value),
        token: network,
        networkName: network,
        url: `/token/${network}/${assetId}`,
        button1Url: `/token/${network}/${assetId}/activity/${transactionHash}`,
      })
    }
  }, [txStatus])
  const handleCancelTransaction = async () => {
    setLoading(true)
    const doubleGasFee = Number(Number(ethers.formatUnits(transaction?.gasPrice, 'gwei')) * 2).toFixed(8)
    const lastIndex = pathname.lastIndexOf('/')
    const baseUrl = pathname.substring(0, lastIndex + 1)
    try {
      setLoading(false)
      setOpenRequestModal(false)
      const { nonce } = transaction
      const tx = {
        nonce,
        maxPriorityFeePerGas: ethers.parseUnits(`${doubleGasFee}`, 'gwei'),
        maxFeePerGas: ethers.parseUnits(`${doubleGasFee}`, 'gwei'),
      }
      const cancedResp = await cancelTransaction(network, tx)
      if (cancedResp && cancedResp.txHash) {
        // GET PENDING TRANSACTION'S LATEST LIST WHICH WILL HAVE CURRENT CANCELLED TRANSACTION HERE
        const pendingTransactionsUpdated = useWallet.getState().pendingTransactions
        // WHEN TRANSACTION CANCELLED SUCCESSFULLY REMOVE SAME NONCE 1ST TRANSACTION FROM PENDING LIST
        const pendingTransactionsFiltered = pendingTransactionsUpdated.filter((txn: any) => {
          return txn.nonce != nonce || (txn.nonce == nonce && txn.value == 0)
        })
        setPendingTransactions(pendingTransactionsFiltered)
        navigate(`${baseUrl}${cancedResp.txHash as string}`)
        setModalData({
          type: 'send-cancel',
          amount: Number(transaction?.value),
          token: network,
          networkName: network,
          errorMsg: 'Transaction cancelled successfully',
        })
      }
    } catch (err) {
      setLoading(false)
      const errorMessage = err.toString().match(/^Error: (.*)$/m)[1] ?? err
      setModalData({
        type: 'transaction_failed',
        amount: Number(transaction?.value),
        token: network,
        networkName: network,
        errorMsg: errorMessage.split(': ')[1] ?? errorMessage,
      })
    }
  }

  const handlePasswordPromptSuccess = async () => {
    setOpenPasswordModal(false)
    await handleCancelTransaction()
  }
  return (
    <>
      <TransactionActivity
        blockNumber={blockNumber}
        page="Token"
        disableClick
        type={type}
        txStatus={txStatus ? txStatus : transactionStatus}
        openModal={() => setOpenRequestModal(true)}
        network={network}
        assetId={assetId}
        transactionHash={transactionHash}
        matchedTransaction={matchedTransaction || transaction}
      />

      <Modal
        backdrop="opaque"
        isOpen={openRequestModal}
        onClose={() => setOpenRequestModal(false)}
        hideCloseButton={true}
        placement="center"
        className="max-w-[20.625rem]"
      >
        <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
          <ModalBody>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="cursor-pointer rounded-full mx-auto text-[4rem] flex items-center justify-center">
                <Icon icon={<Warning />} size="inherit" />
              </div>
              <CustomTypography variant="h1" className="text-center">
                {t('Token.cancelTransaction')}
              </CustomTypography>
              <CustomTypography variant="subtitle" className="text-center dark:text-custom-white40">
                {t('Token.cancelTransactionModalInstruction')}
              </CustomTypography>
            </div>
            <div className="bg-surface-dark-alt p-4 rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <CustomTypography variant="subtitle">{t('Token.estimatedGasFee')}</CustomTypography>
                <div className="text-right">
                  <CustomTypography variant="subtitle">0.00437 ETH</CustomTypography>
                  <CustomTypography variant="body" color="text-custom-white40">
                    $14
                  </CustomTypography>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <CustomTypography variant="subtitle">{t('Token.estimatedTime')}</CustomTypography>
                <CustomTypography variant="subtitle">{`< 30 seconds`}</CustomTypography>
              </div>
            </div>
            <div className="flex justify-between flex-row gap-2 pt-2">
              <Button
                variant="bordered"
                color="outlined"
                isDisabled={loading}
                onClick={() => setOpenRequestModal(false)}
              >
                {t('Actions.Nothanks')}
              </Button>
              <Button
                onClick={handleCancelTransaction}
                color={`${loading ? 'disabled' : 'negative'}`}
                isDisabled={loading}
                isLoading={loading}
                spinner={<SpinnerIcon />}
              >
                {!loading && t('Actions.request')}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <PasswordPromptModal
        modalState={openPasswordModal}
        closePromptModal={() => setOpenPasswordModal(false)}
        onSuccess={handlePasswordPromptSuccess}
      />
    </>
  )
}

export default Activity
