import { useNavigate } from 'lib/woozie'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useDebounce from '@portal/shared/hooks/useDebounce'
import { getTokenData, TokenDataProps } from '@portal/shared/services/coingecko'
import { Button } from 'app/components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import AddSuccessModal from 'pages/wallet/AddSuccessModal'

import { Tab, Tabs } from '@nextui-org/react'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { IToBeAddedModalDataProps, NetworkToken } from '@portal/shared/utils/types'
import { ethers } from 'ethers'
import PasswordPromptModal from 'pages/wallet/PasswordPromptModal'
import CustomTab from './CustomTab'
import SearchTab from './SearchTab'

const AddToken = () => {
  // const { addCustomToken } = useWallet()
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const [responseData, setResponseData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [isModalLoading, setModalLoading] = useState<boolean>(false)
  const [contractAddress, setContractAddress] = useState<string>('')
  const [modalData, setModalData] = useState<IToBeAddedModalDataProps>({})

  const [selectedTokens, setSelectedTokens] = useState<NetworkToken[]>([])
  const [filteredCustomTokenData, setFilteredCustomTokenData] = useState<TokenDataProps | null>()

  const searchValue = useDebounce(contractAddress, 700)
  const [isValid, setIsValid] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const { storeWallet } = useWallet()
  const { currentAccount } = useSettings()
  const { walletsList, addTokenToList } = useStore()

  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false)
  const [needToCreateWallet, setNeedToCreateWallet] = useState<string[]>([])

  useEffect(() => {
    setIsValid(contractAddress ? true : false)
    async function handleSearch() {
      try {
        setLoading(true)
        const result = await getTokenData(contractAddress)
        setIsValid(true)
        setFilteredCustomTokenData(result)
        setErrorMsg('')
      } catch (errmsg) {
        setErrorMsg((errmsg ? errmsg.toString().split('. ')[0] : 'Token not found') as string)
        setIsValid(false)
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
          throw new Error(t('Error.tokenNotFound'))
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
  const handlePasswordPromptSuccess = async (password: string) => {
    if (needToCreateWallet && currentAccount) {
      setModalLoading(true)
      try {
        const accountWallet = walletsList[currentAccount.address][currentAccount.networkName]
        const currentWallet = await ethers.Wallet.fromEncryptedJson(
          accountWallet.encryptedWallet as string,
          password as string
        )
        if (currentWallet) {
          for (const networkName of needToCreateWallet) {
            const { wallet, encryptedPrivateKey, deriveIndex } = await NetworkFactory.checkAndCreateNextDeriveWallet(
              currentWallet.mnemonic.phrase as string,
              networkName
            )
            await storeWallet(
              { wallet, encryptedPrivateKey, deriveIndex },
              '',
              password,
              networkName,
              currentAccount.address
            )
          }
        }
        showSuccessModel()
        setOpenPasswordModal(false)
        setModalLoading(false)
        setResponseData({ status: true, data: {} })
      } catch (error) {
        setResponseData({ status: false, data: error })
        setLoading(false)
        setModalLoading(false)
      }
    }
  }
  const handlePasswordPromptFail = () => {
    setOpenPasswordModal(false)
  }

  const handleAddToken = () => {
    try {
      setLoading(true)

      const tokensToBeAdded = selectedTokens

      if (filteredCustomTokenData) {
        // TODO: check later for custom token
        // tokensToBeAdded = [{ ...filteredCustomTokenData, network: 'mainnet', type: 'erc20' }]
        // modalDataToBeAdded = {
        //   name: filteredCustomTokenData?.name,
        //   image: filteredCustomTokenData?.image,
        // }
      }

      if (currentAccount) {
        const needToAdd: string[] = []
        tokensToBeAdded.forEach((token) => {
          if (walletsList[currentAccount.address] && walletsList[currentAccount.address][token.networkName]) {
            addTokenToList(currentAccount.address, token.shortName)
          } else {
            needToAdd.push(token.networkName)
            // setNeedToCreateWallet((prev) => {
            //   console.log({ prev })
            //   return [...prev, token.networkName]
            // })
          }
        })
        if (needToAdd.length > 0) {
          setNeedToCreateWallet([...needToAdd])
          setOpenPasswordModal(true)
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
    <>
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
              />
            </Tab>
          </Tabs>
        </div>

        <AddSuccessModal
          openModal={Object.keys(modalData || {}).length !== 0}
          closeModal={() => navigate('/home')}
          name={modalData?.name}
          tokenImage={modalData?.image}
        />
      </SinglePageTitleLayout>
      <PasswordPromptModal
        modalState={openPasswordModal}
        closePromptModal={() => setOpenPasswordModal(false)}
        onPromptPassword={handlePasswordPromptSuccess}
        onFail={handlePasswordPromptFail}
        isDismissable={false}
        buttonDisable={isModalLoading}
        responseData={responseData}
      />
    </>
  )
}

export default AddToken
