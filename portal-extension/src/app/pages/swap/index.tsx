import React, { useState } from 'react'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import Footer from 'layouts/wallet-layout/Footer'
import { useTranslation } from 'react-i18next'
import { CustomTypography } from 'components'
import { AdjustGasAmountModal } from 'pages/wallet/token/transaction/send/SendModals'
// import { Asset, useWallet } from '@portal/shared/hooks/useWallet'
import { useNavigate } from 'lib/woozie'
// import { useBalance } from '@portal/shared/hooks/useBalance'
// import { ethers } from 'ethers'

// import { useForm } from 'react-hook-form'
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as yup from 'yup'
// import { usePricing } from '@portal/shared/hooks/usePricing'
// import { useGas } from '@portal/shared/hooks/useGas'
import { Button } from '@nextui-org/react'
import { GasIcon, SpinnerIcon, SwapBlackRoundedIcon } from '@src/app/components/Icons'
import NetworkAssetsInput from './assetsInputs'
import { default as assetsNetwork } from '@portal/shared/data/assets.json'
import { default as allSwapNetworks } from '@portal/shared/data/networks.json'
import SwapSelectNetworks from './SwapSelectNetworks'

const Swap = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const [maxWarning, setMaxWarning] = useState<boolean>(false)
  const [isSwapAssets, setSwapAssets] = useState<boolean>(false)
  //   const [loading, setLoading] = useState<boolean>(true)

  //   const [selectedNetwork, setSelectedUser] = useState<null | Asset>(null)

  //   const { pathname } = createLocationState()
  //   const paths = pathname.split('/')
  //   const network: string = paths[paths.length - 2]
  //   const assetId: string = paths[paths.length - 1]

  //   const { getAsset, setTransaction } = useWallet()
  //   const asset = useMemo(() => getAsset(network, assetId), [assetId, getAsset, network])

  //   const { balanceFormatted } = useBalance(network, assetId, 'savedAssets')
  //   const assetBalance = useMemo(
  //     () => Math.round((Number(balanceFormatted) + Number.EPSILON) * 10000) / 10000,
  //     [balanceFormatted]
  //   )

  //   //   const { getAssetValueFormatted } = usePricing()
  //   const { gasOption, estimatedTransactionCost } = useGas(asset)

  //   const estimatedEtherFees = estimatedTransactionCost
  //     ? Number(ethers.utils.formatEther(estimatedTransactionCost as ethers.BigNumberish))
  //     : 100

  //   const schema = yup.object().shape({
  //     amount: yup
  //       .number()
  //       .typeError('you must specify an amount')
  //       .moreThan(0, 'invalid amount')
  //       .lessThan(assetBalance - estimatedEtherFees, 'low balance')
  //       .required(),
  //     address: yup
  //       .string()
  //       .required()
  //       .matches(/^0x[a-fA-F0-9]{40}$/),
  //   })

  //   const handleReviewTransaction = ({ amount }: { amount: string }) => {
  //     if (selectedNetwork) {
  //       setTransaction({
  //         asset,
  //         to: selectedNetwork.contractAddress,
  //         amount: amount.toString(),
  //         gasOption,
  //       })
  //       navigate('/swap/swap-review')
  //     }
  //   }

  //   const methods = useForm({
  //     resolver: yupResolver(schema),
  //     mode: 'onChange',
  //   })
  //   const {
  //     register,
  //     handleSubmit,
  //     setValue,
  //     // formState: { isDirty, isValid, errors },
  //   } = methods

  const setMaxAmount = () => {
    // setValue('amount', assetBalance - estimatedEtherFees)
    setMaxWarning(false)
  }

  return (
    <SinglePageTitleLayout title="Swap" showMenu disableBack bgOnboarding paddingClass={false} BorderBottom={false}>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col overflow-y-auto rounded-xl justify-between mx-4">
          <div className="rounded-lg bg-surface-dark-alt p-4 space-y-4">
            {/* <Form methods={methods} onSubmit={handleSubmit(handleReviewTransaction)}> */}

            <SwapSelectNetworks allNetworks={allSwapNetworks} />

            <div className="flex items-center justify-between mb-1">
              <CustomTypography type="secondary" variant="body">
                Balance
                {/* {`Balance: ${assetBalance} ${asset.symbol}`} ({getAssetValueFormatted(assetId, assetBalance)}) */}
              </CustomTypography>
              <Button size="sm" variant="bordered" onClick={() => setMaxWarning(true)}>
                {t('Labels.max')}
              </Button>
            </div>
            <div className="relative space-y-4">
              <NetworkAssetsInput
                initialAsset={isSwapAssets ? assetsNetwork[0] : assetsNetwork[11]}
                objectdata={assetsNetwork}
                isSwapAssets={isSwapAssets}
              />
              <NetworkAssetsInput
                initialAsset={!isSwapAssets ? assetsNetwork[0] : assetsNetwork[11]}
                objectdata={assetsNetwork}
                isSwapAssets={isSwapAssets}
              />

              <div className="absolute left-0 right-0 flex justify-center top-[1.9rem]">
                <Button
                  variant="light"
                  size="sm"
                  radius="full"
                  isIconOnly
                  className="transition-all ease-in-out duration-150 hover:scale-125"
                  onClick={() => setSwapAssets(!isSwapAssets)}
                >
                  <SwapBlackRoundedIcon
                    className={`shadow-lg transition-all ease-in-out duration-150 ${
                      isSwapAssets ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <CustomTypography variant="subtitle">-</CustomTypography>
              <div className="flex items-center justify-end">
                <GasIcon className="mr-1" />
                <CustomTypography variant="subtitle">0.0000</CustomTypography>
              </div>
            </div>

            <Button
              className={'bg-gradient-button font-extrabold'}
              onClick={() => navigate('/swap/swap-review')}
              fullWidth
              radius="sm"
              //   isDisabled={!loading}
              //   isLoading={!loading}
              spinner={<SpinnerIcon />}
            >
              {t('Actions.review')}
            </Button>
            {/* </Form> */}
          </div>
        </div>

        <div>
          <Button
            variant="light"
            onClick={() => navigate('/swap/swap-history')}
            className="text-secondary underline underline-offset-2 font-bold flex justify-center mx-auto mb-1"
          >
            {t('Wallet.swapHistory')}
          </Button>
          <Footer />
        </div>
      </div>

      <AdjustGasAmountModal
        setMaxWarning={setMaxWarning}
        coin={132}
        maxWarning={maxWarning}
        closeReceiveTokenModal={() => setMaxWarning(false)}
        setMaxAmount={setMaxAmount}
      />
    </SinglePageTitleLayout>
  )
}

export default Swap
