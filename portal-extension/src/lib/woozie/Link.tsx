/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { AnchorHTMLAttributes, FC, MouseEventHandler, useCallback, useMemo } from 'react'

import { USE_LOCATION_HASH_AS_URL } from './config'
import { HistoryAction, createUrl, changeState } from './history'
import { To, createLocationUpdates, useLocation } from './location'

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: To
  replace?: boolean
}

const Link: FC<LinkProps> = ({ to, replace, ...rest }) => {
  const lctn = useLocation()

  const { pathname, search, hash, state } = useMemo(() => createLocationUpdates(to, lctn), [to, lctn])

  const url = useMemo(() => createUrl(pathname, search, hash), [pathname, search, hash])

  const href = useMemo(() => (USE_LOCATION_HASH_AS_URL ? `${window.location.pathname}#${url}` : url), [url])

  function isModifiedEvent(event: MouseEvent) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
  }

  interface LinkAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    onNavigate: () => void
    onClick?: MouseEventHandler
    target?: string
  }

  const LinkAnchor: FC<LinkAnchorProps> = ({ children, onNavigate, onClick, target }) => {
    const handleClick = useCallback(
      (evt: any) => {
        try {
          if (onClick) {
            onClick(evt)
          }
        } catch (err) {
          evt.preventDefault()
          throw err
        }

        if (
          !evt.defaultPrevented && // onClick prevented default
          evt.button === 0 && // ignore everything but left clicks
          (!target || target === '_self') && // let browser handle "target=_blank" etc.
          !isModifiedEvent(evt) // ignore clicks with modifier keys
        ) {
          evt.preventDefault()
          onNavigate()
        }
      },
      [onClick, target, onNavigate]
    )

    return (
      <a onClick={handleClick} target={target} {...rest}>
        {children}
      </a>
    )
  }

  const handleNavigate = useCallback(() => {
    const action =
      replace || url === createUrl(lctn.pathname, lctn.search, lctn.hash) ? HistoryAction.Replace : HistoryAction.Push
    changeState(action, state, url)
  }, [replace, state, url, lctn])

  return <LinkAnchor {...rest} href={href} onNavigate={handleNavigate} />
}

export default Link
