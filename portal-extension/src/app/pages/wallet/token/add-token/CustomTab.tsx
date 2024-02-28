/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useState } from 'react'
import { useNavigate } from 'lib/woozie'
import { useTranslation } from 'react-i18next'
import { Input, CustomTypography, TokenBalance, Button } from 'app/components'
import { CloseRoundedIcon, SpinnerIcon } from '@src/app/components/Icons'
import { ICustomTabProps } from '@portal/shared/utils/types'
import AddSuccessModal from 'pages/wallet/AddSuccessModal'

const CustomTab = ({ filteredData, contractAddress, loading, errorMsg, setContractAddress }: ICustomTabProps) => {
  const { navigate } = useNavigate()
  const { t } = useTranslation()
  const showFilteredData = Object.keys(filteredData || {}).length !== 0
  const [isShowModal, setShowModal] = useState<boolean>(false)

  return (
    <div className="text-custom-white flex flex-col justify-between h-full">
      <div>
        <CustomTypography variant="body">{t('Token.addCustomToken')}</CustomTypography>
        <CustomTypography className="py-3 underline underline-offset-2 dark:text-secondary" variant="subtitle">
          {t('Token.customTokenInformation')}
        </CustomTypography>
        <div className="space-y-4">
          <div>
            <Input
              onChange={(e) => setContractAddress(e.target.value as string)}
              value={contractAddress}
              fullWidth
              dataTestId="contract-address-input"
              mainColor
              placeholder="Contract Address"
              error={errorMsg}
              icon={
                contractAddress.length ? (
                  <div onClick={() => setContractAddress('')} className="cursor-pointer">
                    <CloseRoundedIcon />
                  </div>
                ) : null
              }
            />
            {!errorMsg && showFilteredData && (
              <div className="py-4">
                <TokenBalance
                  token={filteredData?.name}
                  acronym={filteredData?.acronym}
                  balance="$0"
                  percentage={filteredData?.percentage}
                  thumbnail={filteredData?.image}
                />
              </div>
            )}
          </div>

          <Input
            value={filteredData?.symbol}
            // onChange={}
            fullWidth
            dataTestId="symbol-input"
            mainColor
            placeholder="Symbol"
            // error={errorMsg}
          />
          <Input
            value={filteredData?.decimal}
            // onChange={}
            fullWidth
            dataTestId="Decimal-input"
            mainColor
            placeholder="Decimal"
            // error={errorMsg}
          />
        </div>
      </div>

      <div className="flex mt-8 gap-2">
        <Button color="outlined" variant="bordered" onClick={() => navigate('/home')}>
          {t('Actions.cancel')}
        </Button>

        <Button
          data-test-id="add-token-btn"
          color={`${!loading ? 'disabled' : 'primary'}`}
          isDisabled={!loading || errorMsg}
          onClick={() => setShowModal(true)}
          isLoading={loading}
          spinner={<SpinnerIcon />}
        >
          {!loading && t('Actions.add')}
        </Button>
      </div>

      <AddSuccessModal openModal={isShowModal} closeModal={() => setShowModal(false)} name={filteredData?.name} />
    </div>
  )
}

export default CustomTab
