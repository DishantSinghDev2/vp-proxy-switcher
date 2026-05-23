import type { ProxyConfig, UserAgentOption } from './types'

export const DEFAULT_PROXIES: ProxyConfig[] = [
  {
    id: 'res-us-ny',
    name: 'Residential · US-NY',
    country: 'US',
    city: 'NY',
    type: 'residential',
    host: '73.42.108.221',
    port: 8000,
    flag: '🇺🇸',
    rotating: true,
    latency: 142,
    online: true,
  },
  {
    id: 'res-de-fr',
    name: 'Residential · DE-FR',
    country: 'DE',
    city: 'FR',
    type: 'residential',
    host: '88.198.41.92',
    port: 8000,
    flag: '🇩🇪',
    rotating: true,
    latency: 168,
    online: true,
  },
  {
    id: 'res-jp-tk',
    name: 'Residential · JP-TK',
    country: 'JP',
    city: 'TK',
    type: 'residential',
    host: '153.121.66.4',
    port: 8000,
    flag: '🇯🇵',
    rotating: true,
    latency: 224,
    online: true,
  },
  {
    id: 'dc-us-ca',
    name: 'Datacenter · US-CA',
    country: 'US',
    city: 'CA',
    type: 'datacenter',
    host: '50.116.7.144',
    port: 8000,
    flag: '🇺🇸',
    rotating: false,
    latency: 38,
    online: true,
  },
]

export const USER_AGENTS: UserAgentOption[] = [
  { label: 'Browser default', value: null },
  {
    label: 'Chrome 124 · Windows',
    value:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  },
  {
    label: 'Chrome 124 · macOS',
    value:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  },
  {
    label: 'Firefox 125 · Windows',
    value:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
  },
  {
    label: 'Safari 17 · macOS',
    value:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
  },
  {
    label: 'iPhone 15 · Safari',
    value:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  },
]

export const VPROXIES_URL = 'https://vproxies-app.vercel.app'
