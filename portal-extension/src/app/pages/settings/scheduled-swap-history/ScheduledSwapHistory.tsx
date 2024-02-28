import React from 'react'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { TokenSwapActivity, CustomTypography } from 'app/components'

import WETH from 'assets/coins/WETH.svg'
import DAI from 'assets/coins/DAI.svg'
import SUSHI from 'assets/coins/SUSHI.svg'
import USDT from 'assets/coins/USDT.svg'
import { Divider } from '@nextui-org/react'

const sampleData = [
  {
    from: 'DAI',
    fromImage: <DAI />,
    to: 'WETH',
    toImage: <WETH />,
    date: 'Sept. 20 at 9:36 PM',
    price: '0.0011 WETH',
    status: 'Saved',
  },
  {
    from: 'SUSHI',
    fromImage: <SUSHI />,
    to: 'USDT',
    toImage: <USDT />,
    date: 'Sept. 20 at 9:36 PM',
    price: '28 USDT',
    status: 'Saved',
  },
  {
    from: 'SUSHI',
    fromImage: <SUSHI />,
    to: 'USDT',
    toImage: <USDT />,
    date: 'Sept. 20 at 9:36 PM',
    price: '10 USDT',
    status: 'Saved',
  },
]

const ScheduledSwapHistory = () => (
  <SinglePageTitleLayout title="Fee Saved" className="space-y-4">
    <CustomTypography variant="body">
      Check out the history of all the swaps with an ideal rate and how much was saved in each swap
    </CustomTypography>

    {sampleData.map((data, idx) => (
      <div key={idx}>
        <TokenSwapActivity
          type="Settings"
          from={data.from}
          fromImage={data.fromImage}
          to={data.to}
          toImage={data.toImage}
          date={data.date}
          price={data.price}
          status={data.status}
        />
        <Divider />
      </div>
    ))}
  </SinglePageTitleLayout>
)

export default ScheduledSwapHistory
