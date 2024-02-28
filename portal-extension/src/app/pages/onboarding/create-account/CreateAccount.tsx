import { yupResolver } from '@hookform/resolvers/yup'
import { Checkbox, Link } from '@nextui-org/react'
import { default as assetsDefaultList } from '@portal/shared/data/assets.json'
import { NetworkFactory } from '@portal/shared/factory/network.factory'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { CheckboxIcon, SpinnerIcon } from '@src/app/components/Icons'
import { Button, CustomTypography, Form, Input, PasswordInput } from 'app/components'
import defaultAvatar from 'assets/images/Avatar.png'
import { createLocationState, goBack, useNavigate } from 'lib/woozie'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

type CreateAccountProps = {
  importWallet?: boolean
}

const CreateAccount = ({ importWallet = false }: CreateAccountProps) => {
  const { t } = useTranslation()
  const schema = yup.object().shape({
    username: !importWallet
      ? yup
          .string()
          .min(3, t('Account.usernameMinimum'))
          .max(15, t('Account.usernameMaximum'))
          .required(t('Account.usernameRequired'))
          .matches(/^\S*$/, t('Account.usernameNoSpace'))
      : yup
          .string()
          .min(3, t('Account.usernameMinimum'))
          .max(15, t('Account.usernameMaximum'))
          .notRequired()
          .matches(/^\S*$/, t('Account.usernameNoSpace')),
    password: yup
      .string()
      .min(8)
      .max(32)
      .required()
      .test('no-only-spaces', t('Account.passwordSpace'), (value) => {
        return value && !/^[\s]*$/.test(value)
      }),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'passwords must match'),
    checkTerms: yup
      .boolean()
      .required('You must agree to the terms and conditions.')
      .oneOf([true], 'You must agree to the terms and conditions.'),
  })

  const { navigate } = useNavigate()
  const { username: storedUsername, createWallet, storeWallet, avatar, wallet } = useWallet()
  const { saveAccount } = useSettings()
  const { defaultOnboardingNetwork, isAccountCreatedByPrivateKey } = useWallet()
  const [loading, setLoading] = useState<boolean>(false)
  const { pathname } = createLocationState()
  const paths = pathname.split('/')
  const isCreateAccount = paths[paths.length - 2] === 'onboarding'
  const network: string = paths[paths.length - 1]

  const [isTermsConditionsChecked, setIsTermsConditionsChecked] = useState<boolean>(false)

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
    watch,
  } = methods

  // useEffect(() => {
  //   saveAccount() // call to get wallet details
  // }, [wallet])

  const onCreateAccount = useCallback(
    async (data: { username: string; password: string }) => {
      setLoading(true)
      const username = storedUsername || data.username

      const networkName: string = isAccountCreatedByPrivateKey ? network : (defaultOnboardingNetwork as string)

      // username, address, networkName
      if (!isCreateAccount) {
        if (
          network &&
          (network === 'ETH' || network === 'APT' || network === 'SUI' || network === 'SOL' || network === 'SUPRA')
        ) {
          const { wallet, encryptedPrivateKey, address } = useWallet.getState()
          const walletAddress = address as string
          if (!wallet) {
            throw new Error('no wallet created')
          }
          await storeWallet({ wallet, address: walletAddress, encryptedPrivateKey }, username, data.password, network)
            .then(() => saveAccount(username, walletAddress, networkName, true))
            .catch((e: Error) => console.log(e.message))
          navigate('/onboarding/congratulations')
        } else {
          const { wallet, encryptedPrivateKey } = useWallet.getState()
          const walletAddress = wallet?.address as string
          if (!wallet) {
            throw new Error('no wallet created')
          }
          await storeWallet(
            { wallet, address: walletAddress, encryptedPrivateKey },
            username,
            data.password,
            networkName
          )
            .then(() => saveAccount(username, walletAddress, networkName, true))
            .catch((e: Error) => console.log(e.message))
          navigate('/onboarding/congratulations')
        }
      } else {
        const networkFactory = NetworkFactory.selectByNetworkId(defaultOnboardingNetwork as string)
        networkFactory
          .createWallet()
          .then(({ wallet, encryptedPrivateKey }) => {
            const walletAddress = wallet?.address as string
            // // createWallet()
            storeWallet(
              { wallet, address: walletAddress, encryptedPrivateKey },
              data.username,
              data.password,
              defaultOnboardingNetwork as string
            )
              .then(() => saveAccount(username, walletAddress, networkName, true))
              .catch((e: Error) => console.log(e.message))
            navigate('/onboarding/demo-video')
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
        Terms of Service
      </Link>
    </u>
  )
  const acceptTearmConditions = (e: boolean) => {
    setValue('checkTerms', e, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    setIsTermsConditionsChecked(e)
  }

  return (
    <div className="p-8">
      <Form methods={methods} onSubmit={handleSubmit(onCreateAccount)}>
        <>
          <CustomTypography dataAid="accountCreationHead" className="mb-4 -tracking-[0.018rem]" variant="h3">
            {t('Onboarding.createAccount')}
          </CustomTypography>
          <CustomTypography
            dataAid="creationSubHead"
            className="text-body mb-6 pr-2 leading-5 tracking-tight"
            color="dark:text-custom-white80 text-custom-grey100"
          >
            {t('Onboarding.createAccountSubTitle')}
          </CustomTypography>

          {importWallet && storedUsername ? (
            <div className="flex gap-2 items-center h-[4.25rem]">
              <img
                src={avatar || defaultAvatar}
                alt="default-avatar"
                className="overflow-hidden h-8 w-8 rounded-full"
              />

              <CustomTypography dataAid="walletName" variant="subtitle">
                {storedUsername}
              </CustomTypography>
            </div>
          ) : (
            <div className="min-h-[4.25rem]">
              <Input
                dataAid="userName"
                mainColor
                id="username"
                {...register('username')}
                dynamicColor={'text-feedback-negative'}
                error={errors.username?.message}
                placeholder={t('Onboarding.accountName')}
                endAdornment={
                  <div
                    className={`text-[12px] ${
                      watch('username')?.length > 15 ? 'text-feedback-negative' : 'text-fotter-dark-inactive'
                    }`}
                  >
                    {watch('username')?.length || 0}/15
                  </div>
                }
              />
            </div>
          )}

          <PasswordInput
            mainColor
            dataAid="password"
            id="set-password"
            name="password"
            placeholder={t('Onboarding.setPassword')}
            error={errors.password?.message}
            subTitle={'Min 8 characters'}
          />
          <PasswordInput
            mainColor
            dataAid="confirmPassword"
            name="confirmPassword"
            id="confirm-password"
            placeholder={t('Onboarding.confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <Checkbox
                size="lg"
                radius="sm"
                icon={<CheckboxIcon />}
                onValueChange={(e) => acceptTearmConditions(e)}
                isSelected={isTermsConditionsChecked}
              >
                <span className="text-sm font-bold">I agree to the</span>
              </Checkbox>
              &nbsp;{termsAndServicesLink}
            </div>
          </div>
          <div className="mt-8 flex gap-2">
            <Button data-aid="backNavigation" variant="bordered" color="outlined" onClick={() => goBack()}>
              {t('Actions.back')}
            </Button>
            <Button
              id="create-next-btn"
              data-aid="nextNavigation"
              type="submit"
              color={`${!isDirty || !isValid || loading ? 'disabled' : 'primary'}`}
              isDisabled={!isDirty || !isValid || loading}
              isLoading={loading}
              spinner={<SpinnerIcon />}
            >
              {!loading && t('Actions.next')}
            </Button>
          </div>
        </>
      </Form>
    </div>
  )
}

export default CreateAccount
