/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { ICurrencyDataProps } from '@portal/shared/utils/types'
import { AngleDownIcon, CheckPrimaryIcon } from '@src/app/components/Icons'
import AUDIcon from 'assets/currencies/AUD.svg'
import CADIcon from 'assets/currencies/CAD.svg'
import EURIcon from 'assets/currencies/EUR.svg'
import GBPIcon from 'assets/currencies/GBP.svg'
import JPYIcon from 'assets/currencies/JPY.svg'
import USDIcon from 'assets/currencies/USD.svg'
import classnames from 'classnames'
import { Icon } from 'components'
import { SetStateAction, useState } from 'react'

const currenciesData: Array<ICurrencyDataProps> = [
  { currency: 'USD', icon: <USDIcon /> },
  { currency: 'AUD', icon: <AUDIcon /> },
  { currency: 'CAD', icon: <CADIcon /> },
  { currency: 'EUR', icon: <EURIcon /> },
  { currency: 'GBP', icon: <GBPIcon /> },
  { currency: 'JPY', icon: <JPYIcon /> },
]

const Currency = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD')

  const handleCurrencyChange = (newCurrency: SetStateAction<string>) => {
    setSelectedCurrency(newCurrency)
  }
  const selectedIconClass = classnames('absolute left-6 top-6')

  return (
    <Dropdown placement="bottom-end" className="bg-surface-dark-alt min-w-[6.875rem]">
      <DropdownTrigger>
        <Button variant="light" size="sm" className="text-custom-white uppercase font-extrabold text-sm">
          <Icon icon={currenciesData.find((currency) => currency.currency === selectedCurrency)?.icon} size="small" />
          {selectedCurrency}
          <AngleDownIcon className="w-6 h-6" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Currency"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[selectedCurrency]}
        onSelectionChange={(newSelection: any) => handleCurrencyChange(newSelection[0])}
        itemClasses={{ selectedIcon: selectedIconClass }}
      >
        {currenciesData.map((currencyItem) => (
          <DropdownItem
            key={currencyItem.currency}
            className={`${
              currencyItem.currency === selectedCurrency ? 'bg-surface-hover' : ''
            }text-custom-white uppercase font-extrabold text-sm h-11`}
            startContent={<Icon icon={currencyItem.icon} className="mr-2" size="large" />}
            onClick={() => handleCurrencyChange(currencyItem.currency)}
            selectedIcon={
              currencyItem.currency === selectedCurrency ? (
                <CheckPrimaryIcon className="border-3 border-solid border-surface-dark-alt rounded-full w-4 h-4" />
              ) : null
            }
          >
            {currencyItem.currency}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

export default Currency
