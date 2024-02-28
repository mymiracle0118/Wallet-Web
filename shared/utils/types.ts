import { ethers } from 'ethers'
import { AppEnvironment } from 'portal-extension/src/env'
import { ChangeEvent, Dispatch, ReactElement, ReactNode, SetStateAction } from 'react'
import { AddressBookUser } from 'shared/hooks/useSettings'
import { NetworkAssetsCollection } from 'shared/hooks/useWallet'
import { TokenDataProps } from 'shared/services/coingecko'

export enum NETWORKS {
  Goerli = 'goerli',
  Ethereum = 'ethereum',
  SUI = 'SUI',
  APTOS = 'APTOS',
  Solana_Devnet = 'devnet',
  SOLANA = 'solana',
  SUPRA = 'SUPRA',
}

export enum TxStatus {
  Scheduled = 'Scheduled',
  Pending = 'Pending',
  Completed = 'Completed',
}

export interface TransferPayload {
  recipientAddress: string
  amount: number
  network: string
  rpcUrl?: string
  privateKey: string
  gasPrice?: string
  tokenAddress?: string
  nonce?: number
  data?: string
  gasLimit?: number
  fee?: number // defaults to 10000
  subtractFee?: boolean // defaults to false
}

export interface BalancePayload {
  address: string
  network: string
  rpcUrl?: string
  tokenAddress?: string
}

export interface CreateWalletPayload {
  derivationPath?: string
  cluster?: string
  network: string
}

export interface GetAddressFromPrivateKeyPayload {
  privateKey: string
  network: string
}

export interface GetTransactionPayload {
  rpcUrl?: string
  hash: string
  network: string
}

export interface GenerateWalletFromMnemonicPayload {
  mnemonic: string
  derivationPath?: string
  cluster?: string
  network: string
}

export interface IResponse {
  [key: string]: any
}

export interface GetEncryptedJsonFromPrivateKey {
  password: string
  privateKey: string
  network: string
}

export interface GetWalletFromEncryptedjsonPayload {
  json: string
  password: string
  network: string
}

export interface IGetTokenInfoPayload {
  network: string
  rpcUrl: string
  address: string
  cluster?: 'mainnet-beta' | 'testnet' | 'devnet'
}

export interface ITokenInfo {
  name: string
  symbol: string
  address: string
  decimals: number
  totalSupply: number
  logoUrl?: string
}

export interface ISplTokenInfo {
  chainId: number
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI?: string
  tags: string[]
  extensions: any
}

export interface ISmartContractCallPayload {
  rpcUrl: string
  network: string
  contractAddress: string
  method: string
  methodType: 'read' | 'write'
  params: any[]
  payment?: any[]
  value?: number
  contractAbi?: any[]
  gasPrice?: string
  gasLimit?: number
  nonce?: number
  privateKey?: string
}

export type Transaction = {
  asset: NetworkToken
  to: string
  amount?: string
  gasOption: GasOption
  hash?: string
  nonce?: number
}

export enum GasOption {
  Low = 1,
  Market = 2,
  Aggressive = 3,
}

export type AssetType = 'layer1' | 'erc20' | 'erc721'
export type Asset = {
  id: string
  network: string
  chain: 'ethereum' | string
  type: AssetType
  contractAddress?: string
  name?: string
  symbol?: string
  decimal?: ethers.BigNumberish | number
  balance?: ethers.BigNumberish | number
  formattedBalance?: number
  token?: string
  image?: string
  metadata?: { image: string; attributes: Array<{ trait_type: string; value: string }> }
  enabledAsDefault?: boolean
  aptosType?: string
}

export interface IAccountItemProps {
  avatar: string
  active?: boolean
  address: string
  userName: string
  balance: number | string
  onClick?: (userName: string) => void
  isAccountImported?: boolean
}

export interface AccountOptionProps {
  key: string
  icon: React.ReactNode
  name: string
  onAction: () => void
  accountImported?: boolean
  address?: string
}

export interface IActivityFilterProps {
  key: string
  icon?: ReactElement | string
  name: string
}

export interface INetworkItemProps {
  id: number
  networkId?: string
  image: SVGRectElement | ReactElement | string
  coin: string
  address?: string
  active?: boolean
  link?: string
  onClick?: (networkId: string) => void
  testNetwork?: boolean
  symbol?: string
  networkName?: string
  chainId?: number
  chain?: string
}

export interface IChooseImportMethodProps {
  importWallet: () => void
  importByPrivateKey: () => void
}

export interface ImportWalletProps {
  restoreAccount?: boolean
}

export interface ImportUsernameProps {
  nextToFetchUsername?: string | React.ReactNode
}

export interface IAccountVariablesProps {
  username?: string
  walletAddress: string
  network: string
}

export interface IChangeAvatarProps {
  id: number
  image: string
  alt: string
}

