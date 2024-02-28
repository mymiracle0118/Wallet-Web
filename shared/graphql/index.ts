import gql from 'graphql-tag'
import * as Urql from 'urql'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
  DateTime: any
  Int64: any
  _Any: any
  _FieldSet: any
}

export type BlockInfo = {
  __typename?: 'BlockInfo'
  bits?: Maybe<Scalars['Int']>
  cdd_total?: Maybe<Scalars['Float']>
  chainwork?: Maybe<Scalars['String']>
  coinbase_data_hex?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['String']>
  difficulty?: Maybe<Scalars['Int']>
  fee_per_kb?: Maybe<Scalars['Int']>
  fee_per_kb_usd?: Maybe<Scalars['Float']>
  fee_per_kwu?: Maybe<Scalars['Float']>
  fee_per_kwu_usd?: Maybe<Scalars['Float']>
  fee_total?: Maybe<Scalars['Int']>
  fee_total_usd?: Maybe<Scalars['Float']>
  generation?: Maybe<Scalars['Int']>
  generation_usd?: Maybe<Scalars['Int']>
  guessed_miner?: Maybe<Scalars['String']>
  hash?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['Int']>
  input_count?: Maybe<Scalars['Int']>
  input_total?: Maybe<Scalars['Int']>
  input_total_usd?: Maybe<Scalars['Int']>
  median_time?: Maybe<Scalars['String']>
  merkle_root?: Maybe<Scalars['String']>
  nonce?: Maybe<Scalars['Int']>
  output_count?: Maybe<Scalars['Int']>
  output_total?: Maybe<Scalars['Int']>
  output_total_usd?: Maybe<Scalars['Int']>
  reward?: Maybe<Scalars['Int']>
  reward_usd?: Maybe<Scalars['Int']>
  size?: Maybe<Scalars['Int']>
  stripped_size?: Maybe<Scalars['Int']>
  time?: Maybe<Scalars['String']>
  transaction_count?: Maybe<Scalars['Int']>
  version?: Maybe<Scalars['Int']>
  version_bits?: Maybe<Scalars['Int']>
  version_hex?: Maybe<Scalars['Int']>
  weight?: Maybe<Scalars['Int']>
  witness_count?: Maybe<Scalars['Int']>
}

export type BlockInfoInput = {
  block?: InputMaybe<Scalars['String']>
  blockchain: Blockchain
}

export enum Blockchain {
  Bitcoin = 'bitcoin',
  Cardano = 'cardano',
  /** bitcoin-sv */
  Dogecoin = 'dogecoin',
  Ecash = 'ecash',
  Eos = 'eos',
  /** bitcoin-cash */
  Ethereum = 'ethereum',
  Groestlcoin = 'groestlcoin',
  Litecoin = 'litecoin',
  Mixin = 'mixin',
  Monero = 'monero',
  Ripple = 'ripple',
  Stellar = 'stellar',
  Tezos = 'tezos',
  Zcash = 'zcash',
}

export type ChainEventCountdown = {
  __typename?: 'ChainEventCountdown'
  eth_needed?: Maybe<Scalars['Int']>
  eth_staked?: Maybe<Scalars['Float']>
  event?: Maybe<Scalars['String']>
}

export type ChainInfo = {
  __typename?: 'ChainInfo'
  txId?: Maybe<Scalars['String']>
}

export type ChainInfoInput = {
  blockchain: Blockchain
  layer2?: InputMaybe<Scalars['String']>
  tokenAddress?: InputMaybe<Scalars['String']>
}

export type Erc20Gwei = {
  __typename?: 'ERC20Gwei'
  cheetah?: Maybe<Scalars['Int']>
  fast?: Maybe<Scalars['Int']>
  normal?: Maybe<Scalars['Int']>
  sloth?: Maybe<Scalars['Int']>
  slow?: Maybe<Scalars['Int']>
}

export type Erc20Summary = {
  __typename?: 'ERC20Summary'
  tokens?: Maybe<Scalars['Int']>
  tokens_24h?: Maybe<Scalars['Int']>
  transactions?: Maybe<Scalars['Int']>
  transactions_24h?: Maybe<Scalars['Int']>
}

