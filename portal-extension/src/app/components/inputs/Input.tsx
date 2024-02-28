import { extendVariants, Input as NextUIInput } from '@nextui-org/react'

export const Input: any = extendVariants(NextUIInput, {
  variants: {
    color: {
      stone: {
        inputWrapper: [
          'bg-custom-white10',
          'border-custom-white10',
          'transition-colors',
          'focus-within:bg-custom-white10',
          'data-[hover=true]:border-custom-white10',
          'data-[hover=true]:bg-zinc-100',
          'group-data-[focus=true]:border-custom-white10',
          'data-[hover=true]:bg-custom-white10',
        ],
        input: ['text-custom-white rounded-md', 'placeholder:text-custom-white40', 'text-sm font-extrabold'],
      },
    },
    radius: {
      sm: {
        inputWrapper: 'rounded-md',
      },
    },
    textSize: {
      base: {
        input: 'text-sm font-extrabold',
      },
    },
    removeLabel: {
      true: {
        label: 'hidden',
      },
      false: {},
    },
  },
  defaultVariants: {
    color: 'stone',
    textSize: 'base',
    removeLabel: true,
  },
})
