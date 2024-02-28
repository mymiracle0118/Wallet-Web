import React from 'react'
import { render } from '@testing-library/react'
import ImportNFT from 'pages/wallet/nft/import-nft/ImportNFT'
import { FormProvider, useForm } from 'react-hook-form'

const WrapperForm = ({ children }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}
describe('<ImportNFT />', () => {
  test('renders correctly', () => {
    const tree = render(
      <WrapperForm>
        <ImportNFT />
      </WrapperForm>
    )
    expect(tree).toMatchSnapshot()
  })
})
