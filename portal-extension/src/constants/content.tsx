import {
  IActivityFilterProps,
  IAutoLockTimerProps,
  IChangeAvatarProps,
  IChangeLanguageProps,
  IDemoTransactionsProps,
  IFileRecoveryOptions,
  IFilterAddress,
  ITokenSortFilter,
} from '@portal/shared/utils/types'
import {
  AlphabetIcon,
  HighValueIcon,
  LowValueIcon,
  ReceiveIcon,
  RoundedWhiteIcon,
  SendIcon,
  StarEmptyIcon,
} from '@src/app/components/Icons'

const generateAvatar = (id: number, alt: string): IChangeAvatarProps => {
  return {
    id,
    image: require(`assets/profile-pictures/avatar${id}.png`).default,
    alt,
  }
}
export const CHANGE_AVATAR: IChangeAvatarProps[] = Array.from({ length: 7 }, (_, i) => generateAvatar(i + 1, 'Avatar'))

export const CHANGE_LANGUAGE: IChangeLanguageProps[] = [
  {
    id: 1,
    key: 'en',
    name: 'english',
  },
  {
    id: 2,
    key: 'zh-cn',
    name: 'chinese',
  },
  {
    id: 3,
    key: 'es-ES',
    name: 'Spanish',
  },
  {
    id: 4,
    key: 'hin',
    name: 'hindi',
  },
  {
    id: 5,
    key: 'rus',
    name: 'Russian',
  },
  {
    id: 6,
    key: 'pt',
    name: 'Portuguese',
  },
]

export const DEMO_TRANSCATION: IDemoTransactionsProps[] = [
  {
    type: 'Received',
    date: 'Sept. 20 at 9:36 PM',
    price: '-',
    status: 'Completed',
  },
  {
    type: 'Bought',
    title: 'Bought by you',
    date: 'Sept. 20 at 9:36 PM',
    price: '$9,000',
    status: '',
  },
  {
    type: 'Listed',
    title: 'Listed on OpenSea',
    date: 'Sept. 20 at 9:36 PM',
    price: '$6,000',
    status: '',
  },
  {
    type: 'Bought',
    title: 'Bought by 0x6d90...f757',
    date: 'Sept. 20 at 9:36 PM',
    price: '$4,000',
    status: '',
  },
  {
    type: 'Listed',
    title: 'Listed on Nifty Gateway',
    date: 'Sept. 20 at 9:36 PM',
    price: '$1,000',
    status: '',
  },
  {
    type: 'Minted',
    title: 'Minted on Nifty Gateway',
    date: 'Sept. 20 at 9:36 PM',
    price: '',
    status: '',
  },
]

export const AUTO_LOCK_TIMER: IAutoLockTimerProps[] = [
  {
    id: 0,
    value: 1,
  },
  {
    id: 1,
    value: 2,
  },
  {
    id: 2,
    value: 5,
  },
  {
    id: 3,
    value: 10,
  },
  {
    id: 4,
    value: 30,
  },
]

export const FILE_RECOVERY_OPTIONS: IFileRecoveryOptions[] = [
  {
    id: 1,
    optionType: 'Google Drive',
  },
  {
    id: 2,
    optionType: 'Device',
  },
  {
    id: 3,
    optionType: 'Guardian',
  },
]

export const FILTER_ADDRESS: IFilterAddress[] = [
  {
    id: 1,
    checkId: '1',
    name: 'Default',
  },
  {
    id: 2,
    checkId: '2',
    name: 'Network',
  },
]

export const TOKEN_SORT_FILTER: ITokenSortFilter[] = [
  {
    icon: <StarEmptyIcon className="fill-custom-black dark:fill-custom-white mr-3" />,
    name: 'favorites',
    label: 'Favorites',
  },
  {
    icon: (
      <HighValueIcon className="stroke-custom-black dark:stroke-custom-white fill-custom-black dark:fill-custom-white mr-3" />
    ),
    name: 'highestValue',
    label: 'Highest value',
  },
  {
    icon: (
      <LowValueIcon className="stroke-custom-black dark:stroke-custom-white fill-custom-black dark:fill-custom-white mr-3" />
    ),
    name: 'lowestValue',
    label: 'Lowest value',
  },
  {
    icon: <AlphabetIcon className="fill-custom-black dark:fill-custom-white mr-3" />,
    name: 'alphabetically',
    label: 'Alphabetically',
  },
]

export const ACTIVITY_FILTER: IActivityFilterProps[] = [
  {
    key: 'All',
    icon: <RoundedWhiteIcon />,
    name: 'All',
  },
  {
    key: 'Send',
    icon: <SendIcon />,
    name: 'Send',
  },
  {
    key: 'Received',
    icon: <ReceiveIcon />,
    name: 'Received',
  },
]
