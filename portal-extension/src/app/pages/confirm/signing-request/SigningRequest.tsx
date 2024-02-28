/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */

import React, { useEffect } from 'react'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { useTranslation } from 'react-i18next'
import { Button, CustomTypography } from 'components'
import { goBack, useNavigate } from 'lib/woozie'

import { useWalletConnect } from '@portal/shared/hooks/useWalletConnect'

const SigningRequest = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { session, callRequest, rejectCallRequest } = useWalletConnect()

  useEffect(() => {
    if (!callRequest) {
      goBack()
    }
  }, [callRequest])

  const handleApproveClick = () => {
    navigate(`/confirm/connecting`)
  }

  const handleDeclineClick = () => {
    rejectCallRequest()
    goBack()
  }

  return (
    <SinglePageTitleLayout showWalletConnectMenu disableBack>
      <div className="p-4 ">
        <div className="flex gap-4">
          {session?.peerMeta?.icons.length && session?.peerMeta.icons[0] && (
            <img className="h-9 w-9 rounded-full" alt="token-thumbnail" src={session.peerMeta.icons[0]} />
          )}
          {session?.peerMeta?.name && <CustomTypography className="text-h2">{session.peerMeta.name}</CustomTypography>}
        </div>

        {session?.peerMeta?.url && (
          <CustomTypography className="text-link mt-4" color="text-primary dark:text-secondary">
            {session.peerMeta.url}
          </CustomTypography>
        )}

        <CustomTypography className="text-h1 my-4">{t('Confirm.signatureRequest')}</CustomTypography>
        <div className="overflow-hidden rounded-lg py-3 px-3 bg-gray-dark">
          <div className="max-h-64 overflow-y-scroll">
            <CustomTypography className="text-body line leading-5  break-words">
              {`${callRequest?.method} (${callRequest?.params})`}
            </CustomTypography>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="bordered" color="outlined" onClick={handleDeclineClick} fullWidth>
            {t('Actions.deny')}
          </Button>
          <Button type="submit" onClick={handleApproveClick} fullWidth color="primary">
            {t('Actions.approve')}
          </Button>
        </div>
      </div>
    </SinglePageTitleLayout>
  )
}

export default SigningRequest
