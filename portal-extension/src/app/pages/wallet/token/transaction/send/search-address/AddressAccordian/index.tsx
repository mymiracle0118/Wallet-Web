import { Accordion, AccordionItem } from '@nextui-org/react'
import { AddressBookUser } from '@portal/shared/hooks/useSettings'
import { IAddressAccordian } from '@portal/shared/utils/types'
import { SAFETY_MEASURE } from '@src/utils/constants'
import defaultAvatar from 'assets/images/Avatar.png'
import { Button, CustomTypography, TokenAddressButton } from 'components'
import { useTranslation } from 'react-i18next'

const AddressAccordian = ({
  recentInteractAddresses,
  addressBookByNetwork,
  accountAddresses,
  network,
  onChangeAddress,
}: IAddressAccordian) => {
  const { t } = useTranslation()

  const recentAddresses = recentInteractAddresses?.map((recentAddress) => {
    const addressEntry = addressBookByNetwork.find((entry: AddressBookUser) => entry.address === recentAddress)
    if (addressEntry) {
      return addressEntry
    } else {
      let addressEntry = { avatar: '', username: '-', network, address: recentAddress, safety: SAFETY_MEASURE.LOW }
      const accountAdd = accountAddresses.find((entry: AddressBookUser) => entry.address === recentAddress)
      if (accountAdd) {
        addressEntry = {
          ...addressEntry,
          username: accountAdd.username,
          avatar: accountAdd.avatar,
        }
      }
      return addressEntry
    }
  })

  const itemClasses = {
    base: '!px-0 w-full !bg-transparent border border-solid border-custom-white10 !shadow-none data-focus-visible:!outline-none !rounded-lg',
    title: 'text-sm font-extrabold dark:text-custom-white80 text-left px-4',
    trigger: 'h-14',
    indicator: 'text-medium rotate-90 mr-4',
    content: 'border-t-1 border-solid border-custom-white10 pt-2 px-1',
  }

  return (
    <Accordion variant="splitted" itemClasses={itemClasses} defaultExpandedKeys={['1']} className="mt-4 px-0">
      <AccordionItem key="1" title={t('Token.recentlyInteractedWith')}>
        {recentAddresses && recentAddresses.length ? (
          recentAddresses.map((option) => (
            <Button
              key={option.username}
              onClick={() => onChangeAddress(option)}
              color="outlined"
              className="flex justify-between items-center cursor-pointer px-3 h-14 hover:bg-custom-white10 rounded-md border-0 !bg-transparent w-full"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={option?.avatar || defaultAvatar}
                  alt="Avatar"
                  className="rounded-full h-7 w-7 overflow-hidden"
                />
                <CustomTypography variant="subtitle" className="w-36 !line-clamp-2 text-left">
                  {option.username === '-' ? option.username : `@${option.username as string}`}
                </CustomTypography>
              </div>
              <TokenAddressButton address={option.address} enableCopy className="text-xs" />
            </Button>
          ))
        ) : (
          <CustomTypography variant="subtitle" className="text-center py-4" type="secondary">
            {t('Token.NoAddressFound')}
          </CustomTypography>
        )}
      </AccordionItem>
      <AccordionItem key="2" title={t('Token.inThisWallet')}>
        {accountAddresses.length ? (
          <div className={accountAddresses.length > 4 ? 'overflow-y-auto h-[270px]' : 'h-auto'}>
            {accountAddresses?.map((user: AddressBookUser) => (
              <Button
                color="outlined"
                key={user.username}
                onClick={() => onChangeAddress(user)}
                className="flex justify-between items-center cursor-pointer px-3 h-14 hover:bg-custom-white10 rounded-md border-0 !bg-transparent w-full"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user?.avatar || defaultAvatar}
                    alt="Avatar"
                    className="rounded-full h-7 w-7 overflow-hidden"
                  />
                  <CustomTypography variant="subtitle" className="w-36 !line-clamp-2 text-left">
                    @{user.username}
                  </CustomTypography>
                </div>
                <TokenAddressButton address={user.address} enableCopy className="text-xs" />
              </Button>
            ))}
          </div>
        ) : (
          <CustomTypography variant="subtitle" className="text-center py-4" type="secondary">
            {t('Token.NoAddressFound')}
          </CustomTypography>
        )}
      </AccordionItem>
    </Accordion>
  )
}

export default AddressAccordian
