import PageLayout from 'layouts/index'
import ExtendedLayout from 'layouts/extended-layout/ExtendedLayout'
import Onboarding from 'pages/onboarding'
import CreateAccount from 'pages/onboarding/create-account/CreateAccount'
import ExistingAssets from 'pages/onboarding/existing-assets/ExistingAssets'
import React, { FC, ReactElement, useEffect, useLayoutEffect, useMemo } from 'react'

import { useWallet } from '@portal/shared/hooks/useWallet'
import { useWalletConnect } from '@portal/shared/hooks/useWalletConnect'

import { OpenInFullPage, useAppEnv } from '../env'
import * as Woozie from 'lib/woozie'
import ImportWallet from 'pages/onboarding/import-wallet/ImportWallet'
import { ResolveResult } from 'lib/woozie/router'
import DemoVideo from 'pages/onboarding/demo-video/DemoVideo'
import FreeNFT from 'pages/onboarding/free-nft/FreeNFT'
import Congratulations from 'pages/onboarding/congratulations/Congratulations'
import WalletReset from 'pages/onboarding/wallet-reset/WalletReset'
import RecoveryPhrase from 'pages/onboarding/recovery-phrase/RecoveryPhrase'
import GenerateSeed from 'pages/onboarding/generate-seed/GenerateSeed'
import SelectNetwork from 'pages/onboarding/select-network/SelectNetwork'
import Wallet from 'pages/wallet'
import Login from 'pages/login/Login'
import AddNetwork from 'pages/wallet/network/add-network/AddNetwork'
import Send from 'pages/wallet/token/transaction/send/Send'
import AddressBook from 'pages/wallet/token/transaction/address-book/AddressBook'
import SendReview from 'pages/wallet/token/transaction/send-review/SendReview'
import TokenAsset from 'pages/wallet/token/token-asset/TokenAsset'
import AddToken from 'pages/wallet/token/add-token/AddToken'
import Activity from 'pages/wallet/token/transaction/activity/Activity'
import ReceiveToken from 'pages/wallet/receive-token/ReceiveToken'
import EditAccount from 'pages/account/edit-account/EditAccount'
import CreateSubAccount from 'pages/account/create-sub-account/CreateSubAccount'
import AccountManagement from 'pages/account/account-management/AccountManagement'
import SendNFT from 'pages/wallet/nft/SendNFT'
import SellNFT from 'pages/wallet/nft/SellNFT'
import ImportNFT from 'pages/wallet/nft/import-nft/ImportNFT'
import ImportAccount from 'pages/account/edit-account/ImportAccount'
import ScheduledTransactionHistory from 'pages/settings/scheduled-transaction-history/ScheduledTransactionHistory'
import Settings from 'pages/settings/Settings'
import ChangePassword from 'pages/settings/change-password/ChangePassword'
import Security from 'pages/settings/security/Security'
import NFT from 'pages/wallet/nft/NFT'
import EditAddress from 'pages/settings/addressBook/editAddress/EditAddress'
import AddressBooks from 'pages/settings/addressBook/addressBooks/AddressBooks'
import AddAddress from 'pages/settings/addressBook/addAddress/AddAddress'
import SecretRecoveryPhrase from 'pages/settings/secret-recovery-phrase/SecretRecoveryPhrase'
import AutoLockTimer from 'pages/settings/security/AutoLockTimer'
import ShowPrivateKey from 'pages/account/show-private-key/ShowPrivateKey'
import SwitchNetworkPopOut from 'pages/popouts/switchNetwork/SwitchNetwork'
import AddNetworkPopOut from 'pages/popouts/addNetwork/AddNetwork'
import SigningRequest from 'pages/confirm/signing-request/SigningRequest'
import ConnectingToSignature from 'pages/confirm/signing-request/Connecting'
import ConnectRequest from 'pages/confirm/connect-request/ConnectRequest'
import WalletConnectPage from 'pages/wallet-connect/WalletConnect'
import ProAccountVideo from 'pages/onboarding/pro-account-video/ProAccountVideo'
import RecoveryVideoApp from 'pages/onboarding/recovery-video-app/RecoveryVideoApp'
import ChooseImportMethod from 'pages/onboarding/choose-import-method/ChooseImportMethod'
import ImportByPrivateKey from 'pages/onboarding/import-by-private-key/ImportByPrivateKey'
import ForgotPasswordRecoveryQr from 'pages/onboarding/forgot-password-recovery-qr/ForgotPasswordRecoveryQr'
import GasPriceAlert from 'pages/wallet/token/transaction/gas-price-alert/gas-price'
import AddCustomNetwork from 'pages/wallet/network/add-network/customNetwork'
import NetworkFilter from 'pages/wallet/network/network-filter/NetworkFilter'
import ImportAccountReceoveryPahse from 'pages/account/import-account/choose-import-method/import-account'
import ImportAccountMethod from 'pages/account/import-account/choose-import-method'
import ImportViaPrivateKey from 'pages/account/import-account/choose-import-method/import-by-private-key'
import ImportPrivateKeyAccount from 'pages/account/import-account/choose-import-method/import-by-private-key/import-account'
import Swap from 'pages/swap'
import SwapHistory from 'pages/swap/swapHistory'
import SwapReview from 'pages/swap/swap-review'
import { useSettings } from '@portal/shared/hooks/useSettings'

