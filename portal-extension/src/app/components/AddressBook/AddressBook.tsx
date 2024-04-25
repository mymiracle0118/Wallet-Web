import { Avatar } from '@nextui-org/react'
import { useStore } from '@portal/shared/hooks/useStore'
import { IAddressBookComponentProps, NetworkToken } from '@portal/shared/utils/types'
import { AddressBookUser, useSettings } from '@src/../../shared/hooks/useSettings'
import { CustomTypography, TokenAddressButton } from 'app/components'
import { createLocationState } from 'lib/woozie'
import { KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import NoTokenfound from '../../../assets/images/no-activity.png'

const AddressBookComponent = ({ onClickAddAddress }: IAddressBookComponentProps) => {
  const { t } = useTranslation()
  const { addressBook } = useSettings()
  const { getNetworkToken } = useStore()

  const { pathname } = createLocationState()
  const paths = pathname.split('/')
  const network: string = paths[paths.length - 2]
  const assetId: string = paths[paths.length - 1]
  const asset: NetworkToken = getNetworkToken(assetId)

  const walletNetworkName = asset?.isEVMNetwork ? 'ETH' : network
  const addressOfNetworks =
    asset?.networkName === 'SUPRA' || asset?.networkName === 'APT' ? ['SUPRA', 'APT'] : [walletNetworkName]

  const filteredAddressBook = addressBook.filter((address) => addressOfNetworks.includes(address.network))

  const handleClick = (user: AddressBookUser) => {
    if (onClickAddAddress) {
      onClickAddAddress(user)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, user: AddressBookUser) => {
    if (event.key === 'Enter') {
      handleClick(user)
    }
  }

  return (
    <div>
      {filteredAddressBook.length > 0 ? (
        filteredAddressBook?.map((user: AddressBookUser) => (
          <div
            className="flex items-center justify-between h-14 hover:bg-custom-white10 rounded-[0.75rem] px-1 transition-all ease-in-out duration-100"
            key={user.username}
            onClick={() => handleClick(user)}
            onKeyDown={(event) => handleKeyDown(event, user)}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center space-x-3">
              <Avatar alt={user.username} src={user.avatar} className="w-7 h-7" />
              <CustomTypography variant="subtitle" className="w-36 !line-clamp-2">
                {user.username}
              </CustomTypography>
            </div>
            <TokenAddressButton enableCopy address={user.address} className="text-xs whitespace-nowrap" />
          </div>
        ))
      ) : (
        <div className="mx-auto flex flex-col items-center space-y-3 pt-10">
          <img src={NoTokenfound} alt="no token found" />
          <CustomTypography variant="subtitle" className="text-center" type="secondary">
            {t('Token.NoAddressFound')}
          </CustomTypography>
        </div>
      )}
    </div>
  )
}

export default AddressBookComponent
