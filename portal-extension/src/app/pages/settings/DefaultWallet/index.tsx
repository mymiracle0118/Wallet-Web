import React, { useState } from 'react'
import { CustomTypography, Switch } from 'components'
import { useTranslation } from 'react-i18next'

const DefaultWallet = () => {
  const { t } = useTranslation()
  const [isSelected, setIsSelected] = useState<boolean>(true)

  return (
    <div className="border border-solid border-custom-white10 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div className="w-52 space-y-1">
          <CustomTypography variant="subtitle" className="text-custom-white">
            {t('Wallet.defaultWallet')}
          </CustomTypography>
          <CustomTypography type="secondary">{t('Wallet.defaultWalletDesc')}</CustomTypography>
        </div>
        <Switch id="default-wallet" checked={isSelected} onChange={() => setIsSelected(!isSelected)} />
      </div>
    </div>
  )
}

export default DefaultWallet
