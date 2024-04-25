/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { INetworkAssetsProps } from '@portal/shared/utils/types'
import { AngelRightIcon, CheckPrimaryIcon, CloseRoundedIcon, SearchIcon } from '@src/app/components/Icons'
import classnames from 'classnames'
import { Button, CustomTypography, Input } from 'components'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import NoTokenfound from '../../../../assets/images/no-activity.png'

const NetworkAssets = ({
  isSelectedAssets,
  handleSelectionChange,
  handleSearchInputChange,
  searchInput,
  setSearchInput,
  filteredNetworksAssets,
  setFilteredNetworksAssets,
  objectdata,
  isSwapAssets,
  name,
  image,
  symbol,
}: INetworkAssetsProps) => {
  const { t } = useTranslation()
  const [isShowAssetModal, setShowAssetModal] = useState<boolean>(false)

  const listItemClasses = classnames(
    'relative px-2 gap-3 h-14 hover:!bg-custom-white10 rounded-lg flex items-center justify-center'
  )
  const selectedIconClass = classnames('absolute left-8 bottom-4 z-20')

  return (
    <div>
      <Button
        size="sm"
        radius="full"
        variant="flat"
        color="default"
        onClick={() => setShowAssetModal(true)}
        className="bg-custom-white10 font-extrabold"
      >
        <div className="w-4 h-4 rounded-full">
          <img
            src={isSwapAssets ? image : image}
            alt={isSwapAssets ? name : name}
            className="rounded-full bg-custom-white80"
          />
        </div>
        {isSwapAssets ? symbol : symbol} <AngelRightIcon />
      </Button>

      <Modal
        backdrop="opaque"
        isOpen={isShowAssetModal}
        onClose={() => setShowAssetModal(false)}
        hideCloseButton={true}
        scrollBehavior="inside"
        placement="center"
        className="max-w-[23rem] max-h-[35rem]"
      >
        <ModalContent className="rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
          <ModalHeader className="flex-col gap-y-3 pb-0">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <CustomTypography variant="h4">{t('Swap.swapFrom')}</CustomTypography>
            </div>
            <Input
              dataAid="networkSearch"
              placeholder={t('Network.networkName') as string}
              mainColor
              fullWidth
              value={searchInput}
              className="mt-1 h-12"
              icon={
                filteredNetworksAssets.length >= 0 && searchInput ? (
                  <Button
                    variant="light"
                    size="sm"
                    isIconOnly
                    onClick={() => {
                      setSearchInput(''), setFilteredNetworksAssets(objectdata)
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
            {filteredNetworksAssets.length > 0 ? (
              <Listbox
                items={filteredNetworksAssets}
                variant="flat"
                selectionMode="single"
                selectedKeys={[isSelectedAssets[0]?.contractAddress]}
                onSelectionChange={handleSelectionChange}
                itemClasses={{ base: listItemClasses, selectedIcon: selectedIconClass }}
              >
                {(data) => (
                  <ListboxItem
                    key={data.contractAddress}
                    className="flex items-center justify-between"
                    selectedIcon={
                      data?.contractAddress && isSelectedAssets?.contractAddress ? (
                        <CheckPrimaryIcon className="mr-2 border-3 w-4 h-4 border-solid border-surface-dark-alt rounded-full" />
                      ) : null
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-6">
                        <div className="w-8 h-8 rounded-full">
                          <img src={data.image} alt={data.name} className="rounded-full" />
                        </div>
                        <CustomTypography className="subtitle uppercase space-y-2 flex flex-col" variant="subtitle">
                          {data.symbol}
                          <span className="capitalize dark:text-custom-white40 font-regular">{data.network}</span>
                        </CustomTypography>
                      </div>
                      <CustomTypography
                        className="subtitle uppercase space-y-2 flex flex-col text-right"
                        variant="subtitle"
                      >
                        {data.symbol}
                        <span className="capitalize dark:text-custom-white40 font-regular">{data.network}</span>
                      </CustomTypography>
                    </div>
                  </ListboxItem>
                )}
              </Listbox>
            ) : (
              <div className="mx-auto flex flex-col items-center space-y-2 pt-4">
                <img src={NoTokenfound} alt="no token found" />
                <CustomTypography variant="body" type="secondary">
                  {t('Network.noNetworkFound')}
                </CustomTypography>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="flex gap-2 justify-between items-center">
            <Button fullWidth variant="bordered" color="outlined" onClick={() => setShowAssetModal(false)}>
              {t('Actions.cancel')}
            </Button>
            <Button color="primary" onClick={() => setShowAssetModal(false)}>
              {t('Actions.add')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default NetworkAssets
