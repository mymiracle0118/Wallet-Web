import { Image, Listbox, ListboxItem, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { usePricing } from '@portal/shared/hooks/usePricing'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useStore } from '@portal/shared/hooks/useStore'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { KeyIcon, PlusIcon } from '@src/app/components/Icons'
import { ethersCommify } from '@src/utils/ethersCommify'
import AlertIcon from 'assets/images/alert.png'
import { Button, CustomTypography } from 'components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { useNavigate } from 'lib/woozie'
import LogOut from 'pages/settings/security/logOut'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AccountItem from './AccountItem'

const AccountManagement = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { accounts, currentAccount, setCurrentAccount, hideAccount } = useSettings()
  const { isAccountCreatedByPrivateKey, setSelectedNetwork } = useWallet()
  const accountsImported = Object.values(accounts).filter((a) => a.isAccountImported)

  const handleChangeActiveAccount = (value: string) => {
    setCurrentAccount(accounts[value])
    setSelectedNetwork('')
    navigate('/home')
  }
  const { getAssetValue } = usePricing()
  const { currentTokenArrayWithBalance } = useStore()
  const [totalBalance, setTotalBalance] = useState<number>(0)
  const [hideAccountId, setHideAccountId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let total = 0
    Object.values(currentTokenArrayWithBalance).forEach((asset) => {
      const assetBalance = Number(asset.formattedBalance || 0)
      total += getAssetValue(asset.coingeckoTokenId, assetBalance)
    })

    setTotalBalance(total)
  }, [currentTokenArrayWithBalance, totalBalance, getAssetValue])

  const onClickHideAccount = (accountId: string) => {
    setLoading(false)
    setHideAccountId(accountId)
  }
  const handleHideAccount = () => {
    setLoading(true)
    if (hideAccountId && accounts[hideAccountId]) {
      const account = accounts[hideAccountId]
      hideAccount(hideAccountId)
      if (currentAccount && account.id == currentAccount.id) {
        const toBeActiveAddress = Object.values(accounts)[0]
        setCurrentAccount(toBeActiveAddress)
      }
    }
    setHideAccountId('')
    setLoading(false)
  }

  return (
    <>
      <SinglePageTitleLayout
        title={t('Account.accountTitle')}
        disableBack
        customGoBack
        paddingClass={false}
        onClickAction={() => navigate('/')}
      >
        <div className="flex flex-col h-full px-4">
          <div className="flex-1 space-y-5 overflow-y-auto h-[33.6rem] max-h-[33.6rem] pt-4">
            <div className={'p-2 bg-surface-dark-alt rounded-lg'}>
              {Object.values(accounts)
                .filter((a) => !a.isAccountImported)
                .map((data, idx) => (
                  <AccountItem
                    key={idx}
                    accountId={data.id}
                    active={data.id === currentAccount?.id}
                    avatar={data.avatar}
                    address={data.address}
                    username={data.username}
                    balance={data.id === currentAccount?.id ? `$${ethersCommify(totalBalance.toFixed(2))}` : ''}
                    onClick={handleChangeActiveAccount}
                    onClickHideAccount={onClickHideAccount}
                    isAccountImported={data.isAccountImported}
                    allowHideAccount={!data.isPrimary}
                  />
                ))}
            </div>

            {accountsImported.length > 0 && (
              <div className={'p-2 bg-surface-dark-alt rounded-lg'}>
                <CustomTypography className="ml-3 my-3" type="secondary">
                  {t('Actions.imported')}
                </CustomTypography>
                {accountsImported.map((data, idx) => (
                  <AccountItem
                    key={idx}
                    accountId={data.id}
                    active={data.id === currentAccount?.id}
                    avatar={data.avatar}
                    address={data.address}
                    username={data.username}
                    balance={data.id === currentAccount?.id ? `$${ethersCommify(totalBalance.toFixed(2))}` : ''}
                    onClick={handleChangeActiveAccount}
                    onClickHideAccount={onClickHideAccount}
                    isAccountImported={data.isAccountImported}
                    allowHideAccount={!data.isPrimary}
                  />
                ))}
              </div>
            )}

            <div className="border-small px-1 py-2 rounded-xl dark:border-custom-white10">
              <Listbox aria-label="Account" variant="flat">
                {!isAccountCreatedByPrivateKey ? (
                  <ListboxItem
                    key="create_sub_Account"
                    startContent={<PlusIcon className="mr-2" />}
                    className="font-extrabold py-3"
                    onClick={() => navigate('/account/create-sub-account')}
                  >
                    {t('Account.createSubAccount')}
                  </ListboxItem>
                ) : null}
                <ListboxItem
                  key="import_Account"
                  startContent={<KeyIcon className="mr-2" />}
                  className="font-extrabold py-3"
                  onClick={() => navigate('/account/import-by-private-key')}
                >
                  {t('Account.importAccount')}
                </ListboxItem>
              </Listbox>
            </div>
          </div>
          <LogOut />
        </div>
      </SinglePageTitleLayout>
      <Modal
        backdrop="opaque"
        isOpen={!!hideAccountId}
        onClose={() => setHideAccountId('')}
        hideCloseButton={true}
        placement="center"
        className="max-w-[20.625rem]"
      >
        <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
          <ModalBody>
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <Image width={64} height={64} src={AlertIcon} fallbackSrc={AlertIcon} alt="Alert" />
              </div>

              <CustomTypography variant="h1">{t('Account.modalTitle')}</CustomTypography>

              <div className="flex items-center justify-between gap-x-4">
                <Button
                  variant="bordered"
                  data-aid="setCancel"
                  className="my-2"
                  color="outlined"
                  onClick={() => setHideAccountId('')}
                >
                  {t('Actions.cancel')}
                </Button>
                <Button
                  data-test-id="button-hide-account"
                  color={`${loading ? 'disabled' : 'negative'}`}
                  isDisabled={loading}
                  onClick={handleHideAccount}
                >
                  {t('Actions.hideNow')}
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AccountManagement
