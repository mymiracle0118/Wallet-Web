import { useWallet } from '@portal/shared/hooks/useWallet'
import { Button, CustomTypography, Input, TokenBalance } from 'components'
import { goBack, useNavigate } from 'lib/woozie'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { yupResolver } from '@hookform/resolvers/yup'
import { Tooltip } from '@nextui-org/react'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import { getTokenInfoBySymbol } from '@portal/shared/services/coingecko'
import { NetworkToken } from '@portal/shared/utils/types'
import { QuestionMarkIcon, SpinnerIcon } from '@src/app/components/Icons'
import { generateRandomString } from '@src/utils/generateRandomString'
import { Form } from 'components'
import { ethers } from 'ethers'
import { useForm } from 'react-hook-form'
import * as supraSDK from 'supra-l1-devnet-sdk'
import * as yup from 'yup'

const AddCustomNetwork = () => {
  const { t } = useTranslation()
  const schema = yup.object().shape({
    name: yup
      .string()
      .max(24, t('Wallet.networkNameMaximum') as string)
      .required(t('Error.fieldRequired') as string),
    networkURL: yup
      .string()
      .url(t('Error.invalidUrl') as string)
      .required(t('Error.fieldRequired') as string),
    chainId: yup.number(t('Token.enterNumericValue') as number).required(t('Error.fieldRequired') as string),
  })

  const { currentAccount } = useSettings()
  const { customNetworks, addCustomNetwork } = useStore()
  const { getNetworksTokenList, getNetworkTokenWithCurrentEnv } = useWallet()

  const { navigate } = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [token, setToken] = useState<NetworkToken | null>()
  const networksToken: NetworkToken[] = getNetworksTokenList(true)

  const filteredToken = Object.values(networksToken).filter(
    (network: NetworkToken) => network.tokenType === 'Native' && network.networkName === 'ETH'
    // network.tokenType === 'Native' && (network.networkName === 'ETH' || network.networkName === 'SUPRA')
  ) as NetworkToken[]

  const [activeNetwork] = useState<NetworkToken>(filteredToken[0])

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isValid, isDirty },
  } = methods

  const handleChangeNetworkName = (networkName: string) => {
    setValue('name', networkName, { shouldDirty: true, shouldTouch: true })
    if (networkName.length > 24) {
      return setError('name', { type: 'custom', message: t('Wallet.networkNameMaximum') as string })
    } else {
      setError('name', { type: 'custom' })
    }

    if (token) {
      setToken({ ...token, subTitle: networkName, title: networkName })
    }
  }
  const handleFetchNetworkInfo = async (networkURL: string) => {
    setToken(null)
    methods.setValue('chainId', '')
    methods.setValue('name', '')
    if (networkURL.includes(' ')) {
      setErrorMessage(t('Error.invalidUrl') as string)
      setLoading(false)
      return // Exit the function if space is found
    }
    setValue('networkURL', networkURL, { shouldDirty: true, shouldTouch: true })

    if (!errors.networkURL) {
      setLoading(true)
      try {
        let provider = null
        let network = null
        let defaultToken = null

        if (activeNetwork?.isSupraNetwork) {
          provider = await supraSDK.SupraClient.init(networkURL)
          if (provider) {
            const chainId = await provider.getChainId()
            if (chainId && chainId.value >= 0) {
              network = {
                name: '$SUPRA',
                chainId: chainId.value,
              }
            }
          }

          defaultToken = getNetworkTokenWithCurrentEnv('SUPRA')
        } else {
          provider = new ethers.JsonRpcProvider(networkURL)
          network = await provider.getNetwork()
          defaultToken = getNetworkTokenWithCurrentEnv('ETH')
        }
        if (provider && network && currentAccount) {
          const existingTokensList = { ...customNetworks['testNet'], ...customNetworks['mainNet'] } || {}
          const isAlreadyAdded = Object.values(existingTokensList).some(
            (t) =>
              t.providerNetworkRPC_URL.toLocaleLowerCase().replace(/\/$/, '') ===
              networkURL.toLocaleLowerCase().replace(/\/$/, '')
          )
          if (isAlreadyAdded) {
            setErrorMessage('Network is already added')
          } else {
            methods.setValue('chainId', network.chainId)
            const hostname = new URL(networkURL).hostname
            const name =
              network.name && network.name !== 'unknown' ? network.name : hostname.split('.')?.shift()?.toString() || ''
            methods.setValue('name', name.toUpperCase())

            let newToken: NetworkToken = {
              ...defaultToken,
              id: generateRandomString(5),
              tokenType: 'Native',
              isEVMNetwork: activeNetwork.isEVMNetwork === true,
              isSupraNetwork: activeNetwork?.isSupraNetwork === true,
              providerNetworkRPC_URL: networkURL,
              isCustom: true,
              title: name.toUpperCase(),
              subTitle: name.toUpperCase(),
              networkName: name.toUpperCase(),
              providerNetworkRPC_Network_Name: network.chainId.toString(),
              coingeckoTokenId: activeNetwork?.isSupraNetwork === true ? 'SUPRA' : '',
              indexerClient: '',
              explorerURL: '',
              explorerAccountURL: '',
              image: '',
            }
            if (network.name !== 'unknown') {
              methods.setValue('name', network.name)

              const tokenInfo = await getTokenInfoBySymbol(network.name)
              if (tokenInfo) {
                newToken = {
                  ...newToken,
                  image: tokenInfo.image,
                  shortName: tokenInfo.symbol.toUpperCase(),
                  title: tokenInfo.symbol.toUpperCase(),
                  subTitle: tokenInfo.name,
                  coingeckoTokenId: tokenInfo.id,
                }
              }
            }
            setToken(newToken)
            setErrorMessage('')
          }
        } else {
          setErrorMessage(t('Error.invalidUrl') as string)
        }
        setLoading(false)
      } catch (error) {
        setErrorMessage(t('Error.invalidUrl') as string)
        setLoading(false)
      }
    }
  }

  const handleAddCustomNetwork = useCallback(
    (data: { name: string; networkURL: string; chainId: number }) => {
      setLoading(true)
      try {
        if (token) {
          const shortName = `${(token.title || data.name).replace(/[^a-zA-Z]/g, '')}_${
            generateRandomString(5) as string
          }`
          const tokenWithUniqueName: NetworkToken = {
            ...token,
            shortName: shortName,
          }
          addCustomNetwork(tokenWithUniqueName)
        }
        setLoading(false)
        goBack()
      } catch (error) {
        console.log(error)
        setLoading(false)
        throw new Error(t('Actions.somethingWrong') as string)
      }
    },
    [token]
  )

  /* const handleChangeNetwork = (val: string) => {
    const selected = filteredToken.find((v) => v.networkName === val) as NetworkToken
    setActiveNetwork(selected)
    methods.setValue('networkURL', '')
    methods.setValue('name', '')
    methods.setValue('chainId', '')
  }*/

  return (
    <Form methods={methods} onSubmit={handleSubmit(handleAddCustomNetwork)}>
      <div className="h-[396px]">
        <div className="space-y-4">
          <CustomTypography variant="body" className="dark:text-custom-white">
            {t('Network.customNetworkWarning')}
          </CustomTypography>
          <CustomTypography variant="subtitle" color="dark:text-secondary" className="underline underline-offset-2">
            {t('Network.customNetworkInstructionTitle')}
          </CustomTypography>
        </div>
        <div className="space-y-4 mt-4">
          {/*  <div>
            <Dropdown
              classDynamicChild="h-[16.25rem] overflow-x-hidden overflow-y-scroll w-full border border-solid border-[#424250]"
              classDynamicMenu="w-full bg-custom-white10 mb-4 mt-6 rounded-md p-1 !table "
              anchor={
                <Menu.Button data-aid="currencyDropdown" className="p-2 rounded-xl flex items-center gap-3">
                  <img alt="icon" src={activeNetwork?.image} className="h-6 rounded-full" />

                  <CustomTypography className="w-60 text-left mr-4" variant="subtitle">
                    {activeNetwork?.networkName}
                  </CustomTypography>
                  <Icon size="small" icon={<DropDownIcon />} />
                </Menu.Button>
              }
            >
              {filteredToken?.map((network) => (
                <DropdownItem
                  key={network.networkName}
                  active={network.networkName === activeNetwork?.networkName}
                  text={network.networkName}
                  icon={network.image}
                  isImg={true}
                  onSelect={handleChangeNetwork}
                />
              ))}
            </Dropdown>
          </div>*/}
          <div>
            <Input
              dataAid="networkURL"
              id="networkURL"
              fullWidth
              mainColor
              placeholder={t('Network.networkUrl') as string}
              dataTestId="network-url"
              {...register('networkURL')}
              error={errors.networkURL?.message || errorMessage}
              onChange={(e) => handleFetchNetworkInfo(e.target?.value?.trim())}
              icon={
                <Tooltip
                  content={t('Network.networkUrlTooltip')}
                  placement="top"
                  {...register('chainId')}
                  offset={-3}
                  className="max-w-60"
                  color="foreground"
                >
                  <Button isIconOnly size="sm" variant="light">
                    <QuestionMarkIcon />
                  </Button>
                </Tooltip>
              }
            />
          </div>

          <div>
            <Input
              dataAid="networkName"
              id="name"
              fullWidth
              mainColor
              placeholder={t('Actions.name') as string}
              dataTestId="network-name"
              {...register('name')}
              error={errors.name?.message}
              onChange={(e) => handleChangeNetworkName(e.target.value)}
            />
          </div>

          <div>
            <Input
              dataAid="networkName"
              id="name"
              fullWidth
              mainColor
              disabled
              placeholder={t('Network.chainId') as string}
              dataTestId="network-chainId"
              {...register('chainId')}
              error={errors.chainId?.message}
              icon={
                <Tooltip
                  content={t('Network.chainIdTooltip')}
                  placement="top"
                  offset={-3}
                  className="max-w-60"
                  color="foreground"
                >
                  <Button isIconOnly size="sm" variant="light">
                    <QuestionMarkIcon />
                  </Button>
                </Tooltip>
              }
            />
          </div>
        </div>
        {token && (
          <div className="flex px-1 gap-2 mt-4 mb-4">
            <TokenBalance
              id={token.shortName}
              network={token.networkName}
              token={token.shortName}
              isTestnet={false}
              acronym={token.title}
              tokenFullName={token.subTitle}
              thumbnail={token.image}
            />
          </div>
        )}
      </div>
      <div className="flex px-1 gap-2 mt-3">
        <Button data-aid="cancelButton" color="outlined" variant="bordered" onClick={() => navigate('/network')}>
          {t('Actions.cancel')}
        </Button>
        <Button
          type="submit"
          data-aid="addNetwork"
          data-test-id="add-custom-network"
          className="h-11"
          color={!isValid || !isDirty || loading ? 'default' : 'primary'}
          disabled={!isValid || !isDirty || loading}
          isLoading={loading}
          spinner={<SpinnerIcon />}
        >
          {!loading && t('Actions.add')}
        </Button>
      </div>
    </Form>
  )
}

export default AddCustomNetwork
