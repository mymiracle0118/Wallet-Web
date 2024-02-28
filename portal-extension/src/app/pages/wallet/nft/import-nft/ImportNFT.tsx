import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CustomTypography, Input, ModalComponent, Form, Button } from 'components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import mascot from 'assets/images/mascot.png'
import { useWallet, Asset } from '@portal/shared/hooks/useWallet'
import { isNFTOwner, fetchNFT } from '@portal/shared/services/nft'
import { useNavigate } from 'lib/woozie'
import { default as networks } from '@portal/shared/data/networks.json'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { SpinnerIcon } from '@src/app/components/Icons'

const schema = yup.object().shape({
  contractAddress: yup.string().required('Please enter a valid address'),
  // .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid address'),
  tokenId: yup.string().min(1).max(10).required('Please enter your token Id'),
})

const ImportNFT = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [modalState, setModalState] = useState<boolean>(false)
  // eslint-disable-next-line
  const [preview, setPreview] = useState<Asset | null>(null)
  const { address, addNFT } = useWallet()

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isValid },
  } = methods

  const getPreview = async () => {
    if (isValid) {
      setIsLoading(true)

      const networksToCheck = networks.filter((n) => [1, 3, 5, 42].includes(n.chainId as number))
      for (const network of networksToCheck) {
        try {
          const res = await fetchNFT(
            network.networkId,
            getValues('contractAddress') as string,
            getValues('tokenId') as string
          )

          if (res) {
            setPreview(res)
            break
          }
        } catch (error) {
          console.log(error)
        }
      }

      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (preview) {
      isNFTOwner(address as string, preview.network, preview.contractAddress as string, preview.id)
        .then(setIsOwner)
        .catch((err) => console.log(err))
    }
  }, [address, preview])

  return (
    <SinglePageTitleLayout title="Import NFT">
      <Form
        methods={methods}
        onSubmit={handleSubmit(() => {
          if (preview) {
            addNFT(preview)
            setModalState(true)
          }
        })}
      >
        <div className="flex flex-col p-4 relative h-[500px]">
          <CustomTypography variant="body" className="mb-4">
            You can find the below information in the Details section on the OpenSea page of your NFT
          </CustomTypography>
          <Input
            fullWidth
            mainColor
            placeholder="Contract address"
            className="mt-4"
            {...register('contractAddress', {
              onBlur: getPreview,
            })}
            error={errors.contractAddress?.message}
          />
          <Input
            className="mt-4"
            fullWidth
            mainColor
            placeholder="ID"
            {...register('tokenId', {
              onBlur: getPreview,
            })}
            error={errors.tokenId?.message}
          />
          {preview && !isOwner && (
            <CustomTypography variant="subtitle" className="mt-4" color="text-feedback-negative">
              You do not own this NFT
            </CustomTypography>
          )}

          {preview && (
            <div className="flex gap-4 mt-4">
              <img src={preview?.metadata?.image} alt="nft" className="rounded-md w-40" />
              <div className="flex flex-col gap-2">
                <CustomTypography variant="h3" className="mb-4">
                  {preview?.metadata?.name}
                </CustomTypography>
                <CustomTypography className="text-subtitle1" type="secondary">
                  {preview?.description?.slice(0, 140)}...
                </CustomTypography>
              </div>
            </div>
          )}
          <div className="flex gap-2 absolute bottom-0 w-auto right-4 left-4">
            <Button variant="bordered" color="outlined">
              {t('Actions.cancel')}
            </Button>
            <Button
              type="submit"
              color={`${!isOwner || !isValid ? 'disabled' : 'primary'}`}
              isDisabled={!isOwner || !isValid}
            >
              Import
            </Button>
          </div>
        </div>
      </Form>
      <ModalComponent
        modalState={modalState}
        closeModal={() => setModalState(false)}
        image={mascot}
        title={`You have imported ${preview?.metadata?.name as string}`}
        modalIconImage={preview?.metadata?.image}
      >
        <Button onClick={() => navigate('/home')} isLoading={isLoading} spinner={<SpinnerIcon />} color="primary">
          {!isLoading && t('Actions.ok')}
        </Button>
      </ModalComponent>
    </SinglePageTitleLayout>
  )
}

export default ImportNFT
