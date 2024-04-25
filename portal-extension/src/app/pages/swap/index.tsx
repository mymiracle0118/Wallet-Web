import { CustomTypography } from 'components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import Footer from 'layouts/wallet-layout/Footer'
import { useNavigate } from 'lib/woozie'
import { AdjustGasAmountModal } from 'pages/wallet/token/transaction/send/SendModals'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@nextui-org/react'
import { default as assetsNetwork } from '@portal/shared/data/assets.json'
import { default as allSwapNetworks } from '@portal/shared/data/networks.json'
import { GasIcon, SpinnerIcon, SwapBlackRoundedIcon } from '@src/app/components/Icons'
import SwapSelectNetworks from './SwapSelectNetworks'
import NetworkAssetsInput from './assetsInputs'

const Swap = () => {
  const { t } = useTranslation()
  const { navigate } = useNavigate()
  const [maxWarning, setMaxWarning] = useState<boolean>(false)
  const [isSwapAssets, setSwapAssets] = useState<boolean>(false)

  const setMaxAmount = () => {
    setMaxWarning(false)
  }

  return (
    <SinglePageTitleLayout title="Swap" showMenu disableBack bgOnboarding paddingClass={false} BorderBottom={false}>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col overflow-y-auto rounded-xl justify-between mx-4">
          <div className="rounded-lg bg-surface-dark-alt p-4 space-y-4">
            <SwapSelectNetworks allNetworks={allSwapNetworks} />

            <div className="flex items-center justify-between mb-1">
              <CustomTypography type="secondary" variant="body">
                {t('Labels.balance')}
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
              spinner={<SpinnerIcon />}
            >
              {t('Actions.review')}
            </Button>
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
