import { Popover } from '@headlessui/react'
import { IAddressDropdownProps } from '@portal/shared/utils/types'
import { CustomTypography, Input, TokenAddressButton } from 'components'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SAFETY_MEASURE, getWalletAddressRegex } from 'utils/constants'
import { ContactIcon } from '../Icons'

export const AddressDropdown = ({
  data,
  selectedUser,
  onChange,
  onBookmarkClick,
  onPaste,
  network,
}: IAddressDropdownProps) => {
  const filtered = selectedUser?.address.length
    ? data.filter((user) => user.username.includes(selectedUser?.address))
    : null
  const { t } = useTranslation()
  const showList = filtered ? !!filtered.length : !!data.length

  const regex = getWalletAddressRegex(network)

  const invalid_message = useMemo(
    () => !!selectedUser?.address.length && !selectedUser?.address.match(regex) && t('Actions.invalidAddress'),
    [selectedUser]
  )
  return (
    <div
      className="border-solid  dark:border-custom-white40 border-custom-grey40 rounded-md"
      style={{ borderWidth: selectedUser?.safety && !invalid_message ? '1px' : '0px' }}
    >
      <Popover className="relative">
        <Popover.Button as={Fragment}>
          <Input
            autoComplete="off"
            value={selectedUser?.address}
            onChange={(e) =>
              onChange({
                address: e.target.value,
                username: 'unknown',
                network,
                safety: SAFETY_MEASURE.LOW,
                avatar: '',
              })
            }
            onPaste={(e) =>
              onPaste({ address: e.target.value, username: 'unknown', network, safety: SAFETY_MEASURE.LOW, avatar: '' })
            }
            error={invalid_message}
            mainColor
            placeholder={t('Token.sendAddressPlaceholder') as string}
            fullWidth
            icon={
              <div onClick={onBookmarkClick} className="cursor-pointer">
                <ContactIcon />
              </div>
            }
          />
        </Popover.Button>

        {showList && (
          <Popover.Panel className="z-10 bg-surface-light dark:bg-surface-dark-alt absolute w-full rounded-xl shadow-md pt-2 pb-2">
            {filtered ? (
              filtered.map((option) => (
                <div
                  role="button"
                  tabIndex={0}
                  onKeyPress={() => {
                    // placeholder
                  }}
                  key={option.username}
                  onClick={() => onChange(option)}
                  className="flex justify-between items-center shadow-sm pt-[10px] pb-[10px] pl-3 pr-3 cursor-pointer"
                >
                  <CustomTypography variant="subtitle" className="my-4">
                    {option.username}
                  </CustomTypography>
                  <TokenAddressButton address={option.address} enableCopy />
                </div>
              ))
            ) : (
              <div className="flex flex-col">
                {data?.map((user) => (
                  <div
                    role="button"
                    tabIndex={0}
                    key={user.username}
                    onClick={() => onChange(user)}
                    className="flex justify-between items-center shadow-sm pt-[10px] pb-[10px] pl-3 pr-3 cursor-pointer"
                  >
                    <CustomTypography variant="subtitle" className="my-4">
                      {user.username}
                    </CustomTypography>
                    <TokenAddressButton address={user.address} enableCopy />
                  </div>
                ))}
              </div>
            )}
          </Popover.Panel>
        )}
      </Popover>
    </div>
  )
}
