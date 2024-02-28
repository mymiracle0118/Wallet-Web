import React, { useState } from 'react'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'lib/woozie'
import { CustomTypography, Switch, Button } from 'app/components'

import { useSUI } from '@portal/shared/hooks/useSUI'
import { default as networkAssets } from '@portal/shared/data/networks.json'
import { NetworkAssetsCollection, useWallet } from '@portal/shared/hooks/useWallet'
import { SwapDownIcon } from '@src/app/components/Icons'

const SelectNetwork = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { navigate } = useNavigate()
  const { addNetworkAsset, removeNetworkAsset, networkAssets: selectedNetworkAssets, wallet } = useWallet()
  const { createSUIWallet } = useSUI()

  const handleSelectNetwork = (networkId: string, isChecked: boolean) => {
    if (isChecked) {
      const networkAsset = networkAssets.find((n) => n.networkId === networkId)
      if (networkAsset) {
        const networkToAdd: NetworkAssetsCollection = {
          networkURL: networkAsset?.networkURL,
          imageURL: networkAsset?.image,
          name: networkAsset?.name,
          networkId: networkAsset.networkId,
          chainId: networkAsset?.chainId,
          coin: networkAsset?.coin,
          testNetwork: networkAsset?.testNetwork,
          blockExplorer: networkAsset?.blockExplorer,
        }
        addNetworkAsset(networkToAdd)
      }
    } else {
      removeNetworkAsset(networkId)
    }
  }

  /** To be used in the future for other network activation */
  const isNetworkSelected = (network: string) => {
    return selectedNetworkAssets.find((v) => v.networkId === network)
  }

  const handleNext = async () => {
    if (isNetworkSelected('SUI')) {
      setIsLoading(true)
      await createSUIWallet(wallet?.mnemonic.phrase as string)
      setIsLoading(false)
    }
    navigate('/onboarding/existing-assets')
  }

  return (
    <OnboardingLayout disableLogo>
      <CustomTypography variant="h1">{t('Onboarding.chooseNetwork')}</CustomTypography>
      <CustomTypography variant="body" className="my-8">
        {t('Onboarding.enableNetworks')}
      </CustomTypography>

      {networkAssets.map((data) => (
        <div key={data.networkId} className="flex items-center justify-center h-14">
          <img className="h-9 w-9 rounded-full" alt="token-thumbnail" src={data.image} />
          <CustomTypography className="flex-1 ml-4" variant="subtitle">
            {data.name}
          </CustomTypography>
          <Switch
            id={`network-${data.networkId}`}
            checked={selectedNetworkAssets.some((n) => n.networkId === data.networkId)}
            onChange={(value) => handleSelectNetwork(data.networkId, value as boolean)}
          />
        </div>
      ))}

      <Button
        data-test-id="select-network-next-btn"
        isLoading={isLoading}
        onClick={handleNext}
        spinner={<SwapDownIcon />}
        color="primary"
      >
        {t('Actions.next')}
      </Button>
    </OnboardingLayout>
  )
}

export default SelectNetwork
