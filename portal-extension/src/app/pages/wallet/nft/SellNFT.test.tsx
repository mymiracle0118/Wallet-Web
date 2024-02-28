import React from 'react'
import renderer from 'react-test-renderer'

import SellNFT from './SellNFT'

describe('<SellNFT />', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<SellNFT />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
