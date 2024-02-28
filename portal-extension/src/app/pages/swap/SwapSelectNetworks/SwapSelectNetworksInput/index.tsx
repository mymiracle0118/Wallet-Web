import React from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react'
import { CheckPrimaryIcon, CloseRoundedIcon, SearchIcon } from '@src/app/components/Icons'
import { Button, CustomTypography, Input } from 'components'
import classnames from 'classnames'
import { ISwapSelectNetworksInputProps } from '@portal/shared/utils/types'

const SwapSelectNetworksInput = ({
  isSelectedNetworks,
  isShowNetworkModal,
  setShowNetworkModal,
  handleSearchInputChange,
  handleSelectionChange,
  searchInput,
  setSearchInput,
  filteredNetworks,
  setFilteredNetworks,
  allNetworks,
}: ISwapSelectNetworksInputProps) => {
  const { t } = useTranslation()

  const listItemClasses = classnames(
    'relative px-2 gap-3 h-14 hover:!bg-custom-white10 rounded-lg flex items-center justify-center'
  )
  const selectedIconClass = classnames('absolute left-7 bottom-4 z-20')

  return (
    <Modal
      backdrop="opaque"
      isOpen={isShowNetworkModal}
      onClose={() => {
        setShowNetworkModal(false), setSearchInput(''), setFilteredNetworks(allNetworks)
      }}
      hideCloseButton={true}
      placement="center"
      scrollBehavior="inside"
      className="max-w-[23rem] max-h-[30rem]"
    >
      <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
        <ModalHeader className="flex-col gap-y-3 pb-0">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <CustomTypography variant="h4">Swap From</CustomTypography>
          </div>
          <Input
            dataAid="networkSearch"
            placeholder={t('Network.networkName')}
            mainColor
            fullWidth
            value={searchInput}
            className="mt-1 h-12"
            icon={
              filteredNetworks.length >= 0 && searchInput ? (
                <Button
                  variant="light"
                  size="sm"
                  isIconOnly
                  onClick={() => {
                    setSearchInput(''), setFilteredNetworks(allNetworks)
                  }}
                >
                  <CloseRoundedIcon className="mt-2" />
                </Button>
              ) : (
                <SearchIcon className="pr-1" />
              )
            }
            onChange={handleSearchInputChange}
          />
        </ModalHeader>
        <ModalBody className="px-2">
          {filteredNetworks.length > 0 ? (
            <Listbox
              items={allNetworks}
              variant="flat"
              selectionMode="single"
              selectedKeys={[isSelectedNetworks[0]?.name]}
              onSelectionChange={handleSelectionChange}
              itemClasses={{ base: listItemClasses, selectedIcon: selectedIconClass }}
            >
              {(data) => (
                <ListboxItem
                  key={data.name}
                  className={`flex items-center justify-between ${
                    data?.name === isSelectedNetworks[0]?.name ? 'bg-custom-white10' : ''
                  }`}
                  selectedIcon={
                    data?.name === isSelectedNetworks[0]?.name ? (
                      <CheckPrimaryIcon className="mr-2 border-3 w-5 h-5 border-solid border-[#41424F] rounded-full" />
                    ) : null
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-6">
                      <div className="w-8 h-8 rounded-full">
                        <Avatar src={data?.image} alt={data?.name} radius="full" className="w-8 h-8" />
                      </div>
                      <CustomTypography className="capitalize" variant="subtitle">
                        {data.name}
                      </CustomTypography>
                    </div>
                  </div>
                </ListboxItem>
              )}
            </Listbox>
          ) : (
            <CustomTypography type="secondary" className="text-center pt-6" variant="subtitle">
              No Network Found
            </CustomTypography>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SwapSelectNetworksInput
