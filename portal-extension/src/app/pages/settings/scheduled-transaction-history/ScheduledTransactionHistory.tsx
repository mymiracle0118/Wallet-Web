import { useTranslation } from 'react-i18next'

import { Divider } from '@nextui-org/react'
import { CustomTypography, TokenActivity } from 'app/components'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'

const sampleData = [
  {
    type: 'Sent',
    date: 'Sept. 20 at 9:36 PM',
    price: '0.0014 WETH',
    status: 'Saved',
  },
  {
    type: 'Sent',
    date: 'Sept. 20 at 9:36 PM',
    price: '0.0011 WETH',
    status: 'Saved',
  },
  {
    type: 'Received',
    date: 'Sept. 20 at 9:36 PM',
    price: '0.002 ETH',
    status: 'Saved',
  },
]

const ScheduledTransactionHistory = () => {
  const { t } = useTranslation()
  return (
    <SinglePageTitleLayout title={t('ScheduledTransaction.feeSaved')}>
      <CustomTypography variant="body" className="mb-4 p-4">
        {t('ScheduledTransaction.transactionHistorySubTitle', {
          network: 'Ethereum',
        })}
      </CustomTypography>

      {sampleData.map((data, idx) => (
        <div key={idx}>
          <TokenActivity
            page="Settings-Token"
            key={idx}
            type={data.type}
            date={data.date}
            price={data.price}
            status={data.status}
            tokenName="ETH"
          />
          <Divider />
        </div>
      ))}
    </SinglePageTitleLayout>
  )
}

export default ScheduledTransactionHistory
