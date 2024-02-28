import { Menu } from '@headlessui/react'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { useNavigate } from 'lib/woozie'
import React, { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
// import { default as assetsDefaultList } from '@portal/shared/data/assets.json'
import { yupResolver } from '@hookform/resolvers/yup'
import { Avatar } from '@nextui-org/react'
import { default as networkTokenList } from '@portal/shared/data/networkTokens.json'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useStore } from '@portal/shared/hooks/useStore'
import { ImportUsernameProps, NetworkToken } from '@portal/shared/utils/types'
import ChangeProfileAvatar from '@src/app/components/ChangeProfileAvatar'
import { SpinnerIcon } from '@src/app/components/Icons'
import { decryptData } from '@src/utils/constants'
import { Button, CustomTypography, Dropdown, DropdownItem, Form, Icon, Input } from 'app/components'
import PasswordPromptModal from 'app/pages/wallet/PasswordPromptModal'
import defaultAvatar from 'assets/images/Avatar.png'
import { ethers } from 'ethers'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import DropDownIcon from '../../../../../public/images/backgrounds/dropdown_icon.svg'

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
  const [activeNetwork, setActiveNetwork] = useState<NetworkToken>(networkTokens[0])
  const { clearAccounts, clearAddressbook, currentAccount } = useSettings()
  const [showUsernameView, setShowUsernameView] = useState(false)
  const { saveAccount } = useSettings()
  // const { importPrivateKey } = useWallet()
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false)
  const [selectedAvatar, setSelectedAvatar] = useState<null | string>(null)
  const [isShowAvatarModal, setShowAvatarModal] = useState<boolean>(false)
  const [username, setUsername] = useState('')
  const [responseData, setResponseData] = useState<any>()

  const { walletsList } = useStore()

  const schema = yup.object().shape({
    username: yup
      .string()
      .min(3, t('Account.usernameMinimum'))
      .max(15, t('Account.usernameMaximum'))
      .required(t('Account.usernameRequired'))
      .matches(/^\S*$/, t('Account.usernameNoSpace')),
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
              setErrorText(checkPKey.msg)
            }
          } else {
            setErrorText('Not supporting this network key!')
          }
        } else {
          // import when onboarding
          clearWallet()
          clearAccounts()
          clearAddressbook()

          const asset = networkTokens.find((v) => v.networkName === activeNetwork.networkName) as NetworkToken
          if (asset) {
            const networkFactory = NetworkFactory.selectByNetworkId(activeNetwork.networkName)
            const checkKey = await networkFactory.importWalletByPrivateKey(privateKey, activeNetwork.networkName)
            if (checkKey && checkKey.result) {
              const fetchusername = nextToFetchUsername ? nextToFetchUsername.toString() : '' // Use an empty string if nextToFetchUsername is undefined
              const chain = activeNetwork.networkName || '' // Use an empty string if activeNetwork.networkName is undefined
              navigate(fetchusername + '/' + chain)
            } else {
              setErrorText(checkKey.msg)
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
    // setError,
    formState: { errors, isValid, isDirty },
    watch,
  } = methods

  const handleImportPrivateKey = ({ username }: { username: string }) => {
    setOpenPasswordModal(true)
    setUsername(username)
  }

  const handlePasswordPromptSuccess = async (password: string) => {
    try {
      setLoading(true)
      if (currentAccount) {
        const accountWallet = walletsList[currentAccount.address][currentAccount.networkName]
        const networkToken = useWallet.getState().getNetworkTokenWithCurrentEnv(currentAccount.networkName)
        let checkPassword: any
        if (networkToken.isEVMNetwork) {
          checkPassword = await ethers.Wallet.fromEncryptedJson(
            accountWallet.encryptedWallet as string,
            password as string
          )
        } else {
          checkPassword = await decryptData(accountWallet.encryptedWallet as string, password as string)
        }

        if (checkPassword) {
          const networkFactory = NetworkFactory.selectByNetworkId(activeNetwork.networkName)
          const { wallet, encryptedPrivateKey, address } = await networkFactory.importPrivateKey(privateKey)
          await storeWallet({ wallet, encryptedPrivateKey, address }, '', password, activeNetwork.networkName, address)
            .then(() => saveAccount(username, address, activeNetwork.networkName, false, true))
            .catch((e: Error) => console.log(e.message))
        }
        setResponseData({ status: true, data: {} })
        setOpenPasswordModal(false)
        setLoading(false)
        navigate('/account')
      }
    } catch (error) {
      setResponseData({ status: false, data: error })
      setLoading(false)
    }
  }

  const handlePasswordPromptFail = (error: never) => {
    console.log(error)
    setOpenPasswordModal(false)
    return error
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
            classDynamicMenu="bg-custom-white10 mb-4 mt-6 rounded-md p-1 !table"
            anchor={
              <Menu.Button data-aid="currencyDropdown" className="p-2 rounded-xl flex items-center gap-2">
                <img alt="icon" src={activeNetwork?.image} className="h-6 rounded-full" />

                <CustomTypography className="w-60 text-left mr-4" variant="subtitle">
                  {activeNetwork?.networkName}
                </CustomTypography>
                <Icon size="small" icon={<DropDownIcon />} />
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
            // error={errors.privateKey?.message}
          />
          <span className="text-feedback-negative font-semibold mt-2">{errorText}</span>

          <Button
            type="submit"
            className="mt-4"
            data-aid="nextNavigation"
            data-test-id="button-next"
            onClick={handleNextClick}
            color={`${!privateKey.length || loading ? 'disabled' : 'primary'}`}
            isDisabled={!privateKey.length || loading}
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
                  placeholder={t('Onboarding.accountName')}
                  endAdornment={
                    <div className="text-[12px] text-fotter-dark-inactive">{watch('username')?.length || 0}/15</div>
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
                color={!isDirty || !isValid || loading ? 'disabled' : 'primary'}
                isDisabled={!isDirty || !isValid || loading}
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
          {/* <PasswordPromptModal
            modalState={openPasswordModal}
            closePromptModal={() => setOpenPasswordModal(false)}
            onSuccess={handlePasswordPromptSuccess}
            getPassword={setPassword}
          /> */}
          <PasswordPromptModal
            modalState={openPasswordModal}
            closePromptModal={() => setOpenPasswordModal(false)}
            onPromptPassword={handlePasswordPromptSuccess}
            onFail={handlePasswordPromptFail}
            responseData={responseData}
            isDismissable={false}
            buttonDisable={loading}
          />
        </Fragment>
      )}
    </>
  )
}

export default ImportByPrivateKeyComponents
