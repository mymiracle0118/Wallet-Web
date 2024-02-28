export interface ICOLORSProps {
  main: {
    primary: string
    primaryAlt: string
    secondary: string
  }
  background: {
    gradientLight: string
    gradientDark: string
    gradientAlt: string
    gradientBg: string
    gradientLogoBg: string
    inputLightBg: string
    inputDarkBg: string
  }
  custom: {
    black: string
    grey: string
    grey10: string
    grey40: string
    grey100: string
    white: string
    white10: string
    white40: string
    white80: string
  }
  surface: {
    light: string
    dark: string
    darkAlt: string
    imageOverlay: string
  }
  feedback: {
    positive: string
    negative: string
  }
  borders: {
    main: string
    dark: string
  }
  footer: {
    lightActive: string
    lightInactive: string
    darkInactive: string
  }
}

export const COLORS: ICOLORSProps = {
  main: {
    primary: '#652E88',
    primaryAlt: '#AA3789',
    secondary: '#F63190',
  },
  background: {
    gradientLight: 'linear-gradient(270deg, #652E88 0%, #F63190 100%)',
    gradientDark: 'linear-gradient(270deg, #F63190 26.04%, #652E88 100%)',
    gradientAlt: 'linear-gradient(319deg, #E43FFF 25.22%, #DA8FFF 86.42%)',
    gradientBg: 'linear-gradient(326.94deg, #F63190 40.11%, #652E88 84%)',
    gradientLogoBg: 'linear-gradient(293.34deg, #652E88 9.32%, #F63190 84.93%)',
    inputLightBg: 'rgba(96, 121, 144, 0.1)',
    inputDarkBg: 'rgba(0, 0, 0, 0.2)',
  },
  custom: {
    black: '#363A5B',
    grey: '#607990',
    grey10: 'rgba(96, 121, 144, 0.1)',
    grey40: ' rgba(96, 121, 144, 0.4)',
    grey100: '#607990',
    white: '#fff',
    white10: 'rgba(255, 255, 255, 0.1)',
    white40: 'rgba(255, 255, 255, 0.4)',
    white80: 'rgba(255, 255, 255, 0.8)',
  },
  surface: {
    light: '#fff',
    dark: '#2C2D3C',
    darkAlt: '#1B1C24',
    imageOverlay: 'rgba(54, 58, 91, 0.6)',
  },
  feedback: {
    positive: '#19865F',
    negative: '#EB0046',
  },
  borders: {
    main: 'rgba(96, 121, 144, 0.4)',
    dark: 'rgba(255, 255, 255, 0.4)',
  },
  footer: {
    lightActive: '#FFF',
    lightInactive: 'rgba(96, 121, 144, 0.4)',
    darkInactive: 'rgba(255, 255, 255, 0.4)',
  },
}
