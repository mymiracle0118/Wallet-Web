import { StateStorage } from 'zustand/middleware'

export const chromeSyncStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await chrome.storage.sync.get(name)
    return value[name]
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await chrome.storage.sync.set({ [name]: value })
  },
  removeItem: async (name: string): Promise<void> => {
    await chrome.storage.sync.remove(name)
  },
}

export const chromeLocalStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await chrome.storage.local.get(name)
    return value[name]
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await chrome.storage.local.set({ [name]: value })
  },
  removeItem: async (name: string): Promise<void> => {
    await chrome.storage.local.remove(name)
  },
}
