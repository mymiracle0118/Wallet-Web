import { Chip, Input } from '@nextui-org/react'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { ArrowLeftIcon } from '@src/app/components/Icons'
import { Button, CustomTypography } from 'app/components'
import OnboardingLayout from 'app/layouts/onboarding-layout/OnboardingLayout'
import { goBack, useNavigate } from 'lib/woozie'
import shuffle from 'lodash/shuffle'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const RecoveryPhrase: FC = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const { wallet, setCreateWalletProcessCompleted } = useWallet()
  const [chips, setChips] = useState<Array<{ id: number; name: string }>>([])
  const [chipsArray, setChipsArray] = useState<string[]>([])
  const [uniqueRandomIndexes, setUniqueRandomIndexes] = useState<number[]>([])
  const [phrase, setPhrase] = useState<{ id: number; name: string }[]>([])
  const [randomIndexNames, setRandomIndexName] = useState<string[]>([])

  useEffect(() => {
    if (wallet) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const words = wallet.mnemonic.phrase.split(' ').map((name: any, id: number) => ({ id: id + 1, name }))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setPhrase(words) // set phrase to get name as per words indexes
      setChips(shuffle(words))
    }
  }, [wallet])

  // Used to set dynamic value in recovery code
  useEffect(() => {
    // Function to shuffle an array in place
    function shuffleArray<T>(array: T[]): void {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]] // Swap elements
      }
    }

    // Given array
    const givenArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    // Generate an array of all possible indexes
    const allIndexes = Array.from({ length: givenArray.length }, (_, index) => givenArray[index])

    // Shuffle the array of indexes
    shuffleArray(allIndexes)

    // Take the first 3 indexes from the shuffled array
    const randomIndex = allIndexes.slice(0, 3)

    // Get name of randomIndex
    const names = randomIndex.map((index) => phrase[index - 1]?.name)

    setRandomIndexName(names)
    setUniqueRandomIndexes(randomIndex)
  }, [wallet, phrase])

  const addChip = (name: string) => {
    if (chipsArray.length < 3) {
      setChipsArray((prev) => [...prev, name])
    }
  }

  const chipName = (name: string) => chips.find((item) => item.name === name)?.name

  // Check if added wored match with recovery words to enable button
  const enableNextBtn =
    chipsArray.length === 3 &&
    chipsArray[0] === randomIndexNames[0] &&
    chipsArray[1] === randomIndexNames[1] &&
    chipsArray[2] === randomIndexNames[2]

  // Check if added wored match with recovery words to show error
  const error =
    chipsArray.length === 3 &&
    (chipsArray[0] !== randomIndexNames[0] ||
      chipsArray[1] !== randomIndexNames[1] ||
      chipsArray[2] !== randomIndexNames[2]) &&
    t('Onboarding.recoveryPhraseError')

  const clearSelectedWords = () => {
    setChipsArray([])
  }

  return (
    <OnboardingLayout disableLogo className="text-left">
      <Button isIconOnly size="sm" variant="light" onClick={goBack} className="w-5 h-5 -ml-1">
        <ArrowLeftIcon className="text-lg dark:stroke-white-40" />
      </Button>
      <CustomTypography dataAid="recoveryQuestion" variant="h1" className="pt-6">
        {t('Onboarding.verifySecretRecoveryPhrase')}
      </CustomTypography>
      <CustomTypography variant="body" className="mt-6 text-custom-white80">
        {t('Onboarding.verify3words')}
      </CustomTypography>
      <div className="flex gap-1 mt-4">
        <div className="flex items-center justify-between gap-x-3">
          <Input
            id="outlined-basic"
            value={chipsArray.length > 0 ? chipName(chipsArray[0]) : ''}
            placeholder={String(uniqueRandomIndexes[0])}
            variant="bordered"
            isReadOnly
            radius="sm"
            isInvalid={!!error}
            className="bg-custom-white10 rounded-md"
          />
          <Input
            id="outlined-basic"
            value={chipsArray.length > 1 ? chipName(chipsArray[1]) : ''}
            placeholder={String(uniqueRandomIndexes[1])}
            variant="bordered"
            isReadOnly
            radius="sm"
            isInvalid={!!error}
            className="bg-custom-white10 rounded-md"
          />
          <Input
            id="outlined-basic"
            value={chipsArray.length > 2 ? chipName(chipsArray[2]) : ''}
            placeholder={String(uniqueRandomIndexes[2])}
            variant="bordered"
            isReadOnly
            radius="sm"
            isInvalid={!!error}
            className="bg-custom-white10 rounded-md"
          />
        </div>
      </div>
      <div className="flex flex-row justify-between space-y-4">
        <CustomTypography color="text-feedback-negative" fontWeight="bold" fontSize={12} className="ml-1 mt-1">
          {error}
        </CustomTypography>
        <Button
          data-aid="clearInput"
          className="px-2 !bg-custom-grey10 h-9"
          onClick={clearSelectedWords}
          fullWidth={false}
          color="transparent"
        >
          {t('Actions.clearAll')}
        </Button>
      </div>
      <div className="grid grid-cols-4 mt-4 gap-x-2 gap-y-3">
        {chips
          ? chips.map((chip) => (
              <Chip
                data-testid={`chip-${chip.id}`}
                isDisabled={chipsArray.includes(chip.name)}
                key={chip.id}
                onClick={() => addChip(chip.name)}
                className={chipsArray.includes(chip.name) ? 'bg-custom-white40' : 'bg-custom-white10'}
                classNames={{
                  base: 'bg-custom-white10 hover:bg-custom-grey40 rounded-xl max-w-full text-center cursor-pointer',
                  content: 'text-custom-white font-medium',
                }}
              >
                {chip.name}
              </Chip>
            ))
          : null}
      </div>
      <div className="pt-8 flex gap-2">
        <Button
          data-aid="nextNavigation"
          color={`${!enableNextBtn ? 'disabled' : 'primary'}`}
          isDisabled={!enableNextBtn}
          // onClick={() => navigate('/onboarding/pro-account-video')}
          onClick={() => {
            setCreateWalletProcessCompleted(true)
            navigate('/onboarding/wallet-is-secured')
          }}
        >
          {t('Actions.verify')}
        </Button>
      </div>
    </OnboardingLayout>
  )
}

export default RecoveryPhrase
