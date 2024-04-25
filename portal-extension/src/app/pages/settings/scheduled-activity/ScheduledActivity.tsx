import { IScheduledActivityProps } from '@portal/shared/utils/types'
import TransactionActivity from 'pages/wallet/token/transaction/activity/TransactionActivity'

const ScheduledActivity = ({ swapTokens = false }: IScheduledActivityProps) => {
  return <TransactionActivity swapTokens={swapTokens} txStatus="Completed" page="Settings" network="mainnet" />
}

export default ScheduledActivity
