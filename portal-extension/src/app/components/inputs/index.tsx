import { default as classNames, default as classnames } from 'classnames'
import { CustomTypography } from 'components'
import React, { ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'
import { CrossRoundedRed } from '../Icons'

interface IInputProps extends ComponentProps {
  placeholder?: string
  id?: string
  dataTestId?: string
  icon?: ReactNode
  mainColor?: boolean
  endAdornment?: ReactNode
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onPaste?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  onFocus?: React.FocusEventHandler<HTMLDivElement>
  onBlur?: React.FocusEventHandler<HTMLDivElement>
  onClick?: React.MouseEventHandler<HTMLDivElement>
  onSubmit?: () => void
  value?: ReactNode
  type?: string
  fullWidth?: boolean
  disabled?: boolean
  errorIcon?: boolean
  multiline?: number
  dataAid?: string
  name?: string
  error?: unknown
  step?: string
  style?: React.CSSProperties
  dynamicColor?: string
  autoComplete?: string
}

export const Input = ({
  className,
  placeholder,
  id,
  style,
  icon,
  mainColor,
  endAdornment,
  onChange,
  onPaste,
  onClick,
  value,
  type,
  fullWidth,
  disabled,
  multiline,
  dataTestId,
  onFocus,
  onBlur,
  onSubmit,
  dataAid,
  error,
  name = 'test',
  dynamicColor,
  step,
  autoComplete,
  errorIcon = true,
}: IInputProps) => {
  const inputProps = {
    className: classNames(
      'outline-none	py-3.5 px-3.5 w-full text-sm text-custom-black dark:text-custom-white bg-transparent'
    ),
    onChange: onChange,
    onPaste: onPaste,
    onClick: onClick,
    onFocus: onFocus,
    onBlur: onBlur,
    type: type,
    rows: multiline,
    id: id,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    step: step,
    autoComplete,
  }

  const methods = useFormContext()
  const handleSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.key === 'Enter' && onSubmit) {
      onSubmit()
    }
  }
  return (
    <>
      <div
        style={!!error && error != 'Available' ? { border: '1.5px solid #FD607D' } : {}}
        className={classNames(
          'flex relative rounded-md items-center hover:shadow-md border border-solid border-transparent',
          fullWidth ? 'w-full' : 'w-auto',
          mainColor ? 'bg-input-light-bg dark:bg-custom-white10' : 'bg-transparent',
          className ? className : ''
        )}
      >
        {multiline ? (
          <textarea
            {...methods?.register(name)}
            {...inputProps}
            rows={multiline}
            data-testid={dataTestId}
            onKeyDown={handleSubmit}
            cols={multiline}
            style={style}
            className=" w-full text-h4 p-3 resize-none bg-transparent focus:outline-none dark:text-custom-white80 "
          />
        ) : (
          <>
            <input
              {...methods?.register(name)}
              {...inputProps}
              data-testid={dataTestId}
              onKeyDown={handleSubmit}
              data-aid={dataAid}
              autoComplete="off"
              onWheel={(e) => e.target.blur()}
              className={classnames(inputProps.className, 'bg-transparent text-h4 placeholder:font-extrabold ')}
            />
          </>
        )}
        {(icon || endAdornment) && <div className="pr-2.5 flex items-center">{icon || endAdornment}</div>}
      </div>
      {error && (
        <CustomTypography
          color={dynamicColor ?? 'text-feedback-negative'}
          className="mt-1 text-left font-normal flex items-center"
          variant="small"
        >
          {errorIcon && <CrossRoundedRed className="mr-1 w-3 h-3" />}
          <span className="w-[95%]">{error as string}</span>
        </CustomTypography>
      )}
    </>
  )
}
