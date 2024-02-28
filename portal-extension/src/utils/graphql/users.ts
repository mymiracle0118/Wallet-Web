import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation CreateUser($UserInput: UserInput) {
    createUser(UserInput: $UserInput) {
      id
      walletAddress
      username
      network
    }
  }
`

export const CHECK_USER_EXISTS = gql`
  query Query($username: String!, $network: String) {
    usernameExists(username: $username, network: $network)
  }
`
