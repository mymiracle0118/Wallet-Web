import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ethers } from 'ethers'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { createLocationState, goBack } from 'lib/woozie'
import ETH from 'assets/coins/ETH.svg'
import Alert from 'assets/icons/alert-triangle.svg'
import PasswordPromptModal from 'app/pages/wallet/PasswordPromptModal'
import { Button, COLORS, CustomTypography, Icon, useModalContext } from 'components'
import TransactionActivity from './TransactionActivity'
import { Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { SpinnerIcon } from '@src/app/components/Icons'
import { NetworkFactory } from '@portal/shared/factory/network.factory'

const Activity = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const [openRequestModal, setOpenRequestModal] = useState<boolean>(false)
  const { address, cancelTransaction, wallet, setPendingTransactions, pendingTransactions } = useWallet() //,getAsset
  const [transaction, setTransaction] = useState<ethers.providers.TransactionResponse>()
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false)
  const [transactionStatus, setTransactionStatus] = useState('')
  const { setModalData } = useModalContext()

  const { pathname } = createLocationState()
  const paths = pathname.split('/')
  const network: string = paths[paths.length - 4]
  const assetId: string = paths[paths.length - 3]
  const transactionHash = paths[paths.length - 1]

  // const networkFactory = useMemo(() => NetworkFactory.selectNetwork(asset), [asset])
  const networkFactory = useMemo(() => NetworkFactory.selectByNetworkId(network))
  const fetchData = () => {
    if (transactionHash) {
      networkFactory
        .getTransaction(transactionHash)
        .then((tx: any) => {
          if (tx === null) {
            const removeCancelledTransaction = pendingTransactions?.filter((v) => v.hash !== transactionHash)
            setPendingTransactions(removeCancelledTransaction)
            goBack()
          } else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            setTransaction(tx)
            if (tx.blockNumber) {
              setTransactionStatus('complete')
            }
          }
        })
        .catch((e) => console.log(e))
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
    () => (transaction?.from.toLowerCase() === address?.toLowerCase() ? 'Sent' : 'Received'),
    [address, transaction]
  )

  const handleCancelTransaction = async () => {
    if (wallet) {
      setLoading(true)
      const doubleGasFee = Number(ethers.utils.formatUnits(transaction?.gasPrice, 'gwei') * 10).toFixed(8)
      try {
        const { nonce } = transaction
        const tx = {
          nonce,
          maxPriorityFeePerGas: ethers.utils.parseUnits(`${doubleGasFee}`, 'gwei'),
          maxFeePerGas: ethers.utils.parseUnits(`${doubleGasFee}`, 'gwei'),
        }
        await cancelTransaction(network, tx)
        setLoading(false)
        setOpenRequestModal(false)
        setModalData({
          type: 'send-cancel',
          amount: ethers.utils.formatEther(transaction?.value),
          token: 'ETH',
          tokenImage: <ETH />,
        })
      } catch (err) {
        setLoading(false)
        console.error('Error: ', err)
      }
    } else {
      setOpenPasswordModal(true)
    }
  }

  const handlePasswordPromptSuccess = async () => {
    setOpenPasswordModal(false)
    await handleCancelTransaction()
  }
  return (
    <>
      <TransactionActivity
        page="Token"
        disableClick
        type={type}
        txStatus={
          transaction
            ? transaction.status
              ? transaction.status === 'Invalid'
                ? 'Failed'
                : transaction.status === 'Success'
                ? 'Completed'
                : 'Failed'
              : transaction.blockNumber
              ? 'Completed'
              : 'Pending'
            : ''
        }
        openModal={() => setOpenRequestModal(true)}
        network={network}
        assetId={assetId}
        transactionHash={transactionHash}
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
              <div
                className="cursor-pointer rounded-full mx-auto text-[2.5rem] h-16 w-16 flex items-center justify-center"
                style={{ background: COLORS.background.gradientLogoBg }}
              >
                <Icon icon={<Alert />} size="inherit" />
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
              <Button variant="bordered" color="outlined" onClick={() => setOpenRequestModal(false)}>
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
