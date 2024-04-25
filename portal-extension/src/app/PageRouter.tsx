import ExtendedLayout from 'layouts/extended-layout/ExtendedLayout'
import PageLayout from 'layouts/index'
import Onboarding from 'pages/onboarding'
import CreateAccount from 'pages/onboarding/create-account/CreateAccount'
import { FC, ReactElement, useEffect, useLayoutEffect, useMemo } from 'react'

import { useWallet } from '@portal/shared/hooks/useWallet'
import { useWalletConnect } from '@portal/shared/hooks/useWalletConnect'

import { setLockUp } from '@portal/shared/hooks/useLockUp'
import { useSessionStore } from '@portal/shared/hooks/useSessionStore'
import { useSettings } from '@portal/shared/hooks/useSettings'
import * as Woozie from 'lib/woozie'
import { ResolveResult } from 'lib/woozie/router'
import AccountManagement from 'pages/account/account-management/AccountManagement'
import CreateSubAccount from 'pages/account/create-sub-account/CreateSubAccount'
import EditAccount from 'pages/account/edit-account/EditAccount'
import ImportAccount from 'pages/account/edit-account/ImportAccount'
import ImportAccountMethod from 'pages/account/import-account/choose-import-method'
import ImportAccountReceoveryPahse from 'pages/account/import-account/choose-import-method/import-account'
import ImportViaPrivateKey from 'pages/account/import-account/choose-import-method/import-by-private-key'
import ImportPrivateKeyAccount from 'pages/account/import-account/choose-import-method/import-by-private-key/import-account'
import ShowPrivateKey from 'pages/account/show-private-key/ShowPrivateKey'
import ConnectRequest from 'pages/confirm/connect-request/ConnectRequest'
import ConnectingToSignature from 'pages/confirm/signing-request/Connecting'
import SigningRequest from 'pages/confirm/signing-request/SigningRequest'
import Login from 'pages/login/Login'
import ChooseImportMethod from 'pages/onboarding/choose-import-method/ChooseImportMethod'
import Congratulations from 'pages/onboarding/congratulations/Congratulations'
import DemoVideo from 'pages/onboarding/demo-video/DemoVideo'
import ForgotPasswordRecoveryQr from 'pages/onboarding/forgot-password-recovery-qr/ForgotPasswordRecoveryQr'
import FreeNFT from 'pages/onboarding/free-nft/FreeNFT'
import GenerateSeed from 'pages/onboarding/generate-seed/GenerateSeed'
import ImportByPrivateKey from 'pages/onboarding/import-by-private-key/ImportByPrivateKey'
import ImportByRecoveryFiles from 'pages/onboarding/import-by-recovery-files/ImportByRecoveryFiles'
import ImportWallet from 'pages/onboarding/import-wallet/ImportWallet'
import ProAccountVideo from 'pages/onboarding/pro-account-video/ProAccountVideo'
import RecoveryFileVideo from 'pages/onboarding/recovery-file-video/RecoveryFileVideo'
import RecoveryFile from 'pages/onboarding/recovery-file/RecoveryFile'
import RecoveryOptions from 'pages/onboarding/recovery-options/RecoveryOptions'
import RecoveryPhrase from 'pages/onboarding/recovery-phrase/RecoveryPhrase'
import RecoveryVideoApp from 'pages/onboarding/recovery-video-app/RecoveryVideoApp'
import WalletIsSecured from 'pages/onboarding/wallet-is-secured/WalletIsSecured'
import WalletReset from 'pages/onboarding/wallet-reset/WalletReset'
import AddNetworkPopOut from 'pages/popouts/addNetwork/AddNetwork'
import SwitchNetworkPopOut from 'pages/popouts/switchNetwork/SwitchNetwork'
import Settings from 'pages/settings/Settings'
import AddAddress from 'pages/settings/addressBook/addAddress/AddAddress'
import AddressBooks from 'pages/settings/addressBook/addressBooks/AddressBooks'
import EditAddress from 'pages/settings/addressBook/editAddress/EditAddress'
import ChangePassword from 'pages/settings/change-password/ChangePassword'
import SecurityRecoveryFile from 'pages/settings/recovery-file/SecurityRecoveryFile'
import ScheduledTransactionHistory from 'pages/settings/scheduled-transaction-history/ScheduledTransactionHistory'
import SecretRecoveryPhrase from 'pages/settings/secret-recovery-phrase/SecretRecoveryPhrase'
import AutoLockTimer from 'pages/settings/security/AutoLockTimer'
import Security from 'pages/settings/security/Security'
import Swap from 'pages/swap'
import SwapReview from 'pages/swap/swap-review'
import SwapHistory from 'pages/swap/swapHistory'
import Wallet from 'pages/wallet'
import WalletConnectPage from 'pages/wallet-connect/WalletConnect'
import AddNetwork from 'pages/wallet/network/add-network/AddNetwork'
import AddCustomNetwork from 'pages/wallet/network/add-network/customNetwork'
import NetworkFilter from 'pages/wallet/network/network-filter/NetworkFilter'
import NFT from 'pages/wallet/nft/NFT'
import SellNFT from 'pages/wallet/nft/SellNFT'
import SendNFT from 'pages/wallet/nft/SendNFT'
import ImportNFT from 'pages/wallet/nft/import-nft/ImportNFT'
import ReceiveToken from 'pages/wallet/receive-token/ReceiveToken'
import AddToken from 'pages/wallet/token/add-token/AddToken'
import TokenAsset from 'pages/wallet/token/token-asset/TokenAsset'
import Activity from 'pages/wallet/token/transaction/activity/Activity'
import AddressBook from 'pages/wallet/token/transaction/address-book/AddressBook'
import GasPriceAlert from 'pages/wallet/token/transaction/gas-price-alert/gas-price'
import SendReview from 'pages/wallet/token/transaction/send-review/SendReview'
import Send from 'pages/wallet/token/transaction/send/Send'
import { OpenInFullPage, useAppEnv } from '../env'