export type EthereumChainInfo = {
  __typename?: 'EthereumChainInfo'
  average_simple_transaction_fee_24h?: Maybe<Scalars['Int64']>
  average_simple_transaction_fee_usd_24h?: Maybe<Scalars['Float']>
  average_transaction_fee_24h?: Maybe<Scalars['Int64']>
  average_transaction_fee_usd_24h?: Maybe<Scalars['Float']>
  best_block_hash?: Maybe<Scalars['String']>
  best_block_height?: Maybe<Scalars['Int64']>
  best_block_time?: Maybe<Scalars['String']>
  blockchain_size?: Maybe<Scalars['Int64']>
  blocks?: Maybe<Scalars['Int64']>
  blocks_24h?: Maybe<Scalars['Int64']>
  calls?: Maybe<Scalars['Int64']>
  circulation_approximate?: Maybe<Scalars['Int64']>
  countdowns?: Maybe<Array<Maybe<ChainEventCountdown>>>
  difficulty?: Maybe<Scalars['Int64']>
  hashrate_24h?: Maybe<Scalars['Int64']>
  inflation_24h?: Maybe<Scalars['Float']>
  inflation_usd_24h?: Maybe<Scalars['Float']>
  largest_transaction_24h?: Maybe<LargestTransactionUsd>
  layer_2?: Maybe<EthereumLayer2>
  market_cap_usd?: Maybe<Scalars['Int64']>
  market_dominance_percentage?: Maybe<Scalars['Float']>
  market_price_btc?: Maybe<Scalars['Float']>
  market_price_usd?: Maybe<Scalars['Float']>
  market_price_usd_change_24h_percentage?: Maybe<Scalars['Float']>
  median_simple_transaction_fee_24h?: Maybe<Scalars['Int64']>
  median_simple_transaction_fee_usd_24h?: Maybe<Scalars['Float']>
  median_transaction_fee_24h?: Maybe<Scalars['Int64']>
  median_transaction_fee_usd_24h?: Maybe<Scalars['Float']>
  mempool_median_gas_price?: Maybe<Scalars['Int64']>
  mempool_total_value_approximate?: Maybe<Scalars['Int64']>
  mempool_tps?: Maybe<Scalars['Float']>
  mempool_transactions?: Maybe<Scalars['Int64']>
  suggested_transaction_fee_gwei_options?: Maybe<Erc20Gwei>
  transactions?: Maybe<Scalars['Int64']>
  transactions_24h?: Maybe<Scalars['Int64']>
  uncles?: Maybe<Scalars['Int64']>
  uncles_24h?: Maybe<Scalars['Int64']>
  volume_24h_approximate?: Maybe<Scalars['Int64']>
}

export type EthereumLayer2 = {
  __typename?: 'EthereumLayer2'
  erc_20?: Maybe<Erc20Summary>
}

export type LargestTransactionUsd = {
  __typename?: 'LargestTransactionUSD'
  hash?: Maybe<Scalars['String']>
  value_usd?: Maybe<Scalars['Float']>
}

export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor?: Maybe<Scalars['String']>
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['String']>
}

export type Query = {
  __typename?: 'Query'
  _service: _Service
  /** Queries API to get state of a specific block in a blockchain */
  getBlockInfo?: Maybe<BlockInfo>
  /** Queries API to get state of Ethereum blockchains */
  getChainInfo?: Maybe<EthereumChainInfo>
}

export type QueryGetBlockInfoArgs = {
  input?: InputMaybe<BlockInfoInput>
}

export type QueryGetChainInfoArgs = {
  input?: InputMaybe<ChainInfoInput>
}

export enum Role {
  Admin = 'ADMIN',
  Guest = 'GUEST',
  Superadmin = 'SUPERADMIN',
  User = 'USER',
}

export type StatusAndMessage = {
  __typename?: 'StatusAndMessage'
  message?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
}

export type TxInfoInput = {
  blockchain: Blockchain
  txHash?: InputMaybe<Scalars['String']>
}

export type _Service = {
  __typename?: '_Service'
  sdl?: Maybe<Scalars['String']>
}

export type GetChainInfoQueryVariables = Exact<{
  input?: InputMaybe<ChainInfoInput>
}>

export type GetChainInfoQuery = {
  __typename?: 'Query'
  getChainInfo?: {
    __typename?: 'EthereumChainInfo'
    market_price_usd?: number | null
    suggested_transaction_fee_gwei_options?: {
      __typename?: 'ERC20Gwei'
      cheetah?: number | null
      fast?: number | null
      normal?: number | null
      slow?: number | null
      sloth?: number | null
    } | null
  } | null
}

export const GetChainInfoDocument = gql`
  query GetChainInfo($input: ChainInfoInput) {
    getChainInfo(input: $input) {
      market_price_usd
      suggested_transaction_fee_gwei_options {
        cheetah
        fast
        normal
        slow
        sloth
      }
    }
  }
`

export function useGetChainInfoQuery(options?: Omit<Urql.UseQueryArgs<GetChainInfoQueryVariables>, 'query'>) {
  return Urql.useQuery<GetChainInfoQuery>({ query: GetChainInfoDocument, ...options })
}
