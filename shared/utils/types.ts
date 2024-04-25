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
  fee?: number
  subtractFee?: boolean
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
  accountId: string
  avatar?: string
  active?: boolean
  address: string
  username: string
  balance?: number | string
  onClick?: (username: string) => void
  isAccountImported?: boolean
  selected?: boolean
  onSelect?: (username: string) => void
  onDelete?: (username: string) => void
  allowHideAccount?: boolean
  onClickHideAccount?: (accountId: string) => void
}

export interface AccountOptionProps {
  key: string
  icon: React.ReactNode
  name: string
  onAction: () => void
  accountImported?: boolean
  address?: string
  isVisible?: boolean
}

export interface IActivityFilterProps {
  key: string
  icon?: ReactElement | string
  name: string
}

export interface INetworkItemProps {
  id: number
  name: string
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
  importByRecoveryFiles?: () => void
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
  name: string | undefined
  tokenAssets?: Asset[]
  alreadyAdded?: boolean
  hasMultipleTokens: boolean
}

export interface IAvatarModalProps {
  openModal: boolean
  closeModal: () => void
  selectedAvatar: null | string
  setSelectedAvatar: Dispatch<SetStateAction<string>>
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
  key?: React.Key
  username?: string
  address: string
  image?: SVGRectElement | ReactElement
  avatar?: string
  editMode?: boolean
  network: string
}

export interface IModalComponentProps {
  children?: ReactNode
  title?: string
  subtitle?: string
  image?: string
  modalIconImage?: string
  tokenImage?: string
  nftImage?: string
  ModalIcon?: string
  modalState: boolean
  closeModal: () => void
  small?: boolean
  transparent?: boolean
  dataAid?: string
  imgAlt: string
  thubmTitle?: string
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
  hideBalance?: boolean
  percentage?: number
  hideAmount?: boolean
  className?: string
  checkboxClass?: string
}

export interface ITokenAddressButtonProps {
  className?: string
  iconClassname?: string
  address: string | undefined
  enableCopy?: boolean
  link?: any
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
  coin?: Asset
  closeReceiveTokenModal: () => void
  setMaxAmount: () => void
}

export interface IReceiveTokenModalProps {
  image: ReactElement | string
  title: string
  receivedTokenModal: boolean
  closeReceiveTokenModal: () => void
}

export interface ICustomTabProps {
  filteredData: TokenDataProps | null | undefined
  contractAddress: string
  loading: boolean
  setContractAddress: (address: string) => void
  errorMsg?: string
  handleChangeNetwork?: (val: string) => void
  activeNetwork?: NetworkToken
  networkTokens?: NetworkToken[]
  setErrorMsg: (val: string) => void
  symbolError: string
  setSymbolError: (val: string) => void
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
  assetId?: string
  transactionHash?: string
  blockNumber?: string
  matchedTransaction?: any
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
  hideBalance?: boolean
  gasPriceInCurrency?: string
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
  errorMsg?: any
  watch?: any
  isAddressBookChecked: boolean
  setIsAddressBookChecked: (value: boolean) => void
  selectedUser: AddressBookUser | null
  setSelectedUser: (user: AddressBookUser) => void
  isShowContactAccordion: boolean
  setShowContactAccordion: (value: boolean) => void
  accountAddresses: AddressBookUser
  addressBookByNetwork?: AddressBookUser
  recentInteractAddresses?: string[]
  setShowAddressBook?: (flag: boolean) => void
  isShowAddressBook?: boolean
  isShowAmountStep: boolean
  setShowAmountStep: (flag: boolean) => void
  isDirty: boolean
  isAddressserror: any
  showAddAddress: AddressBookUser
}

export interface IAddressAccordian {
  recentInteractAddresses?: string[]
  addressBookByNetwork: AddressBookUser
  accountAddresses: AddressBookUser
  network: string
  onChangeAddress: (val: AddressBookUser) => void
}

export interface IAddtoAddressBook {
  register: any
  errorMsg: string
  watch: any
  isAddressBookChecked: boolean
  setIsAddressBookChecked: (value: boolean) => void
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
  isSupraNetwork?: boolean
  tokenGasFeeUnitToDisplay?: string
  indexerClient?: string
  isCustom?: boolean // when we add new network or custom token then we pass true
  envType: EnvironmentType
  explorerAccountURL: string
  decimal?: number
  balance?: number | any
  formattedBalance?: number | any
}

