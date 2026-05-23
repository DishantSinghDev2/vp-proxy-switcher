import { activateProxy, deactivateProxy } from './lib/proxyManager'
import type { ProxyConfig } from './lib/types'
import iconUrl from 'url:./assets/icon.png'

export {}

const ALARM = 'proxy-auto-rotate'

let currentProxy: ProxyConfig | null = null

// Inject auth credentials for proxy requests
chrome.webRequest.onAuthRequired.addListener(
  (details, callback) => {
    if (details.isProxy && currentProxy?.username && currentProxy?.password) {
      callback({ authCredentials: { username: currentProxy.username, password: currentProxy.password } })
    } else {
      callback({})
    }
  },
  { urls: ['<all_urls>'] },
  ['asyncBlocking']
)

async function updateActionIcon(connected: boolean) {
  try {
    const resp = await fetch(iconUrl)
    const blob = await resp.blob()
    const bitmap = await createImageBitmap(blob)
    const size = 128
    const canvas = new OffscreenCanvas(size, size)
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(bitmap, 0, 0, size, size)
    const imageData = ctx.getImageData(0, 0, size, size)
    if (!connected) {
      const d = imageData.data
      for (let i = 0; i < d.length; i += 4) {
        const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
        d[i] = d[i + 1] = d[i + 2] = gray
      }
    }
    await chrome.action.setIcon({ imageData: { 128: imageData } })
  } catch { /* silently skip if canvas unavailable */ }
}

async function restoreProxy() {
  const data = await chrome.storage.local.get(['activeProxy', 'autoRotate', 'rotateInterval'])
  if (data.activeProxy) {
    currentProxy = data.activeProxy
    await activateProxy(data.activeProxy)
    updateActionIcon(true)
  } else {
    updateActionIcon(false)
  }
  if (data.autoRotate && data.rotateInterval) {
    scheduleRotation(data.rotateInterval)
  }
}

function scheduleRotation(intervalSeconds: number) {
  chrome.alarms.clear(ALARM, () => {
    chrome.alarms.create(ALARM, { periodInMinutes: intervalSeconds / 60 })
  })
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM) return
  const data = await chrome.storage.local.get(['proxies', 'rotateIndex', 'autoRotate', 'reloadOnChange'])
  if (!data.autoRotate) return
  const proxies: ProxyConfig[] = data.proxies || []
  if (proxies.length < 2) return
  const next = ((data.rotateIndex ?? 0) + 1) % proxies.length
  const proxy = proxies[next]
  currentProxy = proxy
  await chrome.storage.local.set({ rotateIndex: next, activeProxy: proxy })
  await deactivateProxy()
  await activateProxy(proxy)
  updateActionIcon(true)
  if (data.reloadOnChange) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) chrome.tabs.reload(tabs[0].id)
    })
  }
})

chrome.runtime.onStartup.addListener(restoreProxy)
chrome.storage.local.get('activeProxy', restoreProxy)

chrome.runtime.onMessage.addListener(
  (msg: { type: string; proxy?: ProxyConfig; enabled?: boolean; intervalSeconds?: number }, _sender, sendResponse) => {
    if (msg.type === 'SET_PROXY' && msg.proxy) {
      currentProxy = msg.proxy
      activateProxy(msg.proxy)
        .then(() => { updateActionIcon(true); sendResponse({ ok: true }) })
        .catch((e) => sendResponse({ ok: false, error: e.message }))
      return true
    }

    if (msg.type === 'CLEAR_PROXY') {
      currentProxy = null
      deactivateProxy()
        .then(() => { updateActionIcon(false); sendResponse({ ok: true }) })
        .catch((e) => sendResponse({ ok: false, error: e.message }))
      return true
    }

    if (msg.type === 'ROTATE' && msg.proxy) {
      currentProxy = msg.proxy
      deactivateProxy()
        .then(() => activateProxy(msg.proxy!))
        .then(() => { updateActionIcon(true); sendResponse({ ok: true }) })
        .catch((e) => sendResponse({ ok: false, error: e.message }))
      return true
    }

    if (msg.type === 'SET_AUTO_ROTATE') {
      if (msg.enabled && msg.intervalSeconds) {
        scheduleRotation(msg.intervalSeconds)
      } else {
        chrome.alarms.clear(ALARM)
      }
      sendResponse({ ok: true })
      return true
    }
  }
)
