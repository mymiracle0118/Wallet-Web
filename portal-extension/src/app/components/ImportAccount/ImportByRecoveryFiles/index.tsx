import { useState } from 'react'

import { OnBoardingTypes, useWallet } from '@portal/shared/hooks/useWallet'
import { ChooseFiles } from '@src/app/components/ImportAccount/ImportByRecoveryFiles/ChooseFiles'
import { ChooseOptions } from '@src/app/components/ImportAccount/ImportByRecoveryFiles/ChooseOptions'
import { EnterPassword } from '@src/app/components/ImportAccount/ImportByRecoveryFiles/EnterPassword'
import { useNavigate } from 'lib/woozie'

const ImportByRecoveryFiles = () => {
  const { navigate } = useNavigate()
  const { setOnboardingBy } = useWallet()
  const [currentStep, setCurrentStep] = useState<string>('password')
  const [password, setPassword] = useState<string>()
  const [recoveryOptions, setRecoveryOptions] = useState<string[]>([])
  const handleEnterPassword = (password: string) => {
    setPassword(password)
    setCurrentStep('choose_option')
  }
  const handleChooseOptions = (options: string[]) => {
    setRecoveryOptions(options)
    setCurrentStep('choose_files')
  }

  const handleCreateAccount = (phrase: string) => {
    if (phrase) {
      setOnboardingBy(OnBoardingTypes.fileRecovery)
      navigate('/onboarding/import-wallet/create')
    }
  }

  return (
    <div className="w-full relative">
      <div className="mb-16" />
      {currentStep === 'password' && <EnterPassword handleNextStep={handleEnterPassword} />}
      {currentStep === 'choose_option' && (
        <ChooseOptions
          handleNextStep={handleChooseOptions}
          handleBackStep={setCurrentStep}
          defaultRecoveryOptions={recoveryOptions}
        />
      )}
      {currentStep === 'choose_files' && (
        <ChooseFiles
          recoveryPassword={password as string}
          handleNextStep={handleCreateAccount}
          handleBackStep={setCurrentStep}
          recoveryOptions={recoveryOptions}
        />
      )}
    </div>
  )
}

export default ImportByRecoveryFiles