export interface IAddSuccessModalProps {
  openModal: boolean
  closeModal: () => void
  tokenImage?: string
  name: string
  tokenAssets?: Asset[]
}

export interface IAvatarModalProps {
  openModal: boolean
  closeModal: () => void
  selectedAvatar: null | string
  setSelectedAvatar: null | string
  handleAvatarChange: () => void
}

export interface ISettingItemProps {
  title: string
  subTitle?: string | undefined
  endAndorment: ReactElement
  onClick?: () => void
  dataAid?: string
}

export interface IChangeLanguageProps {
  id: number
  key: string
  name: string
}

export interface IAddressItemProps {
  key: React.Key
  userName: string
  address: string
  image?: SVGRectElement | ReactElement
  editMode?: boolean
}

export interface IModalComponentProps {
  children?: ReactNode
  title?: string
  subtitle?: string
  image?: string
  modalIconImage?: string
  tokenImage?: string
  nftImage?: string
  ModalIcon?: ReactNode
  modalState: boolean
  closeModal: () => void
  small?: boolean
  transparent?: boolean
  dataAid?: string
}

export interface IPasswordPromptModalProps {
  modalState: boolean
  account?: string
  closePromptModal: () => void
  onSuccess?: () => void
  onFail?: (error: Error) => void
  onPromptPassword?: (password: string) => void
  getPassword?: (password: string) => void
  responseData?: any
  isDismissable?: boolean
  buttonDisable?: boolean
}

export interface ISendReviewProps {
  sendLater?: boolean
  assetType?: string
}

export interface ISeedPhraseProps {
  phrase?: string
  showSeedPhrase: boolean
  setShowSeedPhrase: Dispatch<SetStateAction<boolean>>
}

export interface ICurrencyDataProps {
  currency: string
  icon: ReactElement
}

export interface IIconProps {
  className?: string
  hover?: string | boolean
  currentColor?: string
}

export interface IAccountItemProps {
  selected: boolean
  onSelect?: (username: string) => void
  onDelete: (username: string) => void
  address: string
  username: string
}

export interface ITokenBalanceProps {
  id?: string | undefined
  network?: string | undefined
  token?: string
  acronym?: string
  balance?: string
  image?: ReactElement
  thumbnail?: string
  onClick?: (token: string) => void
  tokenFullName?: string
  active?: boolean
  nativeBalance?: number
  isTestnet?: boolean
  isFavIcon?: boolean
  isFavorite?: boolean
}

export interface ITokenAddressButtonProps {
  className?: string
  iconClassname?: string
  address: string | undefined
  enableCopy?: boolean
  link?: string
  compact?: boolean
  fullWidth?: boolean
  placement?: 'top' | 'right' | 'left' | 'bottom' | undefined
}

export interface ISendTokenCardProps {
  title: string
  subtitle: string
  img: string
  content: string
  icon: ReactElement
}

export interface IFreeNFTProps {
  image: string
  title: string
  createdBy: string
}

export interface ISendWithEstimateModalProps {
  modalState: boolean
  closeModal: () => void
  openCalendar: () => void
  handleReview: () => void
}

export interface IAdjustGasAmountModalProps {
  setMaxWarning: Dispatch<SetStateAction<boolean>>
  maxWarning: boolean
  coin: Asset
  closeReceiveTokenModal: () => void
  setMaxAmount: () => void
}

export interface IReceiveTokenModalProps {
  coin: Asset
  receivedTokenModal: boolean
  closeReceiveTokenModal: () => void
}

export interface ICustomTabProps {
  filteredData: TokenDataProps | null | undefined
  contractAddress: string
  loading: boolean
  setContractAddress: (address: string) => void
  errorMsg?: string
}

export interface IAppProps {
  env: AppEnvironment
  children?: ReactNode
}

export interface ISavedCardProps {
  icon?: ReactElement
  title: string
  amount: number
  onClick?: () => void
}

export interface IPopupNotifProps {
  title: string
  subTitle: string
  onCancel?: () => void
  onAccept?: () => void
}

export interface ITokenSwapActivityProps {
  from: string
  fromImage: SVGRectElement | ReactElement
  to: string
  toImage: SVGRectElement | ReactElement
  date: string
  price: string
  status: 'Scheduled' | 'Swapping' | 'Completed' | 'Saved' | string
  type: 'Settings' | 'Token'
  disableRedirect?: boolean
  divider?: boolean
}

export interface ITransactionActivityProps {
  txStatus: TxStatus | string
  page: 'Settings' | 'Token'
  disableClick?: boolean
  swapTokens?: boolean
  openModal?: () => void
  network: string
  assetId: string
  transactionHash: string
}

export interface ITokenAssetCardProps {
  image?: string
  coin?: string
  dollarAmount: string | number
  coinAmount: number
  exchange: string
  assetId: string
  network: string
  symbol?: string
  id?: string
  isFavorite: boolean
}

