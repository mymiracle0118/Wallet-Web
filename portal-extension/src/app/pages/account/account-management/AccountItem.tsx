import { useSettings } from '@portal/shared/hooks/useSettings'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { Button, CustomTypography } from 'app/components'
import defaultAvatar from 'assets/images/Avatar.png'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
} from '@nextui-org/react'
import { AccountOptionProps, IAccountItemProps } from '@portal/shared/utils/types'
import { CheckPrimaryIcon, EditIcon, EyeOffIcon, KeyIcon, ThreeDotIcon } from '@src/app/components/Icons'
import AlertIcon from 'assets/images/alert.png'
import { useNavigate } from 'lib/woozie'

const AccountItem = ({ avatar, active, onClick, userName, address, balance, isAccountImported }: IAccountItemProps) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const [hideAccoutModal, setHideAccoutModal] = useState<boolean>(false)
  const { accounts, hideAccount, saveAccount } = useSettings()
  const { setActiveWallet } = useWallet()
  const { navigate } = useNavigate()

  const handleHideAccount = () => {
    setLoading(true)
    const toBeActiveAddress = Object.keys(accounts)[0]
    hideAccount(address)
    setActiveWallet(toBeActiveAddress)
    saveAccount()
    setLoading(false)
  }

  const AccountOptions: AccountOptionProps[] = [
    {
      key: 'Edit',
      name: `${t('Account.option1')}`,
      icon: <EditIcon className="mr-3" />,
      accountImported: false,
      onAction: () => navigate(`/account/edit/${address}`),
    },
    {
      key: 'Show Private Key',
      name: `${t('Account.option2')}`,
      icon: <KeyIcon className="mr-3" />,
      accountImported: false,
      onAction: () => navigate(`/account/show-private-key/${address}`),
    },
    {
      key: 'Hide',
      name: `${t('Account.option3')}`,
      icon: <EyeOffIcon className="mr-3" />,
      accountImported: true,
      onAction: () => setHideAccoutModal(true),
    },
  ]

  const AccountListing = () => {
    return (
      <>
        <div
          className={`${
            active ? 'active bg-[#313239]' : ''
          } flex items-center h-14 hover:bg-[#313239] transition-all ease-in-out duration-200 cursor-pointer rounded-lg`}
        >
          <Listbox variant="flat" data-testid={`account-list-${userName}`} onAction={() => onClick && onClick(address)}>
            <ListboxItem
              key={userName}
              description={balance}
              startContent={
                <div className="relative mr-2">
                  <img src={avatar || defaultAvatar} alt="user-avatar" className="min-w-[2rem] w-8 h-8 rounded-full" />
                  {active && (
                    <div className="absolute -right-1 -bottom-1 flex justify-center items-center bg-[#313239] p-1 rounded-full">
                      <CheckPrimaryIcon />
                    </div>
                  )}
                </div>
              }
              endContent={
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button size="sm" isIconOnly variant="light" fullWidth={false}>
                      <ThreeDotIcon />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat" className="w-52">
                    {AccountOptions.map((options) =>
                      (isAccountImported && options.accountImported) || !options.accountImported ? (
                        <DropdownItem
                          key={options.key}
                          startContent={options.icon}
                          className="text-sm !font-extrabold py-3"
                          onClick={options.onAction}
                        >
                          {options.name}
                        </DropdownItem>
                      ) : null
                    )}
                  </DropdownMenu>
                </Dropdown>
              }
            >
              {userName}
            </ListboxItem>
          </Listbox>
        </div>
      </>
    )
  }

  return (
    <>
      {isAccountImported && (
        <div className="relative">
          <CustomTypography
            variant="small"
            className="ml-3 my-3 bg-gray-dark absolute top-2 right-12 z-40 rounded-lg px-2 shadow-large"
            type="secondary"
          >
            Imported
          </CustomTypography>
        </div>
      )}
      <AccountListing />

      <Modal
        backdrop="opaque"
        isOpen={hideAccoutModal}
        onClose={() => setHideAccoutModal(false)}
        hideCloseButton={true}
        placement="center"
        className="max-w-[20.625rem]"
      >
        <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
          <ModalBody>
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <Image width={64} height={64} src={AlertIcon} fallbackSrc={AlertIcon} alt="Alert" />
              </div>

              <CustomTypography variant="h1">{t('Account.modalTitle')}</CustomTypography>

              <div className="flex items-center justify-between gap-x-4">
                <Button
                  variant="bordered"
                  data-aid="setCancel"
                  className="my-2"
                  color="outlined"
                  onClick={() => setHideAccoutModal(false)}
                >
                  {t('Actions.cancel')}
                </Button>
                <Button
                  data-test-id="button-hide-account"
                  color={`${loading ? 'disabled' : 'negative'}`}
                  isDisabled={loading}
                  onClick={handleHideAccount}
                >
                  {t('Actions.hideNow')}
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AccountItem
