import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePricing } from '@portal/shared/hooks/usePricing'
import { useWallet } from '@portal/shared/hooks/useWallet'
// import { getBlockExplorerURL } from '@portal/shared/utils/getBlockExplorerURL'

import { CustomTypography, TokenAddressButton } from 'app/components'
import WalletLayout from 'layouts/wallet-layout/WalletLayout'

import { Button } from '@nextui-org/react'
import { useStore } from '@portal/shared/hooks/useStore'
import { NetworkToken } from '@portal/shared/utils/types'
import { CaretDownIcon } from '@src/app/components/Icons'
import NetworkIcon from 'assets/icons/network.svg'
import { useNavigate } from 'lib/woozie'
import TokensTab from './token/add-token/TokensTab'

const Home = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { selectedNetwork } = useWallet()
  const { currentTokenArrayWithBalance } = useStore()
  const { getAssetValue } = usePricing()
  const [totalBalance, setTotalBalance] = useState<number>(0)
  const [selectedNetworkObject, setSelectedNetworkObject] = useState<NetworkToken | undefined>(undefined)
  // const website = `${getBlockExplorerURL('mainnet')}/address/${walletAddress}`

  useEffect(() => {
    const selectedNetworkObj = currentTokenArrayWithBalance[selectedNetwork as string] as NetworkToken
    setSelectedNetworkObject(selectedNetworkObj)
  }, [selectedNetwork, currentTokenArrayWithBalance])

  useEffect(() => {
    let total = 0
    Object.values(currentTokenArrayWithBalance).forEach((asset) => {
      const assetBalance = Number(asset.formattedBalance || 0)
      // const assetBalance = asset.balance ? Number(ethers.utils.formatUnits(asset.balance)) : 0
      // const assetBalance = asset.balance ? Number(ethers.utils.formatUnits(asset.balance, asset.decimal)) : 0
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
            {`$${ethers.utils.commify(totalBalance.toFixed(2))}`}
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
        <TokensTab totalBalance={totalBalance} />
      </div>
    </WalletLayout>
  )
}

export default Home
