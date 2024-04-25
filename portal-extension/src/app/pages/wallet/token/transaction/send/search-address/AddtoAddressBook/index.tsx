import { Checkbox } from '@nextui-org/react'
import { IAddtoAddressBook } from '@portal/shared/utils/types'
import { CheckboxIcon } from '@src/app/components/Icons'
import { CustomTypography, Input } from 'components'
import { useTranslation } from 'react-i18next'

const AddtoAddressBook = ({
  isAddressBookChecked,
  setIsAddressBookChecked,
  register,
  errorMsg,
  watch,
}: IAddtoAddressBook) => {
  const { t } = useTranslation()
  return (
    <div className="rounded-lg border border-solid border-custom-white10 p-4 mt-4">
      <Checkbox
        isSelected={isAddressBookChecked}
        onValueChange={setIsAddressBookChecked}
        size="lg"
        radius="sm"
        icon={<CheckboxIcon />}
      >
        <CustomTypography variant="subtitle">{t('Token.addToAddressBook')}</CustomTypography>
      </Checkbox>
      <div className={`${isAddressBookChecked ? 'block' : 'hidden'} mt-2 transition-all ease-in-out duration-200`}>
        <Input
          type="text"
          fullWidth
          mainColor
          placeholder="Label"
          dataTestId="addAddress-label"
          dataAid="label"
          id="label"
          {...register('label')}
          error={errorMsg}
          endAdornment={
            <div
              className={`text-xs ${
                watch('label')?.length > 15 ? 'text-feedback-negative' : 'text-fotter-dark-inactive'
              }`}
            >
              {watch('label')?.length || 0}/15
            </div>
          }
          className={watch('label')?.length > 15 ? '!text-feedback-negative !border !border-feedback-negative' : ''}
        />
      </div>
    </div>
  )
}

export default AddtoAddressBook
