import React from 'react'
import renderer from 'react-test-renderer'
import GenerateSeed from 'pages/onboarding/generate-seed/GenerateSeed'

describe('Send Page UI', () => {
  test('renders correctly Generate Seed Page', () => {
    const tree = renderer.create(<GenerateSeed />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
