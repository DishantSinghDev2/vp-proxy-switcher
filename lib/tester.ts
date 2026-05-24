import type { ProxyConfig } from './types'

export function openProxyTester(proxies: ProxyConfig[]) {
  if (proxies.length === 0) return

  if (proxies.length === 1) {
    const p = proxies[0]
    const params = new URLSearchParams({
      mode: 'single',
      host: p.host,
      port: String(p.port),
      autoTest: 'true',
      ...(p.username ? { username: p.username } : {}),
      ...(p.password ? { password: p.password } : {}),
    })
    chrome.tabs.create({ url: `https://tools.v-proxies.com/tools/proxy-tester?${params}` })
    return
  }

  const list = proxies.slice(0, 100).map(p => {
    const parts: string[] = [p.host, String(p.port)]
    if (p.username) parts.push(p.username)
    if (p.password) parts.push(p.password)
    return parts.join(':')
  }).join(',')

  const params = new URLSearchParams({
    mode: 'bulk',
    proxies: list,
    autoTest: 'true',
  })
  chrome.tabs.create({ url: `https://tools.v-proxies.com/tools/proxy-tester?${params}` })
}
