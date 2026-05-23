import type { ProxyConfig } from './types'

export async function activateProxy(config: ProxyConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.proxy.settings.set(
      {
        value: {
          mode: 'fixed_servers',
          rules: {
            singleProxy: {
              scheme: 'http',
              host: config.host,
              port: config.port,
            },
            bypassList: ['localhost', '127.0.0.1', '::1', '<local>'],
          },
        },
        scope: 'regular',
      },
      () => {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError)
        else resolve()
      }
    )
  })
}

export async function deactivateProxy(): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.proxy.settings.clear({ scope: 'regular' }, () => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError)
      else resolve()
    })
  })
}
