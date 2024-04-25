/* eslint-disable @typescript-eslint/no-floating-promises */
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { default as networks } from '@portal/shared/data/networks.json'
import { useSettings } from '@portal/shared/hooks/useSettings'
import { useWalletConnect } from '@portal/shared/hooks/useWalletConnect'
import { AngleDownIcon, CheckPrimaryIcon } from '@src/app/components/Icons'
import HomeWalletLayout from 'app/layouts/wallet-layout/WalletLayout'
import classnames from 'classnames'
import { Button, CustomTypography, Input, useModalContext } from 'components'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AccountItem from './AccountItem'

const WalletConnect = () => {
  const { t } = useTranslation()
  const { createSession, setSelectedChainId, selectedChainId, disconnect, session } = useWalletConnect()
  const { accounts } = useSettings()
  const { setModalData } = useModalContext()

  const [walletConnectURI, setWalletConnectURI] = useState<string>('')

  const connectedAccounts = useMemo(() => {
    return (
      session?.accounts
        .map((account) => {
          const username = accounts[account].username
          return { address: account, username }
        })
        .sort((a, b) => a.username.localeCompare(b.username)) || []
    )
  }, [accounts, session])

  const onChangeWalletConnectURI = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWalletConnectURI(event.target.value)
  }

  const handleConnectClick = () => {
    try {
      createSession(walletConnectURI)
    } catch (error) {
      console.error('connect error', error)
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message
      setModalData({
        type: 'error',
        errorMsg: message,
      })
    } finally {
      setWalletConnectURI('')
    }
  }

  const handleDisconnectClick = () => {
    try {
      disconnect()
    } catch (error) {
      console.error('disconnect error', error)
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message
      setModalData({
        type: 'error',
        errorMsg: message,
      })
    }
  }

  const selectedChainName = useMemo(() => {
    return networks.find((n) => n.chainId === selectedChainId)?.name
  }, [selectedChainId])

  const selectedIconClass = classnames('absolute left-4 top-3')

  return (
    <HomeWalletLayout isConnected={session?.connected} title="WalletConnect" showAccounts={false} noBackground>
      {session && session?.connected ? (
        <div className="px-4 pt-4">
          <div className="flex gap-2">
            <div className="text-[2rem]">
              <img className="h-9 w-9 rounded-full" alt="token-thumbnail" src={session?.peerMeta?.icons[0]} />
            </div>

            <div className="flex flex-col">
              <CustomTypography variant="subtitle">{session?.peerMeta?.name}</CustomTypography>
              <a
                href={session?.peerMeta?.url}
                target="new"
                className="font-bold underline text-sm text-[#363A5B] dark:text-[#F63190]"
              >
                {session?.peerMeta?.url}
              </a>
            </div>
          </div>

          <CustomTypography variant="subtitle" className="my-4">
            {t('Account.connectedAccounts', { length: connectedAccounts.length })}
          </CustomTypography>

          {connectedAccounts.map((val) => (
            <AccountItem
              key={val.address}
              accountId={val.id}
              selected={val.address === session.accounts[0]}
              address={val.address}
              username={val.username}
              onDelete={handleDisconnectClick}
            />
          ))}
        </div>
      ) : (
        <div className="px-4">
          <Input
            type="text"
            fullWidth
            mainColor
            placeholder="e.g. wc:a281567bb3e4..."
            value={walletConnectURI}
            onChange={onChangeWalletConnectURI}
            endAdornment={
              <Button
                className="h-8 rounded-xl cursor-pointer"
                size="sm"
                variant="flat"
                color="outlined"
                disabled={!walletConnectURI}
                onClick={handleConnectClick}
              >
                Connect
              </Button>
            }
          />
        </div>
      )}
      <div className="flex px-6 mt-4 justify-end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button variant="flat" className="capitalize bg-transparent" color="outlined" size="sm" fullWidth={false}>
              {selectedChainName}
              <AngleDownIcon className="ml-2" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Single selection example"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedChainName}
            onSelectionChange={(chainId: number) => setSelectedChainId(chainId)}
            itemClasses={{ selectedIcon: selectedIconClass }}
          >
            {networks
              .filter((n) => [1, 3, 5, 42].includes(n.chainId as number))
              .map((network) => (
                <DropdownItem
                  key={network.name}
                  onClick={() => setSelectedChainId(network.chainId)}
                  className="h-11 pl-12 font-extrabold text-sm capitalize"
                  selectedIcon={
                    network.name === selectedChainName ? (
                      <CheckPrimaryIcon className="w-5 h-5 bg-gradient-primary rounded-full" />
                    ) : (
                      ''
                    )
                  }
                >
                  {network.name}
                </DropdownItem>
              ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </HomeWalletLayout>
  )
}

export default WalletConnect
