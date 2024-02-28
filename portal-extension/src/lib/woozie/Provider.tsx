import React, { FC } from 'react'

import { LocationProvider } from './location'

type IProviderProps = {
  children: React.ReactNode
}
const Provider: FC<IProviderProps> = ({ children }: IProviderProps) => <LocationProvider>{children}</LocationProvider>

export default Provider