interface RouteContext {
  popup: boolean
  fullPage: boolean
}

type RouteConfig = {
  url: string
  fullpage: boolean
  component: ReactElement | null
  allowAccessAfterOnboarding: boolean
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
    allowAccessAfterOnboarding: false,
    component: <Wallet />,
  },
  {
    url: '/login',
    fullpage: false,
    allowAccessAfterOnboarding: false,
    component: <Login />,
  },

  {
    url: '/network/add',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <AddNetwork />,
  },
  {
    url: '/network-filter',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <NetworkFilter />,
  },
  {
    url: '/transaction/send/:network/:token',
    allowAccessAfterOnboarding: true,
    fullpage: false,
    component: <Send />,
  },
  {
    url: '/transaction/gas-price-alert/:network/:token',
    allowAccessAfterOnboarding: true,
    fullpage: false,
    component: <GasPriceAlert />,
  },
  {
    url: '/transaction/address-book',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <AddressBook />,
  },
  {
    url: '/transaction/:network/address-book',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <AddressBook />,
  },
  {
    url: '/transaction/send-review',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <SendReview />,
  },
  {
    url: '/transaction/send-later-review',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <SendReview sendLater />,
  },

  {
    url: '/token/add',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <AddToken />,
  },
  {
    url: '/nft/:network/:contract/:token',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <NFT />,
  },
  {
    url: '/nft/review',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <SendReview />,
  },
  {
    url: '/nft/send/:network/:contract/:token',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <SendNFT />,
  },
  {
    url: '/nft/sell',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <SellNFT />,
  },
  {
    url: '/nft/import',
    fullpage: false,
    allowAccessAfterOnboarding: false,
    component: <ImportNFT />,
  },
  {
    url: '/token/:network/:token',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <TokenAsset />,
  },
  {
    url: '/token/:network/:token/activity/:id',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <Activity />,
  },
  {
    url: '/account/import',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <ImportAccount />,
  },
  {
    url: '/account/import-account',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <ImportAccountReceoveryPahse />,
  },
  {
    url: '/account/choose-account-import-method',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <ImportAccountMethod />,
  },
  {
    url: '/account/import-by-private-key',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <ImportViaPrivateKey />,
  },
  {
    url: '/account/import-account-private-key',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <ImportPrivateKeyAccount />,
  },
  {
    url: '/token/:token/receive/:network',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <ReceiveToken />,
  },
  {
    url: '/onboarding/create',
    fullpage: true,
    allowAccessAfterOnboarding: false,
    component: <CreateAccount />,
  },
  {
    url: '/onboarding/import-wallet',
    fullpage: true,
    allowAccessAfterOnboarding: true,
    component: <ImportWallet />,
  },
  {
    url: '/onboarding/import-wallet/create',
    fullpage: true,
    allowAccessAfterOnboarding: true,
    component: <CreateAccount importWallet />,
  },
  {
    url: '/onboarding/import-wallet-restore',
    fullpage: true,
    allowAccessAfterOnboarding: false,
    component: <ImportWallet restoreAccount />,
  },
  {
    url: '/onboarding/demo-video',
    fullpage: true,
    allowAccessAfterOnboarding: false,
    component: <DemoVideo />,
  },
  {
    url: '/onboarding/recovery-options',
    fullpage: true,
    allowAccessAfterOnboarding: false,
    component: <RecoveryOptions />,
  },
  {
    url: '/onboarding/recovery-file-video',
    fullpage: true,
    allowAccessAfterOnboarding: false,
    component: <RecoveryFileVideo />,
  },
  {
    url: '/onboarding/recovery-file',
    fullpage: true,
    allowAccessAfterOnboarding: false,
    component: <RecoveryFile />,
  },
  {
    url: '/onboarding/wallet-is-secured',
    fullpage: true,
    allowAccessAfterOnboarding: true,
    component: <WalletIsSecured />,
  },
  {
    url: '/onboarding/free-nft',
    fullpage: true,
    allowAccessAfterOnboarding: false,
    component: <FreeNFT image="images/demo/nft.png" title="How you dune #32" createdBy="@Prettycooltim" />,
  },
  {
    url: '/onboarding/congratulations',
    fullpage: true,
    allowAccessAfterOnboarding: true,
    component: <Congratulations />,
  },
  {
    url: '/onboarding/walletreset',
    fullpage: true,
    allowAccessAfterOnboarding: false,
    component: <WalletReset />,
  },
  {
    url: '/onboarding/recovery-phrase',
    fullpage: true,
    allowAccessAfterOnboarding: false,
    component: <RecoveryPhrase />,
  },
  {
    url: '/onboarding/generate-seed',
    fullpage: true,
    allowAccessAfterOnboarding: false,
    component: <GenerateSeed />,
  },
  {
    url: '/account/list',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <WalletConnectPage />,
  },
  {
    url: '/account/edit/:username',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <EditAccount />,
  },
  {
    url: '/account/create-sub-account',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <CreateSubAccount />,
  },
  {
    url: '/settings',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <Settings />,
  },
  {
    url: '/settings/security',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <Security />,
  },
  {
    url: '/settings/security/auto-lock-timer',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <AutoLockTimer />,
  },
  {
    url: '/settings/scheduled-transaction-history',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <ScheduledTransactionHistory />,
  },
  { url: '/account', fullpage: false, allowAccessAfterOnboarding: true, component: <AccountManagement /> },
  {
    url: '/settings/change-password',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <ChangePassword />,
  },
  {
    url: 'settings/edit-address',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <EditAddress />,
  },
  {
    url: 'settings/address-book',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <AddressBooks />,
  },
  {
    url: 'settings/add-address',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <AddAddress />,
  },
  {
    url: '/settings/security/secret-recovery-phrase',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <SecretRecoveryPhrase />,
  },
  {
    url: '/settings/security/recovery-file',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <SecurityRecoveryFile />,
  },
  {
    url: '/account/show-private-key/:address',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <ShowPrivateKey />,
  },
  {
    url: '/popout/switch-network',
    fullpage: false,
    allowAccessAfterOnboarding: false,
    component: <SwitchNetworkPopOut />,
  },
  {
    url: '/popout/add-network',
    fullpage: false,
    allowAccessAfterOnboarding: false,
    component: <AddNetworkPopOut />,
  },
  {
    url: '/confirm/signing-request',
    fullpage: false,
    allowAccessAfterOnboarding: false,
    component: <SigningRequest />,
  },
  {
    url: '/confirm/connecting',
    fullpage: false,
    allowAccessAfterOnboarding: false,
    component: <ConnectingToSignature />,
  },
  {
    url: '/confirm/connect-request',
    fullpage: false,
    allowAccessAfterOnboarding: false,
    component: <ConnectRequest />,
  },
  {
    url: '/wallet-connect',
    fullpage: false,
    allowAccessAfterOnboarding: false,
    component: <WalletConnectPage />,
  },
  {
    url: '/onboarding/pro-account-video',
    fullpage: false,
    allowAccessAfterOnboarding: false,
    component: <ProAccountVideo />,
  },
  {
    url: '/onboarding/recovery-video-app',
    fullpage: true,
    allowAccessAfterOnboarding: false,
    component: <RecoveryVideoApp />,
  },
  {
    url: '/onboarding/choose-import-method',
    fullpage: true,
    allowAccessAfterOnboarding: true,
    component: <ChooseImportMethod />,
  },
  {
    url: '/onboarding/import-by-private-key',
    fullpage: true,
    allowAccessAfterOnboarding: true,
    component: <ImportByPrivateKey />,
  },
  {
    url: '/onboarding/import-by-recovery-files',
    fullpage: true,
    allowAccessAfterOnboarding: true,
    component: <ImportByRecoveryFiles />,
  },
  {
    url: '/onboarding/forgot-password-recovery-qr',
    fullpage: true,
    allowAccessAfterOnboarding: false,
    component: <ForgotPasswordRecoveryQr />,
  },
  {
    url: 'onboarding/add-custom-network',
    fullpage: false,
    allowAccessAfterOnboarding: false,
    component: <AddCustomNetwork />,
  },
  {
    url: '/swap',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <Swap />,
  },
  {
    url: '/swap/swap-history',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <SwapHistory />,
  },
  {
    url: '/swap/swap-review',
    fullpage: false,
    allowAccessAfterOnboarding: true,
    component: <SwapReview />,
  },
  {
    url: '/onboarding/import-wallet/create/:network',
    fullpage: true,
    allowAccessAfterOnboarding: true,
    component: <CreateAccount importWallet />,
  },
]

