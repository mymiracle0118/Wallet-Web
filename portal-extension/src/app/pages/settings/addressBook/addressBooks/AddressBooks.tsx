import { useSettings } from '@portal/shared/hooks/useSettings'
import { useTranslation } from 'react-i18next'

import { IAddressItemProps, IFilterAddress, IGroupedAddresses } from '@portal/shared/utils/types'
import { CheckRoundedGreyIcon, CheckRoundedPrimaryIcon, CloseRoundedIcon, FilterIcon } from '@src/app/components/Icons'
import { FILTER_ADDRESS } from '@src/constants/content'
import SupraIcon from 'assets/images/Image.svg'
import { Button, CustomTypography } from 'components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { useNavigate } from 'lib/woozie'
import React, { useState } from 'react'
import NoTokenfound from '../../../../../assets/images/no-activity.png'
import AddressItem from '../AddressItem'

const AddressBooks = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const { addressBook } = useSettings()
  const [selectedOption, setSelectedOption] = useState<string>('1')
  const [isFilterShow, setFilterShow] = useState<boolean>(false)

  const groupedAddresses: IGroupedAddresses = {}
  addressBook.forEach((data: IAddressItemProps) => {
    if (!groupedAddresses[data?.network]) {
      groupedAddresses[data?.network] = []
    }
    groupedAddresses[data?.network].push(data)
  })

  const mergedAddresses = Object.values(groupedAddresses).map((networkArray: any) => networkArray.flat())

  return (
    <SinglePageTitleLayout
      paddingClass={false}
      dataAid="addressBookHead"
      title={t('Settings.addressBookPageTitle')}
      className="overflow-hidden py-4"
    >
      <div className="flex items-center justify-between gap-2 mb-4 z-50 bg-surface-dark px-4">
        <Button
          data-aid="editButton"
          variant="bordered"
          color="outlined"
          onClick={() => navigate(`/settings/${addressBook.length > 0 ? 'edit' : 'add'}-address`)}
        >
          {addressBook.length > 0 ? t('Actions.edit') : t('Settings.addAddressTitle')}
        </Button>
        {mergedAddresses.length > 0 && (
          <div className="w-16">
            <Button variant="bordered" color="outlined" size="sm" onClick={() => setFilterShow(!isFilterShow)}>
              {isFilterShow ? <CloseRoundedIcon /> : <FilterIcon />}
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-y-auto max-h-[28.5rem] px-4">
        {isFilterShow && (
          <div className="mb-4 bg-surface-dark-alt rounded-md py-4 px-2 sticky top-0 z-10 shadow-small">
            {FILTER_ADDRESS.map((filterItems: IFilterAddress, index: number) => (
              <label
                key={index}
                htmlFor={String(filterItems.id)}
                className={`cursor-pointer pl-[3rem] relative font-extrabold hover:bg-custom-white10 rounded-lg py-2 mr-2`}
              >
                {selectedOption === filterItems.checkId ? (
                  <CheckRoundedPrimaryIcon className="absolute left-4 top-2 w-5 h-5" />
                ) : (
                  <CheckRoundedGreyIcon className="absolute left-4 top-2 w-5 h-5" />
                )}
                {filterItems.name}
                <input
                  type="radio"
                  id={filterItems.checkId}
                  value={filterItems.checkId}
                  name="FilterAddress"
                  className="invisible"
                  checked={selectedOption === filterItems.checkId}
                  onChange={() => setSelectedOption(filterItems.checkId)}
                />
              </label>
            ))}
          </div>
        )}

        {selectedOption === '1' ? (
          addressBook.length > 0 ? (
            addressBook.map(
              (data, idx) =>
                data.username &&
                data.address && (
                  <AddressItem
                    key={idx}
                    image={<SupraIcon />}
                    username={`@${data.username}`}
                    address={data.address}
                    network={data.network as string}
                  />
                )
            )
          ) : (
            <div className="mx-auto flex flex-col items-center space-y-3 pt-10">
              <img src={NoTokenfound} alt="no token found" />
              <CustomTypography variant="subtitle" className="text-center" type="secondary">
                {t('Token.NoAddressFound')}
              </CustomTypography>
            </div>
          )
        ) : (
          mergedAddresses.map((addressArray, idx) => (
            <React.Fragment key={idx}>
              <CustomTypography variant="small" className="font-bold mb-1 mt-3">
                {addressArray[0].network} {t('Network.network')}
              </CustomTypography>
              <div className="bg-surface-dark-alt rounded-md p-4">
                {addressArray.map((data: IAddressItemProps, idx: number) => (
                  <AddressItem
                    key={idx}
                    image={<SupraIcon />}
                    username={`@${data?.username as string}`}
                    address={data.address}
                    network={data.network}
                  />
                ))}
              </div>
            </React.Fragment>
          ))
        )}
      </div>
    </SinglePageTitleLayout>
  )
}

export default AddressBooks
