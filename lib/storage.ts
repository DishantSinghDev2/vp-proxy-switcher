import type { Settings } from './types'
import { DEFAULT_PROXIES } from './defaults'

const DEFAULTS: Settings = {
  activeProxy: null,
  proxies: DEFAULT_PROXIES,
  reloadOnChange: true,
  userAgent: 'Browser default',
  autoRotate: false,
  rotateInterval: 60,
  rotateIndex: 0,
}

export async function loadSettings(): Promise<Settings> {
  return new Promise((resolve) => {
    chrome.storage.local.get(Object.keys(DEFAULTS), (data) => {
      resolve({ ...DEFAULTS, ...data } as Settings)
    })
  })
}

export async function saveSettings(partial: Partial<Settings>): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set(partial, resolve)
  })
}