const convertRoutesForMap = (isCreateWalletProcessCompleted?: boolean) => {
  return routes.map((route) => {
    if (!route.allowAccessAfterOnboarding && isCreateWalletProcessCompleted) {
      return [route.url, () => <Woozie.Redirect to="/" />]
    }

    if (route.fullpage) {
      return [route.url, onlyInFullPage(layoutEffect(() => route.component))]
    } else {
      return [route.url, layoutEffect(() => route.component)]
    }
  })
}

const ROUTE_MAP = (lockWallet: boolean, isCreateWalletProcessCompleted: boolean) => {
  return Woozie.Router.createMap<RouteContext>([
    [
      '/',
      layoutEffect(() =>
        !isCreateWalletProcessCompleted ? (
          <Onboarding />
        ) : Object.keys(useSettings.getState().accounts).length ? (
          lockWallet ? (
            <Login />
          ) : isCreateWalletProcessCompleted ? (
            <Wallet />
          ) : (
            <Onboarding />
          )
        ) : (
          <Onboarding />
        )
      ),
    ],
    ...(convertRoutesForMap(isCreateWalletProcessCompleted) as any),
    ['*', () => <Woozie.Redirect to="/" />],
  ])
}

const PageRouter: FC = () => {
  const { trigger, pathname } = Woozie.useLocation()
  const { lockWallet, isCreateWalletProcessCompleted, setLockWallet } = useWallet()
  const { encryptedPassword } = useSessionStore()
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

  useEffect(() => {
    if (pathname !== '/' && !pathname.startsWith('/onboarding/') && (lockWallet || !encryptedPassword)) {
      navigate('/')
    }
  }, [lockWallet, encryptedPassword, pathname]) // eslint-disable-line

  useEffect(() => {
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener(function (message) {
      if (message?.lockWalletUpdated) {
        setLockWallet(true)
      }
    })
  }, [setLockWallet])

  useLayoutEffect(() => {
    if (trigger === Woozie.HistoryAction.Push) {
      window.scrollTo(0, 0)
    }

    if (pathname === '/') {
      Woozie.resetHistoryPosition()
    }
    if (!lockWallet && isCreateWalletProcessCompleted) {
      //Set auto time lock start on every activity
      setLockUp(true)
    }
  }, [trigger, pathname, lockWallet, isCreateWalletProcessCompleted])

  const appEnv = useAppEnv()

  const ctx = useMemo<RouteContext>(
    () => ({
      popup: appEnv.popup,
      fullPage: appEnv.fullPage,
    }),
    [appEnv.popup, appEnv.fullPage]
  )

  const allRouteMap = useMemo(
    () => ROUTE_MAP(lockWallet || !encryptedPassword, isCreateWalletProcessCompleted),
    [lockWallet, encryptedPassword, isCreateWalletProcessCompleted]
  )
  return useMemo(() => Woozie.Router.resolve(allRouteMap, pathname, ctx), [pathname, ctx, lockWallet])
}

export default PageRouter
