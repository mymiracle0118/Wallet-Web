/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useEffect, useMemo } from 'react'
import { Accordion, AccordionItem, Checkbox, CheckboxIcon } from '@nextui-org/react'
import { CustomTypography, Input, TokenAddressButton } from 'components'
import { useNavigate } from 'lib/woozie'
import { useTranslation } from 'react-i18next'
import { AddressBookUser } from '@portal/shared/hooks/useSettings'
import { ContactIcon } from '@src/app/components/Icons'
import { SAFETY_MEASURE, getWalletAddressRegex } from 'utils/constants'
import defaultAvatar from 'assets/images/Avatar.png'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { ISearchAddressProps } from '@portal/shared/utils/types'

const SearchAddress = ({
  setValue,
  network,
  register,
  isAddressBookChecked,
  setIsAddressBookChecked,
  selectedUser,
  setSelectedUser,
  isShowContactAccordion,
  setShowContactAccordion,
  addressBookByNetwork,
}: ISearchAddressProps) => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const { avatar } = useWallet()

  // handle address book
  const showAdd =
    !!selectedUser?.address.length &&
    !addressBookByNetwork.filter((user: AddressBookUser) => user.address === selectedUser?.address).length

  const onChangeAddress = (newValue: AddressBookUser) => {
    setValue('address', newValue.address, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    setSelectedUser(newValue)
    setShowContactAccordion(false)
  }

  useEffect(() => {
    setIsAddressBookChecked(false)
  }, [selectedUser])

  // AddressBook in Wallet
  const filtered = selectedUser?.address.length
    ? addressBookByNetwork.filter((user) => user.username.includes(selectedUser?.address))
    : null
  const showList = filtered ? !!filtered.length : !!addressBookByNetwork.length

  const regex = getWalletAddressRegex(network)

  const invalid_message = useMemo(
    () => !!selectedUser?.address.length && !selectedUser?.address.match(regex) && 'Invalid address',
    [regex, selectedUser?.address]
  )

  const itemClasses = {
    base: '!px-0 w-full !bg-transparent border border-solid border-custom-white10 !shadow-none data-focus-visible:!outline-none !rounded-lg',
    title: 'text-sm font-extrabold dark:text-custom-white80 text-left px-4',
    trigger: 'h-14',
    indicator: 'text-medium rotate-90 mr-4',
    content: 'border-t-1 border-solid border-custom-white10 pt-2 px-1',
  }

  return (
    <div>
      <Input
        mainColor
        fullWidth
        autoComplete="off"
        value={selectedUser?.address}
        error={invalid_message}
        placeholder={t('Token.sendAddressPlaceholder')}
        onClick={() => setShowContactAccordion(true)}
        onChange={(e) =>
          onChangeAddress({
            address: e.target.value,
            username: 'unknown',
            network,
            safety: SAFETY_MEASURE.LOW,
            avatar: '',
          })
        }
        onPaste={(e) =>
          onChangeAddress({
            address: e.target.value,
            username: 'unknown',
            network,
            safety: SAFETY_MEASURE.LOW,
            avatar: '',
          })
        }
        icon={
          <div onClick={() => navigate('/transaction/address-book')} className="cursor-pointer">
            <ContactIcon />
          </div>
        }
      />

      {showAdd && (
        <div className="rounded-lg border border-solid border-custom-white10 p-4 mt-4">
          <Checkbox
            isSelected={isAddressBookChecked}
            onValueChange={setIsAddressBookChecked}
            size="lg"
            radius="sm"
            icon={<CheckboxIcon />}
          >
            <CustomTypography variant="subtitle">{t('Token.addToAddressBook')}</CustomTypography>
          </Checkbox>
          <div className={`${isAddressBookChecked ? 'flex' : 'hidden'} mt-2 transition-all ease-in-out duration-200`}>
            <Input type="text" fullWidth mainColor placeholder="Label" {...register('name')} error="" />
          </div>
        </div>
      )}

      {isShowContactAccordion && (
        <Accordion variant="splitted" itemClasses={itemClasses} defaultExpandedKeys={['1']} className="mt-4 px-0">
          <AccordionItem key="1" title={t('Token.recentlyInteractedWith')}>
            <div className="px-4">{t('Token.NoAddressFound')}</div>
          </AccordionItem>
          <AccordionItem key="2" title={t('Token.inThisWallet')}>
            {showList ? (
              <>
                {filtered ? (
                  filtered.map((option) => (
                    <div
                      role="button"
                      tabIndex={0}
                      key={option.username}
                      onClick={() => onChangeAddress(option)}
                      className="flex justify-between items-center cursor-pointer px-3 h-14 hover:bg-custom-white10 rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={avatar || defaultAvatar}
                          alt="Avatar"
                          className="rounded-full h-7 w-7 overflow-hidden"
                        />
                        <CustomTypography variant="subtitle" className="w-36 !line-clamp-2">
                          @{option.username}
                        </CustomTypography>
                      </div>
                      <TokenAddressButton address={option.address} enableCopy className="text-xs" />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col">
                    {addressBookByNetwork?.map((user) => (
                      <div
                        role="button"
                        tabIndex={0}
                        key={user.username}
                        onClick={() => onChangeAddress(user)}
                        className="flex justify-between items-center cursor-pointer px-3 h-14 hover:bg-custom-white10 rounded-md"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={avatar || defaultAvatar}
                            alt="Avatar"
                            className="rounded-full h-7 w-7 overflow-hidden"
                          />
                          <CustomTypography variant="subtitle" className="w-36 !line-clamp-2">
                            @{user.username}
                          </CustomTypography>
                        </div>
                        <TokenAddressButton address={user.address} enableCopy className="text-xs" />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <CustomTypography variant="subtitle" className="text-center py-4" type="secondary">
                {t('Token.NoAddressFound')}
              </CustomTypography>
            )}
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )
}

export default SearchAddress