export interface IAccountItemProps {
  accountName: string
  selected: boolean
  onSelected: (check: boolean) => void
}

export interface INetworkAsset {
  chain: string
  contractAddress: string
  decimal: number
  enabledAsDefault: boolean
  gasSymbol: string
  id: string
  image: string
  name: string
  network: string
  symbol: string
  type: string
}

export interface INetworkAssetsProps {
  isSelectedAssets: INetworkAsset[]
  setSelectedAssets: Dispatch<SetStateAction<INetworkAsset[]>>
  handleSelectionChange: (selectedKeys: any) => void
  handleSearchInputChange: (event: ChangeEvent<HTMLInputElement>) => void
  searchInput: string
  setSearchInput: Dispatch<SetStateAction<string>>
  filteredNetworksAssets: INetworkAsset[]
  setFilteredNetworksAssets: Dispatch<SetStateAction<INetworkAsset[]>>
  objectdata: INetworkAsset
  isSwapAssets: boolean
  name: string
  image: string
  symbol: string
}

export interface INetworkAssetsInputProps {
  initialAsset: INetworkAsset
  objectdata: INetworkAsset
  isSwapAssets: boolean
}

export interface ISwapSelectNetworksInputProps {
  isSelectedNetworks: NetworkAssetsCollection[]
  isShowNetworkModal: boolean
  setShowNetworkModal: Dispatch<SetStateAction<boolean>>
  handleSearchInputChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleSelectionChange: (selectedKeys: string[]) => void
  searchInput: string
  setSearchInput: Dispatch<SetStateAction<string>>
  filteredNetworks: NetworkAssetsCollection[]
  setFilteredNetworks: Dispatch<SetStateAction<NetworkAssetsCollection[]>>
  allNetworks: NetworkAssetsCollection[]
}

export interface ISwapSelectNetworksProps {
  allNetworks: NetworkAssetsCollection[]
}

export interface ISearchAddressProps {
  setValue: (field: string, value: any, options?: any) => void
  network: string
  register: any
  isAddressBookChecked: boolean
  setIsAddressBookChecked: (value: boolean) => void
  selectedUser: AddressBookUser | null
  setSelectedUser: (user: AddressBookUser) => void
  isShowContactAccordion: boolean
  setShowContactAccordion: (value: boolean) => void
  addressBookByNetwork: AddressBookUser
}

export type ISwitchProps = {
  labels?: [string, string]
  disabled?: boolean
  checked: boolean
  onChange: (value: boolean) => void
  id?: string
  dataAid?: string
}

export interface IDemoTransactionsProps {
  type: 'Send' | 'Sent' | 'Received' | 'Bought' | 'Listed' | 'Minted' | string
  title?: string
  date: string
  price: string
  status: string
}

export type ITExistingAssetRow = {
  assetIndex: number
  data: Asset
  handleSelectAsset: (index: number) => void
}

export interface IAccountMenuItemProps {
  icon: SVGRectElement | ReactElement
  item: string
  onClick?: () => void
}

export type IHeaderProps = {
  title?: string
  isConnected?: boolean
  showAccounts?: boolean
}

export type IAddressDropdownProps = {
  data: AddressBookUser[]
  onChange: (newValue: AddressBookUser) => void
  onBookmarkClick: () => void
  selectedUser?: AddressBookUser
  onPaste?: (newValue: AddressBookUser) => void
  network: string
}

export type IToBeAddedModalDataProps = {
  name?: string
  image?: string
}

export interface IToolTipProps {
  title: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  containerClass?: string
  pointerClass?: string
  className?: string
  children?: ReactNode
}

export interface IFavouriteProps {
  isFavToken: boolean
  placement?: 'top' | 'bottom' | 'left' | 'right'
  showArrow?: boolean
  handleFavorite: () => void
}

export type EnvironmentType = 'testNet' | 'mainNet'

export interface NetworkToken {
  // [x: string]: string
  address: string
  id: string
  image: string
  title: string
  subTitle: string
  shortName: string
  amount: string
  usdAmount: string
  networkId: string
  networkName: string
  tokenType: 'Native' | 'ERC20'
  isUpdated?: boolean
  tokenContractAddress?: string
  providerNetworkRPC_URL: string
  providerNetworkRPC_Network_Name: string | number
  explorerURL?: string
  apiUrl: string
  tokenIds?: [string]
  coingeckoTokenId: string
  oneDayUSDPriceChangePercentage?: number
  isFavorite: boolean
  isEVMNetwork?: boolean
  tokenGasFeeUnitToDisplay?: string
  indexerClient?: string
  isCustom?: boolean // when we add new network or custom token then we pass true
  envType: EnvironmentType
  explorerAccountURL: string
  decimal?: ethers.BigNumberish | number
  balance?: ethers.BigNumberish | number
  formattedBalance?: ethers.BigNumberish | number
}

export interface NetworkTokensList {
  [key: string]: NetworkToken
}
