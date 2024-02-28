import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import AccountItem from './AccountItem'
import { useNavigate } from 'lib/woozie'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { ethers } from 'ethers'
import { usePricing } from '@portal/shared/hooks/usePricing'
import { Listbox, ListboxItem } from '@nextui-org/react'
import { IAccountItemProps } from '@portal/shared/utils/types'
import { Button } from 'components'
import { KeyIcon, PlusIcon } from '@src/app/components/Icons'
import { useStore } from '@portal/shared/hooks/useStore'

const AccountManagement = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { accounts, currentAccount, setCurrentAccount } = useSettings()
  const { setLockWallet, isAccountCreatedByPrivateKey } = useWallet()

  // TODO :: saveAccount reseting default assets with balance check another option to show balance
  const handleChangeActiveAccount = (value: string) => {
    setCurrentAccount(accounts[value])
    navigate('/home')
  }
  const { getAssetValue } = usePricing()
  const { currentTokenArrayWithBalance } = useStore()
  const [totalBalance, setTotalBalance] = useState<number>(0)
  useEffect(() => {
    let total = 0
    Object.values(currentTokenArrayWithBalance).forEach((asset) => {
      const assetBalance = Number(asset.formattedBalance || 0)
      total += getAssetValue(asset.coingeckoTokenId, assetBalance)
    })

    setTotalBalance(total)
  }, [currentTokenArrayWithBalance, totalBalance, getAssetValue])

  const accountData = useMemo(
    () =>
      Object.values(accounts).map<IAccountItemProps>((data) => ({
        address: data.address,
        userName: data.username,
        avatar: data.avatar,
        balance: 0,
        isAccountImported: data.isAccountImported,
        active: data.address === currentAccount?.address,
      })),
    [accounts]
  )

  return (
    <SinglePageTitleLayout title={t('Account.accountTitle')}>
      <div className="flex flex-col h-full">
        <div className="flex-1 space-y-5">
          <div className={'p-2 bg-surface-dark-alt rounded-lg'}>
            {accountData.map((data, idx) => (
              <AccountItem
                key={idx}
                active={data.active}
                avatar={data.avatar}
                address={data.address}
                userName={data.userName}
                balance={data.active ? `$${ethers.utils.commify(totalBalance.toFixed(2))}` : ''}
                onClick={handleChangeActiveAccount}
                isAccountImported={data.isAccountImported}
              />
            ))}
          </div>

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
        <div className="pt-4 flex">
          <Button
            type="button"
            data-aid="logOutButton"
            onClick={() => {
              setLockWallet(true), navigate('/login')
            }}
            variant="bordered"
            color="outlined"
          >
            {t('Actions.logout')}
          </Button>
        </div>
      </div>
    </SinglePageTitleLayout>
  )
}

export default AccountManagement
