import { CustomTypography, Input } from 'app/components'
import EyeOff from 'assets/icons/eye-off.svg'
import Eye from 'assets/icons/eye.svg'
import classNames from 'classnames'
import { FC, useState } from 'react'
import { useFormContext } from 'react-hook-form'

export interface IPasswordInputProps {
  placeholder: string
  id?: string
  value?: string
  onChange?: (value: string) => void
  onSubmit?: () => void
  subTitle?: string
  color?: 'primary' | 'secondary' | string
  mainColor?: boolean
  disabled?: boolean
  dataAid?: string
  name: string
  className?: string
  error?: unknown
  dataTestId?: string
}
export const PasswordInput: FC<IPasswordInputProps> = ({
  id,
  subTitle,
  onSubmit,
  placeholder,
  mainColor,
  disabled,
  dataAid,
  dataTestId = 'password',
  name = 'password',
  className,
  error,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const methods = useFormContext()
  return (
    <div className={classNames('mt-4 min-h-[4.25rem]', className)}>
      <Input
        {...methods?.register(name)}
        error={error}
        dataTestId={dataTestId}
        disabled={disabled}
        dataAid={dataAid}
        id={id}
        placeholder={placeholder}
        type={showPassword ? 'text' : 'password'}
        onSubmit={onSubmit}
        mainColor={mainColor}
        fullWidth
        onPaste={(e) => {
          e.preventDefault()
          return false
        }}
        endAdornment={
          <button
            type="button"
            tabIndex={-1}
            data-aid={`${name}ShowHide`}
            aria-label="toggle password visibility"
            className="dark:stroke-custom-white stroke-custom-black w-6"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        }
      />
      {subTitle && !error && (
        <CustomTypography variant="small" color="text-custom-white80" className="mt-1 ml-1">
          {subTitle}
        </CustomTypography>
      )}
    </div>
  )
}