interface RouteContext {
  popup: boolean
  fullPage: boolean
}

type RouteConfig = {
  url: string
  fullpage: boolean
  component: ReactElement | null
}

type RouteFactory = Woozie.Router.ResolveResult<RouteContext>

function onlyInFullPage(factory: RouteFactory): RouteFactory {
  const FullPage: ResolveResult<RouteContext> = (params, ctx) =>
    !ctx.fullPage ? <OpenInFullPage /> : factory(params, ctx)
  return FullPage
}

function layoutEffect(factory: RouteFactory): RouteFactory {
  const LayoutPage: ResolveResult<RouteContext> = (params, ctx) =>
    !ctx.fullPage ? (
      <PageLayout>{factory(params, ctx)}</PageLayout>
    ) : (
      <ExtendedLayout>{factory(params, ctx)}</ExtendedLayout>
    )
  return LayoutPage
}

// This will be the main routing for both setup
export const routes: Array<RouteConfig> = [
  {
    url: '/home',
    fullpage: false,
    component: <Wallet />,
  },
  {
    url: '/login',
    fullpage: false,
    component: <Login />,
  },
  // {
  //   url: '/network',
  //   fullpage: false,
  //   component: <Network />,
  // },
  {
    url: '/network/add',
    fullpage: false,
    component: <AddNetwork />,
  },
  {
    url: '/network-filter',
    fullpage: false,
    component: <NetworkFilter />,
  },
  {
    url: '/transaction/send/:network/:token',
    fullpage: false,
    component: <Send />,
  },
  {
    url: '/transaction/gas-price-alert/:network/:token',
    fullpage: false,
    component: <GasPriceAlert />,
  },
  {
    url: '/transaction/address-book',
    fullpage: false,
    component: <AddressBook />,
  },
  {
    url: '/transaction/send-review',
    fullpage: false,
    component: <SendReview />,
  },
  {
    url: '/transaction/send-later-review',
    fullpage: false,
    component: <SendReview sendLater />,
  },

  {
    url: '/token/add',
    fullpage: false,
    component: <AddToken />,
  },
  {
    url: '/nft/:network/:contract/:token',
    fullpage: false,
    component: <NFT />,
  },
  {
    url: '/nft/review',
    fullpage: false,
    component: <SendReview />,
  },
  {
    url: '/nft/send/:network/:contract/:token',
    fullpage: false,
    component: <SendNFT />,
  },
  {
    url: '/nft/sell',
    fullpage: false,
    component: <SellNFT />,
  },
  {
    url: '/nft/import',
    fullpage: false,
    component: <ImportNFT />,
  },
  {
    url: '/token/:network/:token',
    fullpage: false,
    component: <TokenAsset />,
  },
  {
    url: '/token/:network/:token/activity/:id',
    fullpage: false,
    component: <Activity />,
  },
  {
    url: '/account/import',
    fullpage: false,
    component: <ImportAccount />,
  },
  {
    url: '/account/import-account',
    fullpage: false,
    component: <ImportAccountReceoveryPahse />,
  },
  {
    url: '/account/choose-account-import-method',
    fullpage: false,
    component: <ImportAccountMethod />,
  },
  {
    url: '/account/import-by-private-key',
    fullpage: false,
    component: <ImportViaPrivateKey />,
  },
  {
    url: '/account/import-account-private-key',
    fullpage: false,
    component: <ImportPrivateKeyAccount />,
  },
  {
    url: '/token/:token/receive/:network',
    fullpage: false,
    component: <ReceiveToken />,
  },
  {
    url: '/onboarding/create',
    fullpage: true,
    component: <CreateAccount />,
  },
  {
    url: '/onboarding/existing-assets',
    fullpage: true,
    component: <ExistingAssets />,
  },
  {
    url: '/onboarding/import-wallet',
    fullpage: true,
    component: <ImportWallet />,
  },
  {
    url: '/onboarding/import-wallet/create',
    fullpage: true,
    component: <CreateAccount importWallet />,
  },
  {
    url: '/onboarding/import-wallet-restore',
    fullpage: true,
    component: <ImportWallet restoreAccount />,
  },
  {
    url: '/onboarding/select-network',
    fullpage: true,
    component: <SelectNetwork />,
  },
  {
    url: '/onboarding/demo-video',
    fullpage: true,
    component: <DemoVideo />,
  },
  {
    url: '/onboarding/free-nft',
    fullpage: true,
    component: <FreeNFT image="images/demo/nft.png" title="How you dune #32" createdBy="@Prettycooltim" />,
  },
  {
    url: '/onboarding/congratulations',
    fullpage: true,
    component: <Congratulations />,
  },
  {
    url: '/onboarding/walletreset',
    fullpage: true,
    component: <WalletReset />,
  },
  {
    url: '/onboarding/recovery-phrase',
    fullpage: true,
    component: <RecoveryPhrase />,
  },
  {
    url: '/onboarding/generate-seed',
    fullpage: true,
    component: <GenerateSeed />,
  },
  {
    url: '/account/list',
    fullpage: false,
    component: <WalletConnectPage />,
  },
  {
    url: '/account/edit/:username',
    fullpage: false,
    component: <EditAccount />,
  },
  {
    url: '/account/create-sub-account',
    fullpage: false,
    component: <CreateSubAccount />,
  },
  {
    url: '/settings',
    fullpage: false,
    component: <Settings />,
  },
  {
    url: '/settings/security',
    fullpage: false,
    component: <Security />,
  },
  {
    url: '/settings/security/auto-lock-timer',
    fullpage: false,
    component: <AutoLockTimer />,
  },
  {
    url: '/settings/scheduled-transaction-history',
    fullpage: false,
    component: <ScheduledTransactionHistory />,
  },
  { url: '/account', fullpage: false, component: <AccountManagement /> },
  {
    url: '/settings/change-password',
    fullpage: false,
    component: <ChangePassword />,
  },
  {
    url: 'settings/edit-address',
    fullpage: false,
    component: <EditAddress />,
  },
  {
    url: 'settings/address-book',
    fullpage: false,
    component: <AddressBooks />,
  },
  {
    url: 'settings/add-address',
    fullpage: false,
    component: <AddAddress />,
  },
  { url: '/settings/security/secret-recovery-phrase', fullpage: false, component: <SecretRecoveryPhrase /> },
  {
    url: '/account/show-private-key/:address',
    fullpage: false,
    component: <ShowPrivateKey />,
  },
  {
    url: '/popout/switch-network',
    fullpage: false,
    component: <SwitchNetworkPopOut />,
  },
  {
    url: '/popout/add-network',
    fullpage: false,
    component: <AddNetworkPopOut />,
  },
  {
    url: '/confirm/signing-request',
    fullpage: false,
    component: <SigningRequest />,
  },
  {
    url: '/confirm/connecting',
    fullpage: false,
    component: <ConnectingToSignature />,
  },
  {
    url: '/confirm/connect-request',
    fullpage: false,
    component: <ConnectRequest />,
  },
  {
    url: '/wallet-connect',
    fullpage: false,
    component: <WalletConnectPage />,
  },
  {
    url: '/onboarding/pro-account-video',
    fullpage: false,
    component: <ProAccountVideo />,
  },
  {
    url: '/onboarding/recovery-video-app',
    fullpage: true,
    component: <RecoveryVideoApp />,
  },
  {
    url: '/onboarding/choose-import-method',
    fullpage: true,
    component: <ChooseImportMethod />,
  },
  {
    url: '/onboarding/import-by-private-key',
    fullpage: true,
    component: <ImportByPrivateKey />,
  },
  {
    url: '/onboarding/forgot-password-recovery-qr',
    fullpage: true,
    component: <ForgotPasswordRecoveryQr />,
  },
  {
    url: 'onboarding/add-custom-network',
    fullpage: false,
    component: <AddCustomNetwork />,
  },
  {
    url: '/swap',
    fullpage: false,
    component: <Swap />,
  },
  {
    url: '/swap/swap-history',
    fullpage: false,
    component: <SwapHistory />,
  },
  {
    url: '/swap/swap-review',
    fullpage: false,
    component: <SwapReview />,
  },
  {
    url: '/onboarding/import-wallet/create/:network',
    fullpage: true,
    component: <CreateAccount importWallet />,
  },
]

