import { yupResolver } from '@hookform/resolvers/yup'
import { Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { IPasswordPromptModalProps } from '@portal/shared/utils/types'
import { SpinnerIcon } from '@src/app/components/Icons'
import IconShield from 'assets/icons/shield.svg'
import { Button, CustomTypography, Icon, PasswordInput } from 'components'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

const PasswordPromptModal = ({
  modalState,
  closePromptModal,
  onSuccess,
  onFail,
  onPromptPassword,
  getPassword,
  responseData,
  isDismissable = true,
  buttonDisable,
}: IPasswordPromptModalProps) => {
  const { openWallet } = useWallet()
  const { t } = useTranslation()

  const schema = yup.object().shape({
    password: yup.string().required(t('Account.enterPassword') as string),
  })

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid, isDirty },
  } = methods

  const [loading, setLoading] = useState<boolean>(false)

  const handleConfirm = async (data: { password: string }) => {
    if (onPromptPassword) {
      setLoading(true)
      try {
        onPromptPassword(data.password)
      } catch (error) {
        setError('password', { type: 'custom' })
        onFail && onFail(error as Error)
      }
      setLoading(false)
    } else {
      setLoading(true)
      try {
        await openWallet(data.password)
        getPassword?.(data.password)
        onSuccess && onSuccess()
        reset()
        setLoading(false)
      } catch (error) {
        let message = 'Unknown Error'
        if (error instanceof Error) message = error.message
        setError('password', { type: 'custom', message })
        onFail && onFail(error as Error)
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (responseData && responseData.status === false) {
      let message = t('Actions.invalidPassword')
      if (responseData.data.message instanceof Error) message = responseData.data.message
      setLoading(false)
      setError('password', { type: 'custom', message })
    }
  }, [responseData])
  return (
    <Modal
      backdrop="opaque"
      isOpen={modalState}
      onClose={() => {
        closePromptModal()
        reset()
        setError('password', { type: 'custom', message: '' })
      }}
      hideCloseButton={true}
      placement="center"
      className="max-w-[20.625rem]"
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={false}
    >
      <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
        <ModalBody>
          <div className="flex flex-col items-center justify-center">
            <div className="cursor-pointer rounded-full mx-auto mb-4 text-[4rem] flex items-center justify-center">
              <Icon icon={<IconShield />} size="inherit" />
            </div>
            <CustomTypography variant="h1" className="text-center">
              {t('Security.modalPasswordConfirm')}
            </CustomTypography>
          </div>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleConfirm)}>
              <PasswordInput
                mainColor
                id="enter-password"
                placeholder={t('Onboarding.password')}
                disabled={loading}
                className="w-full"
                name="password"
                error={errors?.password?.message}
              />
              <div className="flex gap-2 mt-6">
                <Button
                  fullWidth
                  variant="bordered"
                  color="outlined"
                  onClick={() => {
                    if (!loading) {
                      closePromptModal()
                      reset()
                      setError('password', { type: 'custom', message: '' })
                    }
                  }}
                  isDisabled={buttonDisable}
                >
                  {t('Actions.cancel')}
                </Button>
                <Button
                  data-test-id="button-confirm"
                  color={`${!isDirty || !isValid || loading ? 'disabled' : 'primary'}`}
                  isDisabled={!isDirty || !isValid || loading}
                  type="submit"
                  isLoading={loading}
                  spinner={<SpinnerIcon />}
                >
                  {!loading && t('Actions.confirm')}
                </Button>
              </div>
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default PasswordPromptModal