export interface NetworkTokensList {
  [key: string]: NetworkToken
}

export interface IAutoLockTimerProps {
  id: number
  value: number
}

export interface ICreatePasswordProps {
  handleNextStep: Dispatch<SetStateAction<string>>
}

export interface IChooseFilesProps {
  recoveryPassword: string
  recoveryOptions: string[]
  handleNextStep: Dispatch<SetStateAction<string>>
  handleBackStep: Dispatch<SetStateAction<string>>
}
export interface IRecoveryFilesProps {
  fileName: string
  content: string
  isValid: boolean
  errorMessage?: string
}

export interface IChooseOptionsProps {
  handleNextStep: Dispatch<SetStateAction<string[]>>
  handleBackStep: Dispatch<SetStateAction<string>>
  defaultRecoveryOptions: string[]
}

export interface IFileRecoveryOptions {
  id: number
  optionType: string
}

export interface ISeedLessProps {
  phrase: string
  username: string
  onSuccessSaveRecoveryFile: () => void
}

export interface ISaveToDeviceProps {
  defaultFileName: string
  handleNextStep: (fileName: string, fileIndex: number, nextStep: string) => void
  handleBackStep: Dispatch<SetStateAction<string>>
}

export interface ISaveToDriveProps {
  defaultFileName: string
  handleNextStep: (fileName: string) => void
  handleBackStep: Dispatch<SetStateAction<string>>
}

export interface ITabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
  dataTestId?: string
}

export interface ITabProps {
  value: number
  onChange?: (newValue: number) => void
  tabs: string[]
}

export type IDropdownItemProps = {
  text: string
  active?: boolean
  icon?: ReactElement | string
  onSelect?: (text: string) => void
  isImg?: boolean | false // if icon is image then true else false
}
export interface IPasswordInputProps {
  placeholder: string
  id?: string
  value?: string
  onChange?: (value: string) => void
  onSubmit?: () => void
  subTitle?: string
  color?: 'primary' | 'secondary' | string
  mainColor?: boolean
  disabled?: boolean
  dataAid?: string
  name: string
  className?: string
  error?: unknown
  dataTestId?: string
}

export interface IAddressBookComponentProps {
  onClickAddAddress?: (user: AddressBookUser) => void
}

export type ITokenActivityProps = {
  type: 'Send' | 'Sent' | 'Received' | 'Bought' | 'Listed' | 'Minted'
  title?: string
  date: string
  price: string | number
  status: 'Scheduled' | 'Pending' | 'Completed' | 'Saved' | 'Failed' | string
  page: 'Settings' | 'Settings-Token' | 'Token'
  disableClick?: boolean
  transactionHash?: string
  onClick?: () => void
  network?: string
  tokenDecimal?: string | number
  assetId?: string
  hideBalance?: boolean
  tokenName: string
}

export interface ICustomThumbnail {
  thumbName: string | undefined
  className?: string
}

export interface ISendSameAddressModal {
  isShowSameAddressModal: boolean
  setShowSameAddressModal: () => void
  onContinue: () => void
}

export interface IFilterAddress {
  id: number
  checkId: string
  name: string
}

export interface IGroupedAddresses {
  [network: string]: IAddressItemProps[]
}

export type ISearchTabProps = {
  selectedTokens?: Array<NetworkToken>
  setSelectedToken: (token: NetworkToken) => void
}

export type ITotatBalanceProps = {
  totalBalance: number
  hideBalance?: boolean
  hideLawBalance?: boolean
}

export interface ITokenSortFilter {
  icon: ReactElement
  name: string
  label: string
}

export interface ITokenBalanceRow {
  assetId: string
  token: NetworkToken
  hideBalance?: boolean
  hideLawBalance?: boolean
}

export interface IRecoveryFileVideoProps {
  handleNextStep: () => void
}

export type INFTCardProps = {
  title: string
  image: string
  price: string
  color?: string
  currency: string
  liked?: boolean
  onClick?: () => void
}

export type ILoaderProps = {
  className?: string
  size?: number
  variant?: 'rectangle' | 'text' | 'rounded'
}

export type ICreateAccountProps = {
  importWallet?: boolean
}

export type IScheduledActivityProps = {
  swapTokens?: boolean
}

export type ISendNFTProps = {
  title?: string
}

export type INftScheduledModalProps = {
  modalState: boolean
  nftImage: string
  nftTitle: string
  closeModal: () => void
}
