import { Menu } from '@headlessui/react'
import { default as networkTokenList } from '@portal/shared/data/networkTokens.json'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import { NetworkToken } from '@portal/shared/utils/types'
import { fromUTF8Array } from '@portal/shared/utils/utf8'
import { useWallet } from '@src/../../shared/hooks/useWallet'
import { CopyIcon, SpinnerIcon } from '@src/app/components/Icons'
import { decryptData } from '@src/utils/constants'
import { Button, CustomTypography, Dropdown, DropdownItem, Icon, Input, ToolTip } from 'app/components'
import { ethers } from 'ethers'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { createLocationState, goBack, useNavigate } from 'lib/woozie'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DropDownIcon from '../../../../../public/images/backgrounds/dropdown_icon.svg'
const networkTokens = Object.values(networkTokenList).filter((token) => token.tokenType === 'Native')

const ShowPrivateKey = () => {
  const { pathname } = createLocationState()
  const paths = pathname.split('/')
  const address = paths.slice(-1).pop()
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const [privateKeyPassword, setPrivateKeyPassword] = useState('')
  const [showKey, setShowKey] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [privateKeyToShow, setPrivateKeyToShow] = useState<string>('')
  const { currentAccount } = useSettings()
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const textRef = useRef<HTMLSpanElement | null>(null)
  const { walletsList } = useStore()
  const [activeNetwork, setActiveNetwork] = useState<NetworkToken>()
  const [filteredTokens, setFilteredTokens] = useState<NetworkToken[]>([])

  useEffect(() => {
    if (address) {
      const selectedAddressKeys = Object.keys(walletsList[address])
      const filteredData = networkTokens.filter((token) => selectedAddressKeys.includes(token.shortName))
      setActiveNetwork(filteredData[0])
      setFilteredTokens(filteredData)
    }
  }, [])

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
      setShowKey(true)
      if (currentAccount && address && activeNetwork) {
        const accountWallet = walletsList[currentAccount.address][currentAccount.networkName]
        const networkToken = useWallet.getState().getNetworkTokenWithCurrentEnv(currentAccount.networkName)
        if (networkToken.isEVMNetwork) {
          await ethers.Wallet.fromEncryptedJson(accountWallet.encryptedWallet as string, privateKeyPassword as string)
        } else {
          await decryptData(accountWallet.encryptedWallet as string, privateKeyPassword as string)
        }
        const selectedAccount = walletsList[address]
        const encPK = selectedAccount[activeNetwork?.shortName]?.encryptedPrivateKey
        const PK = fromUTF8Array(encPK)
        setPrivateKeyToShow(PK)
        setError(false), setErrorMsg('')
      }
    } catch (error) {
      setShowKey(false)
      setError(true), setErrorMsg('Invalid password!')
    }
  }

  const handleChangeNetwork = (val: string) => {
    const selected = filteredTokens.find((v) => v.networkName === val) as NetworkToken
    setActiveNetwork(selected)
  }

  return (
    <SinglePageTitleLayout title="Show Private Key">
      <div className="space-y-5">
        <CustomTypography variant="body">{t('Settings.privateKeyDisclosure')}</CustomTypography>

        {(showKey && privateKeyToShow) || error ? (
          <>
            <CustomTypography variant="subtitle" className="my-4" type="secondary">
              {error ? (
                <label className="dark:text-feedback-negative text-sm font-bold"> {errorMsg}</label>
              ) : (
                <>{t('Settings.showPrivateKeyLabel')}</>
              )}
            </CustomTypography>
            {/* {!error && wallet?.privateKeyPassword ? ( */}
            {!error && privateKeyToShow ? (
              <>
                <div className="bg-surface-dark-alt rounded-md p-4 mb-3">
                  <CustomTypography variant="body" ref={textRef} className="break-words text-white leading-5">
                    {/* {wallet?.privateKeyPassword} */}
                    {privateKeyToShow}
                  </CustomTypography>

                  <div className="flex justify-end cursor-pointer mt-3 ml-auto w-fit">
                    <ToolTip title={`${isCopied ? 'Copied' : 'Copy'}`} placement="left">
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
              </>
            ) : null}
            <Button
              color={`${!privateKeyPassword.length ? 'disabled' : 'primary'}`}
              isDisabled={!privateKeyPassword.length}
              onClick={() => navigate('/account')}
            >
              {error ? t('Actions.tryAgain') : t('Actions.done')}
            </Button>
          </>
        ) : (
          <>
            <Dropdown
              classDynamicChild="max-h-[16.25rem] h-auto overflow-x-hidden overflow-y-scroll w-full border border-solid border-[#424250]"
              classDynamicMenu="bg-custom-white10 mb-4 mt-6 rounded-md p-1 !table"
              anchor={
                <Menu.Button data-aid="currencyDropdown" className="p-2 rounded-xl flex items-center gap-4">
                  <img alt="icon" src={activeNetwork?.image} className="h-6 rounded-full" />

                  <CustomTypography className="w-60 text-left mr-4" variant="subtitle">
                    {activeNetwork?.networkName}
                  </CustomTypography>
                  <Icon size="small" icon={<DropDownIcon />} />
                </Menu.Button>
              }
            >
              {filteredTokens.map((network) => (
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
              type="password"
              placeholder="Password"
              mainColor
              fullWidth
              onChange={(e) => setPrivateKeyPassword(e.target.value as string)}
            />

            <div className="mt-4 flex gap-2">
              <Button color="outlined" variant="bordered" onClick={goBack}>
                {t('Actions.cancel')}
              </Button>
              <Button
                data-aid="nextNavigation"
                color={`${!privateKeyPassword.length || showKey ? 'disabled' : 'primary'}`}
                isDisabled={!privateKeyPassword.length || showKey}
                // onClick={async () => {
                //   setShowKey(true),
                //     await openWallet(privateKeyPassword, address)
                //       .then((privateKeyShow: string) => {
                //         setPrivateKeyToShow(privateKeyShow)
                //         setError(false), setErrorMsg('')
                //       })
                //       .catch(() => {
                //         setShowKey(false)
                //         setError(true), setErrorMsg('Invalid password!')
                //       })
                // }}
                onClick={handleShowPrivateKey}
              >
                {showKey ? <SpinnerIcon /> : t('Actions.show')}
              </Button>
            </div>
          </>
        )}
      </div>
    </SinglePageTitleLayout>
  )
}

export default ShowPrivateKey
