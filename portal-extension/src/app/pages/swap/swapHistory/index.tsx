import React from 'react'
import { TokenSwapActivity } from 'components'
import DAI from 'assets/coins/DAI.svg'
import WETH from 'assets/coins/WETH.svg'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'

const SwapHistory = () => {
  return (
    <SinglePageTitleLayout paddingClass={false} title="Swap History">
      <div className="divide-y divide-solid divide-custom-white10">
        <TokenSwapActivity
          type="Settings"
          disableRedirect
          from="DAI"
          fromImage={<DAI />}
          to="WETH"
          toImage={<WETH />}
          date="11/12/2023"
          price="≤ 0.04 WETH"
          status="Swapping"
        />
        <TokenSwapActivity
          type="Settings"
          disableRedirect
          from="DAI"
          fromImage={<DAI />}
          to="WETH"
          toImage={<WETH />}
          date="11/12/2023"
          price="≤ 0.04 WETH"
          status="Swapping"
        />
      </div>
    </SinglePageTitleLayout>
  )
}

export default SwapHistory
