import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import { FC, useState } from 'react'

import { useSettings } from '@portal/shared/hooks/useSettings'
import { decryptData } from '@portal/shared/services/EncryptionService'
import { SeedlessRecovery } from '@src/app/components/seedless-recovery'

import { useSessionStore } from '@portal/shared/hooks/useSessionStore'
import { RecoveryFileVideoComponent } from '@src/app/components/RecoveryFileVideo/RecoveryFileVideo'
import { useNavigate } from 'lib/woozie'
import PasswordPromptModal from 'pages/wallet/PasswordPromptModal'

const SecurityRecoveryFile: FC = () => {
  const { navigate } = useNavigate()
  const { setIsSavedRecoveryFile, accounts } = useSettings.getState()
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(true)
  const [videoWatchDone, setVideoWatchDone] = useState<boolean>(false)
  const [currentPhrase, setCurrentPhrase] = useState<string>('')

  const { getPassword } = useSessionStore.getState()
  const primaryAccount = Object.values(accounts).find((acc) => acc.isPrimary)

  const handleCreateAccount = () => {
    setIsSavedRecoveryFile(true)
    navigate('/settings')
  }

  const handleVideoWatch = () => {
    setVideoWatchDone(true)
  }

  const handlePasswordOnSuccess = () => {
    const phrase = decryptData(primaryAccount?.encryptedWallet as string, getPassword() as string) as string
    setCurrentPhrase(phrase)
    setOpenPasswordModal(false)
  }
  const passwordPromptFailure = (error: Error) => {
    console.log('Wrong Password', error)
  }

  return (
    <OnboardingLayout disableLogo>
      {!videoWatchDone && <RecoveryFileVideoComponent handleNextStep={handleVideoWatch} />}
      {currentPhrase && videoWatchDone && (
        <SeedlessRecovery
          phrase={currentPhrase}
          username={primaryAccount?.username as string}
          onSuccessSaveRecoveryFile={handleCreateAccount}
        />
      )}

      <PasswordPromptModal
        modalState={openPasswordModal}
        closePromptModal={() => navigate('/settings/security')}
        onSuccess={() => {
          handlePasswordOnSuccess()
        }}
        onFail={passwordPromptFailure}
      />
    </OnboardingLayout>
  )
}

export default SecurityRecoveryFile
