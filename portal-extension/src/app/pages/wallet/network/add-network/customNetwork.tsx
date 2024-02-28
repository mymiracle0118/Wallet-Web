import React, { useCallback, useState } from 'react'

import { CustomTypography, Input, TokenBalance } from 'components'
import { useNavigate, goBack } from 'lib/woozie'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@portal/shared/hooks/useWallet'

import * as yup from 'yup'
import { Form } from 'components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Button, Tooltip } from '@nextui-org/react'
import { QuestionMarkIcon } from '@src/app/components/Icons'
import { ethers } from 'ethers'
import { getTokenInfoBySymbol } from '@portal/shared/services/coingecko'
import { NetworkToken } from '@portal/shared/utils/types'
import { useSettings } from '@portal/shared/hooks/useSettings'

const AddCustomNetwork = () => {
  const { t } = useTranslation()
  const schema = yup.object().shape({
    name: yup.string().min(3).required(t('Error.fieldRequired')),
    networkURL: yup.string().url().required(t('Error.fieldRequired')),
    chainId: yup.number().required(t('Error.fieldRequired')),
  })
  const { addNetworkAsset } = useWallet()
  const { addCustomToken, networkEnvironment, currentAccount, accounts } = useSettings()

  const { navigate } = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [token, setToken] = useState<NetworkToken | null>()

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = methods
  const handleChangeNetworkName = (networkName: string) => {
    if (token) {
      setToken({ ...token, subTitle: networkName })
    }
  }
  const handleFetchNetworkInfo = async (networkURL: string) => {
    setToken(null)
    methods.setValue('chainId', '')
    methods.setValue('name', '')

    if (!errors.networkURL) {
      setLoading(true)
      try {
        const provider = new ethers.providers.JsonRpcProvider(networkURL)
        if (provider && currentAccount) {
          const network = await provider.getNetwork()
          const existingTokensList = accounts[currentAccount.address].customTokens[networkEnvironment] || {}
          const isAlreadyAdded = Object.values(existingTokensList).find((t) => t.id == network.chainId.toString())
          if (isAlreadyAdded) {
            setErrorMessage('Network already added.')
          } else {
            methods.setValue('chainId', network.chainId)
            const hostname = new URL(networkURL).hostname
            const name = hostname.split('.')?.shift()?.toString() || ''
            methods.setValue('name', name.toUpperCase())
            const { getNetworkTokenWithCurrentEnv } = useWallet.getState()
            const defaultToken = getNetworkTokenWithCurrentEnv('ETH')

            let newToken: NetworkToken = {
              ...defaultToken,
              id: network.chainId.toString(),
              tokenType: 'Native',
              isEVMNetwork: true,
              providerNetworkRPC_URL: networkURL,
              isCustom: true,
              // image: tokenInfo.image,
              // shortName: tokenInfo.symbol.toUpperCase(),
              title: name.toUpperCase(),
              subTitle: name.toUpperCase(),
              coingeckoTokenId: '',
              // networkName: tokenInfo.symbol.toUpperCase(),
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
                  networkName: tokenInfo.symbol.toUpperCase(),
                }
              }
            }
            setToken(newToken)
            setErrorMessage('')
          }
        } else {
          setErrorMessage('Invalid RPC URL')
        }
        setLoading(false)
      } catch (error) {
        setErrorMessage('Invalid RPC URL.')
        setLoading(false)
      }
    }
  }

  const handleAddCustomNetwork = useCallback(
    (data: { name: string; networkURL: string; chainId: number }) => {
      setLoading(true)
      try {
        if (token) {
          const shortName = `${(token.title || data.name).replace(/[^a-zA-Z]/g, '')}_${Date.now()}`
          const tokenWithUniqueName: NetworkToken = {
            ...token,
            shortName: shortName,
            networkName: shortName,
          }
          addCustomToken(tokenWithUniqueName)
        }

        // addNetworkAsset(asset)
        setLoading(false)
        goBack()
      } catch (error) {
        console.log(error)
        setLoading(false)
        throw new Error('Something is wrong!')
      }
    },
    [addNetworkAsset, token]
  )

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
          <div>
            <Input
              dataAid="networkURL"
              id="networkURL"
              fullWidth
              mainColor
              placeholder={t('Network.networkUrl')}
              dataTestId="network-url"
              {...register('networkURL')}
              error={errors.networkURL?.message || errorMessage}
              // onChange={(e) => handleFetchNetworkInfo(e.target.value)}
              // onPaste={(e) => handleFetchNetworkInfo(e.target.value)}
              onBlur={(e) => handleFetchNetworkInfo(e.target?.value)}
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
              placeholder={t('Actions.name')}
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
              placeholder={t('Network.chainId')}
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
          <TokenBalance
            id={token.shortName}
            network={token.networkName}
            isFavorite={token.isFavorite}
            isFavIcon={true}
            token={token.shortName}
            isTestnet={false}
            acronym={token.title}
            // balance={`$${ethers.utils.commify(assetValue)}`}
            tokenFullName={token.subTitle}
            thumbnail={token.image}
            // onClick={() => navigate(`/token/${token.networkName}/${assetId}`)}
          />
        )}
        {/* <NetworkItem image={<SupraIcon />} coin="Supra" link onClick={handleChangeNetwork} /> */}
      </div>
      <div className="flex px-1 gap-2 mt-3">
        <Button data-aid="cancelButton" variant="bordered" onClick={() => navigate('/network')} fullWidth radius="sm">
          {t('Actions.cancel')}
        </Button>
        <Button
          fullWidth
          radius="sm"
          type="submit"
          data-aid="addNetwork"
          className="gradient-button"
          data-test-id="add-custom-network"
          color={!isValid || !isDirty || loading ? 'default' : 'primary'}
          disabled={!isValid || !isDirty || loading}
        >
          {t('Actions.add')}
        </Button>
      </div>
    </Form>
  )
}

export default AddCustomNetwork
