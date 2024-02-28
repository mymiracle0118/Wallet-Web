/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { ChangeEvent, useEffect, useState } from 'react'
import { AngelRightIcon } from '@src/app/components/Icons'
import SwapSelectNetworksInput from './SwapSelectNetworksInput'
import { NetworkAssetsCollection } from '@portal/shared/hooks/useWallet'
import { ISwapSelectNetworksProps } from '@portal/shared/utils/types'
import { Button } from 'components'

const SwapSelectNetworks = ({ allNetworks }: ISwapSelectNetworksProps) => {
  const [searchInput, setSearchInput] = useState<string>('')
  const [isShowNetworkModal, setShowNetworkModal] = useState<boolean>(false)
  const [isSelectedNetworks, setSelectedNetworks] = useState<NetworkAssetsCollection[]>([allNetworks[1]])
  const [filteredNetworks, setFilteredNetworks] = useState(allNetworks)

  const handleSelectionChange = (selectedKeys: string[]) => {
    const selectedKeysSet = new Set(selectedKeys)
    const selectedObjects = filteredNetworks.filter((item) => selectedKeysSet.has(item.name))
    setSelectedNetworks(selectedObjects)
    setShowNetworkModal(false)
  }

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value.toLowerCase())
  }

  useEffect(() => {
    const filtered = allNetworks.filter(
      (assets) =>
        assets.name.toLowerCase().includes(searchInput) ||
        assets.symbol.toLowerCase().includes(searchInput) ||
        assets.address.toLowerCase().includes(searchInput) ||
        assets.coin.toLowerCase().includes(searchInput)
    )

    setFilteredNetworks(filtered)
  }, [allNetworks, searchInput])

  return (
    <>
      <Button
        variant="flat"
        color="default"
        onClick={() => setShowNetworkModal(true)}
        className="bg-custom-white10 font-extrabold h-14 flex items-center justify-between"
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full mr-2 flex items-center">
            <img
              src={isSelectedNetworks[0].image}
              alt={isSelectedNetworks[0].name}
              className="rounded-full bg-custom-white80"
            />
          </div>
          {isSelectedNetworks[0].name}
        </div>
        <AngelRightIcon className="w-6 h-6" />
      </Button>

      <SwapSelectNetworksInput
        isSelectedNetworks={isSelectedNetworks}
        isShowNetworkModal={isShowNetworkModal}
        setShowNetworkModal={setShowNetworkModal}
        handleSelectionChange={handleSelectionChange}
        handleSearchInputChange={handleSearchInputChange}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filteredNetworks={filteredNetworks}
        setFilteredNetworks={allNetworks}
        allNetworks={allNetworks}
      />
    </>
  )
}

export default SwapSelectNetworks
