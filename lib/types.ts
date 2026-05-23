export interface ProxyConfig {
  id: string
  name: string
  country: string
  city: string
  type: 'residential' | 'datacenter' | 'mobile'
  host: string
  port: number
  username?: string
  password?: string
  latency?: number
  online?: boolean
  flag: string
  rotating: boolean
}

export interface Settings {
  activeProxy: ProxyConfig | null
  proxies: ProxyConfig[]
  reloadOnChange: boolean
  userAgent: string
}

export interface TestResult {
  ok: boolean
  ip?: string
  ms?: number
  error?: string
}

export type UserAgentOption = {
  label: string
  value: string | null
}
