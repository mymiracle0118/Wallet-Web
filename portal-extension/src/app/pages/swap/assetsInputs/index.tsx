/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INetworkAsset, INetworkAssetsInputProps } from '@portal/shared/utils/types'
import { Input } from 'components'
import React, { useEffect, useState } from 'react'
import NetworkAssets from '../networkAssets'

const NetworkAssetsInput = ({ initialAsset, objectdata, isSwapAssets }: INetworkAssetsInputProps) => {
  const [searchInput, setSearchInput] = useState<string>('')
  const [isSelectedAssets, setSelectedAssets] = useState([])
  const [filteredNetworksAssets, setFilteredNetworksAssets] = useState(objectdata)

  const handleSelectionChange = (selectedKeys: INetworkAsset) => {
    const selectedKeysSet = new Set(selectedKeys)
    const selectedObjects = filteredNetworksAssets.filter(
      (item: INetworkAsset) =>
        selectedKeysSet.has(item.contractAddress) || selectedKeysSet.has(item.name) || selectedKeysSet.has(item.network)
    )
    setSelectedAssets(selectedObjects)
  }

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value.toLowerCase())
  }

  useEffect(() => {
    const filtered = objectdata.filter(
      (assets: INetworkAsset) =>
        assets.name.toLowerCase().includes(searchInput) ||
        assets.symbol.toLowerCase().includes(searchInput) ||
        assets.contractAddress.toLowerCase().includes(searchInput) ||
        assets.network.toLowerCase().includes(searchInput)
    )

    setFilteredNetworksAssets(filtered)
  }, [objectdata, searchInput])

  return (
    <Input
      dataAid="networkSearch"
      placeholder="0.00"
      mainColor
      fullWidth
      value=""
      className="h-14"
      endAdornment={
        <NetworkAssets
          isSelectedAssets={isSelectedAssets}
          handleSelectionChange={handleSelectionChange}
          handleSearchInputChange={handleSearchInputChange}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          filteredNetworksAssets={filteredNetworksAssets}
          setFilteredNetworksAssets={objectdata}
          objectdata={objectdata}
          isSwapAssets={isSwapAssets}
          image={isSelectedAssets.length ? isSelectedAssets[0].image : initialAsset.image}
          name={isSelectedAssets.length ? isSelectedAssets[0].name : initialAsset.name}
          symbol={isSelectedAssets.length ? isSelectedAssets[0].symbol : initialAsset.symbol}
        />
      }
    />
  )
}

export default NetworkAssetsInput
