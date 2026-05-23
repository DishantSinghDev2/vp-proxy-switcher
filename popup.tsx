import { useState, useEffect } from 'react'
import Header from './components/Header'
import RoutingCard from './components/RoutingCard'
import ProxySelector from './components/ProxySelector'
import Toggle from './components/Toggle'
import UserAgentSelector from './components/UserAgentSelector'
import ActionButtons from './components/ActionButtons'
import RotationSettings from './components/RotationSettings'
import type { ProxyConfig, TestResult } from './lib/types'
import { loadSettings, saveSettings } from './lib/storage'
import { openProxyTester } from './lib/tester'
import { fetchIPInfo, fetchCurrentIP, measureLatency } from './lib/ipInfo'
import './style.css'

export default function Popup() {
  const [proxies, setProxies] = useState<ProxyConfig[]>([])
  const [active, setActive] = useState<ProxyConfig | null>(null)
  const [reloadOnChange, setReloadOnChange] = useState(true)
  const [userAgent, setUserAgent] = useState('Browser default')
  const [rotating, setRotating] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)
  const [autoRotate, setAutoRotate] = useState(false)
  const [rotateInterval, setRotateInterval] = useState(60)
  const [currentIP, setCurrentIP] = useState<string | null>(null)
  const [loadingIP, setLoadingIP] = useState(false)

  useEffect(() => {
    loadSettings().then((s) => {
      setProxies(s.proxies)
      setActive(s.activeProxy)
      setReloadOnChange(s.reloadOnChange)
      setUserAgent(s.userAgent)
      setAutoRotate(s.autoRotate)
      setRotateInterval(s.rotateInterval)

      // If a proxy is already active on popup open, fetch live IP + latency
      if (s.activeProxy) {
        refreshIPAndLatency(s.activeProxy, s.proxies)
      }
    })
  }, [])

  const refreshIPAndLatency = async (proxy: ProxyConfig, allProxies: ProxyConfig[]) => {
    setLoadingIP(true)
    const [ipData, ms] = await Promise.all([fetchCurrentIP(), measureLatency()])
    setLoadingIP(false)
    if (ipData) setCurrentIP(ipData.ip)
    if (ms !== null) {
      const updated = allProxies.map(p => p.id === proxy.id ? { ...p, latency: ms } : p)
      setProxies(updated)
      setActive(prev => prev?.id === proxy.id ? { ...prev, latency: ms } : prev)
      await saveSettings({ proxies: updated, activeProxy: { ...proxy, latency: ms } })
    }
  }

  const reloadActiveTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) chrome.tabs.reload(tabs[0].id)
    })
  }

  const handleSelect = async (proxy: ProxyConfig | null) => {
    setActive(proxy)
    setResult(null)
    setCurrentIP(null)
    await saveSettings({ activeProxy: proxy, rotateIndex: 0 })
    chrome.runtime.sendMessage({ type: proxy ? 'SET_PROXY' : 'CLEAR_PROXY', proxy })
    if (reloadOnChange) reloadActiveTab()
    if (proxy) {
      // Small delay to let the proxy activate before measuring
      setTimeout(() => refreshIPAndLatency(proxy, proxies), 800)
    }
  }

  const handleAddProxies = async (batch: ProxyConfig[]) => {
    const next = [...proxies, ...batch]
    setProxies(next)
    await saveSettings({ proxies: next })
    // Enrich each in background
    batch.forEach(async (proxy) => {
      const info = await fetchIPInfo(proxy.host)
      if (info) {
        const enriched: ProxyConfig = {
          ...proxy,
          country: info.countryCode,
          city: info.city,
          flag: info.flag,
          name: proxy.name.startsWith('Imported ·')
            ? `${proxy.type === 'residential' ? 'Residential' : proxy.type === 'datacenter' ? 'Datacenter' : 'Mobile'} · ${info.countryCode}-${info.city.slice(0, 2).toUpperCase() || info.countryCode}`
            : proxy.name,
        }
        setProxies(prev => prev.map(p => p.id === proxy.id ? enriched : p))
        const saved = await import('./lib/storage').then(m => m.loadSettings())
        const enrichedList = saved.proxies.map((p: ProxyConfig) => p.id === proxy.id ? enriched : p)
        await saveSettings({ proxies: enrichedList })
      }
    })
  }

  const handleAddProxy = async (proxy: ProxyConfig) => {
    // Immediately append with placeholder flag, then enrich in background
    const next = [...proxies, proxy]
    setProxies(next)
    await saveSettings({ proxies: next })

    // Enrich with real country/flag/city from ipwho.is
    const info = await fetchIPInfo(proxy.host)
    if (info) {
      const enriched: ProxyConfig = {
        ...proxy,
        country: info.countryCode,
        city: info.city,
        flag: info.flag,
        name: proxy.name.startsWith('Custom ·') || proxy.name.startsWith('Imported ·')
          ? `${proxy.type === 'residential' ? 'Residential' : proxy.type === 'datacenter' ? 'Datacenter' : 'Mobile'} · ${info.countryCode}-${info.city.slice(0, 2).toUpperCase() || info.countryCode}`
          : proxy.name,
      }
      const enrichedList = next.map(p => p.id === proxy.id ? enriched : p)
      setProxies(enrichedList)
      await saveSettings({ proxies: enrichedList })
    }
  }

  const handleRemoveProxy = async (id: string) => {
    const next = proxies.filter(p => p.id !== id)
    setProxies(next)
    if (active?.id === id) {
      setActive(null)
      setCurrentIP(null)
      chrome.runtime.sendMessage({ type: 'CLEAR_PROXY' })
    }
    // Auto-disable rotation if fewer than 2 proxies remain
    if (next.length < 2 && autoRotate) {
      setAutoRotate(false)
      await saveSettings({ proxies: next, autoRotate: false })
      chrome.runtime.sendMessage({ type: 'SET_AUTO_ROTATE', enabled: false })
    } else {
      await saveSettings({ proxies: next })
    }
  }

  const handleRotate = async () => {
    if (!active) return
    setRotating(true)
    setResult(null)
    try {
      await chrome.runtime.sendMessage({ type: 'ROTATE', proxy: active })
      if (reloadOnChange) reloadActiveTab()
      setTimeout(() => refreshIPAndLatency(active, proxies), 800)
    } finally {
      setRotating(false)
    }
  }

  const handleTest = () => {
    if (!active) return
    openProxyTester(active)
  }

  const handleReloadToggle = async (val: boolean) => {
    setReloadOnChange(val)
    await saveSettings({ reloadOnChange: val })
  }

  const handleUserAgent = async (label: string, _ua: string | null) => {
    setUserAgent(label)
    await saveSettings({ userAgent: label })
  }

  const handleAutoRotateToggle = async (val: boolean) => {
    setAutoRotate(val)
    await saveSettings({ autoRotate: val })
    chrome.runtime.sendMessage({ type: 'SET_AUTO_ROTATE', enabled: val, intervalSeconds: rotateInterval })
  }

  const handleRotateInterval = async (seconds: number) => {
    setRotateInterval(seconds)
    await saveSettings({ rotateInterval: seconds })
    if (autoRotate) {
      chrome.runtime.sendMessage({ type: 'SET_AUTO_ROTATE', enabled: true, intervalSeconds: seconds })
    }
  }

  return (
    <div className="bg-[#0d0d0d] flex flex-col" style={{ width: 360, height: 600 }}>
      <Header />

      <div className="flex-1 py-1 space-y-1">
        <RoutingCard
          proxy={active}
          latency={result?.ok ? result.ms : undefined}
          currentIP={currentIP}
          loadingIP={loadingIP}
        />

        <ProxySelector
          proxies={proxies}
          active={active}
          onSelect={handleSelect}
          onAddProxy={handleAddProxy}
          onAddProxies={handleAddProxies}
          onRemoveProxy={handleRemoveProxy}
        />

        <Toggle label="Reload tab when proxy changes" value={reloadOnChange} onChange={handleReloadToggle} />

        <RotationSettings
          enabled={autoRotate}
          intervalSeconds={rotateInterval}
          onToggle={handleAutoRotateToggle}
          onIntervalChange={handleRotateInterval}
          disabled={proxies.length < 2}
        />

        <UserAgentSelector value={userAgent} onChange={handleUserAgent} />
      </div>

      <ActionButtons
        onRotate={handleRotate}
        onTest={handleTest}
        rotating={rotating}
        testing={false}
        disabled={!active}
      />
    </div>
  )
}
