import { extendVariants, Button as NextUIButton } from '@nextui-org/react'

export const Button: any = extendVariants(NextUIButton, {
  variants: {
    color: {
      primary: 'bg-gradient-to-b from-[#8927C6] to-[#B366E2] hover:bg-gradient-to-t',
      secondary: 'hover:text-primary-alt text-custom-white hover:bg-custom-white10',
      success: 'bg-success bg-success',
      warning: 'bg-warning bg-warning',
      negative: 'bg-[#FD607D] !text-[#2C2D3C]',
      outlined: 'dark:border-custom-white40 custom-text-white outline-none',
      transparent: 'bg-custom-white40',
      disabled: '!bg-[#323445] text-custom-grey40 opacity-40',
    },
    isDisabled: {
      true: 'opacity-40 !bg-custom-grey pointer-events-none cursor-not-allowed text-custom-grey40',
    },
    size: {
      xl: 'text-sm font-extrabold',
    },
    radius: {
      full: 'rounded-full',
      xl: 'rounded-xl',
      lg: 'rounded-lg',
      md: 'rounded-md',
      sm: 'rounded-sm',
      none: 'rounded-none',
    },
    fullWidth: {
      true: 'w-full',
      false: 'w-auto',
    },
    isIconOnly: {
      true: '!bg-transparent bg-none hover:from-transparent hover:to-transparent hover:opacity-60 h-auto',
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'xl',
    fullWidth: true,
    isIconOnly: false,
    radius: 'md',
  },
  compoundVariants: [
    {
      color: ['primary', 'secondary', 'success', 'warning', 'negative', 'outlined', 'transparent', 'disabled'],
      class:
        'font-extrabold rounded-md dark:text-custom-white dark:focus-visible:outline-none dark:focus:outline-none transition-all ease-in-out duration-200 h-11',
    },
  ],
})
