import React, { useState } from 'react'
import SinglePageTitleLayout from 'layouts/single-page-layout/SinglePageLayout'
import { Image, Input, Listbox, ListboxItem, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { Button, CustomTypography } from 'components'
import GasIcon from 'assets/images/gas-icon.png'
import { DeleteIcon } from '@src/app/components/Icons'
import { useTranslation } from 'react-i18next'

const GasPricealertData = [
  {
    id: 1,
    gas: 10,
    price: '0.57',
  },
  {
    id: 2,
    gas: 22,
    price: '1.24',
  },
  {
    id: 3,
    gas: 11,
    price: '2.84',
  },
]

const GasPriceAlert = () => {
  const { t } = useTranslation()
  const [gasPriceData, setGasPriceData] = useState(GasPricealertData)
  const [isShowSetAlertModal, setShowSetAlertModal] = useState<boolean>(false)
  const [isShowGasAlertModal, setShowGasAlertModal] = useState<boolean>(false)

  const handleDeleteGasAlert = (id: number) => {
    const updatedData = gasPriceData.filter((gasPrice) => gasPrice.id !== id)
    setGasPriceData([...updatedData])
  }

  return (
    <SinglePageTitleLayout dataAid="gasPriceAlert" title="Gas Price Alert">
      <Button
        variant="bordered"
        data-aid="setAlertButton"
        className="my-2"
        color="outlined"
        onClick={() => setShowSetAlertModal(true)}
      >
        {t('Actions.setAlert')}
      </Button>

      <Listbox
        className="divide-y divide-default-300/50 overflow-visible !p-0"
        itemClasses={{
          base: 'py-2 gap-3',
        }}
        items={GasPricealertData}
      >
        {(gasPrice) => (
          <ListboxItem
            key={gasPrice.id}
            className="hover:!bg-custom-white10 rounded-md"
            endContent={
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={() => handleDeleteGasAlert(gasPrice.id)}
                fullWidth={false}
              >
                <DeleteIcon />
              </Button>
            }
          >
            <CustomTypography variant="subtitle">
              {gasPrice.gas} Gwei
              <br /> <span className="font-regular text-custom-white40">${gasPrice.price}</span>
            </CustomTypography>
          </ListboxItem>
        )}
      </Listbox>

      {/* Set Alert Modal */}
      <Modal
        backdrop="opaque"
        isOpen={isShowSetAlertModal}
        onClose={() => setShowSetAlertModal(false)}
        hideCloseButton={true}
        placement="center"
        className="max-w-[20.625rem]"
      >
        <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
          <ModalBody>
            <div className="space-y-4">
              <CustomTypography dataAid="setGasPricealert" variant="h1" className="text-center">
                {t('Token.setGasPriceAlert')}
              </CustomTypography>
              <CustomTypography dataAid="gasPrice" variant="subtitle">
                {t('Token.gasPrice')}
              </CustomTypography>

              <div className="flex w-full space-x-2 items-center">
                <Input type="gwei" size="sm" label="Gwei" className="[&>*]:w-auto [&>*]:py-0" />
                <CustomTypography variant="subtitle">{t('Actions.or')}</CustomTypography>
                <Input type="price" size="sm" label="$" className="[&>*]:w-auto [&>*]:py-0" />
              </div>

              <div className="flex items-center justify-between gap-x-4">
                <Button
                  variant="bordered"
                  data-aid="setCancel"
                  className="my-2"
                  color="outlined"
                  onClick={() => setShowSetAlertModal(false)}
                >
                  {t('Actions.cancel')}
                </Button>
                <Button
                  data-aid="set"
                  color="primary"
                  onClick={() => {
                    setShowSetAlertModal(false)
                    setShowGasAlertModal(true)
                  }}
                >
                  {t('Actions.set')}
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Get Price Alert Modal */}
      <Modal
        backdrop="opaque"
        isOpen={isShowGasAlertModal}
        onClose={() => setShowGasAlertModal(false)}
        hideCloseButton={true}
        placement="center"
        className="max-w-[20.625rem]"
      >
        <ModalContent className="py-3 rounded-[1.75rem] dark:bg-surface-dark bg-custom-white">
          <ModalBody>
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <Image width={64} height={64} src={GasIcon} fallbackSrc={GasIcon} alt="Gas Price Alert" />
              </div>

              <CustomTypography dataAid="setGasPricealert" variant="h1">
                {t('Token.GasPriceTitle')}
              </CustomTypography>
              <CustomTypography dataAid="gasPrice" type="secondary" variant="subtitle">
                {t('Token.GasPriceDesc')}
              </CustomTypography>

              <div className="flex items-center justify-between gap-x-4">
                <Button
                  variant="bordered"
                  data-aid="setCancel"
                  className="my-2"
                  color="outlined"
                  onClick={() => {
                    setShowSetAlertModal(true)
                    setShowGasAlertModal(false)
                  }}
                >
                  {t('Actions.notNow')}
                </Button>
                <Button data-aid="set" color="primary">
                  {t('Actions.viewWallet')}
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SinglePageTitleLayout>
  )
}

export default GasPriceAlert
