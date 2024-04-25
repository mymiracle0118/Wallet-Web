import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePricing } from '@portal/shared/hooks/usePricing'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useWallet } from '@portal/shared/hooks/useWallet'

import { CustomTypography, TokenAddressButton } from 'app/components'
import WalletLayout from 'layouts/wallet-layout/WalletLayout'

import { Button, Image } from '@nextui-org/react'
import { useStore } from '@portal/shared/hooks/useStore'
import { NetworkToken } from '@portal/shared/utils/types'
import { CaretDownIcon } from '@src/app/components/Icons'
import { ethersCommify } from '@src/utils/ethersCommify'
import NetworkIcon from 'assets/icons/network.svg'
import { useNavigate } from 'lib/woozie'
import HideBalanceIcon from '../../../../public/images/backgrounds/hide-balance.png'
import TokensTab from './token/add-token/TokensTab'

const Home = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const {
    selectedNetwork,
    isCreateWalletProcessCompleted,
    getNetworksTokenList,
    pendingTransactions,
    setPendingTransactions,
  } = useWallet()
  const { enableHideBalance, enableHideLawBalance, currentAccount } = useSettings()
  const { currentTokenArrayWithBalance, walletsList } = useStore()
  const networkTokenList = getNetworksTokenList()
  const { getAssetValue } = usePricing()
  const [totalBalance, setTotalBalance] = useState<number>(0)
  const [selectedNetworkObject, setSelectedNetworkObject] = useState<NetworkToken | undefined>(undefined)
  if (!isCreateWalletProcessCompleted) {
    navigate('/')
  }

  useEffect(() => {
    // REMOVE FAILED AND CUSTOM TOKEN'S CANCELLED TRANSACTIONS FROM PENDING TRANSACTION LIST
    const filteredTransactions = pendingTransactions.filter(
      (transaction: any) => transaction.status !== 'Failed' && transaction.status !== 'Cancelled'
    )
    setPendingTransactions(filteredTransactions)
  }, [])
  useEffect(() => {
    let nativeNetwork = Object.values(networkTokenList).find(
      (t: NetworkToken) => t.networkName === selectedNetwork && t.tokenType === 'Native'
    ) as NetworkToken
    if (nativeNetwork && currentAccount) {
      const walletNetworkName = nativeNetwork.isEVMNetwork ? 'ETH' : nativeNetwork.networkName
      const accountWallet = walletsList[currentAccount.id][walletNetworkName]
      if (accountWallet) {
        nativeNetwork = {
          ...nativeNetwork,
          address: accountWallet.address,
        }
      }
    }
    setSelectedNetworkObject(nativeNetwork)
  }, [selectedNetwork, currentAccount])

  useEffect(() => {
    let total = 0
    Object.values(currentTokenArrayWithBalance).forEach((asset) => {
      const assetBalance = Number(asset.formattedBalance || 0)
      const assetValue = getAssetValue(asset.coingeckoTokenId, assetBalance)
      if (asset.networkName === selectedNetwork || selectedNetwork === '' || selectedNetwork === undefined) {
        total += assetValue
      }
    })

    setTotalBalance(total)
  }, [currentTokenArrayWithBalance, totalBalance, selectedNetwork])

  return (
    <WalletLayout>
      <div className="text-center mb-2 absolute right-0 left-0 border border-solid border-custom-white10 rounded-lg mx-4">
        <div className="flex flex-col justify-center text-left p-4">
          <CustomTypography dataAid="totalValueVol" variant="h2">
            {!enableHideBalance ? (
              `$${ethersCommify(totalBalance.toFixed(2))}`
            ) : (
              <Image
                width={32}
                height={32}
                src={HideBalanceIcon}
                fallbackSrc={HideBalanceIcon}
                alt="Alert"
                className="z-0"
              />
            )}
          </CustomTypography>

          <CustomTypography data-test-id="total-value" dataAid="totalValueHead" type="secondary" variant="subtitle">
            {t('Wallet.totalValue')}
          </CustomTypography>

          <div className="flex items-center justify-between mt-4 gap-x-3">
            <Button
              variant="bordered"
              className="border-custom-white w-fit rounded-xl z-0"
              size="md"
              onClick={() => navigate('/network-filter')}
            >
              <NetworkIcon className="fill-custom-black text-xl" />
              <span className="truncate max-w-[7rem]">
                {selectedNetworkObject
                  ? selectedNetworkObject.title
                  : selectedNetwork
                  ? selectedNetwork
                  : t('Network.allNetworks')}
              </span>
              <CaretDownIcon />
            </Button>
            {selectedNetworkObject && selectedNetworkObject.address ? (
              <TokenAddressButton
                enableCopy
                address={selectedNetworkObject.address}
                className="text-custom-white !border-custom-white !h-10"
                iconClassname="!fill-custom-white"
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="relative mt-[164px] body-wrapper bg-surface-dark rounded-t-xl">
        <TokensTab totalBalance={totalBalance} hideBalance={enableHideBalance} hideLawBalance={enableHideLawBalance} />
      </div>
    </WalletLayout>
  )
}

export default Home
