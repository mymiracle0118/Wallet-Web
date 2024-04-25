import { Menu } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Avatar } from '@nextui-org/react'
import { default as networkTokenList } from '@portal/shared/data/networkTokens.json'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { TAccount, useSettings } from '@portal/shared/hooks/useSettings'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { useNavigate } from 'lib/woozie'
import React, { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ImportUsernameProps, NetworkToken } from '@portal/shared/utils/types'
import ChangeProfileAvatar from '@src/app/components/ChangeProfileAvatar'
import { CaretDownIcon, SpinnerIcon } from '@src/app/components/Icons'

import { useSessionStore } from '@portal/shared/hooks/useSessionStore'
import { encryptData } from '@portal/shared/services/EncryptionService'
import { Button, CustomTypography, Dropdown, DropdownItem, Form, Input } from 'app/components'
import defaultAvatar from 'assets/images/Avatar.png'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const networkTokens = Object.values(networkTokenList).filter((token) => token.tokenType === 'Native')

const ImportByPrivateKeyComponents = ({ nextToFetchUsername }: ImportUsernameProps) => {
  const myArray = window.location.href.split('/')
  const fromPage = myArray[myArray.length - 2]

  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const [privateKey, setPrivateKey] = useState<string>('')
  const [errorText, setErrorText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { clearWallet, storeWallet } = useWallet()
  const { getPassword } = useSessionStore()
  const [activeNetwork, setActiveNetwork] = useState<NetworkToken | any>(null)
  const { clearAccounts, clearAddressbook, saveAccount, getNewAccountId, accounts, setCurrentAccount } = useSettings()
  const [showUsernameView, setShowUsernameView] = useState<boolean>(false)
  const [selectedAvatar, setSelectedAvatar] = useState<null | string>(null)
  const [isShowAvatarModal, setShowAvatarModal] = useState<boolean>(false)

  const schema = yup.object().shape({
    username: yup
      .string()
      .min(3, t('Account.usernameMinimum') as string)
      .required(t('Account.usernameRequired') as string)
      .matches(/^\S*$/, t('Account.usernameNoSpace') as string),
  })

  const handleChangeNetwork = (val: string) => {
    const selected = networkTokens.find((v) => v.networkName === val) as NetworkToken
    setActiveNetwork(selected)
    setErrorText('')
  }

  const handleNextClick = useCallback(async () => {
    setLoading(true)
    try {
      if (privateKey && activeNetwork) {
        if (fromPage === 'account') {
          // import after login
          setLoading(false)
          const asset = networkTokens.find((v) => v.networkName === activeNetwork.networkName) as NetworkToken
          if (asset) {
            const networkFactory = NetworkFactory.selectByNetworkId(activeNetwork.networkName)
            const checkPKey = await networkFactory.checkAccountAlreadyImported(privateKey, activeNetwork.networkName)
            if (checkPKey.result) {
              setShowUsernameView(true)
            } else {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              setErrorText(checkPKey?.msg || 'Incorrect Private Key')
            }
          } else {
            setErrorText('Not supporting this network key!')
          }
        } else {
          // import when onboarding
          await clearWallet()
          clearAccounts()
          clearAddressbook()

          const asset = networkTokens.find((v) => v.networkName === activeNetwork.networkName) as NetworkToken
          if (asset) {
            const networkFactory = NetworkFactory.selectByNetworkId(activeNetwork.networkName)
            const checkKey = await networkFactory.importWalletByPrivateKey(privateKey, activeNetwork.networkName)
            if (checkKey && checkKey.result) {
              const fetchusername = nextToFetchUsername ? nextToFetchUsername.toString() : '' // Use an empty string if nextToFetchUsername is undefined
              const chain: string = activeNetwork.networkName || '' // Use an empty string if activeNetwork.networkName is undefined
              navigate(fetchusername + '/' + chain)
            } else {
              setErrorText('Incorrect Private Key')
            }
            setLoading(false)
          } else {
            setErrorText('Somthing went wrong in network!')
            setLoading(false)
          }
        }
      }
    } catch (error) {
      setErrorText('Invalid key!')
      setLoading(false)
    }
  }, [activeNetwork, clearAccounts, clearAddressbook, clearWallet, navigate, privateKey])

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setError,
    watch,
  } = methods

  const handleImportPrivateKey = async ({ username }: { username: string }) => {
    const hasUsername = Object.values(accounts).some((account) => account.username === username)
    if (hasUsername) {
      setError('username', { type: 'custom', message: 'Duplicated label' })
    } else {
      const password = getPassword()
      try {
        setLoading(true)
        const accountId = getNewAccountId()

        if (password) {
          const networkFactory = NetworkFactory.selectByNetworkId(activeNetwork.networkName)
          const { encryptedPrivateKey: newPrivateKey, address } = await networkFactory.importPrivateKey(privateKey)
          const encryptedPrivateKey = encryptData(JSON.stringify(newPrivateKey), password)

          await storeWallet({ address }, '', '', activeNetwork.networkName, accountId)
            .then(async () => {
              const accountObj = {
                id: accountId,
                username,
                address,
                networkName: activeNetwork.networkName,
                isPrimary: false,
                isAccountImported: true,
                encryptedPrivateKey,
                avatar: selectedAvatar || defaultAvatar,
              }
              saveAccount(accountObj)

              if (activeNetwork.networkName === 'APT') {
                await storeWallet({ address }, '', '', 'SUPRA', accountId).then()
              }
              if (activeNetwork.networkName === 'SUPRA') {
                await storeWallet({ address }, '', '', 'APT', accountId).then()
              }
              setCurrentAccount(accountObj as TAccount)
            })
            .catch((e: Error) => console.log(e.message))

          setLoading(false)
          navigate('/account')
        } else {
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
      }
    }
  }

  return (
    <>
      {!showUsernameView && (
        <Fragment>
          <CustomTypography dataAid="addSingleWallets" variant="body">
            {t('Onboarding.toAddSingleChain')}
          </CustomTypography>

          <Dropdown
            classDynamicChild="h-[16.25rem] overflow-x-hidden overflow-y-scroll w-full border border-solid border-[#424250]"
            classDynamicMenu="bg-custom-white10 mb-4 mt-6 rounded-md p-1 w-full"
            anchor={
              <Menu.Button
                data-aid="currencyDropdown"
                className={`rounded-xl flex items-center gap-2 justify-between w-full ${
                  activeNetwork?.networkName ? 'px-2 py-1' : 'p-2'
                }`}
              >
                {activeNetwork?.networkName && (
                  <Avatar
                    src={activeNetwork?.image}
                    alt={activeNetwork?.title}
                    className="w-10 !h-auto overflow-hidden rounded-full bg-custom-white"
                  />
                )}

                <CustomTypography className="w-full text-left mr-4" variant="subtitle">
                  {activeNetwork?.networkName || 'Choose Network'}
                </CustomTypography>
                <CaretDownIcon className="w-6 h-6" />
              </Menu.Button>
            }
          >
            {networkTokens.map((network) => (
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
          <div className="relative">
            <Input
              name="privateKey"
              multiline={3}
              dataTestId="input-private-key"
              placeholder="Enter your private key"
              value={privateKey}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                setPrivateKey(event.target.value), setErrorText('')
              }}
              mainColor
              error={errorText}
            />
            {privateKey.length > 0 && (
              <div className={`flex justify-end w-full absolute right-0 ${errorText ? '-bottom-4' : '-bottom-9'}`}>
                <Button
                  onClick={() => {
                    setPrivateKey('')
                    setErrorText('')
                  }}
                  variant="bordered"
                  color="outlined"
                  size="sm"
                  type="clear"
                  className="w-12 h-7 mt-3 font-bold"
                >
                  {t('Actions.clear')}
                </Button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="mt-12"
            data-aid="nextNavigation"
            data-test-id="button-next"
            onClick={handleNextClick}
            color={`${!privateKey.length || loading || !activeNetwork?.networkName ? 'disabled' : 'primary'}`}
            isDisabled={!privateKey.length || loading || !activeNetwork?.networkName}
          >
            {t('Actions.next')}
          </Button>
        </Fragment>
      )}
      {showUsernameView && (
        <Fragment>
          <Form methods={methods} onSubmit={handleSubmit(handleImportPrivateKey)}>
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar src={selectedAvatar || defaultAvatar} className="w-24 h-24 rounded-full" />

                <Button
                  variant="bordered"
                  color="outlined"
                  className="font-extrabold h-11 w-24"
                  onClick={() => setShowAvatarModal(true)}
                >
                  {t('Actions.change')}
                </Button>
              </div>

              <div className="space-y-1">
                <CustomTypography variant="subtitle" type="secondary">
                  {t('Onboarding.accountName')}
                </CustomTypography>
                <Input
                  autoComplete="off"
                  dataTestId="username"
                  mainColor
                  id="username"
                  placeholder={t('Onboarding.accountName') as string}
                  endAdornment={
                    <div
                      className={`text-xs ${
                        watch('username')?.length > 15 ? 'text-feedback-negative' : 'text-fotter-dark-inactive'
                      }`}
                    >
                      {watch('username')?.length || 0}/15
                    </div>
                  }
                  className={
                    errors.username || watch('username')?.length > 15
                      ? '!text-feedback-negative !border !border-feedback-negative'
                      : ''
                  }
                  fullWidth
                  disabled={loading}
                  {...register('username')}
                  error={errors.username?.message}
                  dynamicColor={'text-feedback-negative'}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-between mt-8">
              <Button
                type="submit"
                data-test-id="create-subaccount-btn"
                color={
                  !isDirty || !isValid || loading || errors.username || watch('username')?.length > 15
                    ? 'disabled'
                    : 'primary'
                }
                isDisabled={!isDirty || !isValid || loading || errors.username || watch('username')?.length > 15}
                isLoading={loading}
                spinner={<SpinnerIcon />}
              >
                {!loading && t('Actions.import')}
              </Button>
            </div>

            <ChangeProfileAvatar
              openModal={isShowAvatarModal}
              closeModal={() => {
                setShowAvatarModal(false)
                setSelectedAvatar('')
              }}
              selectedAvatar={selectedAvatar}
              setSelectedAvatar={setSelectedAvatar}
              handleAvatarChange={() => setShowAvatarModal(false)}
            />
          </Form>
        </Fragment>
      )}
    </>
  )
}

export default ImportByPrivateKeyComponents
