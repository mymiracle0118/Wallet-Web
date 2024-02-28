/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useBalance } from '@portal/shared/hooks/useBalance'
import { useGas } from '@portal/shared/hooks/useGas'
import { usePricing } from '@portal/shared/hooks/usePricing'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { ethers } from 'ethers'
import { createLocationState, useNavigate } from 'lib/woozie'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, CustomTypography, DatePicker, Form, Input, ModalComponent } from 'components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'

// import { tokenImage } from 'utils/tokenImage'
import { AddressBookUser, useSettings } from '@portal/shared/hooks/useSettings'
import { SAFETY_MEASURE, getWalletAddressRegex } from 'utils/constants'
import { AdjustGasAmountModal, ReceiveTokenModal, SendWithEstimateModal } from './SendModals'

import { yupResolver } from '@hookform/resolvers/yup'
import { Slider } from '@nextui-org/react'
import { GasOption, NetworkToken } from '@portal/shared/utils/types'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import SearchAddress from './search-address'
// import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useStore } from '@portal/shared/hooks/useStore'

const Send = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { getNetworkToken } = useStore()
  const { pathname } = createLocationState()
  const paths = pathname.split('/')
  const network: string = paths[paths.length - 2]
  const assetId: string = paths[paths.length - 1]

  const { setTransaction } = useWallet() //getAsset,
  // const networkFactory = useMemo(() => NetworkFactory.selectByNetworkId(network))
  const asset: NetworkToken = getNetworkToken(assetId)

  const { addToAddressBook, addressBook } = useSettings()
  // const asset = useMemo(() => getAsset(network, assetId), [assetId, getAsset, network])
  const { balanceFormatted } = useBalance(asset)
  const assetBalance = useMemo(
    () => Math.round((Number(balanceFormatted) + Number.EPSILON) * 100000) / 100000,
    [balanceFormatted]
  )

  const { getAssetValueFormatted } = usePricing()
  // const { getMarketPrice, getMarket24HourChange, getAssetValueFormatted } = usePricing()
  // const assetValue = useMemo(() => getAssetValue(asset.coingeckoTokenId, assetBalance), [assetBalance, getAssetValue])
  const {
    gasOption,
    setGasOption,
    maxFeePerGas,
    maxPriorityFeePerGas,
    estimatedTransactionCost,
    estimatedTransactionTime,
  } = useGas(asset)

  const [selectedUser, setSelectedUser] = useState<null | AddressBookUser>(null)
  const [modalState, setModalState] = useState<boolean>(false)
  const [receivedTokenModal, setReceivedTokenModal] = useState<boolean>(false)
  const [calendarState, setCalendarState] = useState<boolean>(false)
  const [maxWarning, setMaxWarning] = useState<boolean>(false)
  const [isAddressBookChecked, setIsAddressBookChecked] = useState<boolean>(false)
  const [isShowContactAccordion, setShowContactAccordion] = useState<boolean>(false)

  const [estimatedEtherFees, setEstimatedEthersFees] = useState<number>(0)
  const addressBookByNetwork = addressBook.filter((address) => address.network.toLowerCase() === network.toLowerCase())

  const addUserToAddressBook = (name: string) => {
    if (isAddressBookChecked && selectedUser) {
      addToAddressBook({
        avatar: '',
        username: name ? name : `@TestAccount #${addressBookByNetwork?.length + 1}`,
        network: network,
        address: selectedUser.address,
        safety: SAFETY_MEASURE.LOW,
      })
    }
  }

  useEffect(() => {
    const fetchTransactionCost = async () => {
      try {
        const cost = await estimatedTransactionCost
        setEstimatedEthersFees(cost || 0)
      } catch (error) {
        console.error('Failed to fetch transaction cost:', error)
        setEstimatedEthersFees(0)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchTransactionCost()
  }, [estimatedTransactionCost])

  const schema = yup.object().shape({
    amount: yup
      .number()
      .typeError('you must specify an amount')
      .moreThan(0, 'invalid amount')
      .max(assetBalance - estimatedEtherFees, 'low balance')
      .required(),
    address: yup.string().required().matches(getWalletAddressRegex(network)),
  })

  const handleReviewTransaction = (data: { name: string; amount: string }) => {
    if (selectedUser) {
      addUserToAddressBook(data.name)
      setTransaction({
        asset,
        to: selectedUser.address,
        amount: data.amount.toString(),
        gasOption,
      })
      navigate('/transaction/send-review')
    }
  }

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isDirty, isValid, errors },
  } = methods

  const setMaxAmount = () => {
    setValue('amount', assetBalance - estimatedEtherFees, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
    setMaxWarning(false)
  }

  return (
    <SinglePageTitleLayout showMenu>
      <div>
        <Form methods={methods} onSubmit={handleSubmit(handleReviewTransaction)}>
          <CustomTypography variant="subtitle" type="secondary" className="mb-1">
            {t('Labels.to')}
          </CustomTypography>
          <SearchAddress
            setValue={setValue}
            network={network}
            register={register}
            selectedUser={selectedUser}
            isShowContactAccordion={isShowContactAccordion}
            setShowContactAccordion={setShowContactAccordion}
            setSelectedUser={setSelectedUser}
            addressBookByNetwork={addressBookByNetwork}
            isAddressBookChecked={isAddressBookChecked}
            setIsAddressBookChecked={setIsAddressBookChecked}
          />
          {!isShowContactAccordion && (
            <Fragment>
              <div className="space-y-1 mt-8">
                <CustomTypography variant="subtitle" type="secondary">
                  {t('Labels.amount')}
                </CustomTypography>
                <Input
                  type="number"
                  step="any"
                  fullWidth
                  mainColor
                  className="appearance-none"
                  placeholder={`${asset.title} Amount`}
                  {...register('amount', {
                    valueAsNumber: true,
                    validate: (value) => value > 0,
                  })}
                  error={errors?.amount?.message}
                  endAdornment={
                    <button
                      type="button"
                      className={`p-2 rounded-md text-custom-white hover:bg-custom-white10 ${
                        assetBalance <= 0 ? 'pointer-events-none opacity-30' : ''
                      }`}
                      onClick={() => setMaxWarning(true)}
                    >
                      {t('Labels.max')}
                    </button>
                  }
                />
                <div className="flex items-center justify-between">
                  <CustomTypography variant="body" type="secondary">
                    {getAssetValueFormatted(
                      asset.coingeckoTokenId,
                      getValues('amount') ? parseFloat(getValues('amount') as string) : 0
                    )}
                  </CustomTypography>
                  <CustomTypography variant="small">
                    {`Balance: ${assetBalance}`}
                    {/* ({getAssetValueFormatted(asset.coingeckoTokenId, assetBalance)}) */}
                  </CustomTypography>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-custom-white10 mt-8 space-y-3">
                {asset.isEVMNetwork ? (
                  <>
                    <div className="flex justify-between">
                      <div>
                        <CustomTypography variant="body" type="secondary">
                          {t('Labels.maxFee')}:
                        </CustomTypography>
                        <CustomTypography variant="body">
                          {`${parseFloat(
                            ethers.utils.formatUnits(
                              maxFeePerGas as ethers.BigNumberish,
                              asset.tokenGasFeeUnitToDisplay
                            )
                          ).toFixed(5)} ${asset.tokenGasFeeUnitToDisplay}`}
                        </CustomTypography>
                      </div>
                      <div className="text-right">
                        <CustomTypography variant="body" type="secondary" className="flex-1">
                          {t('Labels.maxPriorityFee')}:
                        </CustomTypography>
                        <CustomTypography variant="body" className="ml-1 min-w-[4.5em]">
                          {`${parseFloat(
                            ethers.utils.formatUnits(
                              maxPriorityFeePerGas as ethers.BigNumberish,
                              asset.tokenGasFeeUnitToDisplay
                            )
                          ).toFixed(5)} ${asset.tokenGasFeeUnitToDisplay}`}
                        </CustomTypography>
                      </div>
                    </div>

                    <Slider
                      size="sm"
                      aria-label="Volume"
                      minValue={1}
                      maxValue={3}
                      showTooltip={true}
                      value={gasOption}
                      onChange={(v: GasOption) => {
                        setGasOption(v)
                      }}
                      isDisabled={getValues('amount') === ''}
                      classNames={{
                        base: 'max-w-md',
                        track: 'border-s-white-10 border-none',
                        filler: 'bg-gradient-dark',
                      }}
                      renderThumb={(props) => (
                        <div {...props} className="group p-1 top-1/2 cursor-grab data-[dragging=true]:cursor-grabbing">
                          <span className="transition-transform shadow-small bg-secondary rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80" />
                        </div>
                      )}
                    />
                  </>
                ) : null}

                <div className="flex">
                  <CustomTypography variant="subtitle" className="flex-1">
                    {t('Token.estimatedGasFee')}
                  </CustomTypography>
                  <div>
                    <CustomTypography className="text-right" variant="subtitle">
                      {estimatedEtherFees} {asset.title}
                    </CustomTypography>
                    <CustomTypography variant="body" className="text-right dark:text-custom-white40">
                      {getAssetValueFormatted(asset.coingeckoTokenId, estimatedEtherFees)}
                    </CustomTypography>
                  </div>
                </div>

                <div className="flex justify-between">
                  <CustomTypography variant="subtitle" className="flex-1">
                    {t('Token.estimatedTime')}
                  </CustomTypography>
                  <CustomTypography className="text-right" variant="subtitle">
                    {estimatedTransactionTime}
                  </CustomTypography>
                </div>
              </div>

              <div className="mt-4 flex flex-col justify-between items-center gap-2">
                <Button
                  data-test-id="button-review"
                  type="submit"
                  color={`${!isDirty || !isValid ? 'disabled' : 'primary'}`}
                  isDisabled={!isDirty || !isValid}
                >
                  {t('Token.reviewTransaction')}
                </Button>
                <Button
                  variant="bordered"
                  color="outlined"
                  // disabled={!ethers.utils.isAddress(addressValue) || !amount.length}
                  isDisabled
                  className="mt-1 mb-2"
                  onClick={() => {
                    // addUserToAddressBook()
                    setModalState(true)
                  }}
                >
                  {t('Token.sendWithLowGas')}
                </Button>
              </div>
            </Fragment>
          )}
        </Form>
      </div>

      <SendWithEstimateModal
        modalState={modalState}
        closeModal={() => setModalState(false)}
        openCalendar={() => setCalendarState(true)}
        handleReview={() => {
          setModalState(false)
          setReceivedTokenModal(true)
        }}
      />

      <AdjustGasAmountModal
        setMaxWarning={setMaxWarning}
        coin={asset}
        maxWarning={maxWarning}
        closeReceiveTokenModal={() => setMaxWarning(false)}
        setMaxAmount={setMaxAmount}
      />

      <ReceiveTokenModal
        receivedTokenModal={receivedTokenModal}
        closeReceiveTokenModal={() => {
          setReceivedTokenModal(false)
          navigate(-1)
        }}
        coin={asset}
      />

      <ModalComponent modalState={calendarState} closeModal={() => setCalendarState(false)}>
        <DatePicker />
      </ModalComponent>
    </SinglePageTitleLayout>
  )
}

export default Send
