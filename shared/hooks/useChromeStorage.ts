import { useCallback, useEffect, useState } from 'react'

export const storage = {
  get: (key: string, defaultValue: any, storageArea: Storage) => {
    const keyObj = defaultValue === undefined ? key : { [key]: defaultValue }
    return new Promise((resolve, reject) => {
      chrome.storage[storageArea].get(keyObj, (items: any) => {
        const error = chrome.runtime.lastError
        if (error) return reject(error)
        resolve(items[key])
      })
    })
  },
  set: (key: string, value: any, storageArea: Storage) => {
    return new Promise((resolve, reject) => {
      chrome.storage[storageArea].set({ [key]: value }, () => {
        const error = chrome.runtime.lastError
        error ? reject(error) : resolve()
      })
    })
  },
}

/**
 * Basic hook for storage
 * @param {string} key
 * @param {*} initialValue
 * @param {'local'|'sync'} storageArea
 * @returns {[*, function(*= any): void, boolean, string]}
 */

export default function useChromeStorage(key, initialValue, storageArea) {
  const [INITIAL_VALUE] = useState(() => {
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })
  const [STORAGE_AREA] = useState(storageArea)
  const [state, setState] = useState(INITIAL_VALUE)
  const [isPersistent, setIsPersistent] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    storage
      .get(key, INITIAL_VALUE, STORAGE_AREA)
      .then((res) => {
        setState(res)
        setIsPersistent(true)
        setError('')
      })
      .catch((error) => {
        setIsPersistent(false)
        setError(error)
      })
  }, [key, INITIAL_VALUE, STORAGE_AREA])

  const updateValue = useCallback(
    (newValue) => {
      const toStore = typeof newValue === 'function' ? newValue(state) : newValue
      storage
        .set(key, toStore, STORAGE_AREA)
        .then(() => {
          setIsPersistent(true)
          setError('')
        })
        .catch((error) => {
          // set newValue to local state because chrome.storage.onChanged won't be fired in error case
          setState(toStore)
          setIsPersistent(false)
          setError(error)
        })
    },
    [STORAGE_AREA, key, state]
  )

  useEffect(() => {
    const onChange = (changes, areaName) => {
      if (areaName === STORAGE_AREA && key in changes) {
        setState(changes[key].newValue)
        setIsPersistent(true)
        setError('')
      }
    }
    chrome.storage.onChanged.addListener(onChange)
    return () => {
      chrome.storage.onChanged.removeListener(onChange)
    }
  }, [key, STORAGE_AREA])

  return [state, updateValue, isPersistent, error]
}
