/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { AngleDownIcon, CheckPrimaryIcon, CheckRoundedGreyIcon } from '@src/app/components/Icons'
import { CHANGE_LANGUAGE } from '@src/constants/content'
import classnames from 'classnames'
import { CustomTypography } from 'components'
import { SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'

const LangauageChange = () => {
  const { t } = useTranslation()
  const [isSelectLanguage, setSelectLanguage] = useState<string>('en')
  const selectedIconClass = classnames('absolute left-2 top-[0.65rem]')

  const handleCurrencyChange = (languageKey: SetStateAction<string>) => {
    setSelectLanguage(languageKey)
  }

  return (
    <div className="flex items-center justify-between min-h-[3.5rem] hover:bg-custom-white10 px-4">
      <CustomTypography variant="subtitle">{t('Settings.language')}</CustomTypography>
      <Dropdown placement="bottom-end" className="bg-surface-dark-alt min-w-[6.875rem]">
        <DropdownTrigger>
          <Button variant="light" size="sm" className="text-custom-white uppercase font-extrabold text-sm">
            {isSelectLanguage}
            <AngleDownIcon className="ml-2" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Language"
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={[isSelectLanguage]}
          onSelectionChange={(language: any) => setSelectLanguage(language[0])}
          className="text-custom-white capitalize font-extrabold text-sm"
          itemClasses={{ selectedIcon: selectedIconClass }}
        >
          {CHANGE_LANGUAGE.map((languageItems) => (
            <DropdownItem
              key={languageItems.key}
              className={`${languageItems.key === isSelectLanguage ? 'bg-surface-hover' : ''} h-11 pl-12`}
              onClick={() => handleCurrencyChange(languageItems.key)}
              selectedIcon={
                languageItems.key === isSelectLanguage ? (
                  <CheckPrimaryIcon className="w-6 h-6 bg-gradient-primary rounded-full" />
                ) : (
                  <CheckRoundedGreyIcon className="w-6 h-6" />
                )
              }
            >
              {languageItems.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default LangauageChange
