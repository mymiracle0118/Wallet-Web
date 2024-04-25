import { useNavigate } from 'lib/woozie'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useDebounce from '@portal/shared/hooks/useDebounce'
import { TokenDataProps } from '@portal/shared/services/coingecko'
import { Button } from 'app/components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import AddSuccessModal from 'pages/wallet/AddSuccessModal'

import { Tab, Tabs } from '@nextui-org/react'
import { default as networkTokenList } from '@portal/shared/data/networkTokens.json'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { IToBeAddedModalDataProps, NetworkToken } from '@portal/shared/utils/types'
import CustomTab from './CustomTab'
import SearchTab from './SearchTab'

const networkTokens = Object.values(networkTokenList).filter(
  (token) => token.tokenType === 'Native' && token.shortName !== 'SUPRA'
)

const AddToken = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [contractAddress, setContractAddress] = useState<string>('')
  const [modalData, setModalData] = useState<IToBeAddedModalDataProps>({})

  const [selectedTokens, setSelectedTokens] = useState<NetworkToken[]>([])
  const [filteredCustomTokenData, setFilteredCustomTokenData] = useState<TokenDataProps | null>()
  const [activeNetwork, setActiveNetwork] = useState<NetworkToken | null>(null)

  const searchValue = useDebounce(contractAddress, 700)
  const [isValid, setIsValid] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [symbolError, setSymbolError] = useState<string>('')

  const { storeWallet, getPhrase } = useWallet()
  const { currentAccount } = useSettings()
  const { walletsList, addTokenToList } = useStore()

  const filteredToken: NetworkToken[] = networkTokens
    .map((network: NetworkToken) => {
      if (currentAccount && walletsList[currentAccount.id] && walletsList[currentAccount.id][network.networkName]) {
        return { ...network, address: walletsList[currentAccount.id][network.networkName].address }
      }
      return network
    })
    .filter((network: NetworkToken) => network.address) as NetworkToken[]

  const handleChangeNetwork = (val: string) => {
    const selected = filteredToken.find((v) => v.networkName === val) as NetworkToken
    setActiveNetwork(selected)
    setContractAddress('')
    setErrorMsg('')
    setSymbolError('')
    setFilteredCustomTokenData(null)
  }
  useEffect(() => {
    setIsValid(contractAddress ? true : false)
    async function handleSearch() {
      try {
        setLoading(true)
        const networkFactory = NetworkFactory.selectByNetworkId(activeNetwork?.networkName as string)
        const tokenData = await networkFactory.getCustomToken(contractAddress, activeNetwork?.address)
        if (!tokenData.error) {
          setIsValid(true)
          setFilteredCustomTokenData({ ...tokenData, image: '', coingeckoTokenId: '' })
          setErrorMsg('')
        } else {
          setErrorMsg(tokenData.error)
          setIsValid(false)
          setFilteredCustomTokenData(null)
        }
      } catch (errmsg) {
        let message = 'Token not found'
        if (errmsg instanceof Error) message = errmsg.message
        setErrorMsg(message)
        setIsValid(false)
        setFilteredCustomTokenData(null)
      }
      setLoading(false)
    }
    if (searchValue !== '') {
      setLoading(true)
      handleSearch()
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        .catch(() => {
          setFilteredCustomTokenData(null)
          setLoading(false)
          throw new Error(t('Error.tokenNotFound') as string)
        })
    } else {
      setFilteredCustomTokenData(null)
    }
  }, [searchValue]) // eslint-disable-line

  const showSuccessModel = () => {
    let modalDataToBeAdded = null
    if (selectedTokens.length) {
      const isMultipleToken = selectedTokens.length > 1
      if (isMultipleToken) {
        const names = Object.values(selectedTokens)
          .map((v) => v.title)
          .join(', ')

        modalDataToBeAdded = {
          name: names,
        }
      } else {
        modalDataToBeAdded = {
          name: Object.values(selectedTokens)[0].title,
          image: Object.values(selectedTokens)[0].image,
        }
      }
    }
    modalDataToBeAdded && setModalData(modalDataToBeAdded)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  const createNetworkWallet = async (needToCreateWallet: string[]) => {
    if (needToCreateWallet && currentAccount) {
      try {
        setLoading(true)
        const mnemonic = getPhrase()
        if (mnemonic) {
          for (const networkName of needToCreateWallet) {
            const { wallet, derivationPathIndex } = await NetworkFactory.checkAndCreateNextDeriveWallet(
              mnemonic,
              networkName
            )
            await storeWallet({ address: wallet.address, derivationPathIndex }, '', '', networkName, currentAccount.id)
          }
          showSuccessModel()
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
  }

  const handleAddToken = async () => {
    try {
      setLoading(true)

      const tokensToBeAdded = selectedTokens

      if (currentAccount) {
        const needToAdd: string[] = []
        tokensToBeAdded.forEach((token) => {
          const walletNetworkName = token.isEVMNetwork ? 'ETH' : token.networkName
          if (walletsList[currentAccount.id] && walletsList[currentAccount.id][walletNetworkName]) {
            addTokenToList(currentAccount.id, token.shortName)
          } else {
            needToAdd.push(token.networkName)
          }
        })
        if (needToAdd.length > 0) {
          await createNetworkWallet([...needToAdd])
        } else {
          showSuccessModel()
        }
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleSelectToken = (asset: NetworkToken) => {
    let updatedSelectedTokens = [...selectedTokens]
    if (updatedSelectedTokens.some((a) => a.networkName === asset.networkName && a.shortName === asset.shortName)) {
      updatedSelectedTokens = updatedSelectedTokens.filter(
        (item) => !(item.shortName === asset.shortName && item.networkName === asset.networkName)
      )
    } else {
      updatedSelectedTokens.push(asset)
    }
    setIsValid(updatedSelectedTokens.length ? true : false)
    setSelectedTokens(updatedSelectedTokens)
  }
  return (
    <SinglePageTitleLayout title="Add token" paddingClass={false}>
      <div className="px-4 pt-4">
        <Tabs
          aria-label="Add Token"
          size="sm"
          radius="lg"
          color="default"
          className="w-[98%] ml-1"
          classNames={{
            tabList: 'gap-2 relative bg-custom-white10 w-full',
            cursor: 'w-full',
            tab: 'px-4 h-6 selected-tabs',
            tabContent: 'group-data-[selected=true]:text-[#363A5B] text-custom-white font-extrabold text-[0.875rem]',
          }}
        >
          <Tab key="Search" title="Search" data-test-id="search-add-token-tab">
            <SearchTab selectedTokens={selectedTokens} setSelectedToken={handleSelectToken} />
            <div className="flex pt-3 gap-2">
              <Button color="outlined" variant="bordered" onClick={() => navigate('/home')}>
                {t('Actions.cancel')}
              </Button>

              <Button
                data-test-id="add-token-btn"
                color={`${!isValid ? 'disabled' : 'primary'}`}
                isDisabled={!isValid}
                onClick={handleAddToken}
              >
                {t('Actions.add')}
              </Button>
            </div>
          </Tab>
          <Tab key="custom-Token" title="Custom Token" data-test-id="custom-add-token-tab" className="h-full">
            <CustomTab
              loading={loading}
              filteredData={filteredCustomTokenData}
              contractAddress={contractAddress}
              setContractAddress={setContractAddress}
              errorMsg={errorMsg}
              setErrorMsg={setErrorMsg}
              handleChangeNetwork={handleChangeNetwork}
              activeNetwork={activeNetwork as any}
              networkTokens={filteredToken}
              symbolError={symbolError}
              setSymbolError={setSymbolError}
            />
          </Tab>
        </Tabs>
      </div>

      <AddSuccessModal
        openModal={Object.keys(modalData || {}).length !== 0}
        closeModal={() => navigate('/home')}
        name={modalData?.name}
        tokenImage={modalData?.image}
        hasMultipleTokens={selectedTokens.length > 1}
      />
    </SinglePageTitleLayout>
  )
}

export default AddToken
