import { useWallet } from '@portal/shared/hooks/useWallet'
import { IAutoLockTimerProps } from '@portal/shared/utils/types'
import { CheckRoundedGreyIcon, CheckRoundedPrimaryIcon } from '@src/app/components/Icons'
import { AUTO_LOCK_TIMER } from '@src/constants/content'
import { Button, CustomTypography } from 'components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { goBack, useNavigate } from 'lib/woozie'
import { ChangeEvent, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

const AutoLockTimer = () => {
  const { t } = useTranslation()
  const { lockTime, setLockTimer } = useWallet()
  const [selected, setSelected] = useState<number>(lockTime)
  const { navigate } = useNavigate()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelected(Number(event.target.value))
  }

  const onSaveTime = () => {
    setLockTimer(selected)
    navigate('/settings/security')
  }

  return (
    <SinglePageTitleLayout dataAid="autoLockHead" title={t('Security.autoLockTimer')}>
      <div className="space-y-4">
        <CustomTypography variant="body">
          <Trans i18nkey="Security.autoLockInMins" values={{ inMins: 'in minutes' }}>
            {t('Settings.setAutoLockTimer')}
          </Trans>
        </CustomTypography>

        <div className="grid gap-1 bg-surface-dark-alt rounded-lg p-2">
          {AUTO_LOCK_TIMER.map((autoLockTimer: IAutoLockTimerProps, index: number) => (
            <label
              key={index}
              htmlFor={String(autoLockTimer.value)}
              className={`cursor-pointer pl-[3.5rem] relative font-extrabold hover:bg-custom-white10 rounded-lg p-4 ${
                selected === autoLockTimer.value ? 'bg-custom-white10' : ''
              }`}
            >
              {selected === autoLockTimer.value ? (
                <CheckRoundedPrimaryIcon className="absolute left-4 top-4 w-5 h-5" />
              ) : (
                <CheckRoundedGreyIcon className="absolute left-4 top-4 w-5 h-5" />
              )}
              {autoLockTimer.value} {t('Settings.mins')}
              <input
                type="radio"
                id={autoLockTimer.value.toString()}
                name="autoTime"
                className="invisible"
                value={autoLockTimer.value}
                checked={selected === autoLockTimer.value}
                onChange={handleChange}
              />
            </label>
          ))}
        </div>

        <div className="flex pt-4 justify-center gap-2">
          <Button data-aid="cancelButton" variant="bordered" color="outlined" onClick={goBack}>
            {t('Actions.cancel')}
          </Button>
          <Button data-aid="saveButton" data-test-id="button-save" color={'primary'} onClick={onSaveTime}>
            {t('Actions.save')}
          </Button>
        </div>
      </div>
    </SinglePageTitleLayout>
  )
}

export default AutoLockTimer
