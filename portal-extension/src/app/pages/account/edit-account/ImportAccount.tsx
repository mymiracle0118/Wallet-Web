import { useWallet } from '@portal/shared/hooks/useWallet'
import { Button, CustomTypography, Form, Input, PasswordInput } from 'app/components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { goBack, useNavigate } from 'lib/woozie'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { yupResolver } from '@hookform/resolvers/yup'
import { Tooltip } from '@nextui-org/react'
import { QuestionMarkIcon, SpinnerIcon } from '@src/app/components/Icons'
import { useForm } from 'react-hook-form'
import { passwordRegex } from 'utils/constants'
import * as yup from 'yup'

const ImportAccount = () => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const schema = yup.object().shape({
    privateKey: yup.string().required(),
    password: yup
      .string()
      .required(t('Onboarding.passwordIsRequired') as string)
      .matches(passwordRegex.password, t('Onboarding.passwordRegexDontMatch') as string),
  })
  const [loading, setLoading] = useState<boolean>(false)
  const { openWallet, importPrivateKey } = useWallet()

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setError,
  } = methods

  const importAccountFromPrivateKey = useCallback(
    async (privateKey: string, password: string) => {
      await importPrivateKey(privateKey, password, 'mainnet', 'username')
      goBack()
    },
    [importPrivateKey]
  )

  const handleImportPrivateKey = useCallback(
    async (data: { privateKey: string; password: string }) => {
      setLoading(true)
      try {
        setLoading(true)
        await importAccountFromPrivateKey(data.privateKey, data.password)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setError('password', { type: 'custom', message: error.message })
      }
    },
    [openWallet, importAccountFromPrivateKey, setError]
  )

  return (
    <SinglePageTitleLayout title="Import account">
      <Form methods={methods} onSubmit={handleSubmit(handleImportPrivateKey)}>
        <div>
          <CustomTypography variant="body">{t('Account.importAccountMessage')}</CustomTypography>

          <div className="flex items-center justify-between my-4 gap-2">
            <Input fullWidth mainColor value="Private Key" placeholder="Private Key" disabled />
            <Tooltip content="Private Key" placement="top-end">
              <Button isIconOnly size="sm" variant="light" fullWidth={false}>
                <QuestionMarkIcon />
              </Button>
            </Tooltip>
          </div>
          <PasswordInput
            mainColor
            dataTestId="private-key-input"
            id="private-key"
            name="privateKey"
            placeholder="Enter your private key"
            error={errors.privateKey?.message}
            disabled={loading}
            className="mb-8"
          />
          <CustomTypography className="mt-2" type="secondary" variant="subtitle">
            {t('Account.enterPassword')}
          </CustomTypography>

          <PasswordInput
            mainColor
            id="enter-password"
            name="password"
            placeholder={t('Account.enterPassword')}
            error={errors.password?.message}
            className="mb-8"
            disabled={loading}
          />
          <div className="flex mt-4 gap-2">
            <Button color="outlined" variant="bordered" onClick={() => navigate('/home')}>
              {t('Actions.cancel')}
            </Button>
            <Button
              data-test-id="import-privatekey-btn"
              color={`${!isValid || !isDirty || loading ? 'disabled' : 'primary'}`}
              isDisabled={!isValid || !isDirty || loading}
              type="submit"
              isLoading={loading}
              spinner={<SpinnerIcon />}
            >
              {!loading && t('Actions.import')}
            </Button>
          </div>
        </div>
      </Form>
    </SinglePageTitleLayout>
  )
}
export default ImportAccount
