import Avatar1 from 'assets/profile-pictures/avatar1.png'
import Avatar2 from 'assets/profile-pictures/avatar2.png'
import Avatar3 from 'assets/profile-pictures/avatar3.png'
import Avatar4 from 'assets/profile-pictures/avatar4.png'
import Avatar5 from 'assets/profile-pictures/avatar5.png'
import Avatar6 from 'assets/profile-pictures/avatar6.png'
import Avatar7 from 'assets/profile-pictures/avatar7.png'
import { IChangeAvatarProps, IChangeLanguageProps, IDemoTransactionsProps } from '@portal/shared/utils/types'

export const CHANGE_AVATAR: IChangeAvatarProps[] = [
  {
    id: 1,
    image: Avatar1,
    alt: 'Avatar',
  },
  {
    id: 2,
    image: Avatar2,
    alt: 'Profile',
  },
  {
    id: 3,
    image: Avatar3,
    alt: 'Picture',
  },
  {
    id: 4,
    image: Avatar4,
    alt: 'Avatar',
  },
  {
    id: 5,
    image: Avatar5,
    alt: 'Profile',
  },
  {
    id: 6,
    image: Avatar6,
    alt: 'Avatar',
  },
  {
    id: 7,
    image: Avatar7,
    alt: 'Avatar',
  },
]

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
