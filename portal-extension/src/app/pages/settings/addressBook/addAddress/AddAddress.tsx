import { Menu } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { default as networkAssets } from '@portal/shared/data/networks.json'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { listNetwork } from '@portal/shared/hooks/useWallet'
import { CloseRoundedIcon } from '@src/app/components/Icons'
import { Button, CustomTypography, Dropdown, DropdownItem, Form, Icon, Input } from 'components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { goBack } from 'lib/woozie'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import DropDownIcon from '../../../../../../public/images/backgrounds/dropdown_icon.svg'

const schema = yup.object().shape({
  address: yup.string().required(),
  label: yup.string().required(),
})

const AddAddress = () => {
  const { t } = useTranslation()
  const { addToAddressBook } = useSettings()
  const [addressValue, setAddressValue] = useState<string>('')
  const [activeNetwork, setActiveNetwork] = useState<string>(networkAssets[0].networkId)

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    register,
  } = methods

  const addAddress = useCallback(
    (data: { label: string; address: string }) => {
      addToAddressBook({
        address: data.address,
        username: data.label,
        network: activeNetwork,
      })
      goBack()
      setAddressValue('')
    },
    [addToAddressBook, activeNetwork]
  )

  const handleChangeNetwork = (val: string) => {
    const selected = networkAssets.find((v) => v.name === val) as listNetwork
    setActiveNetwork(selected.networkId)
  }

  return (
    <SinglePageTitleLayout title={t('Settings.addAddressTitle')}>
      <Form methods={methods} onSubmit={handleSubmit(addAddress)}>
        <div className="space-y-4">
          <CustomTypography type="secondary">{t('Settings.addAddressSubTitle')}</CustomTypography>

          <Dropdown
            classDynamicChild="h-[16.25rem] overflow-x-hidden overflow-y-scroll w-full border border-solid border-[#424250]"
            classDynamicMenu="bg-custom-white10 mb-4 mt-6 rounded-md p-1 !table"
            anchor={
              <Menu.Button data-aid="currencyDropdown" className="p-2 rounded-xl flex items-center gap-2">
                <img alt="icon" src={activeNetwork?.image} className="h-6 rounded-full" />

                <CustomTypography variant="subtitle" className="w-60 text-left mr-4">
                  {activeNetwork?.name}
                </CustomTypography>
                <Icon size="small" icon={<DropDownIcon />} />
              </Menu.Button>
            }
          >
            {networkAssets.map((network) => (
              <DropdownItem
                key={network.name}
                active={network.name === activeNetwork?.name}
                text={network.name}
                icon={network.image}
                isImg={true}
                onSelect={handleChangeNetwork}
              />
            ))}
          </Dropdown>

          <Input
            placeholder="Address"
            mainColor
            fullWidth
            dataTestId="addAddress-address"
            dataAid="address"
            id="address"
            {...register('address')}
            value={addressValue}
            onChange={(e) => setAddressValue(e.target.value)}
            error={errors.address?.message}
            endAdornment={
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
            }
          />
          <Input
            placeholder="Label"
            mainColor
            fullWidth
            className="mt-2"
            dataTestId="addAddress-label"
            dataAid="label"
            id="label"
            {...register('label')}
            error={errors.label?.message}
          />
          <div className="flex gap-2 pt-4">
            <Button variant="bordered" color="outlined" onClick={goBack}>
              {t('Actions.cancel')}
            </Button>
            <Button
              type="submit"
              color={`${!isValid || !isDirty ? 'disabled' : 'primary'}`}
              isDisabled={!isValid || !isDirty}
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
