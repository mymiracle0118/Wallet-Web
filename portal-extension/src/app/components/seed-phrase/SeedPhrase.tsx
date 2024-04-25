import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CustomTypography, Button, ToolTip } from 'app/components'
import { CopyIcon, DownloadIcon, EyeIcon } from '../Icons'
import { ISeedPhraseProps } from '@portal/shared/utils/types'

export const SeedPhrase = ({ phrase, showSeedPhrase, setShowSeedPhrase }: ISeedPhraseProps) => {
  const { t } = useTranslation()
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const copy = () => {
    if (phrase) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      navigator.clipboard.writeText(phrase)
    }
    setIsCopied(true)
  }

  useEffect(() => {
    if (isCopied) setTimeout(() => setIsCopied(false), 1000)
  }, [isCopied])

  const download = () => {
    if (phrase) {
      const element = document.createElement('a')
      const file = new Blob([phrase], {
        type: 'text/plain',
      })
      element.href = URL.createObjectURL(file)
      element.download = 'secret_recovery_phrase.txt'
      document.body.appendChild(element)
      element.click()
    }
  }

  return (
    <div className="w-full rounded-lg mt-8 relative border border-custom-grey">
      {!showSeedPhrase && (
        <button
          className="absolute w-full h-full flex flex-col items-center justify-center	cursor-pointer backdrop-blur-lg rounded-lg"
          type="button"
          onClick={() => setShowSeedPhrase(true)}
          data-aid="click-to-reveal"
        >
          <div className="text-[32px] stroke-custom-black dark:stroke-custom-white">
            <EyeIcon />
          </div>
          <CustomTypography className="text-body " color="dark:text-custom-white80 text-custom-grey100">
            {t('Onboarding.clickToReveal')}
          </CustomTypography>
        </button>
      )}

      {phrase && (
        <div className="rounded-[12px] bg-surface-dark-alt p-4 space-y-5">
          <div className="grid grid-cols-3 gap-2">
            {phrase.split(' ').map((val: string, idx) => (
              <div key={val}>
                <div className="flex  gap-1">
                  <div className="mr-2 text-custom-white">
                    <span className="text-note  dark:text-custom-white40"> {String(idx + 1).padStart(2, '0')}</span>
                    {'  '}
                  </div>
                  <CustomTypography>{val}</CustomTypography>
                </div>
              </div>
            ))}
          </div>

          {showSeedPhrase && (
            <div className="flex gap-2 justify-end">
              <ToolTip title={t('Onboarding.download')} className="!-bottom-2 !-right-2">
                <Button isIconOnly size="sm" onClick={download} variant="light" fullWidth={false}>
                  <DownloadIcon className="stroke-custom-black dark:stroke-custom-white w-4 h-4" />
                </Button>
              </ToolTip>

              <ToolTip
                title={isCopied ? t('Onboarding.copied') : t('Onboarding.copy')}
                className="!-bottom-2 !-right-2"
              >
                <Button onClick={copy} isIconOnly size="sm" variant="light" fullWidth={false}>
                  <CopyIcon className="fill-custom-black dark:fill-custom-white w-4 h-4" />
                </Button>
              </ToolTip>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
