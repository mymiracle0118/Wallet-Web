import { Button } from '@nextui-org/react'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { ISearchTabProps, NetworkToken } from '@portal/shared/utils/types'
import { CloseRoundedIcon, SearchIcon } from '@src/app/components/Icons'
import { CustomTypography, Input, TokenBalance } from 'app/components'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import NoTokenfound from '../../../../../assets/images/no-activity.png'

const SearchTab = ({ selectedTokens = [], setSelectedToken }: ISearchTabProps) => {
  const { t } = useTranslation()
  const { isAccountCreatedByPrivateKey, getNetworksTokenList } = useWallet()
  const [searchValue, setSearchValue] = useState<string>('')
  const { currentTokenArrayWithBalance } = useStore()
  const { currentAccount } = useSettings()

  const filteredDefaultAssets = Object.values(getNetworksTokenList()).filter((defaultAsset: NetworkToken) => {
    //Allow custom network token for imported account
    if (
      defaultAsset.isCustom &&
      currentAccount?.networkName === 'ETH' &&
      defaultAsset.isEVMNetwork &&
      !currentTokenArrayWithBalance[defaultAsset.shortName]
    ) {
      return true
    }
    if (currentAccount?.isAccountImported && defaultAsset.networkName != currentAccount.networkName) {
      return false
    }

    if (isAccountCreatedByPrivateKey && currentAccount?.networkName !== defaultAsset.networkName) {
      return false
    }

    const isTokenExist = currentTokenArrayWithBalance[defaultAsset.shortName]
    if (isTokenExist) {
      return false
    }
    const isNativeTokenExist = currentTokenArrayWithBalance[defaultAsset.networkName]
    if (isNativeTokenExist) {
      return true
    }

    return defaultAsset.tokenType === 'Native'
  })

  const filteredWithSearch = searchValue
    ? filteredDefaultAssets.filter(
        (token: NetworkToken) =>
          token.shortName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
          token.subTitle.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
      )
    : filteredDefaultAssets

  const handleSelectToken = (token: NetworkToken) => {
    setSelectedToken(token)
  }

  return (
    <div className="pt-1">
      <Input
        onChange={(e) => setSearchValue(e.target.value as string)}
        value={searchValue}
        fullWidth
        placeholder="Asset name or symbol"
        mainColor
        className="h-11"
        icon={
          searchValue ? (
            <Button variant="light" size="sm" isIconOnly onClick={() => setSearchValue('')}>
              <CloseRoundedIcon />
            </Button>
          ) : (
            <SearchIcon className="pr-1" />
          )
        }
      />

      {filteredWithSearch.length > 0 && searchValue && (
        <CustomTypography type="secondary" variant="subtitle" className="my-3">
          {filteredWithSearch.length} {filteredWithSearch.length > 1 ? 'Results' : 'Result'}
        </CustomTypography>
      )}

      <div
        className={`flex flex-col overflow-y-auto bg-surface-dark-alt rounded-lg py-2 ${
          filteredWithSearch.length && searchValue ? 'h-[19.25rem] max-h-[19.25rem]' : 'h-[21rem] max-h-[21rem] mt-4'
        }`}
      >
        <div className="space-y-1">
          {filteredWithSearch.length > 0 ? (
            filteredWithSearch.map((token: NetworkToken) => (
              <TokenBalance
                tokenFullName={token.subTitle}
                key={`${token.networkName}:${token.shortName}`}
                token={token.shortName}
                network={!token.isCustom ? token.networkName : ''}
                acronym={token.title}
                thumbnail={token.image}
                onClick={() => handleSelectToken(token)}
                active={selectedTokens.some((t) => t.shortName === token.shortName)}
                hideAmount
                className="!bg-transparent hover:!bg-custom-white10 p-4 rounded-none"
                checkboxClass="!border-0"
              />
            ))
          ) : (
            <div className="mx-auto flex flex-col items-center space-y-2 pt-4 w-52">
              <img src={NoTokenfound} alt="no token found" />
              <CustomTypography variant="subtitle" className="text-center mt-6 font-regular" type="secondary">
                {t('Token.NoResult')}
                <br />
                {t('Token.TryAddCusotmToken')}
              </CustomTypography>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchTab
