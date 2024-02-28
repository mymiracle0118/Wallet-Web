import React from 'react'
import { TokenBalance } from 'app/components'
import { networksData } from '../sampleData'

const NetworksTab = () => (
  <div className="px-4">
    {networksData.map((data, idx) => (
      <TokenBalance
        key={idx}
        acronym={data.acronym}
        balance={data.balance}
        percentage={data.percentage}
        image={data.image}
      />
    ))}
  </div>
)

export default NetworksTab
