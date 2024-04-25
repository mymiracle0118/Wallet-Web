import { Menu } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Avatar } from '@nextui-org/react'
import { default as networkTokenList } from '@portal/shared/data/networkTokens.json'
import { AddressBookUser, useSettings } from '@portal/shared/hooks/useSettings'
import { NetworkToken } from '@portal/shared/utils/types'
import { CaretDownIcon, CloseRoundedIcon } from '@src/app/components/Icons'
import { useAppEnv } from '@src/env'
import { Button, CustomTypography, Dropdown, DropdownItem, Form, Input } from 'components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { goBack } from 'lib/woozie'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getWalletAddressRegex } from 'utils/constants'
import * as yup from 'yup'

const networkTokens = Object.values(networkTokenList).filter((token) => token.tokenType === 'Native')

const AddAddress = () => {
  const appEnv = useAppEnv()
  const { t } = useTranslation()
  const { addressBook, addToAddressBook } = useSettings()
  const [addressValue, setAddressValue] = useState<string>('')
  const [activeNetwork, setActiveNetwork] = useState<NetworkToken | null>(null)
  const [schema, setSchema] = useState<any>(null)

  useEffect(() => {
    const schema = yup.object().shape({
      address: yup
        .string()
        .required()
        .matches(getWalletAddressRegex(activeNetwork?.networkName as string), t('Actions.invalidAddress') as string)
        .test('unique-address', t('Settings.alreadyAddedSameAddress') as string, function (value) {
          return !addressBook || !addressBook.some((item) => item.address === value)
        }),
      label: yup
        .string()
        .required(t('Wallet.addLabelName') as string)
        .test('unique-label', t('Settings.alreadyAddedSameLabel') as string, function (label) {
          const lowercaseLabel = label?.toLowerCase()
          const uppercaseLabel = label?.toUpperCase()
          return (
            !addressBook ||
            !addressBook.some(
              (item) => item.username.toLowerCase() === lowercaseLabel || item.username.toUpperCase() === uppercaseLabel
            )
          )
        }),
    })
    setSchema(schema)
  }, [activeNetwork, addressBook, t])

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    register,
    setValue,
    watch,
  } = methods

  const addAddress = useCallback(
    (data: { label: string; address: string }) => {
      addToAddressBook({
        address: data.address,
        username: data.label,
        network: activeNetwork?.networkName as string,
      })
      goBack()
      setAddressValue('')
    },
    [addToAddressBook, activeNetwork]
  )

  const handleChangeNetwork = (val: string) => {
    const selected = networkTokens.find((v) => v.networkName === val) as NetworkToken
    setActiveNetwork(selected)
    setValue('address', '', { shouldValidate: true }) // Reset the address field value and trigger validation
    setAddressValue('')
  }

  const onChangeAddress = (newValue: AddressBookUser) => {
    setValue('address', newValue, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
    setAddressValue(newValue as any)
  }

  return (
    <SinglePageTitleLayout title={t('Settings.addAddressTitle')}>
      <Form methods={methods} onSubmit={handleSubmit(addAddress)}>
        <div className="space-y-4">
          <CustomTypography type="secondary">{t('Settings.addAddressSubTitle')}</CustomTypography>

          <Dropdown
            classDynamicChild="h-[16.25rem] overflow-x-hidden overflow-y-scroll w-full border border-solid border-[#424250]"
            classDynamicMenu="bg-custom-white10 mb-4 mt-6 rounded-md p-1 w-full"
            anchor={
              <Menu.Button
                data-aid="currencyDropdown"
                className={`rounded-xl flex items-center gap-2 justify-between w-full ${
                  activeNetwork?.networkName ? 'px-2 py-1' : 'p-2'
                }`}
              >
                {activeNetwork?.networkName && (
                  <Avatar
                    src={activeNetwork?.image}
                    alt={activeNetwork?.title}
                    className={`h-7 overflow-hidden rounded-full bg-custom-white ${appEnv.fullPage ? 'w-7' : 'w-8'}`}
                  />
                )}

                <CustomTypography variant="subtitle" className="w-60 text-left mr-4">
                  {activeNetwork?.networkName || 'Choose Network'}
                </CustomTypography>
                <CaretDownIcon className="w-6 h-6" />
              </Menu.Button>
            }
          >
            {networkTokens.map((network) => (
              <DropdownItem
                key={network.networkName}
                active={network.networkName === activeNetwork?.networkName}
                text={network.networkName}
                icon={network.image}
                isImg={true}
                onSelect={handleChangeNetwork}
              />
            ))}
          </Dropdown>

          <div>
            <Input
              placeholder="Address"
              mainColor
              fullWidth
              dataTestId="addAddress-address"
              dataAid="address"
              id="address"
              {...register('address')}
              value={addressValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeAddress(e.target.value as any)}
              onPaste={(e: React.ChangeEvent<HTMLInputElement>) => onChangeAddress(e.target.value as any)}
              error={addressValue !== '' ? errors.address?.message : null}
              endAdornment={
                addressValue && (
                  <Button
                    variant="flat"
                    size="sm"
                    color="transparent"
                    aria-label="toggle password visibility"
                    className="bg-transparent"
                    isIconOnly
                    onClick={() => setAddressValue('')}
                  >
                    <CloseRoundedIcon />
                  </Button>
                )
              }
            />
          </div>
          <div>
            <Input
              placeholder="Label"
              mainColor
              fullWidth
              dataTestId="addAddress-label"
              dataAid="label"
              id="label"
              {...register('label')}
              error={errors.label?.message}
              className={
                errors.username || watch('label')?.length > 15
                  ? '!text-feedback-negative !border !border-feedback-negative mt-2'
                  : 'mt-2'
              }
              endAdornment={
                <div
                  className={`text-xs ${
                    watch('label')?.length > 15 ? 'text-feedback-negative' : 'text-fotter-dark-inactive'
                  }`}
                >
                  {watch('label')?.length || 0}/15
                </div>
              }
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="bordered" color="outlined" onClick={goBack}>
              {t('Actions.cancel')}
            </Button>
            <Button
              type="submit"
              color={`${
                !isValid || !isDirty || !errors || !activeNetwork?.networkName || watch('label')?.length > 15
                  ? 'disabled'
                  : 'primary'
              }`}
              isDisabled={!isValid || !isDirty || !errors || !activeNetwork?.networkName || watch('label')?.length > 15}
              data-test-id="add-address-btn"
            >
              {t('Actions.add')}
            </Button>
          </div>
        </div>
      </Form>
    </SinglePageTitleLayout>
  )
}

export default AddAddress
