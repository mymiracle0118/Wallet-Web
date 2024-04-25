import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { Button, Input } from 'app/components'
import { useNavigate } from 'lib/woozie'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

const ImportByRecoveryPhase = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { clearWallet, defaultOnboardingNetwork } = useWallet()
  const { clearAccounts, clearAddressbook } = useSettings()

  const [phrase, setPhrase] = useState<string>('')
  const [errorText, setErrorText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const networkFactory = NetworkFactory.selectByNetworkId(defaultOnboardingNetwork as string)

  const handleNextClick = useCallback(async () => {
    try {
      await clearWallet()
      clearAccounts()
      clearAddressbook()
      networkFactory.recoverWallet(phrase)
      setLoading(true)
      navigate('/onboarding/import-wallet/create')
    } catch (error) {
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message
      setErrorText(message)
    }
  }, [phrase, navigate])

  return (
    <>
      <div className="min-h-[6.25rem] relative">
        <Input
          multiline={3}
          dataTestId="input-recovery-phase"
          placeholder="Enter your secret recovery phrase"
          value={phrase}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPhrase(event.target.value)}
          mainColor
          error={errorText}
        />

        {phrase.length > 0 && (
          <div className="flex justify-end w-full absolute -bottom-4 right-0">
            <Button
              onClick={() => {
                setPhrase('')
                setErrorText('')
              }}
              variant="bordered"
              color="outlined"
              size="sm"
              type="clear"
              className="w-12 h-7 mt-3 font-bold"
            >
              {t('Actions.clear')}
            </Button>
          </div>
        )}
      </div>
      <div className="flex !mt-8 justify-center">
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
