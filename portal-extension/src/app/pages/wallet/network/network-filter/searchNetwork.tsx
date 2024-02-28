/* eslint-disable @typescript-eslint/no-floating-promises */
import { Avatar, Listbox, ListboxItem } from '@nextui-org/react'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { NetworkToken } from '@portal/shared/utils/types'
import { CheckPrimaryIcon, CloseRoundedIcon, SearchIcon } from '@src/app/components/Icons'
import PasswordPromptModal from 'app/pages/wallet/PasswordPromptModal'
import classnames from 'classnames'
import { Button, CustomTypography, Icon, Input, TokenAddressButton } from 'components'
import { ethers } from 'ethers'
import { useNavigate } from 'lib/woozie'
import { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const SearchNetwork = () => {
  const { t } = useTranslation()
  const { networkEnvironment: networkType, currentAccount } = useSettings()
  const { setSelectedNetwork, selectedNetwork, isAccountCreatedByPrivateKey, getNetworksList, storeWallet } =
    useWallet()
  const { walletsList } = useStore()

  const [selectedNetworks, setSelectedNetworks] = useState(new Set([selectedNetwork]))
  const [searchInput, setSearchInput] = useState('')
  const [filteredNetworks, setFilteredNetworks] = useState<NetworkToken[]>([])
  const { navigate } = useNavigate()
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)

  const [checkCreateNetworkWallet, setCheckCreateNetworkWallet] = useState<NetworkToken | null>()

  const filteredData: NetworkToken[] = getNetworksList()
  const syncWithSavedNetworks = (filteredList: NetworkToken[]) => {
    if (isAccountCreatedByPrivateKey || currentAccount?.isAccountImported) {
      filteredList = filteredData.filter((token) => token.networkName === currentAccount?.networkName)
    }
    const filtered: NetworkToken[] = filteredList.map((network: NetworkToken) => {
      if (currentAccount && walletsList[currentAccount.address]) {
        const accountWallet = walletsList[currentAccount.address][network.shortName]
        if (accountWallet) {
          return {
            ...network,
            address: accountWallet.address,
          }
        }
      }
      return network
    }) as NetworkToken[]
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
  const selectedIconClass = classnames('absolute left-10 bottom-4 z-20')

  const handleSelectNetwork = () => {
    setSelectedNetwork(Array.from(selectedNetworks)[0])
    navigate('/home')
  }

  const handlePasswordPromptSuccess = async (password: string) => {
    try {
      setLoading(true)
      if (checkCreateNetworkWallet && currentAccount) {
        const accountWallet = walletsList[currentAccount.address][currentAccount.networkName]
        const currentWallet = await ethers.Wallet.fromEncryptedJson(
          accountWallet.encryptedWallet as string,
          password as string
        )
        if (currentWallet) {
          const { wallet, encryptedPrivateKey, deriveIndex } = await NetworkFactory.checkAndCreateNextDeriveWallet(
            currentWallet.mnemonic.phrase as string,
            checkCreateNetworkWallet.networkName
          )

          await storeWallet(
            { wallet, encryptedPrivateKey, deriveIndex },
            '',
            password,
            checkCreateNetworkWallet.networkName,
            currentAccount.address
          )
        }
        setResponseData({ status: true, data: {} })
        setOpenPasswordModal(false)
      }
    } catch (error) {
      setResponseData({ status: false, data: error })
      setLoading(false)
    }
  }
  const handlePasswordPromptFail = (error: never) => {
    setOpenPasswordModal(false)
    return error
  }

  const createNetworkWallet = (network: NetworkToken) => {
    setCheckCreateNetworkWallet(network)
    setOpenPasswordModal(true)
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
          placeholder={t('Network.networkName')}
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
            {filteredNetworks.length} Result
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
                  selectedIcon={
                    selectedNetworks &&
                    selectedNetworks.has(data.id) && (
                      <CheckPrimaryIcon className="mr-2 border-3 w-4 h-4 border-solid border-surface-dark-alt rounded-full" />
                    )
                  }
                  startContent={
                    <>
                      <div className="flex items-center">
                        {typeof data.image === 'string' ? (
                          <Avatar
                            alt="Networks"
                            className="flex-shrink-0 rounded-full justify-center w-8 h-8"
                            size="sm"
                            src={data.image}
                          />
                        ) : (
                          data.image && <Icon icon={data.image} size="large" />
                        )}
                        {!data.image && (
                          <div className="w-8 h-8 uppercase rounded-full bg-gradient-bg text-custom-white flex items-center justify-center">
                            {data.networkName.slice(0, 1)}
                          </div>
                        )}
                      </div>
                      {/* {activeNetwork && selectedNetworks.has(data.id) && (
                      <div className="absolute left-8 bottom-3 z-10 border-3 border-solid border-surface-dark-alt rounded-full">
                        <CheckPrimaryIcon />
                      </div>
                    )} */}
                    </>
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
            <CustomTypography type="secondary" className="text-center pt-6" variant="subtitle">
              No Network Found
            </CustomTypography>
          )}
        </div>
        <div className={`mt-3 flex items-start ${filteredNetworks.length > 0 ? 'gap-2' : ''}`}>
          {filteredNetworks.length > 0 && (
            <Button variant="bordered" data-aid="setCancel" color="outlined" onClick={() => setSelectedNetworks([''])}>
              {t('Actions.clear')}
            </Button>
          )}
          <Button
            fullWidth
            radius="md"
            data-aid="addNetwork"
            // isDisabled={selectedNetworks.size === 0}
            // className={`${selectedNetworks.size > 0 ? 'bg-gradient-button font-extrabold' : ''}`}
            className={'bg-gradient-button font-extrabold h-11'}
            // onClick={() => navigate(`/token/${coin.network}/${assetId}`)}
            onClick={handleSelectNetwork}
          >
            {t('Actions.apply')}
          </Button>
        </div>
      </div>
      <PasswordPromptModal
        modalState={openPasswordModal}
        closePromptModal={() => setOpenPasswordModal(false)}
        onPromptPassword={handlePasswordPromptSuccess}
        onFail={handlePasswordPromptFail}
        responseData={responseData}
        isDismissable={false}
        buttonDisable={loading}
      />
    </>
  )
}

export default SearchNetwork
