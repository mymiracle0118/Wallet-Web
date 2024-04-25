/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useBalance } from '@portal/shared/hooks/useBalance'
import { useGas } from '@portal/shared/hooks/useGas'
import { usePricing } from '@portal/shared/hooks/usePricing'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { ethers } from 'ethers'
import { createLocationState, useNavigate } from 'lib/woozie'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, CustomTypography, DatePicker, Form, Input, ModalComponent } from 'components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'

import { AddressBookUser, useSettings } from '@portal/shared/hooks/useSettings'
import { SAFETY_MEASURE, getMinimumBalance, getWalletAddressRegex } from 'utils/constants'
import { AdjustGasAmountModal, ReceiveTokenModal, SendSameAddressModal, SendWithEstimateModal } from './SendModals'

import { yupResolver } from '@hookform/resolvers/yup'
import { Slider } from '@nextui-org/react'
import { useStore } from '@portal/shared/hooks/useStore'
import { GasOption, NetworkToken } from '@portal/shared/utils/types'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import SearchAddress from './search-address'

const Send = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { getNetworkToken, getAccountNetworkAddresses } = useStore()
  const { pathname } = createLocationState()
  const paths = pathname.split('/')
  const network: string = paths[paths.length - 2]
  const assetId: string = paths[paths.length - 1]

  const { setTransaction } = useWallet() //getAsset,
  const asset: NetworkToken = getNetworkToken(assetId)
  const accountAddresses = getAccountNetworkAddresses(asset)
  const walletNetworkName = asset.isEVMNetwork ? 'ETH' : asset?.isSupraNetwork ? 'SUPRA' : network

  const { addToAddressBook, addressBook, getRecentIntractAddress } = useSettings()
  const recentAddresses = getRecentIntractAddress(walletNetworkName)
  const { balanceFormatted } = useBalance(asset)
  const assetBalance = useMemo(
    () => Math.round((Number(balanceFormatted) + Number.EPSILON) * 100000) / 100000,
    [balanceFormatted]
  )

  const { getAssetValueFormatted, getGasValueFormatted } = usePricing()
  const { gasOption, setGasOption, maxFeePerGas, estimatedTransactionCost, estimatedTransactionTime } = useGas(asset)

  const [selectedUser, setSelectedUser] = useState<null | AddressBookUser>(null)
  const [modalState, setModalState] = useState<boolean>(false)
  const [receivedTokenModal, setReceivedTokenModal] = useState<boolean>(false)
  const [calendarState, setCalendarState] = useState<boolean>(false)
  const [maxWarning, setMaxWarning] = useState<boolean>(false)
  const [isAddressBookChecked, setIsAddressBookChecked] = useState<boolean>(false)
  const [isShowContactAccordion, setShowContactAccordion] = useState<boolean>(true)
  const [isShowAddressBook, setShowAddressBook] = useState<boolean>(false)
  const [isShowSameAddressModal, setShowSameAddressModal] = useState<boolean>(false)
  const [isShowAmountStep, setShowAmountStep] = useState<boolean>(false)

  const [estimatedEtherFees, setEstimatedEthersFees] = useState<number>(0)
  const addressBookByNetwork = addressBook.filter((address) => address?.network === walletNetworkName)

  const [showSlider, setShowSlider] = useState<boolean>(true)

  const addUserToAddressBook = (name: string) => {
    if (isAddressBookChecked && selectedUser) {
      addToAddressBook({
        avatar: '',
        username: name ? name : `Account #${addressBookByNetwork?.length + 1}`,
        network: walletNetworkName,
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
      .test('maxDecimalPlaces', t('Wallet.must6DecimalOrLess') as string, (number) =>
        /^\d+(\.\d{1,6})?$/.test(String(number))
      )
      .typeError(t('Wallet.mustHaveAmount') as string)
      .moreThan(0, t('Wallet.enterValidAmount') as string)
      .max(assetBalance - estimatedEtherFees, t('Wallet.insufficientBalance') as string)
      .required(),
    address: yup.string().required().matches(getWalletAddressRegex(walletNetworkName)),
    label: yup.string(),
  })

  const handleReviewTransaction = (data: { label: string; amount: string }) => {
    if (selectedUser) {
      addUserToAddressBook(data.label)
      setTransaction({
        asset,
        to: selectedUser.address,
        amount: data.amount.toString(),
        gasOption,
        symbol: asset.title,
      })
      if (asset.address === selectedUser?.address) {
        setShowSameAddressModal(true)
      } else {
        navigate('/transaction/send-review')
      }
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
    watch,
    setError,
    formState: { isDirty, isValid, errors },
  } = methods

  const setMaxAmount = () => {
    setShowSlider(false)
    const maxGas = estimatedEtherFees + (estimatedEtherFees * 10) / 100
    const calculatedAmount =
      Math.floor((assetBalance - maxGas - (0.1 * maxGas + getMinimumBalance(asset.shortName))) * 1000000) / 1000000
    if (calculatedAmount > 0) {
      if (asset.tokenType === 'Native') {
        setValue('amount', calculatedAmount, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        })
      } else {
        setValue('amount', assetBalance, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        })
      }
      setMaxWarning(false)
    } else {
      setError('amount', { type: 'custom', message: t('Wallet.insufficientBalance') as string })
      setMaxWarning(false)
    }
  }

  const enteredAmountDollarValue = Number(
    getAssetValueFormatted(
      asset.coingeckoTokenId,
      getValues('amount') ? parseFloat(getValues('amount') as string) : 0
    ).replace('$', '')
  )
  const estimatedGasFeeDollarValue = getGasValueFormatted(asset.coingeckoTokenId, estimatedEtherFees)

  const showAddAddress =
    !!selectedUser?.address.length &&
    !addressBookByNetwork.filter((user: AddressBookUser) => user.address === selectedUser?.address).length

  return (
    <SinglePageTitleLayout showMenu title={t('Actions.send')}>
      <div>
        <Form methods={methods} onSubmit={handleSubmit(handleReviewTransaction)}>
          <CustomTypography variant="subtitle" type="secondary" className="mb-1">
            {t('Labels.to')}
          </CustomTypography>
          <SearchAddress
            setValue={setValue}
            network={network}
            register={register}
            watch={watch}
            errorMsg={errors.label?.message}
            selectedUser={selectedUser}
            isShowContactAccordion={isShowContactAccordion}
            setShowContactAccordion={setShowContactAccordion}
            setSelectedUser={setSelectedUser}
            addressBookByNetwork={addressBookByNetwork}
            isAddressBookChecked={isAddressBookChecked}
            setIsAddressBookChecked={setIsAddressBookChecked}
            recentInteractAddresses={recentAddresses}
            accountAddresses={accountAddresses}
            isShowAddressBook={isShowAddressBook}
            setShowAddressBook={setShowAddressBook}
            setShowAmountStep={setShowAmountStep}
            isShowAmountStep={isShowAmountStep}
            isDirty={isDirty}
            isAddressserror={errors.address}
            showAddAddress={showAddAddress}
          />
          {(isShowAmountStep || (selectedUser?.address && !errors.address && !showAddAddress)) && (
            <div>
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
                      className={`px-2 py-1.5 rounded-md text-custom-white hover:bg-custom-grey transition-all duration-300 ease-in-out ${
                        assetBalance <= 0 ? 'pointer-events-none opacity-30 bg-transparent' : 'bg-custom-white10'
                      }`}
                      onClick={() => {
                        setMaxWarning(true)
                      }}
                    >
                      {t('Labels.max')}
                    </button>
                  }
                />
                <div className="flex items-center justify-between">
                  <CustomTypography variant="body" type="secondary">
                    {Number(enteredAmountDollarValue) > 0 ? `$${enteredAmountDollarValue}` : ''}
                  </CustomTypography>
                  <CustomTypography variant="small">
                    {`Balance: ${assetBalance}`}
                    {/* ({getAssetValueFormatted(asset.coingeckoTokenId, assetBalance)}) */}
                  </CustomTypography>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-custom-white10 mt-8 space-y-3">
                {asset?.isEVMNetwork && showSlider ? (
                  <>
                    <div className="flex justify-between">
                      <CustomTypography variant="body" type="secondary">
                        {t('Labels.maxFee')}
                      </CustomTypography>
                      <div>
                        <CustomTypography variant="body">
                          {`${parseFloat(
                            ethers.formatUnits(maxFeePerGas as ethers.BigNumberish, asset.tokenGasFeeUnitToDisplay)
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
                      {estimatedGasFeeDollarValue > 0 ? `$${estimatedGasFeeDollarValue}` : ''}
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
                  color={`${
                    !isDirty ||
                    !isValid ||
                    watch('label')?.length > 15 ||
                    (isAddressBookChecked && watch('label')?.length < 1)
                      ? 'disabled'
                      : 'primary'
                  }`}
                  isDisabled={
                    !isDirty ||
                    !isValid ||
                    watch('label')?.length > 15 ||
                    (isAddressBookChecked && watch('label')?.length < 1)
                  }
                >
                  {t('Token.reviewTransaction')}
                </Button>
                {/* <Button
                  variant="bordered"
                  color="outlined"
                  isDisabled
                  className="mt-1 mb-2"
                  onClick={() => {
                    setModalState(true)
                  }}
                >
                  {t('Token.sendWithLowGas')}
                </Button> */}
              </div>
            </div>
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
        image={asset.image}
        title={asset.title}
      />

      <SendSameAddressModal
        onContinue={() => navigate('/transaction/send-review')}
        isShowSameAddressModal={isShowSameAddressModal}
        setShowSameAddressModal={() => setShowSameAddressModal(false)}
      />

      <ModalComponent modalState={calendarState} closeModal={() => setCalendarState(false)} imgAlt="ETH">
        <DatePicker />
      </ModalComponent>
    </SinglePageTitleLayout>
  )
}

export default Send
