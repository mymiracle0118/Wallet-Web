import React from 'react'
import renderer from 'react-test-renderer'

import AddressBooks from './AddressBooks'

describe('<AddressBooks />', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<AddressBooks />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
