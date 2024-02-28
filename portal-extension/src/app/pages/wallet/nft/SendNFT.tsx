import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, createLocationState } from 'lib/woozie'
import { useTranslation } from 'react-i18next'
import { ethers } from 'ethers'

import { useWallet } from '@portal/shared/hooks/useWallet'
import { usePricing } from '@portal/shared/hooks/usePricing'
import { useGas } from '@portal/shared/hooks/useGas'
import { useSettings } from '@portal/shared/hooks/useSettings'
import type { AddressBookUser } from '@portal/shared/hooks/useSettings'
import { SAFETY_MEASURE } from 'utils/constants'

import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { CustomTypography, Icon, AddressDropdown, Button } from 'components'

import { tokenImage } from 'utils/tokenImage'
import { GasOption } from '@portal/shared/utils/types'
import { Checkbox, Divider, Slider } from '@nextui-org/react'

const SendNFT = () => {
  const { t } = useTranslation()
  const { pathname } = createLocationState()
  const { navigate } = useNavigate()

  const paths = pathname.split('/')
  const network: string = paths[paths.length - 3]
  const contractAddress: string = paths[paths.length - 2]
  const assetId: string = paths[paths.length - 1]

  const { getNFTAsset, setTransaction } = useWallet()
  const asset = useMemo(
    () => getNFTAsset(network, contractAddress, assetId),
    [getNFTAsset, network, contractAddress, assetId]
  )

  const { getAssetValueFormatted } = usePricing()

  const {
    gasOption,
    setGasOption,
    maxFeePerGas,
    maxPriorityFeePerGas,
    estimatedTransactionCost,
    estimatedTransactionTime,
  } = useGas(network, asset.type as string, asset.contractAddress as string)

  const [selectedUser, setSelectedUser] = useState<null | AddressBookUser>(null)

  // handle address book
  const { addToAddressBook, addressBook } = useSettings()
  const [isAddressBookChecked, setIsAddressBookChecked] = useState<boolean>(false)
  useEffect(() => {
    setIsAddressBookChecked(false)
  }, [selectedUser])
  const addUserToAddressBook = () => {
    if (isAddressBookChecked && selectedUser) {
      addToAddressBook({
        avatar: '',
        username: `@TestAccount #${addressBook?.length + 1}`,
        address: selectedUser.address,
        safety: SAFETY_MEASURE.LOW,
      })
    }
  }

  const estimatedEtherFees = Number(ethers.utils.formatEther(estimatedTransactionCost as ethers.BigNumberish))

  const handleReviewTransaction = () => {
    if (selectedUser) {
      addUserToAddressBook()
      setTransaction({
        asset,
        to: selectedUser.address,
        gasOption,
      })
      navigate('/transaction/send-review')
    }
  }

  const onChangeAddress = (newValue: AddressBookUser) => {
    setSelectedUser(newValue)
  }

  const showAdd =
    !!selectedUser?.address.length &&
    !addressBook.filter((user: AddressBookUser) => user.address === selectedUser?.address).length

  return (
    <SinglePageTitleLayout showMenu>
      <div className="px-4">
        <div className="flex pb-4">
          <div className="h-8 w-8 text-xl">
            <Icon icon={tokenImage('ethereum')} size="inherit" />
          </div>
          <CustomTypography variant="h2" className="ml-4">
            {t('Nft.sendArtwork')}
          </CustomTypography>
        </div>
        <div className="gap-4">
          <img src={asset.metadata?.image} alt="nft-demo" className="rounded-lg min-w-[8.75rem]" />
          <div className="flex flex-col gap-1">
            <CustomTypography variant="h3">Description data is missing</CustomTypography>
            <CustomTypography variant="subtitle" type="secondary">
              Edition -- of {asset.id}
            </CustomTypography>
          </div>
        </div>
        <CustomTypography variant="subtitle" type="secondary" className="mb-3">
          {t('Labels.to')}
        </CustomTypography>
        <AddressDropdown
          selectedUser={selectedUser || undefined}
          data={addressBook}
          onChange={onChangeAddress}
          onBookmarkClick={() => navigate('/transaction/address-book')}
        />
        {showAdd && (
          <>
            <CustomTypography className="text-body my-2">Ethereum network</CustomTypography>
            <Checkbox onValueChange={setIsAddressBookChecked} isSelected={isAddressBookChecked}>
              Add to address book
            </Checkbox>
          </>
        )}
        <div className="mt-8 mb-1 flex">
          <div className="flex flex-1">
            <CustomTypography variant="subtitle" type="secondary">
              {t('Labels.maxFee')}
            </CustomTypography>
            <CustomTypography variant="subtitle" className="ml-1">
              {parseFloat(ethers.utils.formatUnits(maxFeePerGas as ethers.BigNumberish, 'gwei')).toFixed(2)} Gwei
            </CustomTypography>
          </div>
          <div className="flex flex-1">
            <CustomTypography variant="subtitle" type="secondary" className="flex-1 text-right">
              {t('Labels.maxPriorityFee')}
            </CustomTypography>
            <CustomTypography variant="subtitle" className="ml-1 min-w-[4.5em]">
              {parseFloat(ethers.utils.formatUnits(maxPriorityFeePerGas as ethers.BigNumberish, 'gwei'))} Gwei
            </CustomTypography>
          </div>
        </div>
        {/* <Slider
          marks
          aria-label="Volume"
          value={gasOption}
          onChange={(_, v: GasOption) => {
            setGasOption(v)
          }}
          color="secondary"
          size="small"
          min={1}
          max={3}
        /> */}
        <Slider
          size="sm"
          minValue={3}
          maxValue={1}
          aria-label="Volume"
          value={gasOption}
          onChange={(_, v: GasOption) => {
            setGasOption(v)
          }}
        />
        F
        <div className="mt-3">
          <CustomTypography variant="subtitle" className="flex-1">
            {t('Token.estimatedGasFee')}
          </CustomTypography>
          <div>
            <CustomTypography className="text-right" variant="subtitle">
              {estimatedEtherFees.toFixed(8)} ETH
            </CustomTypography>
            <CustomTypography variant="subtitle" className="text-right">
              {getAssetValueFormatted('ethereum', estimatedEtherFees)}
            </CustomTypography>
          </div>
        </div>
        <Divider className="mt-2" />
        <div className="mt-4">
          <CustomTypography variant="subtitle" className="flex-1">
            {t('Token.estimatedTime')}
          </CustomTypography>
          <div>
            <CustomTypography className="text-right" variant="subtitle">
              {estimatedTransactionTime}
            </CustomTypography>
          </div>
        </div>
        <div className="mt-4 flex flex-col justify-between items-center">
          <Button
            data-test-id="button-review"
            onClick={handleReviewTransaction}
            color={`${!ethers.utils.isAddress(selectedUser?.address as string) ? 'disabled' : 'primary'}`}
            isDisabled={!ethers.utils.isAddress(selectedUser?.address as string)}
          >
            {t('Token.reviewTransaction')}
          </Button>
          <Button variant="bordered" color="outlined" isDisabled className="mt-1 mb-2">
            {t('Token.sendWithLowGas')}
          </Button>
        </div>
      </div>
    </SinglePageTitleLayout>
  )
}

export default SendNFT