const convertRoutesForMap: [string, ResolveResult<RouteContext>][] = routes.map((route) => {
  if (route.fullpage) {
    return [route.url, onlyInFullPage(layoutEffect(() => route.component))]
  } else {
    return [route.url, layoutEffect(() => route.component)]
  }
})

const ROUTE_MAP = (lockWallet: boolean) => {
  return Woozie.Router.createMap<RouteContext>([
    [
      '/',
      layoutEffect(() =>
        Object.keys(useSettings.getState().accounts).length ? lockWallet ? <Login /> : <Wallet /> : <Onboarding />
      ),
    ],
    ...convertRoutesForMap,
    ['*', () => <Woozie.Redirect to="/" />],
  ])
}

const PageRouter: FC = () => {
  const { trigger, pathname } = Woozie.useLocation()
  const { lockWallet } = useWallet()
  const { createSession, sessionRequest, session, callRequest } = useWalletConnect()
  const { navigate } = Woozie.useNavigate()

  useEffect(() => {
    if (session) {
      createSession()
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    if (sessionRequest) {
      navigate('/confirm/connect-request')
    }
  }, [sessionRequest]) // eslint-disable-line

  useEffect(() => {
    if (callRequest) {
      navigate('/confirm/signing-request')
    }
  }, [callRequest]) // eslint-disable-line

  // Scroll to top after new location pushed.
  useEffect(() => {
    if (lockWallet) {
      navigate('/')
    }
  }, [lockWallet]) // eslint-disable-line

  useLayoutEffect(() => {
    if (trigger === Woozie.HistoryAction.Push) {
      window.scrollTo(0, 0)
    }

    if (pathname === '/') {
      Woozie.resetHistoryPosition()
    }
  }, [trigger, pathname])

  const appEnv = useAppEnv()

  const ctx = useMemo<RouteContext>(
    () => ({
      popup: appEnv.popup,
      fullPage: appEnv.fullPage,
    }),
    [appEnv.popup, appEnv.fullPage]
  )

  return useMemo(() => Woozie.Router.resolve(ROUTE_MAP(lockWallet), pathname, ctx), [pathname, ctx, lockWallet])
}

export default PageRouter
