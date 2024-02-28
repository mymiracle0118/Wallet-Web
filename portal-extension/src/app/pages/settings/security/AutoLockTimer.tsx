import React, { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { Button, CustomTypography, Input } from 'components'
import { useWallet } from '@portal/shared/hooks/useWallet'
import { goBack } from 'lib/woozie'

const AutoLockTimer = () => {
  const { t } = useTranslation()
  const { lockTime, setLockTimer } = useWallet()
  const [minutes, setMinutes] = useState<string | number>(lockTime || 5)
  const [error, setError] = useState<boolean>(false)

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setMinutes(value as string)
    if (Number(value) > 120 || Number(value) < 1) {
      setError(true)
    } else {
      setError(false)
    }
  }

  const onSaveTime = () => {
    setLockTimer(Number(minutes))
    goBack()
  }

  return (
    <SinglePageTitleLayout dataAid="autoLockHead" title={t('Security.autoLockTimer')}>
      <div className="space-y-4">
        <CustomTypography variant="body">
          <Trans i18nkey="Security.autoLockInMins" values={{ inMins: 'in minutes' }}>
            Set the idle time <span className="font-extrabold">in minutes</span> before the wallet will be locked.
          </Trans>
        </CustomTypography>

        <div className="space-y-1 min-h-[4.0625rem]">
          <Input
            dataAid="inputTime"
            dataTestId="input-lock-time"
            type="number"
            fullWidth
            mainColor
            placeholder="1-120 minutes"
            value={minutes}
            icon={<CustomTypography variant="small">mins</CustomTypography>}
            onChange={handleTimeChange}
          />
          {error && <div className="text-xs text-feedback-negative">Set Minutes between 1-120</div>}
        </div>

        <div className="flex pt-4 justify-center gap-2">
          <Button data-aid="cancelButton" variant="bordered" color="outlined" onClick={goBack}>
            {t('Actions.cancel')}
          </Button>
          <Button
            data-aid="saveButton"
            data-test-id="button-save"
            color={`${Number(minutes) > 120 || lockTime === Number(minutes) ? 'disabled' : 'primary'}`}
            isDisabled={Number(minutes) > 120 || lockTime === Number(minutes)}
            onClick={onSaveTime}
          >
            {t('Actions.save')}
          </Button>
        </div>
      </div>
    </SinglePageTitleLayout>
  )
}

export default AutoLockTimer
