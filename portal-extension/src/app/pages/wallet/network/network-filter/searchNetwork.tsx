/* eslint-disable @typescript-eslint/no-floating-promises */
import { Avatar, Button, Listbox, ListboxItem } from '@nextui-org/react'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { NetworkToken } from '@portal/shared/utils/types'
import CustomThumbnail from '@src/app/components/CustomThumbnail'
import { CheckPrimaryIcon, CloseRoundedIcon, SearchIcon } from '@src/app/components/Icons'
import classnames from 'classnames'
import { CustomTypography, Icon, Input, TokenAddressButton } from 'components'
import { useNavigate } from 'lib/woozie'
import { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NoTokenfound from '../../../../../assets/images/no-activity.png'

const SearchNetwork = () => {
  const { t } = useTranslation()
  const { networkEnvironment: networkType, currentAccount } = useSettings()
  const { setSelectedNetwork, selectedNetwork, isAccountCreatedByPrivateKey, getNetworksList, storeWallet, getPhrase } =
    useWallet()
  const { walletsList } = useStore()

  const [selectedNetworks, setSelectedNetworks] = useState(new Set([selectedNetwork]))
  const [searchInput, setSearchInput] = useState<string>('')
  const [filteredNetworks, setFilteredNetworks] = useState<NetworkToken[]>([])
  const { navigate } = useNavigate()

  const [loading, setLoading] = useState<boolean>(false)

  const filteredData: NetworkToken[] = getNetworksList()
  const syncWithSavedNetworks = (filteredList: NetworkToken[]) => {
    let filtered: NetworkToken[] = filteredList.map((network: NetworkToken) => {
      if (currentAccount && walletsList[currentAccount.id]) {
        const walletNetworkName = network.isEVMNetwork ? 'ETH' : network.networkName
        const accountWallet = walletsList[currentAccount.id][walletNetworkName]
        if (accountWallet) {
          return {
            ...network,
            address: accountWallet.address,
          }
        }
      }
      return network
    }) as NetworkToken[]

    if (isAccountCreatedByPrivateKey || currentAccount?.isAccountImported) {
      filtered = filtered.filter((token) => token.address)
    }
    setFilteredNetworks(filtered)
  }
  useEffect(() => {
    if (searchInput) {
      const filtered: NetworkToken[] = filteredData.filter(
        (network: NetworkToken) =>
          network.shortName.toLowerCase().includes(searchInput.toLowerCase()) ||
          (network.subTitle && network.subTitle.toLowerCase().includes(searchInput.toLowerCase()))
      )
      syncWithSavedNetworks(filtered)
    } else {
      syncWithSavedNetworks(filteredData)
    }
  }, [searchInput, walletsList])

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setSearchInput(inputValue)
  }

  const listItemClasses = classnames(
    'relative font-sm font-extrabold px-4 py-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-14 data-[hover=true]:bg-default-100/80'
  )
  const selectedIconClass = classnames('absolute left-[33px] bottom-[11px] z-20 w-4 h-4')

  const handleSelectNetwork = () => {
    setSelectedNetwork(Array.from(selectedNetworks)[0])
    navigate('/home')
  }

  const createNetworkWallet = async (network: NetworkToken) => {
    try {
      setLoading(true)
      const mnemonic = getPhrase()
      if (network && currentAccount && mnemonic) {
        const { wallet, derivationPathIndex } = await NetworkFactory.checkAndCreateNextDeriveWallet(
          mnemonic,
          network.networkName
        )

        await storeWallet(
          { address: wallet.address, derivationPathIndex },
          '',
          '',
          network.networkName,
          currentAccount.id
        )
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="px-1 py-2">
        <CustomTypography type="secondary" variant="subtitle">
          To use {networkType === 'testNet' ? 'main' : 'test'} networks, switch in the Settings
        </CustomTypography>
      </div>
      <div className="space-y-4 px-1">
        <Input
          dataAid="networkSearch"
          placeholder={t('Network.networkName') as string}
          mainColor
          fullWidth
          value={searchInput}
          className="mt-1 h-11"
          icon={
            filteredNetworks.length >= 0 && searchInput ? (
              <Button
                variant="light"
                size="sm"
                isIconOnly
                onClick={() => {
                  setSearchInput(''), setFilteredNetworks([])
                }}
              >
                <CloseRoundedIcon />
              </Button>
            ) : (
              <SearchIcon className="pr-1" />
            )
          }
          onChange={handleSearchInputChange}
        />
        {filteredNetworks.length > 0 && searchInput && (
          <CustomTypography type="secondary" variant="subtitle">
            {filteredNetworks.length} {filteredNetworks.length > 1 ? 'Results' : 'Result'}
          </CustomTypography>
        )}

        <div
          className={`${
            filteredNetworks.length > 0 && searchInput ? 'h-[19rem]' : 'h-[21.25rem]'
          } overflow-scroll bg-surface-dark-alt rounded-lg`}
        >
          {filteredNetworks.length > 0 ? (
            <Listbox
              items={filteredNetworks}
              selectionMode="single"
              selectedKeys={selectedNetworks}
              onSelectionChange={(selected) => setSelectedNetworks(new Set(selected))}
              className="p-0 overflow-visible rounded-medium"
              itemClasses={{ base: listItemClasses, selectedIcon: selectedIconClass }}
            >
              {(data) => (
                <ListboxItem
                  key={data.networkName}
                  data-testid={`${data.networkName}-btn`}
                  className={`text-ellipsis ${selectedNetworks.has(data.id) ? 'bg-default-100/80' : ''}`}
                  selectedIcon={({ isSelected }) => (
                    <CheckPrimaryIcon
                      className={`mr-2 w-[18px] h-[18px] checkmark-icon ${isSelected ? 'active' : ''} `}
                    />
                  )}
                  startContent={
                    <div className="flex items-center">
                      {!data.image ? (
                        <CustomThumbnail thumbName={data.subTitle} />
                      ) : typeof data.image === 'string' ? (
                        <Avatar
                          alt="Networks"
                          className="flex-shrink-0 rounded-full justify-center w-8 h-8 bg-custom-white"
                          size="sm"
                          src={data.image}
                        />
                      ) : (
                        data.image && <Icon icon={data.image} size="large" />
                      )}
                    </div>
                  }
                  endContent={
                    data.address ? (
                      <TokenAddressButton
                        address={data.address}
                        enableCopy
                        placement="left"
                        className="w-32 max-w-32 font-regular text-xs"
                      />
                    ) : (
                      <Button
                        variant="bordered"
                        fullWidth={false}
                        size="sm"
                        disabled={loading}
                        className="rounded-xl font-regular"
                        onClick={() => createNetworkWallet(data)}
                      >
                        Create
                      </Button>
                    )
                  }
                >
                  {data.title || data.subTitle}
                </ListboxItem>
              )}
            </Listbox>
          ) : (
            <div className="mx-auto flex flex-col items-center space-y-2 pt-10">
              <img src={NoTokenfound} alt="no token found" />
              <CustomTypography variant="body" type="secondary">
                {t('Network.noNetworkFound')}
              </CustomTypography>
            </div>
          )}
        </div>
        <div className={`mt-3 flex items-start ${filteredNetworks.length > 0 ? 'gap-2' : ''}`}>
          {selectedNetworks.size > 0 && ![...selectedNetworks].includes('') && (
            <Button
              data-aid="setCancel"
              variant="bordered"
              className="h-11"
              onClick={() => setSelectedNetworks(new Set())}
            >
              {t('Actions.clear')}
            </Button>
          )}

          <Button
            fullWidth
            radius="md"
            data-aid="addNetwork"
            className="font-extrabold h-11 bg-gradient-button"
            onClick={handleSelectNetwork}
          >
            {t('Actions.apply')}
          </Button>
        </div>
      </div>
    </>
  )
}

export default SearchNetwork
