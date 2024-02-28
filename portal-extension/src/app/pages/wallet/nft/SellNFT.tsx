import React from 'react'
import { useTranslation } from 'react-i18next'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { CustomTypography } from 'app/components'

import ExternalLinkIcon from 'assets/icons/external-link.svg'

const everyone = [
  {
    name: 'OpenSea',
    websiteURL: 'https://opensea.io',
    logo: 'https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png',
  },
  {
    name: 'Rariable',
    websiteURL: 'https://rarible.com',
    logo: 'https://assets.coingecko.com/nft_contracts/images/1082/large/rarible.jpg',
  },
  {
    name: 'LooksRare',
    websiteURL: 'https://looksrare.com',
    logo: 'https://assets.coingecko.com/coins/images/22173/large/circle-black-256.png',
  },
]

const artist = [
  {
    name: 'SuperRare',
    websiteURL: 'https://superrare.com',
    logo: 'https://assets.coingecko.com/coins/images/17753/large/RARE.jpg',
  },
  {
    name: 'Foundation',
    websiteURL: 'https://foundation.org',
    logo: 'https://theme.zdassets.com/theme_assets/12129897/660def02924945816049919b8ec01b16dd07cf3e.svg',
  },
  {
    name: 'Nifty Gateway',
    websiteURL: 'https://www.niftygateway.com/',
    logo: 'https://media.niftygateway.com/image/upload/q_auto:good,w_500/v1576344316/nifty-builder-images/kyhclu5quebqm4sit0he.png',
  },
]

const SellNFT = () => {
  const { t } = useTranslation()

  const renderRow = ({ name, websiteURL, logo }: { name: string; websiteURL: string; logo: string }) => {
    return (
      <div key={name} className="flex items-center justify-center h-[56px]">
        <img className="h-[36px] w-[36px] rounded-full" alt="token-thumbnail" src={logo} />
        <CustomTypography className="flex-1 ml-4" variant="subtitle">
          {name}
        </CustomTypography>
        <button type="button" onClick={() => window.open(websiteURL)}>
          <ExternalLinkIcon className="fill-custom-black dark:fill-custom-white h-[24px] w-[24px]" />
        </button>
      </div>
    )
  }

  return (
    <SinglePageTitleLayout title={t('Nft.sellArtwork')}>
      <div className="px-4">
        <CustomTypography type="secondary" className="py-4" variant="subtitle">
          {t('Nft.forEveryone')}
        </CustomTypography>
        {everyone.map(({ name, websiteURL, logo }) => renderRow({ name, websiteURL, logo }))}
        <CustomTypography type="secondary" className="py-4" variant="subtitle">
          {t('Nft.forArtist')}
        </CustomTypography>
        {artist.map(({ name, websiteURL, logo }) => renderRow({ name, websiteURL, logo }))}
      </div>
    </SinglePageTitleLayout>
  )
}

export default SellNFT
