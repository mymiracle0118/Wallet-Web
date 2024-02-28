import { ToastOptions } from 'react-toastify'

/* eslint-disable prefer-destructuring */
export const ToastConfigs: ToastOptions = {
  position: 'bottom-center',
  className:
    'text-center w-full bg-midnight text-mediumGray whitespace-nowrap !max-w-full !rounded-full min-h-0 !px-2.5',
  bodyClassName: '!p-0 !m-0',
  autoClose: 5000,
  hideProgressBar: true,
  closeButton: false,
  closeOnClick: true,
}
