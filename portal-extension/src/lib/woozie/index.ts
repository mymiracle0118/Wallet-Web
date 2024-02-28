import { useNavigate as useNavigateDom } from 'react-router-dom'
import { HistoryAction, createUrl, changeState } from './history'
import { To, createLocationState, createLocationUpdates } from './location'
import * as Router from './router'

export * from './config'
export * from './history'
export * from './location'
export { default as Provider } from './Provider'
export { default as Link } from './Link'
export { default as Redirect } from './Redirect'
export { Router }

export const useNavigate = () => {
  let navigate
  if (process.env.RUN_VERCEL) {
    const navigateRouterDom = useNavigateDom() // eslint-disable-line
    navigate = navigateRouterDom
  } else {
    navigate = (to: To, action?: HistoryAction.Push | HistoryAction.Replace) => {
      const lctn = createLocationState()
      const lctnUpdates = createLocationUpdates(to, lctn)

      const { pathname, search, hash, state } = lctnUpdates
      const url = createUrl(pathname, search, hash)

      if (!action) {
        action = url === createUrl(lctn.pathname, lctn.search, lctn.hash) ? HistoryAction.Replace : HistoryAction.Push
      }

      changeState(action, state, url)
    }
  }

  return {
    navigate,
  }
}
