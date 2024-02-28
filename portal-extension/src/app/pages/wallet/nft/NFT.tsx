import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CustomTypography, DataCard, TokenActivity, Icon, TokenAddressButton, Button } from 'components'

import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'

import GasIcon from 'assets/icons/gas.svg'
import ExternalLinkIcon from 'assets/icons/external-link.svg'
import ChevronDown from 'assets/icons/chevron-down.svg'
import ArrowUpRightIcon from 'assets/icons/arrow-up-right.svg'
import ArrowDownLeftIcon from 'assets/icons/arrow-down-left.svg'
import NetworkETH from 'assets/nft-networks/network-eth.svg'
import { Listbox } from '@headlessui/react'
import { useNavigate, createLocationState } from 'lib/woozie'
import { Divider } from '@nextui-org/react'
import { BoughtIcon, ListedIcon, MintedIcon } from '@src/app/components/Icons'
import { DEMO_TRANSCATION } from '@src/constants/content'

const NFT = () => {
  const { t } = useTranslation()
  const { pathname } = createLocationState()
  const { navigate } = useNavigate()

  const paths = pathname.split('/')
  const network = paths[paths.length - 3]
  const contractAddress = paths[paths.length - 2]
  const tokenId = paths[paths.length - 1]

  const [selectedOption, setSelectedOption] = useState(t('Account.option1'))

  return (
    <SinglePageTitleLayout showMenu>
      <div className="flex flex-col p-4">
        <div
          className="cover rounded-lg w-full h-[17.5rem] flex justify-end"
          style={{
            backgroundSize: 'cover',
            backgroundImage: "url('/images/demo/nft-demo.png')",
          }}
        >
          <div className="justify-end w-[4.5rem] h-[4.5rem]">
            <NetworkETH />
          </div>
        </div>
        <CustomTypography variant="h3" className="my-4">
          Machine Hallucinations - Huble Dreams - NG Collector&apos;s Edition #4/10
        </CustomTypography>
        <CustomTypography variant="subtitle" type="secondary" className="my-4">
          Edition 4 of 10
        </CustomTypography>
        <Button className="my-1" onClick={() => navigate(`/nft/send/${network}/${contractAddress}/${tokenId}`)}>
          {t('Token.send')}
        </Button>

        <div className="flex items-center my-1">
          <Icon icon={<GasIcon />} size="medium" />
          <CustomTypography variant="subtitle" className="flex-1">
            120 Gwei ≈ $14
          </CustomTypography>
          <Button variant="bordered" color="outlined" fullWidth={false} className="px-4">
            {t('Token.alerts')}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 mb-4">
          <CustomTypography variant="subtitle">{t('Nft.artworkAddress')}</CustomTypography>
          <TokenAddressButton
            enableCopy
            address="0x1096b3e129224d3e547bB431bd316bd33f62b19q"
            link="https://google.com/"
          />
        </div>
        <Divider />
        <div className="flex items-center justify-between my-2">
          <CustomTypography variant="subtitle">{t('Nft.createdBy')}</CustomTypography>
          <CustomTypography className="text-right" variant="subtitle">
            Refik Anadol
          </CustomTypography>
        </div>
        <Divider />
        <div className="flex items-center justify-between my-2">
          <CustomTypography variant="subtitle">{t('Nft.collection')}</CustomTypography>
          <CustomTypography className="text-right" variant="subtitle">
            Machine Hallucinations: Collectors Edition by Refik Anadol
          </CustomTypography>
        </div>
        <Divider />
        <div className="flex items-center justify-between my-2">
          <CustomTypography variant="subtitle">Network</CustomTypography>
          <CustomTypography className="text-right" variant="subtitle">
            Ethereum
          </CustomTypography>
        </div>
        <Divider />
        <div className="flex gap-2 my-2">
          <DataCard title="You Bought For" amount={9000} />
          <DataCard title="Price Chart" icon={<Icon icon={<ExternalLinkIcon />} size="medium" />} />
        </div>
        <CustomTypography variant="body" type="secondary" className="mt-4 mb-2">
          {t('Nft.collectionDailyStats')}
        </CustomTypography>
        <div className="flex gap-1 justify-between my-2">
          <DataCard width={132} title="Total Supply" amount={10000} />
          <DataCard width={132} title="Floor Price" amount={12000} percentage={0.8} />
        </div>
        <div className="flex gap-1 justify-between my-2">
          <DataCard width={132} title="Avg. Sales Price" amount={20000} percentage={10.2} />
          <DataCard width={132} title="Highest ActiveGlobal Bid" amount={35000} />
        </div>
        <div className="flex gap-1 justify-between my-2">
          <DataCard width={132} title="Secondary Market Volume" amount={100000} />
          <DataCard width={132} title="Secondary MarketSales" amount={2} />
        </div>
        <Button variant="bordered" color="outlined" className="my-2" onClick={() => navigate('/nft/sell')}>
          {t('Nft.sell')}
        </Button>
        <div className="flex items-center justify-between my-2">
          <CustomTypography variant="subtitle" type="secondary">
            {t('Nft.artworkTradingHistory')}
          </CustomTypography>

          <Listbox value={selectedOption} onChange={setSelectedOption}>
            <Listbox.Button className="relative">
              <Button className="flex items-center">
                {t('Nft.all')}
                <ChevronDown className="stroke--black dark:stroke-custom-white" />
              </Button>
              <Listbox.Options className="absolute right-0 dark:bg-surface-dark-alt bg-surface-light rounded-md z-10 w-60">
                <>
                  <div>{t('Actions.all')}</div>
                  <div className="flex gap-x-2">
                    <BoughtIcon /> {t('Nft.sortValue1')}
                  </div>
                  <div className="flex gap-x-2">
                    <ListedIcon /> {t('Nft.sortValue2')}
                  </div>
                  <div className="flex gap-x-2">
                    <ArrowUpRightIcon /> {t('Nft.sortValue3')}
                  </div>
                  <div className="flex gap-x-2">
                    <ArrowDownLeftIcon /> {t('Nft.sortValue4')}
                  </div>
                  <div className="flex gap-x-2">
                    <MintedIcon /> {t('Nft.sortValue5')}
                  </div>
                </>
              </Listbox.Options>
            </Listbox.Button>
          </Listbox>
        </div>
      </div>
      {DEMO_TRANSCATION.map((v, idx) => (
        <TokenActivity
          disableClick
          key={idx}
          type={v.type}
          title={v.title}
          date={v.date}
          price={v.price}
          status={v.status}
        />
      ))}
    </SinglePageTitleLayout>
  )
}

export default NFT
