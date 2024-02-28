import { gql } from '@apollo/client'
const typeDefs = gql`
  """
  The DateTime scalar type represents date and time as a string in RFC3339 format.
  For user-profile: "1985-04-12T23:20:50.52Z" represents 20 minutes and 50.52 seconds after the 23rd hour of April 12th, 1985 in UTC.
  """
  scalar DateTime
  scalar JSONObject
  type usernameExists {
    username: String
    network: String
  }
`

export default typeDefs
