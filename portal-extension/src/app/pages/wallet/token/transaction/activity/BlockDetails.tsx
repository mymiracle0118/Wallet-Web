import React from 'react'
import { CustomTypography } from 'components'
import { QuestionMarkIcon, SpinnerTransctionIcon } from '@src/app/components/Icons'

const BlockDetails = () => (
  <div className="pr-3 rounded-lg flex items-center bg-surface-dark-alt justify-between">
    <SpinnerTransctionIcon className="animate-spin" />

    <CustomTypography variant="small" className="pr-4 -ml-3">
      This transition requires <br />
      <strong>12 block confirmations</strong> to be completed
    </CustomTypography>
    <QuestionMarkIcon />
  </div>
)

export default BlockDetails
