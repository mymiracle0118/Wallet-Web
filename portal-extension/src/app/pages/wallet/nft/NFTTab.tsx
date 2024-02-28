import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import { NFTCard, Input, CustomTypography, Button } from 'app/components'
import { SearchIcon, SortIcon } from '@src/app/components/Icons'
import { useNavigate } from 'lib/woozie'
import { Listbox } from '@headlessui/react'
import { useTranslation } from 'react-i18next'

import mascotEmptyNft from 'assets/images/mascot-empty-nft.png'

import { useWallet } from '@portal/shared/hooks/useWallet'
import { isNFTOwner } from '@portal/shared/services/nft'

import { sortFilters } from '../token/add-token/TokensTab'
import { Chip } from '@nextui-org/react'

const NFTTab = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const [selectedSort, setSelectedSort] = useState<string>('highestValue')

  const { address, NFTs, removeNFT } = useWallet()

  useEffect(() => {
    NFTs.forEach(async (nft) => {
      const owner = await isNFTOwner(address as string, nft.network, nft.contractAddress as string, nft.id)
      if (!owner) {
        removeNFT(nft)
      }
    })
  }, [address, NFTs, removeNFT])

  const hasNft = NFTs.length > 0
  return (
    <div className="px-4 py-4 flex flex-col">
      <div className="flex justify-between mb-2">
        <div className="flex flex-row gpa-2 font-bold">
          <Chip color="primary">All</Chip>
          <Chip>Favourites</Chip>
        </div>
        <div>
          <Listbox value={selectedSort} onChange={setSelectedSort}>
            <Listbox.Button className="relative">
              <Button isIconOnly variant="flat" color="transparent" data-aid="sortList">
                <SortIcon className="fill-custom-black dark:fill-custom-white" />
              </Button>
              <Listbox.Options className="absolute z-10 shadow-md right-0 dark:bg-surface-dark-alt bg-surface-light rounded-md overflow-hidden">
                {sortFilters.map((filter) => (
                  <Listbox.Option
                    key={filter.id}
                    value={filter.name}
                    className={classnames(
                      'text-sm font-extrabold px-6 py-3.5 flex justify-start items-center gap-1 [&>svg]:w-5 [&>svg]:h-5 stroke-custom-black dark:stroke-custom-white hover:bg-custom-grey10 dark:hover:bg-custom-white10',
                      filter.name === selectedSort ? 'bg-custom-grey10 dark:bg-custom-white10' : ''
                    )}
                  >
                    {filter.icon} {filter.name}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox.Button>
          </Listbox>
        </div>
      </div>
      <Input
        fullWidth
        dataAid="searchBar"
        placeholder={t('Actions.search')}
        className="search-input font-bold mb-4"
        icon={<SearchIcon className="stroke-custom-black dark:stroke-custom-white" />}
        mainColor
      />
      {hasNft ? (
        <div className="flex flex-wrap gap-4 min-h-[120px] mb-4">
          {NFTs.map((nft, idx: number) => (
            <NFTCard
              key={idx}
              title={nft.id}
              image={nft.metadata?.image as string}
              price="$9,000"
              currency="ETH"
              onClick={() => navigate(`/nft/${nft.network}/${nft.contractAddress as string}/${nft.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="grayscale-[50%]">
          {/* mascotEmptyNft */}
          <img className="mx-auto my-0" alt="empty-nft" src={mascotEmptyNft} />
          <CustomTypography className="text-center mx-auto mt-2 mb-4" variant="body">
            {t('Nft.emptyList')}
          </CustomTypography>
        </div>
      )}

      <Button
        className="mb-4"
        variant="bordered"
        color="outlined"
        fullWidth={false}
        onClick={() => navigate('/nft/import')}
      >
        Import NFT
      </Button>
    </div>
  )
}

export default NFTTab
