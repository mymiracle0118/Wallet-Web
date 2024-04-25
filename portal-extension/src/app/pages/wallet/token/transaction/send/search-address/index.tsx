import { AddressBookUser } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import { ISearchAddressProps, NetworkToken } from '@portal/shared/utils/types'
import AddressBookComponent from '@src/app/components/AddressBook/AddressBook'
import { CloseRoundedIcon, ContactIcon } from '@src/app/components/Icons'
import { Button, Input } from 'components'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SAFETY_MEASURE, getWalletAddressRegex } from 'utils/constants'
import AddressAccordian from './AddressAccordian'
import AddtoAddressBook from './AddtoAddressBook'

const SearchAddress = ({
  setValue,
  network,
  register,
  errorMsg,
  watch,
  isAddressBookChecked,
  setIsAddressBookChecked,
  selectedUser,
  setSelectedUser,
  isShowContactAccordion,
  setShowContactAccordion,
  addressBookByNetwork,
  accountAddresses,
  recentInteractAddresses,
  setShowAddressBook,
  isShowAddressBook,
  isShowAmountStep,
  setShowAmountStep,
  isDirty,
  isAddressserror,
  showAddAddress,
}: ISearchAddressProps) => {
  const { t } = useTranslation()
  const { getNetworkToken } = useStore()
  const asset: NetworkToken = getNetworkToken(network)

  const onChangeAddress = (newValue: AddressBookUser) => {
    setValue('address', newValue.address, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    setSelectedUser(newValue)
    setShowContactAccordion(false)
  }

  useEffect(() => {
    setIsAddressBookChecked(false)
  }, [selectedUser])

  const regex = getWalletAddressRegex(asset?.isSupraNetwork ? 'SUPRA' : network)

  const invalid_message = useMemo(
    () => !!selectedUser?.address.length && !selectedUser?.address.match(regex) && 'Address is incorrect',
    [regex, selectedUser?.address]
  )

  const onHandleAddressRemove = () => {
    setShowAddressBook
      ? selectedUser?.address
        ? (setSelectedUser(null), setShowContactAccordion(true), setShowAmountStep(false))
        : setShowAddressBook(false)
      : null
  }

  return (
    <div
      className={`flex flex-col justify-between ${
        isShowAmountStep ||
        (!showAddAddress && selectedUser?.address && !isAddressserror) ||
        (!selectedUser?.address && isDirty && !isAddressserror)
          ? 'h-auto'
          : 'h-[30rem]'
      }`}
    >
      <div>
        <Input
          mainColor
          fullWidth
          autoComplete="off"
          value={selectedUser ? selectedUser?.address : ''}
          error={invalid_message}
          placeholder={t('Token.sendAddressPlaceholder') as string}
          disabled={(selectedUser?.address && !invalid_message) || isShowAmountStep}
          onChange={(e) =>
            onChangeAddress({
              address: e.target.value,
              username: '',
              network,
              safety: SAFETY_MEASURE.LOW,
              avatar: '',
            })
          }
          onPaste={(e) =>
            onChangeAddress({
              address: e.target.value,
              username: '',
              network,
              safety: SAFETY_MEASURE.LOW,
              avatar: '',
            })
          }
          icon={
            !isShowAddressBook && selectedUser?.address ? (
              <div className="cursor-pointer" onClick={() => onHandleAddressRemove()}>
                <CloseRoundedIcon />
              </div>
            ) : (
              <div
                className="cursor-pointer"
                onClick={() => setShowAddressBook && setShowAddressBook(!isShowAddressBook)}
              >
                <ContactIcon />
              </div>
            )
          }
        />
        {showAddAddress && !invalid_message && !isShowAmountStep && (
          <AddtoAddressBook
            register={register}
            errorMsg={errorMsg}
            watch={watch}
            isAddressBookChecked={isAddressBookChecked}
            setIsAddressBookChecked={setIsAddressBookChecked}
          />
        )}
        {isShowAddressBook ? (
          <div className="mt-4">
            <AddressBookComponent
              onClickAddAddress={(user: AddressBookUser) => {
                onChangeAddress(user)
                setShowAddressBook && setShowAddressBook(false)
              }}
            />
          </div>
        ) : (
          !showAddAddress &&
          (isShowContactAccordion || (!selectedUser?.address && isDirty && isAddressserror)) && (
            <AddressAccordian
              recentInteractAddresses={recentInteractAddresses}
              addressBookByNetwork={addressBookByNetwork}
              accountAddresses={accountAddresses}
              network={network}
              onChangeAddress={onChangeAddress}
            />
          )
        )}
      </div>
      {!isShowAmountStep && showAddAddress && selectedUser?.address && !isAddressserror && (
        <Button
          data-test-id="button-review"
          color={`${
            !selectedUser?.address ||
            invalid_message ||
            watch('label')?.length > 15 ||
            (isAddressBookChecked && watch('label')?.length === 0)
              ? 'disabled'
              : 'primary'
          }`}
          isDisabled={
            !selectedUser?.address ||
            invalid_message ||
            watch('label')?.length > 15 ||
            (isAddressBookChecked && watch('label')?.length === 0)
          }
          onClick={() => setShowAmountStep(true)}
        >
          {t('Actions.next')}
        </Button>
      )}
    </div>
  )
}

export default SearchAddress
