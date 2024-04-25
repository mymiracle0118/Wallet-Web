import React, { FC } from 'react'
import { useNavigate } from 'lib/woozie'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'

import { SeedlessRecovery } from '@src/app/components/seedless-recovery'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { useSettings } from '@portal/shared/hooks/useSettings'

const RecoveryFile: FC = () => {
  const { navigate } = useNavigate()
  const { wallet, username, setCreateWalletProcessCompleted } = useWallet.getState()
  const { setIsSavedRecoveryFile } = useSettings.getState()
  const phrase = wallet?.mnemonic?.phrase
  const handleCreateAccount = () => {
    setIsSavedRecoveryFile(true)
    setCreateWalletProcessCompleted(true)
    navigate('/onboarding/wallet-is-secured')
  }
  return (
    <OnboardingLayout disableLogo>
      <SeedlessRecovery phrase={phrase} username={username as string} onSuccessSaveRecoveryFile={handleCreateAccount} />
    </OnboardingLayout>
  )
}

export default RecoveryFile
