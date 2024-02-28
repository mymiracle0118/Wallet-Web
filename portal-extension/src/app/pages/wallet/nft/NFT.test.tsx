import React from 'react'
import renderer from 'react-test-renderer'

import NFT from './NFT'

describe('<NFT />', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<NFT />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
