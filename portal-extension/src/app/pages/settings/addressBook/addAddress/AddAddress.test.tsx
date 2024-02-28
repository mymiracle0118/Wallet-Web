import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render, renderHook, screen } from '@testing-library/react'
import { useSettings } from '@portal/shared/hooks/useSettings'
import userEvent from '@testing-library/user-event'

import AddAddress from './AddAddress'

const WrapperForm = ({ children }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}
describe('<AddAddress />', () => {
  test('renders correctly', () => {
    const tree = render(
      <WrapperForm>
        <AddAddress />
      </WrapperForm>
    )

    expect(tree).toMatchSnapshot()
  })

  test('Add item to Address Book', async () => {
    const user = userEvent.setup()
    const { result } = renderHook(() => useSettings())
    const before = result.current.addressBook.length
    render(
      <WrapperForm>
        <AddAddress />
      </WrapperForm>
    )

    await user.type(screen.getByTestId('addAddress-address'), '0xb81B777a6f7C8d79400A5172c5316F2233dd76C4')
    await user.type(screen.getByTestId('addAddress-label'), 'Test Address 1')
    await user.click(screen.getByTestId('add-address-btn'))

    expect(result.current.addressBook).toHaveLength(before + 1)
  })
})
