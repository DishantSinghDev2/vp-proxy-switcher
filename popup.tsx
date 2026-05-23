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

  useEffect(() => {
    loadSettings().then((s) => {
      setProxies(s.proxies)
      setActive(s.activeProxy)
      setReloadOnChange(s.reloadOnChange)
      setUserAgent(s.userAgent)
      setAutoRotate(s.autoRotate)
      setRotateInterval(s.rotateInterval)
    })
  }, [])

  const reloadActiveTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) chrome.tabs.reload(tabs[0].id)
    })
  }

  const handleSelect = async (proxy: ProxyConfig | null) => {
    setActive(proxy)
    setResult(null)
    await saveSettings({ activeProxy: proxy, rotateIndex: 0 })
    chrome.runtime.sendMessage({ type: proxy ? 'SET_PROXY' : 'CLEAR_PROXY', proxy })
    if (reloadOnChange) reloadActiveTab()
  }

  const handleAddProxy = async (proxy: ProxyConfig) => {
    const next = [...proxies, proxy]
    setProxies(next)
    await saveSettings({ proxies: next })
  }

  const handleRotate = async () => {
    if (!active) return
    setRotating(true)
    setResult(null)
    try {
      await chrome.runtime.sendMessage({ type: 'ROTATE', proxy: active })
      if (reloadOnChange) reloadActiveTab()
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

      <div className="flex-1 overflow-y-auto py-1 space-y-1">
        <RoutingCard proxy={active} latency={result?.ok ? result.ms : undefined} />

        <ProxySelector
          proxies={proxies}
          active={active}
          onSelect={handleSelect}
          onAddProxy={handleAddProxy}
        />

        <Toggle label="Reload tab when proxy changes" value={reloadOnChange} onChange={handleReloadToggle} />

        <RotationSettings
          enabled={autoRotate}
          intervalSeconds={rotateInterval}
          onToggle={handleAutoRotateToggle}
          onIntervalChange={handleRotateInterval}
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
