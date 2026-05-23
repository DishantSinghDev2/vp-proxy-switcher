import { activateProxy, deactivateProxy } from './lib/proxyManager'
import type { ProxyConfig } from './lib/types'

export {}

let currentProxy: ProxyConfig | null = null

// Inject auth credentials for proxy requests
chrome.webRequest.onAuthRequired.addListener(
  (details, callback) => {
    if (
      details.isProxy &&
      currentProxy?.username &&
      currentProxy?.password
    ) {
      callback({
        authCredentials: {
          username: currentProxy.username,
          password: currentProxy.password,
        },
      })
    } else {
      callback({})
    }
  },
  { urls: ['<all_urls>'] },
  ['asyncBlocking']
)

// Restore proxy on browser startup
chrome.runtime.onStartup.addListener(async () => {
  const data = await chrome.storage.local.get('activeProxy')
  if (data.activeProxy) {
    currentProxy = data.activeProxy
    await activateProxy(data.activeProxy)
  }
})

// Restore proxy when service worker wakes
chrome.storage.local.get('activeProxy', async (data) => {
  if (data.activeProxy) {
    currentProxy = data.activeProxy
    await activateProxy(data.activeProxy)
  }
})

chrome.runtime.onMessage.addListener(
  (msg: { type: string; proxy?: ProxyConfig }, _sender, sendResponse) => {
    if (msg.type === 'SET_PROXY' && msg.proxy) {
      currentProxy = msg.proxy
      activateProxy(msg.proxy)
        .then(() => sendResponse({ ok: true }))
        .catch((e) => sendResponse({ ok: false, error: e.message }))
      return true
    }

    if (msg.type === 'CLEAR_PROXY') {
      currentProxy = null
      deactivateProxy()
        .then(() => sendResponse({ ok: true }))
        .catch((e) => sendResponse({ ok: false, error: e.message }))
      return true
    }

    if (msg.type === 'ROTATE' && msg.proxy) {
      // Re-applying the same proxy triggers the rotating pool to hand a new IP
      currentProxy = msg.proxy
      deactivateProxy()
        .then(() => activateProxy(msg.proxy!))
        .then(() => sendResponse({ ok: true }))
        .catch((e) => sendResponse({ ok: false, error: e.message }))
      return true
    }
  }
)
