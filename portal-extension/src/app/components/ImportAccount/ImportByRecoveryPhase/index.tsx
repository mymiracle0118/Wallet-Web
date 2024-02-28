import { useSettings } from '@portal/shared/hooks/useSettings'
import { useWallet } from '@portal/shared/hooks/useWallet'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, goBack } from 'lib/woozie'
import { Button, Input } from 'app/components'
import { NetworkFactory } from '@portal/shared/factory/network.factory'

const ImportByRecoveryPhase = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { recoverWallet, clearWallet, defaultOnboardingNetwork } = useWallet()
  const { clearAccounts, clearAddressbook } = useSettings()

  const [phrase, setPhrase] = useState<string>('')
  const [errorText, setErrorText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const networkFactory = NetworkFactory.selectByNetworkId(defaultOnboardingNetwork as string)

  const handleNextClick = useCallback(() => {
    try {
      clearWallet()
      clearAccounts()
      clearAddressbook()

      // const networkFactory = NetworkFactory.selectByNetworkId('ETH')
      networkFactory.recoverWallet(phrase)

      // recoverWallet(phrase)
      // saveAccount()
      setLoading(true)
      navigate('/onboarding/import-wallet/create')
    } catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message
      setErrorText(message)
    }
  }, [recoverWallet, phrase, navigate])

  return (
    <>
      <div className="min-h-[6.25rem]">
        <Input
          multiline={3}
          dataTestId="input-recovery-phase"
          placeholder="Enter your secret recovery phrase"
          value={phrase}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPhrase(event.target.value)}
          mainColor
          error={errorText}
        />
      </div>
      <div className="flex mt-6 justify-between gap-2">
        <Button data-aid="backNavigation" variant="bordered" color="outlined" onClick={() => goBack()}>
          {t('Actions.back')}
        </Button>
        <Button
          data-aid="nextNavigation"
          color={`${!phrase.length || loading ? 'disabled' : 'primary'}`}
          isDisabled={!phrase.length || loading}
          onClick={handleNextClick}
        >
          {t('Actions.next')}
        </Button>
      </div>
    </>
  )
}

export default ImportByRecoveryPhase
