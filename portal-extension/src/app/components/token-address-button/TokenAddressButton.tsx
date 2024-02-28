import { ITokenAddressButtonProps } from '@portal/shared/utils/types'
import { Button, CustomTypography, ToolTip } from 'app/components'
import classnames from 'classnames'
import { formatAddress } from 'helpers/addressFormatter'
import { useState } from 'react'
import { CopyIcon, HyperlinkIcon } from '../Icons'

export const TokenAddressButton = ({
  className,
  iconClassname,
  address,
  enableCopy,
  link,
  placement,
}: ITokenAddressButtonProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const handleClickCopy = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    void navigator.clipboard.writeText(address).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <div
      className={classnames(
        className,
        'text-custom-white border-1 border-solid h-8  border-custom-white40 rounded-xl flex items-center justify-center w-fit px-3'
      )}
    >
      <CustomTypography className="text-note" color="text-inherit">
        {address && formatAddress(address)}
      </CustomTypography>

      {enableCopy && (
        <ToolTip title={`${isCopied ? 'Copied' : 'Copy'}`} placement={placement}>
          <Button
            isIconOnly
            size="sm"
            radius="none"
            variant="light"
            className="bg-transparent"
            onClick={handleClickCopy}
          >
            <p>
              <CopyIcon className={classnames(iconClassname, 'fill-custom-white w-4 h-4')} />
            </p>
          </Button>
        </ToolTip>
      )}
      {link && (
        <ToolTip title="Go on page">
          <Button size="sm" isIconOnly onClick={() => window.open(link)} variant="light">
            <HyperlinkIcon className={classnames(iconClassname, 'fill-custom-white w-4 h-4')} />
          </Button>
        </ToolTip>
      )}
    </div>
  )
}
