import type { ProxyConfig } from './types'
import { VPROXIES_URL } from './defaults'

export function openProxyTester(proxy: ProxyConfig) {
  // Credentials go in the hash — never sent to the server in HTTP headers
  const params = new URLSearchParams({
    host: proxy.host,
    port: String(proxy.port),
    name: proxy.name,
    ...(proxy.username ? { user: proxy.username } : {}),
    ...(proxy.password ? { pass: proxy.password } : {}),
  })
  chrome.tabs.create({ url: `${VPROXIES_URL}/tools/proxy-tester#${params}` })
}
