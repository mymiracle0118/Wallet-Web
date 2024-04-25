/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Menu } from '@headlessui/react'
import { Avatar } from '@nextui-org/react'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { ICustomTabProps } from '@portal/shared/utils/types'
import { CaretDownIcon, CloseRoundedIcon, SpinnerIcon } from '@src/app/components/Icons'
import { useAppEnv } from '@src/env'
import { Button, CustomTypography, Dropdown, DropdownItem, Input, TokenBalance } from 'app/components'
import { useNavigate } from 'lib/woozie'
import AddSuccessModal from 'pages/wallet/AddSuccessModal'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const CustomTab = ({
  filteredData,
  contractAddress,
  loading,
  errorMsg,
  setErrorMsg,
  symbolError,
  setSymbolError,
  setContractAddress,
  handleChangeNetwork,
  activeNetwork,
  networkTokens,
}: ICustomTabProps) => {
  const appEnv = useAppEnv()
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const showFilteredData = Object.keys(filteredData || {}).length !== 0
  const [isShowModal, setShowModal] = useState<boolean>(false)
  const { addCustomToken, accounts, currentAccount, networkEnvironment } = useSettings()
  const [alreadyAdded, setAlreadyAdded] = useState<boolean>(false)
  const [filteredDecimal, setFilteredDecimal] = useState<string>('')
  const [symbolName, setSymbolName] = useState<string>('')

  useEffect(() => {
    if (filteredData) {
      setSymbolName(filteredData.title)
      setFilteredDecimal(filteredData.decimal)
      setSymbolError('')
    } else {
      setSymbolName('')
      setFilteredDecimal('')
    }
  }, [filteredData])

  const handleAddCustomToken = () => {
    setShowModal(true)
    if (currentAccount) {
      const existingTokensList = accounts[currentAccount.id].customTokens[networkEnvironment] || {}

      const isAlreadyAdded = Object.values(existingTokensList).find(
        (t) => t.tokenContractAddress == filteredData.tokenContractAddress
      )

      if (isAlreadyAdded) {
        setAlreadyAdded(true)
      } else {
        filteredData = { ...filteredData, title: symbolName }
        addCustomToken(filteredData)
      }
    }
  }

  const handleChangeTokenName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setSymbolName(value)
    if (value.length > 10) {
      setSymbolError(t('Wallet.symbolNameMaximum') as string)
    } else if (value.length == 0) {
      setSymbolError(t('Wallet.symbolNameRequired') as string)
    } else {
      setSymbolError('')
    }
    if (symbolError && value.length === 0) {
      setErrorMsg('')
    }
  }

  const handlChangeContractAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setContractAddress(value)
    if (errorMsg && value.length === 0) {
      setErrorMsg('')
    }
  }

  const handleClearInput = () => {
    setErrorMsg('')
    setContractAddress('')
    setSymbolName('')
    setFilteredDecimal('')
    setSymbolError('')
  }

  return (
    <div className="text-custom-white flex flex-col justify-between h-full">
      <div>
        <CustomTypography variant="body">{t('Token.addCustomToken')}</CustomTypography>
        <CustomTypography className="py-3 underline underline-offset-2 dark:text-secondary" variant="subtitle">
          {t('Token.customTokenInformation')}
        </CustomTypography>
        <div className="space-y-4">
          <Dropdown
            classDynamicChild="max-h-[16.25rem] overflow-x-hidden overflow-y-scroll w-full border border-solid border-[#424250] shadow-medium"
            classDynamicMenu="bg-custom-white10 mt-6 rounded-md p-1 h-11 w-full"
            anchor={
              <Menu.Button
                data-aid="currencyDropdown"
                className={`rounded-xl flex items-center gap-3 justify-between w-full ${
                  activeNetwork?.networkName ? 'px-2 py-1' : 'p-2'
                }`}
              >
                {activeNetwork?.networkName && (
                  <Avatar
                    src={activeNetwork?.image}
                    alt={activeNetwork?.title}
                    className={`h-7 overflow-hidden rounded-full bg-custom-white ${appEnv.fullPage ? 'w-7' : 'w-8'}`}
                  />
                )}

                <CustomTypography className="w-60 text-left mr-4" variant="subtitle">
                  {activeNetwork?.networkName || 'Choose Network'}
                </CustomTypography>
                <CaretDownIcon className="w-6 h-6" />
              </Menu.Button>
            }
          >
            {networkTokens?.map((network) => (
              <DropdownItem
                key={network.networkName}
                active={network.networkName === activeNetwork?.networkName}
                text={network.networkName}
                icon={network.image}
                isImg={true}
                onSelect={() => {
                  handleClearInput()
                  if (handleChangeNetwork) {
                    handleChangeNetwork(network.networkName)
                  }
                }}
              />
            ))}
          </Dropdown>

          <div>
            <Input
              fullWidth
              mainColor
              dataTestId="contract-address-input"
              placeholder="Contract Address"
              error={errorMsg}
              value={contractAddress}
              onChange={handlChangeContractAddress}
              icon={
                contractAddress.length ? (
                  <button onClick={handleClearInput} className="cursor-pointer border-0 bg-transparent">
                    <CloseRoundedIcon />
                  </button>
                ) : null
              }
              disabled={!activeNetwork}
            />
          </div>
          <div>
            <Input
              id="name"
              value={symbolName ?? ''}
              fullWidth
              dataTestId="symbol-input"
              mainColor
              placeholder="Symbol"
              error={symbolError}
              disabled={!activeNetwork}
              onChange={handleChangeTokenName}
            />
          </div>
          <Input
            value={filteredDecimal ?? ''}
            fullWidth
            dataTestId="Decimal-input"
            mainColor
            placeholder="Decimal"
            disabled
          />

          {!errorMsg && showFilteredData && filteredData && (
            <div className="p-0">
              <TokenBalance
                network={filteredData?.networkName}
                token={symbolName ?? ''}
                acronym={symbolName ?? ''}
                percentage={filteredData?.percentage}
                thumbnail={filteredData?.image}
                tokenFullName={symbolName ?? ''}
                nativeBalance={filteredData?.formattedBalance}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex mt-4 gap-2">
        <Button color="outlined" variant="bordered" onClick={() => navigate('/home')}>
          {t('Actions.cancel')}
        </Button>

        <Button
          data-test-id="add-token-btn"
          color={`${errorMsg || !filteredData || symbolError ? 'disabled' : 'primary'}`}
          isDisabled={errorMsg || !filteredData || symbolError}
          onClick={handleAddCustomToken}
          isLoading={loading}
          spinner={<SpinnerIcon />}
        >
          {!loading && t('Actions.add')}
        </Button>
      </div>

      <AddSuccessModal
        openModal={isShowModal}
        closeModal={() => setShowModal(false)}
        name={symbolName ?? ''}
        tokenImage={filteredData?.image}
        alreadyAdded={alreadyAdded}
      />
    </div>
  )
}

export default CustomTab
