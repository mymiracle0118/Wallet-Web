const { nextui } = require('@nextui-org/react')
const { withTV } = require('tailwind-variants/transformer')
const plugin = require('tailwindcss/plugin')

module.exports = withTV({
  content: ['./src/**/*.{html,tsx,js,jsx}', '../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      primary: '#8927C6',
      'primary-alt': '#9E36DE',
      secondary: '#DA8FFF',
      black: '#000000',
      'gray-dark': '#273444',
      'custom-black': '#363A5B',
      'custom-grey': '#323543',
      'custom-grey100': '#607990',
      'custom-white': '#FFFFFF',
      'white-80': '#D5D5D8',
      'white-40': '#808189',
      'white-10': '#41424E',
      'surface-light': '#fff',
      'surface-hover': '#313239',
      'surface-dark': '#2C2D3B',
      'surface-dark-alt': '#1B1C24',
      'feedback-positive': '#19865F',
      'feedback-cautious': '#FF9704',
      'feedback-negative': '#FD607D',
      'footer-light-active': '#652E88',
      transparent: 'transparent',
      danger: '#FD607D',
      warning: '#FF9704',
      success: '#30D158',
    },
    borderRadius: {
      md: '8px',
      lg: '16px',
      xl: '24px',
      full: '9999px',
    },
    fontFamily: {
      sans: ['Mulish', 'sans-serif'],
    },
    fontSize: {
      xl: '1.75rem',
      lg: '1.5rem',
      md: '1.125rem',
      sm: '0.875rem',
      xs: '0.75rem',
      body: '0.875rem',
    },
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    extend: {
      colors: {
        'input-light-bg': 'rgba(96, 121, 144, 0.10)',
        'input-dark-bg': 'rgba(255, 255, 255, 0.10)',
        'custom-grey10': 'rgba(96, 121, 144, 0.1)',
        'custom-grey40': ' rgba(96, 121, 144, 0.4)',
        'custom-white10': 'rgba(255, 255, 255, 0.1)',
        'custom-white40': 'rgba(255, 255, 255, 0.4)',
        'custom-white80': 'rgba(255, 255, 255, 0.8)',
        'surface-image-overlay': 'rgba(54, 58, 91, 0.6)',
        'borders-main': 'rgba(96, 121, 144, 0.4)',
        'borders-dark': 'rgba(255, 255, 255, 0.4)',
        'footer-light-inactive': 'rgba(96, 121, 144, 0.4)',
        'fotter-dark-inactive': 'rgba(255, 255, 255, 0.4)',
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(270deg, #95CEE7 0%, #9A47CF 53.13%, #F63190 100%)',
        'gradient-dark': 'linear-gradient(270deg, #F63190 26.04%, #9A47CF 64.58%, #95CEE7 100%)',
        'gradient-alt': 'linear-gradient(286deg, #FF95C8 16.67%, #F63190 99.00%)',
        'gradient-bg': 'linear-gradient(281deg, #F63190 0%, #9A47CF 47.40%, #95CEE7 100%)',
        'gradient-text': 'linear-gradient(350deg, #E43FFF 86.42%, #DA8FFF 25.22%)',
        'gradientLogo-bg': 'linear-gradient(293.34deg, #652E88 9.32%, #F63190 84.93%)',
        'gradient-primary': 'linear-gradient(319deg, #E43FFF 25.22%, #DA8FFF 86.42%)',
        'gradient-button': 'linear-gradient(180deg, #8927C6 25.22%, #B366E2 88.42%)',
        'gradient-checkbox': 'linear-gradient(319deg, #E43FFF 25.22%, #DA8FFF 86.42%)',
        'gradient-pro':
          'linear-gradient(327deg, rgba(246, 49, 144, 0.10) 40.11%, rgba(154, 71, 207, 0.10) 60.91%, rgba(149, 206, 231, 0.10) 84%)',
        check: "url('assets/icons/check-path.svg')",
      },
      boxShadow: {
        sm: 'inset 0px -1px 0px rgba(255, 255, 255, 0.1)',
        md: '0px 0px 12px rgb(0 0 0 / 20%)',
        footer: 'inset 0px 1px 0px rgba(0, 0, 0, 0.05)',
        tooltip: '0px 0px 12px 4px rgba(0, 0, 0, 0.50)',
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            'surface-dark': '#ffffff',
          },
        },
        dark: {
          colors: {
            primary: '#8927C6',
            secondary: '#DA8FFF',
            black: '#000000',
            'primary-alt': '#9E36DE',
            'gray-dark': '#273444',
            'custom-black': '#363A5B',
            'custom-grey': '#323543',
            'custom-grey100': '#607990',
            'custom-white': '#FFFFFF',
            'white-80': '#D5D5D8',
            'white-40': '#808189',
            'white-10': '#41424E',
            'surface-light': '#fff',
            'surface-hover': '#313239',
            'surface-dark': '#2C2D3B',
            'surface-dark-alt': '#1B1C24',
            'feedback-positive': '#19865F',
            'feedback-cautious': '#FF9704',
            'feedback-negative': '#FD607D',
            'footer-light-active': '#652E88',
            transparent: 'transparent',
            danger: '#FD607D',
            warning: '#FF9704',
            success: '#30D158',
          },
          backgroundImage: {
            'gradient-light': 'linear-gradient(270deg, #95CEE7 0%, #9A47CF 53.13%, #F63190 100%)',
            'gradient-dark': 'linear-gradient(270deg, #F63190 26.04%, #9A47CF 64.58%, #95CEE7 100%)',
            'gradient-alt': 'linear-gradient(286deg, #FF95C8 16.67%, #F63190 99.00%)',
            'gradient-bg': 'linear-gradient(281deg, #F63190 0%, #9A47CF 47.40%, #95CEE7 100%)',
            'gradient-text': 'linear-gradient(350deg, #E43FFF 86.42%, #DA8FFF 25.22%)',
            'gradientLogo-bg': 'linear-gradient(293.34deg, #652E88 9.32%, #F63190 84.93%)',
            'gradient-primary': 'linear-gradient(319deg, #E43FFF 25.22%, #DA8FFF 86.42%)',
            'gradient-button': 'linear-gradient(180deg, #8927C6 25.22%, #B366E2 88.42%)',
            'gradient-checkbox': 'linear-gradient(319deg, #E43FFF 25.22%, #DA8FFF 86.42%)',
            'gradient-pro':
              'linear-gradient(327deg, rgba(246, 49, 144, 0.10) 40.11%, rgba(154, 71, 207, 0.10) 60.91%, rgba(149, 206, 231, 0.10) 84%)',
            check: "url('assets/icons/check-path.svg')",
          },
          boxShadow: {
            sm: 'inset 0px -1px 0px rgba(255, 255, 255, 0.1)',
            md: '0px 0px 12px rgb(0 0 0 / 20%)',
            footer: 'inset 0px 1px 0px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    }),
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: {
          fontSize: theme('fontSize.xl'),
          fontWeight: theme('fontWeight.extrabold'),
        },
        h2: {
          fontSize: theme('fontSize.lg'),
          fontWeight: theme('fontWeight.light'),
        },
        h3: {
          fontSize: theme('fontSize.md'),
          fontWeight: theme('fontWeight.extrabold'),
        },
        h4: {
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.extrabold'),
        },
        h5: {
          fontSize: theme('fontSize.xs'),
          fontWeight: theme('fontWeight.extrabold'),
        },
        h6: {
          fontSize: theme('fontSize.body'),
          fontWeight: theme('fontWeight.regular'),
        },
        p: {
          fontSize: theme('fontSize.xs'),
          fontWeight: theme('fontWeight.regular'),
        },
        small: {
          fontSize: theme('fontSize.extraSmall'),
          fontWeight: theme('fontWeight.regular'),
        },
      })
    }),
  ],
})
