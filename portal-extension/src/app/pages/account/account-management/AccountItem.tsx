import { Button } from 'app/components'
import defaultAvatar from 'assets/images/Avatar.png'
import { useTranslation } from 'react-i18next'

import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Listbox, ListboxItem } from '@nextui-org/react'
import { AccountOptionProps, IAccountItemProps } from '@portal/shared/utils/types'
import { CheckPrimaryIcon, EditIcon, EyeOffIcon, KeyIcon, ThreeDotIcon } from '@src/app/components/Icons'
import { useNavigate } from 'lib/woozie'

const AccountItem = ({
  accountId,
  avatar,
  active,
  onClick,
  username,
  allowHideAccount,
  onClickHideAccount,
}: IAccountItemProps) => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()

  const AccountOptions: AccountOptionProps[] = [
    {
      key: 'Edit',
      name: `${t('Account.option1')}`,
      icon: <EditIcon className="mr-3" />,
      accountImported: false,
      isVisible: true,
      onAction: () => navigate(`/account/edit/${accountId as string}`),
    },
    {
      key: 'Show Private Key',
      name: `${t('Account.option2')}`,
      icon: <KeyIcon className="mr-3" />,
      accountImported: false,
      isVisible: true,
      onAction: () => navigate(`/account/show-private-key/${accountId as string}`),
    },
    {
      key: 'Hide',
      name: `${t('Account.option3')}`,
      icon: <EyeOffIcon className="stroke-custom-white mr-3" />,
      accountImported: true,
      isVisible: allowHideAccount,
      onAction: () => onClickHideAccount && onClickHideAccount(accountId),
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
          <Listbox
            variant="flat"
            data-testid={`account-list-${username}`}
            onAction={() => onClick && onClick(accountId)}
          >
            <ListboxItem
              key={username}
              startContent={
                <div className="relative mr-2 rounded-full">
                  <Avatar
                    src={avatar || defaultAvatar}
                    alt="user-avatar"
                    className="min-w-[2rem] w-8 h-8 rounded-full bg-custom-white"
                  />
                  {active && (
                    <div className="absolute -right-1 -bottom-2 flex justify-center items-center bg-transparent p-1 rounded-full">
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
                    {AccountOptions.filter((op) => op.isVisible).map((options) => (
                      <DropdownItem
                        key={options.key}
                        startContent={options.icon}
                        className="text-sm !font-extrabold py-3"
                        onClick={options.onAction}
                      >
                        {options.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              }
            >
              {username}
            </ListboxItem>
          </Listbox>
        </div>
      </>
    )
  }

  return (
    <>
      <AccountListing />
    </>
  )
}

export default AccountItem
