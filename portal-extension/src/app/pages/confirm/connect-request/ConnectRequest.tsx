import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { goBack } from 'lib/woozie'

import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { CustomTypography, Button } from 'components'

import { useWalletConnect } from '@portal/shared/hooks/useWalletConnect'
import { useSettings } from '@portal/shared/hooks/useSettings'

import AccountItem from './AccountItem'
import { SpinnerIcon } from '@src/app/components/Icons'

const ConnectRequest = () => {
  const { t } = useTranslation()
  const { sessionRequest, approveSession, rejectSession, clear } = useWalletConnect()
  const { accounts } = useSettings()

  const [selectedAccount, setSelectedAccount] = useState(Object.keys(accounts)[0])
  const [loading, setLoading] = useState<boolean>(false)

  const handleApproveClick = () => {
    try {
      setLoading(true)
      approveSession([selectedAccount])
      goBack()
    } catch (error) {
      console.error('handleApproveClick', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDenyClick = () => {
    try {
      setLoading(true)
      rejectSession()
    } catch (error) {
      console.error('handleDenyClick', error)
      clear()
    } finally {
      setLoading(false)
      goBack()
    }
  }

  if (!sessionRequest) {
    return null
  }

  return (
    <SinglePageTitleLayout disableBack>
      <div className="p-4 ">
        <div className="flex gap-4">
          {sessionRequest.params[0].peerMeta.icons[0] && (
            <img
              className="h-9 w-9 rounded-full"
              alt="token-thumbnail"
              src={sessionRequest.params[0].peerMeta.icons[0]}
            />
          )}
          {sessionRequest.params[0].peerMeta.name && (
            <CustomTypography className="text-h2">{sessionRequest.params[0].peerMeta.name}</CustomTypography>
          )}
        </div>
        <CustomTypography className="text-link mt-4" color="text-primary dark:text-secondary">
          {sessionRequest.params[0].peerMeta.url}
        </CustomTypography>
        <CustomTypography className="text-h1 my-4">{t('Confirm.connectRequest')}</CustomTypography>
        <CustomTypography className="text-body line leading-5">{t('Confirm.connectRequestContent')}</CustomTypography>
        <div className="my-4">
          {Object.values(accounts).map((account) => (
            <AccountItem
              key={account.address}
              selected={account.address === selectedAccount}
              accountName={account.username}
              onSelected={() => setSelectedAccount(account.address)}
            />
          ))}
        </div>
        <div className="flex gap-2  ">
          <Button
            isLoading={loading}
            variant="bordered"
            color="outlined"
            onClick={handleDenyClick}
            spinner={<SpinnerIcon />}
          >
            {t('Actions.deny')}
          </Button>
          <Button isLoading={loading} onClick={handleApproveClick} spinner={<SpinnerIcon />} color="primary">
            {!loading && t('Actions.allow')}
          </Button>
        </div>
      </div>
    </SinglePageTitleLayout>
  )
}

export default ConnectRequest
