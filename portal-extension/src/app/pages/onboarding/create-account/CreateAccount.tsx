import { yupResolver } from '@hookform/resolvers/yup'
import { Checkbox, Link } from '@nextui-org/react'
import { default as assetsDefaultList } from '@portal/shared/data/assets.json'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useSessionStore } from '@portal/shared/hooks/useSessionStore'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { OnBoardingTypes, useWallet } from '@portal/shared/hooks/useWallet'
import { encryptData } from '@portal/shared/services/EncryptionService'
import { ICreateAccountProps } from '@portal/shared/utils/types'
import { ArrowLeftIcon, CheckboxIcon, SpinnerIcon } from '@src/app/components/Icons'
import { passwordRegex } from '@src/utils/constants'
import { Button, CustomTypography, Form, Input, PasswordInput } from 'app/components'
import { createLocationState, goBack, useNavigate } from 'lib/woozie'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

const CreateAccount = ({ importWallet = false }: ICreateAccountProps) => {
  const { t } = useTranslation()

  const { navigate } = useNavigate()
  const {
    username: storedUsername,
    setUsername,
    createWallet,
    storeWallet,
    wallet,
    clearWallet,
    setCreateWalletProcessCompleted,
    onboardingBy,
    defaultOnboardingNetwork,
    isAccountCreatedByPrivateKey,
    setOnboardingBy,
  } = useWallet()

  const schema = yup.object().shape({
    username: yup
      .string()
      .min(3, t('Account.usernameMinimum') as string)
      .required(t('Account.usernameRequired') as string)
      .matches(/^\S*$/, t('Account.usernameNoSpace') as string),
    password: yup
      .string()
      .required(t('Onboarding.passwordIsRequired') as string)
      .matches(passwordRegex.password, t('Onboarding.passwordRegexDontMatch') as string),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], t('Onboarding.passwordDontMatch') as string),
  })

  // Conditionally add validation for checkTerms based on onboardingBy value
  const schemaTerms = schema.test('conditional-validation', '', function (value, validationContext) {
    const { createError } = validationContext

    if (onboardingBy === OnBoardingTypes.fileRecovery) {
      return true // No validation needed if onboardingBy is 'fileRecovery'
    } else {
      // Validate checkTerms field
      const { checkTerms } = value || {}
      if (!checkTerms) {
        return createError({
          message: t('Onboarding.termsAndConditions') as string,
          path: 'checkTerms',
        })
      }
    }
    return true // Validation passed
  })

  const { saveAccount, getNewAccountId } = useSettings()
  const { setPassword } = useSessionStore()
  const [loading, setLoading] = useState<boolean>(false)
  const { pathname } = createLocationState()
  const paths = pathname.split('/')
  const isCreateAccount = paths[paths.length - 2] === 'onboarding'
  const network: string = paths[paths.length - 1]

  const [isTermsConditionsChecked, setIsTermsConditionsChecked] = useState<boolean>(false)

  const methods = useForm({
    resolver: yupResolver(schemaTerms),
    mode: 'onChange',
    context: { onboardingBy: onboardingBy }, // Pass onboardingBy value to the context
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
    watch,
  } = methods

  const onCreateAccount = useCallback(
    async (data: { username: string; password: string }) => {
      setLoading(true)
      const username = storedUsername || data.username
      const accountId = getNewAccountId()
      const networkName: string = isAccountCreatedByPrivateKey ? network : (defaultOnboardingNetwork as string)
      if (!isCreateAccount) {
        setPassword(data.password)
        setUsername(username)

        if (
          network &&
          (network === 'ETH' || network === 'APT' || network === 'SUI' || network === 'SOL' || network === 'SUPRA')
        ) {
          const { wallet, encryptedPrivateKey: privateKey, address } = useWallet.getState()
          const walletAddress = address as string
          if (!wallet) {
            throw new Error('no wallet created')
          }
          const encryptedPrivateKey = encryptData(JSON.stringify(privateKey), data.password)
          await storeWallet({ address: walletAddress }, username, data.password, networkName, accountId)
            .then(async () => {
              saveAccount({
                id: accountId,
                username,
                address: walletAddress,
                encryptedPrivateKey,
                networkName,
                isPrimary: true,
              })
              if (network === 'APT') {
                await storeWallet({ address: walletAddress }, '', '', 'SUPRA', accountId).then()
              }
              if (network === 'SUPRA') {
                await storeWallet({ address: walletAddress }, '', '', 'APT', accountId).then()
              }
            })
            .catch((e: Error) => console.log(e.message))
          setCreateWalletProcessCompleted(true)
          setOnboardingBy(OnBoardingTypes.privateKey)
          navigate('/onboarding/congratulations')
        } else {
          const { wallet, encryptedPrivateKey: privateKey } = useWallet.getState()
          const walletAddress = wallet?.address as string
          if (!wallet) {
            throw new Error('no wallet created')
          }
          const encryptedWallet = encryptData(wallet?.mnemonic?.phrase, data.password)
          const encryptedPrivateKey = encryptData(JSON.stringify(privateKey), data.password)

          await storeWallet({ address: walletAddress }, username, data.password, networkName, accountId)
            .then(() => {
              saveAccount({
                id: accountId,
                username,
                address: walletAddress,
                encryptedWallet,
                encryptedPrivateKey,
                networkName,
                isPrimary: true,
              })

              // Create supra wallet
              setTimeout(async () => {
                const { wallet: supWallet, derivationPathIndex } = await NetworkFactory.checkAndCreateNextDeriveWallet(
                  wallet.mnemonic.phrase as string,
                  'SUPRA'
                )
                await storeWallet(
                  { address: supWallet.address, derivationPathIndex },
                  '',
                  data.password,
                  'SUPRA',
                  accountId
                )
              }, 1000)
            })

            .catch((e: Error) => console.log(e.message))
          setCreateWalletProcessCompleted(true)
          if (onboardingBy === '') {
            setOnboardingBy(OnBoardingTypes.recoveryPhrase)
          }

          navigate('/onboarding/congratulations')
        }
      } else {
        const networkFactory = NetworkFactory.selectByNetworkId(defaultOnboardingNetwork as string)
        await clearWallet().then()
        setPassword(data.password)
        setUsername(username)
        networkFactory
          .createWallet()
          .then(({ wallet, encryptedPrivateKey: privateKey }) => {
            const encryptedWallet = encryptData(wallet?.mnemonic?.phrase, data.password)
            const encryptedPrivateKey = encryptData(JSON.stringify(privateKey), data.password)

            const walletAddress = wallet?.address as string
            storeWallet(
              { address: walletAddress },
              data.username,
              data.password,
              defaultOnboardingNetwork as string,
              accountId
            )
              .then(() => {
                saveAccount({
                  id: accountId,
                  username,
                  address: walletAddress,
                  networkName,
                  encryptedWallet,
                  encryptedPrivateKey,
                  isPrimary: true,
                })
                setTimeout(async () => {
                  const { wallet: supWallet, derivationPathIndex } =
                    await NetworkFactory.checkAndCreateNextDeriveWallet(wallet.mnemonic.phrase as string, 'SUPRA')
                  await storeWallet(
                    { address: supWallet.address, derivationPathIndex },
                    '',
                    data.password,
                    'SUPRA',
                    accountId
                  )
                }, 1000)
              })
              .catch((e: Error) => console.log(e.message))
            setOnboardingBy(OnBoardingTypes.createdAccount)
            navigate('/onboarding/recovery-options')
          })
          .catch((e: Error) => {
            console.log(e.message)
          })
      }
      setLoading(false)
    },
    [createWallet, storeWallet, saveAccount, navigate, wallet, assetsDefaultList] // eslint-disable-line
  )

  const termsAndServicesLink = (
    <u>
      <Link
        href="/terms"
        target="_blank"
        className="text-secondary text-sm font-bold decoration-secondary underline underline-offset-2"
      >
        {t('Onboarding.termOfService')}
      </Link>
    </u>
  )
  const acceptTearmConditions = (e: boolean) => {
    setValue('checkTerms', e, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    setIsTermsConditionsChecked(e)
  }

  return (
    <div className="p-8">
      {importWallet ? (
        <>
          <CustomTypography dataAid="accountCreationHead" className="mb-4 -tracking-[0.018rem]" variant="h3">
            <Button isIconOnly size="sm" variant="light" onClick={goBack} className="w-5 h-5 -ml-1 mr-2">
              <ArrowLeftIcon className="text-lg dark:stroke-white-40" />
            </Button>
            {onboardingBy === '' ? t('Onboarding.createAccount') : t('Onboarding.setupNetPassword')}
          </CustomTypography>
          <div className="space-y-4 mb-8">
            <CustomTypography
              dataAid="creationSubHead"
              className="text-body leading-5 tracking-tight"
              color="dark:text-custom-white80 text-custom-grey100"
            >
              {t('Onboarding.createAccountSubTitle')}
            </CustomTypography>
            {network === 'create' ? (
              <CustomTypography
                dataAid="creationSubHead"
                className="text-body leading-5 tracking-tight"
                color="dark:text-custom-white80 text-custom-grey100"
              >
                {t('Onboarding.importAccountImportPhraseCreateDown')}
              </CustomTypography>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <CustomTypography dataAid="accountCreationHead" className="mb-4 pt-4 -tracking-[0.018rem]" variant="h1">
            {t('Onboarding.createAccount')}
          </CustomTypography>
          <CustomTypography
            dataAid="creationSubHead"
            className="text-body mb-6 pr-2 leading-5 tracking-tight"
            color="dark:text-custom-white80 text-custom-grey100"
          >
            {t('Onboarding.createAccountSubTitle')}
          </CustomTypography>
        </>
      )}
      <Form methods={methods} onSubmit={handleSubmit(onCreateAccount)}>
        <>
          <div className="min-h-[4.25rem]">
            <Input
              dataAid="username"
              mainColor
              id="username"
              {...register('username')}
              dynamicColor={'text-feedback-negative'}
              error={errors.username?.message}
              placeholder={t('Onboarding.accountName') as string}
              className={
                errors.username || watch('username')?.length > 15
                  ? '!text-feedback-negative !border !border-feedback-negative'
                  : ''
              }
              endAdornment={
                <div
                  className={`text-xs ${
                    watch('username')?.length > 15 ? 'text-feedback-negative' : 'text-fotter-dark-inactive'
                  }`}
                >
                  {watch('username')?.length || 0}/15
                </div>
              }
            />
          </div>

          <PasswordInput
            mainColor
            dataAid="password"
            id="set-password"
            name="password"
            placeholder={t('Onboarding.setPassword')}
            error={errors.password?.message}
          />
          <PasswordInput
            mainColor
            dataAid="confirmPassword"
            name="confirmPassword"
            id="confirm-password"
            placeholder={t('Onboarding.confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          {onboardingBy === '' && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <Checkbox
                  size="lg"
                  radius="sm"
                  icon={<CheckboxIcon />}
                  onValueChange={(e) => acceptTearmConditions(e)}
                  isSelected={isTermsConditionsChecked}
                >
                  <span className="text-sm font-bold">{t('Onboarding.agreefortermsAndConditions')}</span>
                </Checkbox>
                &nbsp;{termsAndServicesLink}
              </div>
            </div>
          )}
          <div className="mt-8 flex gap-2">
            <Button
              id="create-next-btn"
              data-aid="nextNavigation"
              type="submit"
              color={`${
                !isDirty || !isValid || loading || errors.username || watch('username')?.length > 15
                  ? 'disabled'
                  : 'primary'
              }`}
              isDisabled={!isDirty || !isValid || loading || errors.username || watch('username')?.length > 15}
              isLoading={loading}
              spinner={<SpinnerIcon />}
            >
              {!loading && t(`${importWallet ? 'Actions.done' : 'Actions.next'}`)}
            </Button>
          </div>
        </>
      </Form>
    </div>
  )
}

export default CreateAccount
