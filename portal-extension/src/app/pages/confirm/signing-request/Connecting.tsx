/* eslint-disable @typescript-eslint/no-unsafe-argument */

import React, { useEffect, useState } from 'react'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import connecting from 'assets/gif/connecting.gif'
import { CustomTypography, Icon } from 'components'
import ETH from 'assets/coins/ETH.svg'

import PasswordPromptModal from 'app/pages/wallet/PasswordPromptModal'
import { useWalletConnect, getWalletSigner } from '@portal/shared/hooks/useWalletConnect'
import { go, goBack } from 'lib/woozie'

const ConnectingToSignature = () => {
  const { session, callRequest, approveCallRequest } = useWalletConnect()

  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false)

  useEffect(() => {
    if (!callRequest) {
      go(-1)
    } else {
      setOpenPasswordModal(true)
    }
  }, [callRequest])

  const handlePromptPassword = async (password: string) => {
    try {
      setOpenPasswordModal(false)
      const walletSigner = await getWalletSigner(session?.chainId as number, session?.accounts[0] as string, password)
      await approveCallRequest(walletSigner)
      go(-2)
    } catch (error) {
      setOpenPasswordModal(true)
    }
  }

  const handleCancelPasswordPrompt = () => {
    setOpenPasswordModal(false)
    goBack()
  }

  return (
    <SinglePageTitleLayout showWalletConnectMenu disableBack>
      <div className="flex items-center justify-center gap-4 mt-48">
        <Icon icon={<ETH />} size="large" />
        <img src={connecting} alt="my-gif" className="w-32" />
        <img className="h-9 w-9 rounded-full" alt="token-thumbnail" src={session?.peerMeta?.icons[0]} />
      </div>
      <CustomTypography className="text-xl text-center mt-8 !text-secondary font-bold">Connecting...</CustomTypography>
      <PasswordPromptModal
        modalState={openPasswordModal}
        closePromptModal={handleCancelPasswordPrompt}
        onPromptPassword={handlePromptPassword}
      />
    </SinglePageTitleLayout>
  )
}

export default ConnectingToSignature
