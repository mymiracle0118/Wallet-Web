import { useSettings } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { NetworkToken } from '@portal/shared/utils/types'
import { SearchIcon } from '@src/app/components/Icons'
import { CustomTypography, Input, TokenBalance } from 'app/components'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import NoTokenfound from '../../../../../assets/images/no-activity.png'

type SearchTabProps = {
  selectedTokens?: Array<NetworkToken>
  setSelectedToken: (token: NetworkToken) => void
}

const SearchTab = ({ selectedTokens = [], setSelectedToken }: SearchTabProps) => {
  const { t } = useTranslation()
  const { isAccountCreatedByPrivateKey, getNetworksTokenList } = useWallet()
  const [searchValue, setSearchValue] = useState<string>('')
  const { currentTokenArrayWithBalance } = useStore()
  const { currentAccount } = useSettings()

  const filteredDefaultAssets = Object.values(getNetworksTokenList()).filter((defaultAsset: NetworkToken) => {
    if (isAccountCreatedByPrivateKey && currentAccount?.networkName !== defaultAsset.networkName) {
      return false
    }
    // if (defaultAsset.tokenType === 'Native' && defaultAsset.isCustom) {
    //   return false
    // }
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
        icon={<SearchIcon />}
        mainColor
        className="h-11"
      />

      <div className="h-[22.3rem] max-h-[22.3rem] flex flex-col overflow-y-auto">
        <div className="mt-4 space-y-1">
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
