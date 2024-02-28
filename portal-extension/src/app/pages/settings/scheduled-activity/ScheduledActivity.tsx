import React from 'react'
import TransactionActivity from 'pages/wallet/token/transaction/activity/TransactionActivity'

type ScheduledActivityProps = {
  swapTokens?: boolean
}

const ScheduledActivity = ({ swapTokens = false }: ScheduledActivityProps) => {
  return <TransactionActivity swapTokens={swapTokens} txStatus="Completed" page="Settings" network="mainnet" />
}

export default ScheduledActivity
