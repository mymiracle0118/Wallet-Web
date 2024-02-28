import React from 'react'
import { useTranslation } from 'react-i18next'
import { CustomTypography, Icon, Button, COLORS } from 'app/components'
import GasIcon from 'assets/icons/gas.svg'
import { IPopupNotifProps } from '@portal/shared/utils/types'

export const PopupNotif = ({ title, subTitle, onCancel, onAccept }: IPopupNotifProps) => {
  const { t } = useTranslation()

  return (
    <div className="bg-surface-dark shadow-md rounded-xl max-h-[18.75rem] max-w-[16.5rem] text-center p-8">
      <div
        className="cursor-pointer rounded-xl mx-auto mb-4 p-4 text-[4rem] h-16 w-64"
        style={{ background: COLORS.background.gradientLogoBg }}
      >
        <Icon icon={<GasIcon />} size="inherit" />
      </div>

      <CustomTypography className="text-h1 mb-4">{title}</CustomTypography>
      <CustomTypography className="text-h4 mb-4" type="secondary">
        {subTitle}
      </CustomTypography>

      <div className="flex justify-between gap-2">
        <Button onClick={onCancel} fullWidth variant="bordered">
          {t('Actions.notNow')}
        </Button>
        <Button onClick={onAccept} fullWidth color="primary">
          {t('Actions.viewWallet')}
        </Button>
      </div>
    </div>
  )
}
