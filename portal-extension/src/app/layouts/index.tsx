import React, { FC } from 'react'

const PageLayout: FC<ComponentProps> = ({ children }) => (
  <div className="overflow-hidden mx-auto w-[22.5rem] h-[37.5rem] bg-surface-dark [&>div]:!rounded-[0rem]">
    {children}
  </div>
)

export default PageLayout
