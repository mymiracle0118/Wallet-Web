import React from 'react'
import { render, renderHook, screen, act } from '@testing-library/react'
import { useSettings } from '@portal/shared/hooks/useSettings'
import userEvent from '@testing-library/user-event'
import EditAddress from './EditAddress'

describe('<EditAddress />', () => {
  test('renders correctly', () => {
    const tree = render(<EditAddress />)
    expect(tree).toMatchSnapshot()
  })

  test('Remove Address to Address Book', async () => {
    const user = userEvent.setup()
    const { result } = renderHook(() => useSettings())

    act(() => {
      result.current.addressBook = [
        { address: '0x63C100ac0C36549C7218070294b60C18d813675a', username: 'Test Address 1' },
        { address: '0x63C100ac0C36549C7218070294b60C18d813675b', username: 'Test Address 2' },
        { address: '0x63C100ac0C36549C7218070294b60C18d813675c', username: 'Test Address 3' },
      ]
    })
    render(<EditAddress />)

    await user.click(screen.getAllByTestId('remove-address-btn')[1])

    expect(result.current.addressBook).toHaveLength(2)
  })
})
