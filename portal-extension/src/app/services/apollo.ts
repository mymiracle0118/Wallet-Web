import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { ToastConfigs } from '../config/index'
import PATHS from '../../constants/paths'
import { toast } from 'react-toastify'
import { appVersion, walletApiUrl } from './config'
import typeDefs from '../../utils/graphql/typeDefs'

const getClient = () => {
  const accessKey = process.env.API_KEY
  if (!accessKey) {
    throw new Error('API_KEY is not defined in the environment variables.')
  }

  const httpLink = new HttpLink({
    uri: `${walletApiUrl}`,
    fetch,
    headers: {
      Authorization: `Apikey ${accessKey}`,
    },
  })

  const errorLink = onError((error) => {
    const { graphQLErrors = [], networkError } = error
    if (graphQLErrors.length > 0) {
      // eslint-disable-next-line no-console
      const errorMessage = graphQLErrors[0]?.message || 'Internal issue'
      toast.error(errorMessage, ToastConfigs)
      toast.clearWaitingQueue()
    }
    if (networkError) {
      toast.error('Apollo network error, Please check again!', ToastConfigs)
      toast.clearWaitingQueue()
      // eslint-disable-next-line no-console
      console.error(networkError, 'networkError')
      setTimeout(() => {
        localStorage.clear()
        window.location.href = PATHS.API.AUTH.LOGOUT
      }, 1500)
    }
  })

  const mergedLink = from([new RetryLink(), errorLink, httpLink]) //authLink,

  return new ApolloClient({
    ssrMode: false,
    link: mergedLink,
    name: 'pbo-web',
    version: appVersion,
    typeDefs,
    cache: new InMemoryCache({
      typePolicies: {
        LocalState: {
          fields: {},
        },
      },
    }),
  })
}

export default getClient
