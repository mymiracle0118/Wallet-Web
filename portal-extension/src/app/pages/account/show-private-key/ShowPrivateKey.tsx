import { Menu } from '@headlessui/react'
import { Avatar } from '@nextui-org/react'
import { default as networkTokenList } from '@portal/shared/data/networkTokens.json'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import { decryptData } from '@portal/shared/services/EncryptionService'
import { NetworkToken } from '@portal/shared/utils/types'
import { fromUTF8Array } from '@portal/shared/utils/utf8'
import { CaretDownIcon, CopyIcon, SpinnerIcon } from '@src/app/components/Icons'
import { Button, CustomTypography, Dropdown, DropdownItem, Input, ToolTip } from 'app/components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { createLocationState, goBack, useNavigate } from 'lib/woozie'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const networkTokens = Object.values(networkTokenList).filter((token) => token.tokenType === 'Native')

const ShowPrivateKey = () => {
  const { pathname } = createLocationState()
  const paths = pathname.split('/')
  const address = paths.slice(-1).pop()
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const [privateKeyPassword, setPrivateKeyPassword] = useState<string>('')
  const [showKey, setShowKey] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [privateKeyToShow, setPrivateKeyToShow] = useState<string>('')
  const { currentAccount, accounts } = useSettings()
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const textRef = useRef<HTMLSpanElement | null>(null)
  const { walletsList } = useStore()
  const [activeNetwork, setActiveNetwork] = useState<NetworkToken | null>(null)
  const [filteredTokens, setFilteredTokens] = useState<NetworkToken[]>([])

  useEffect(() => {
    if (address && walletsList) {
      const accountsWalletsList = walletsList[address]
      const filteredData = networkTokens
        .map((token) => {
          return { ...token, address: accountsWalletsList[token.shortName]?.address } as unknown as NetworkToken
        })
        .filter((token) => token.address)
      setFilteredTokens(filteredData)
    }
  }, [address, walletsList])

  const copyToClipboard = () => {
    if (textRef.current) {
      const textToCopy = textRef.current.textContent || ''
      void navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
    }
  }

  const handleShowPrivateKey = async () => {
    try {
      if (currentAccount && address && activeNetwork) {
        const selectedAccount = accounts[address]

        let encryptedPrivateKey: any
        if (!selectedAccount.encryptedWallet && selectedAccount.encryptedPrivateKey) {
          encryptedPrivateKey = JSON.parse(
            decryptData(selectedAccount.encryptedPrivateKey as string, privateKeyPassword as string) as string
          )
        } else {
          const primaryAccount = Object.values(accounts).find((acc) => acc.isPrimary)
          const accountWallet = walletsList[selectedAccount.id][activeNetwork.networkName]

          const mnemonic = decryptData(
            primaryAccount?.encryptedWallet as string,
            privateKeyPassword as string
          ) as string
          if (mnemonic) {
            const networkFactory = NetworkFactory.selectByNetworkId(activeNetwork.networkName)
            const walletObj = await networkFactory.createWallet(mnemonic, accountWallet.derivationPathIndex)
            encryptedPrivateKey = walletObj.encryptedPrivateKey
          }
        }
        setShowKey(true)

        if (encryptedPrivateKey) {
          const PK = fromUTF8Array(encryptedPrivateKey)
          setPrivateKeyToShow(PK)
          setError(false), setErrorMsg('')
        } else {
          setError(true), setErrorMsg(t('Actions.invalidPassword') as string)
        }
      }
    } catch (error) {
      setShowKey(false)
      setError(true), setErrorMsg(t('Actions.invalidPassword') as string)
    }
  }

  return (
    <SinglePageTitleLayout title={t('Account.option2')}>
      <div className="space-y-5">
        <CustomTypography variant="body">{t('Settings.privateKeyDisclosure')}</CustomTypography>

        {showKey && privateKeyToShow && !error ? (
          <>
            <div className="bg-surface-dark-alt rounded-md p-4 mb-3">
              <CustomTypography variant="body" ref={textRef} className="break-words text-white leading-5">
                {privateKeyToShow}
              </CustomTypography>

              <div className="flex justify-end cursor-pointer mt-3 ml-auto w-fit">
                <ToolTip title={`${isCopied ? 'Copied' : 'Copy'}`}>
                  <Button
                    isIconOnly
                    size="sm"
                    radius="none"
                    variant="light"
                    className="bg-transparent"
                    onClick={copyToClipboard}
                  >
                    <CopyIcon className="fill-custom-white" />
                  </Button>
                </ToolTip>
              </div>
            </div>
            <Button color="primary" onClick={() => navigate('/account')}>
              {t('Actions.done')}
            </Button>
          </>
        ) : (
          <>
            <Dropdown
              classDynamicChild="max-h-[16.25rem] h-auto overflow-x-hidden overflow-y-scroll w-full border border-solid border-[#424250]"
              classDynamicMenu="bg-custom-white10 mb-4 mt-6 rounded-md p-1 w-full"
              anchor={
                <Menu.Button
                  data-aid="currencyDropdown"
                  className={`rounded-xl flex items-center gap-4 justify-between w-full ${
                    activeNetwork?.networkName ? 'px-2 py-1' : 'p-2'
                  }`}
                >
                  {activeNetwork?.networkName && (
                    <Avatar
                      src={activeNetwork?.image}
                      alt={activeNetwork?.title}
                      className="w-10 overflow-hidden rounded-full !h-auto  bg-custom-white"
                    />
                  )}
                  <CustomTypography className="w-full text-left mr-4" variant="subtitle">
                    {activeNetwork?.networkName || 'Choose Network'}
                  </CustomTypography>
                  <CaretDownIcon className="w-6 h-6" />
                </Menu.Button>
              }
            >
              {filteredTokens.map((network) => (
                <DropdownItem
                  key={network.networkName}
                  active={network.networkName === activeNetwork?.networkName}
                  text={network.networkName}
                  onSelect={() => {
                    setActiveNetwork(network)
                  }}
                  icon={network.image}
                  isImg={true}
                />
              ))}
            </Dropdown>
            {activeNetwork && (
              <div className="border-small p-4 rounded-lg dark:border-custom-white10 my-3 space-y-2">
                <CustomTypography variant="subTitle" className="font-extrabold dark:text-custom-white40">
                  {t('Wallet.walletAddress')}
                </CustomTypography>
                <CustomTypography className="break-all">{activeNetwork.address}</CustomTypography>
              </div>
            )}

            <div>
              <Input
                type="password"
                placeholder="Password"
                mainColor
                fullWidth
                onChange={(e) => setPrivateKeyPassword(e.target.value as string)}
                error={errorMsg}
              />
            </div>

            <div className="mt-4 flex gap-2">
              <Button color="outlined" variant="bordered" onClick={goBack}>
                {t('Actions.cancel')}
              </Button>
              <Button
                data-aid="nextNavigation"
                color={`${
                  !privateKeyPassword.length || (showKey && !error) || !activeNetwork ? 'disabled' : 'primary'
                }`}
                isDisabled={!privateKeyPassword.length || (showKey && !error) || !activeNetwork}
                onClick={handleShowPrivateKey}
                spinner={<SpinnerIcon />}
              >
                {t('Actions.show')}
              </Button>
            </div>
          </>
        )}
      </div>
    </SinglePageTitleLayout>
  )
}

export default ShowPrivateKey
