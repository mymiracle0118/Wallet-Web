/* eslint-disable @typescript-eslint/restrict-template-expressions */

import React, { FC, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'lib/woozie'
import { ethers } from 'ethers'

import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { CustomTypography, Switch, Loader, Button } from 'app/components'
import { getNetworkName } from '@portal/shared/utils/getNetworkName'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { usePricing } from '@portal/shared/hooks/usePricing'
import { default as defaultAssets } from '@portal/shared/data/assets.json'
import type { Asset } from '@portal/shared/hooks/useWallet'
import { useBalance } from '@portal/shared/hooks/useBalance'
import { ITExistingAssetRow } from '@portal/shared/utils/types'

const ExistingAssetRow: FC = ({ assetIndex, data, handleSelectAsset }: ITExistingAssetRow) => {
  const { address: walletAddress } = useWallet()
  const { getAssetValue } = usePricing()
  const { isLoading } = useQuery(['asset-balance', walletAddress, data.id], () =>
    NetworkFactory.selectNetwork(data).getTokenBalance(walletAddress as string, data)
  )
  const { balanceFormatted } = useBalance(data.network as string, data.id, 'defaultAssets')

  const assetValue = getAssetValue(data.id, Number(balanceFormatted))
  return (
    <div key={`${data.network}.${data.symbol}`} className="flex min-h-[3.5rem] w-full gap-4 items-center">
      <img className="h-9 w-6 rounded-full" alt="token-thumbnail" src={data.image} />

      <div className="h-full flex flex-1 justify-between items-center">
        <div>
          <div className="flex gap-2">
            <CustomTypography variant="subtitle" fontWeight="bold">
              {data.symbol}
            </CustomTypography>
            <CustomTypography variant="subtitle" type="secondary">
              {getNetworkName(data.network)}
            </CustomTypography>
          </div>
          <CustomTypography variant="body" fontWeight="regular" color="text-custom-grey100">
            {data.name}
          </CustomTypography>
        </div>
        <div className="text-end text-right">
          {isLoading ? (
            <div className="w-16 flex flex-col gap-1 items-end">
              <Loader variant="text" />
              <Loader variant="text" className="w-1/2 h-2" />
            </div>
          ) : (
            <>
              <CustomTypography variant="subtitle" fontWeight="bold">
                {ethers.utils.commify(balanceFormatted.toFixed(8))}
              </CustomTypography>
              <CustomTypography variant="body" fontWeight="regular" color="text-custom-grey100">
                {`$${ethers.utils.commify(assetValue)}`}
              </CustomTypography>
            </>
          )}
        </div>
      </div>
      <Switch
        id={`${data.network}-${data.symbol}`}
        checked={data.enabledAsDefault || false}
        onChange={() => handleSelectAsset(assetIndex)}
      />
    </div>
  )
}

const ExistingAssets: FC = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { networkAssets } = useWallet() //setAssets,
  const networkAssetsKey = networkAssets.map((v) => v.networkId) as Array<string>
  const filteredAssetsBySelectedNetwork = defaultAssets.filter((v) => networkAssetsKey.includes(v.network)) as Asset[]
  const [assets, setDefaultAssets] = useState<Array<Asset>>(filteredAssetsBySelectedNetwork)
  const handleSelectAsset = (index: number) => {
    const state = [...assets]
    const newValue = state[index].enabledAsDefault
    state[index] = { ...state[index], enabledAsDefault: !newValue }
    setDefaultAssets(state)
  }

  const handleSubmit = () => {
    // const newAssets = assets.filter((v) => v.enabledAsDefault)
    // setAssets(newAssets)
    navigate({ pathname: '/onboarding/congratulations', search: '?accountImported=true' })
  }

  return (
    <div className="px-4">
      <CustomTypography variant="h1" className="mt-4">
        {t('Onboarding.showExistingAssetsTitle')}
      </CustomTypography>
      <CustomTypography variant="body" fontWeight="regular" className="my-4 dark:text-custom-white80">
        {t('Onboarding.showExistingAssetsSubTitle')}
      </CustomTypography>
      <div className="h-[260px] w-full gap-4 flex flex-col overflow-y-auto">
        {assets.map((data, idx) => (
          <ExistingAssetRow key={idx} assetIndex={idx} data={data} handleSelectAsset={handleSelectAsset} />
        ))}
      </div>
      <Button data-aid="submit-existing-assets" onClick={handleSubmit} className="mt-4" color="primary">
        {t('Actions.next')}
      </Button>
    </div>
  )
}

export default ExistingAssets
