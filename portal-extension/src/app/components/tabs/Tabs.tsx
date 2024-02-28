import * as React from 'react'
import { CustomTypography } from 'app/components'
import { Tab as HeadlessTab } from '@headlessui/react'
// import { Tabs, Tab } from '@nextui-org/react'

export interface ITabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
  dataTestId?: string
}

export interface ITabProps {
  value: number
  onChange?: (newValue: number) => void
  tabs: string[]
}

export function TabPanel(props: ITabPanelProps) {
  const { children, value, index, dataTestId, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      data-testid={dataTestId}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>
          <CustomTypography>{children}</CustomTypography>
        </div>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

export const Tab = ({ value, onChange, tabs }: ITabProps) => (
  <HeadlessTab.Group onChange={onChange} selectedIndex={value}>
    <HeadlessTab.List className="w-full flex justify-around">
      {tabs.map((tab, idx) => (
        <HeadlessTab className="outline-0" data-testid={`tab-${tab.replace(' ', '-')}`} {...a11yProps(idx)} key={idx}>
          {({ selected }) => (
            <CustomTypography
              color={selected ? 'dark:text-custom-white text-primary' : 'dark:text-custom-white40 text-custom-grey40'}
              className="py-4 text-h4"
            >
              {tab}
            </CustomTypography>
          )}
        </HeadlessTab>
      ))}
    </HeadlessTab.List>
  </HeadlessTab.Group>
)

// export const TabCustom = ({ children, tabsOption, onTabChange, selectedValue }) => (
//   <Tabs aria-label="Dynamic tabs" items={tabsOption} selectedKey={selectedValue} onSelectionChange={onTabChange}>
//     {tabsOption.map((tab, idx) => (
//       <Tab key={idx} title={tab} data-testid={`tab-${tab.replace(' ', '-')}`} {...a11yProps(idx)}>
//         {selectedValue === idx ? children : null}
//       </Tab>
//     ))}
//   </Tabs>
// )

export const InnerTab = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (newValue: number) => {
    setValue(newValue)
  }

  return (
    <div className=" w-full">
      <div className="text-custom-white">
        <Tab value={value} onChange={handleChange} tabs={['Item one', 'Item two']} />
      </div>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
    </div>
  )
}
