import { useState } from 'react'
import type { ProxyConfig } from '../lib/types'

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const TypeBadge = ({ type }: { type: ProxyConfig['type'] }) => {
  const label = type === 'residential' ? 'RES' : type === 'datacenter' ? 'DC' : 'MOB'
  return (
    <span className="text-[10px] font-mono font-semibold text-[#9ca3af] border border-[#2a2a2a] rounded px-1.5 py-0.5">
      {label}
    </span>
  )
}

const LatencyDot = ({ ms }: { ms?: number }) => {
  const color = !ms ? '#4b5563' : ms < 100 ? '#4ade80' : ms < 200 ? '#a3e635' : ms < 400 ? '#facc15' : '#ef4444'
  return <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
}

interface Props {
  proxies: ProxyConfig[]
  active: ProxyConfig | null
  onSelect: (proxy: ProxyConfig | null) => void
  onAddProxy: (proxy: ProxyConfig) => void
}

export default function ProxySelector({ proxies, active, onSelect, onAddProxy }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState({ host: '', port: '8080', username: '', password: '', name: '' })

  const filtered = proxies.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.host.includes(search) ||
    `${p.country}-${p.city}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    if (!form.host || !form.port) return
    const proxy: ProxyConfig = {
      id: `custom-${Date.now()}`,
      name: form.name || `Custom · ${form.host}`,
      country: 'US',
      city: '',
      type: 'residential',
      host: form.host,
      port: parseInt(form.port),
      username: form.username || undefined,
      password: form.password || undefined,
      flag: '🌐',
      rotating: false,
    }
    onAddProxy(proxy)
    setShowAddForm(false)
    setForm({ host: '', port: '8080', username: '', password: '', name: '' })
  }

  return (
    <div className="mx-3 mb-2">
      <p className="text-[10px] text-[#4b5563] uppercase tracking-widest font-semibold px-1 mb-1.5">
        Proxy
      </p>
      <div className="rounded-xl border border-[#1e1e1e] overflow-hidden bg-[#111111]">
        {/* Current proxy row */}
        <button
          className="flex items-center gap-3 w-full px-3.5 py-3 text-left hover:bg-[#161616] transition-colors"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="text-lg leading-none">{active?.flag ?? '⬤'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-white font-medium truncate">
              {active?.name ?? 'Direct connection'}
            </p>
            {active && (
              <p className="text-[11px] text-[#4b5563] font-mono truncate">
                {active.rotating ? 'rotating' : 'static'} · {active.host}:{active.port}
              </p>
            )}
          </div>
          {active && <TypeBadge type={active.type} />}
          <span className="text-[#4b5563]"><ChevronDown open={open} /></span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="border-t border-[#1e1e1e]">
            {/* Search */}
            <div className="px-3 py-2 border-b border-[#1a1a1a]">
              <input
                className="w-full bg-transparent text-[13px] text-[#9ca3af] outline-none placeholder:text-[#4b5563]"
                placeholder="Search 84.2M IPs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>

            {/* Vproxies promo banner */}
            <a
              href="https://vproxies.app/pricing"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2 bg-[#0f1f12] border-b border-[#1a2e1a] hover:bg-[#132518] transition-colors no-underline"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <p className="text-[11px] text-[#4ade80] font-semibold">★ v-proxies Residential</p>
                <p className="text-[10px] text-[#4b5563]">$0.99/GB · 84M+ IPs worldwide</p>
              </div>
              <span className="text-[11px] text-[#22c55e] font-semibold">Get →</span>
            </a>

            {/* Direct connection */}
            <button
              className={`flex items-center gap-3 w-full px-3.5 py-2.5 text-left hover:bg-[#1a1a1a] transition-colors ${
                !active ? 'bg-[#1a1a1a]' : ''
              }`}
              onClick={() => { onSelect(null); setOpen(false) }}
            >
              <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${!active ? 'border-[#22c55e]' : 'border-[#374151]'}`}>
                {!active && <div className="w-full h-full rounded-full scale-50 bg-[#22c55e]" />}
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-[#d1d5db]">Direct connection</p>
                <p className="text-[11px] text-[#4b5563]">—</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#374151]" />
            </button>

            {/* Proxy list */}
            <div className="max-h-48 overflow-y-auto">
              {filtered.map((proxy) => (
                <button
                  key={proxy.id}
                  className={`flex items-center gap-3 w-full px-3.5 py-2.5 text-left hover:bg-[#1a1a1a] transition-colors ${
                    active?.id === proxy.id ? 'bg-[#1a1a1a]' : ''
                  }`}
                  onClick={() => { onSelect(proxy); setOpen(false) }}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    active?.id === proxy.id ? 'border-[#22c55e]' : 'border-[#374151]'
                  }`}>
                    {active?.id === proxy.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                    )}
                  </div>
                  <span className="text-base leading-none">{proxy.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#d1d5db] font-medium truncate">{proxy.name}</p>
                    <p className="text-[11px] text-[#4b5563] font-mono truncate">
                      {proxy.host}:{proxy.port}
                    </p>
                  </div>
                  {proxy.latency !== undefined && (
                    <span className="text-[11px] text-[#6b7280] font-mono">{proxy.latency}ms</span>
                  )}
                  <LatencyDot ms={proxy.latency} />
                </button>
              ))}
            </div>

            {/* Add / Import footer */}
            {showAddForm ? (
              <div className="border-t border-[#1e1e1e] p-3 space-y-2">
                <input className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-[12px] text-white outline-none placeholder:text-[#4b5563]" placeholder="Proxy name (optional)" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <div className="flex gap-2">
                  <input className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-[12px] text-white outline-none placeholder:text-[#4b5563]" placeholder="Host / IP" value={form.host} onChange={e => setForm(f => ({ ...f, host: e.target.value }))} />
                  <input className="w-20 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-[12px] text-white outline-none placeholder:text-[#4b5563]" placeholder="Port" value={form.port} onChange={e => setForm(f => ({ ...f, port: e.target.value }))} />
                </div>
                <input className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-[12px] text-white outline-none placeholder:text-[#4b5563]" placeholder="Username (optional)" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
                <input type="password" className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-[12px] text-white outline-none placeholder:text-[#4b5563]" placeholder="Password (optional)" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#22c55e] text-black font-semibold text-[12px] rounded-lg py-1.5 hover:bg-[#16a34a] transition-colors" onClick={handleAdd}>Add</button>
                  <button className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-[#9ca3af] font-semibold text-[12px] rounded-lg py-1.5 hover:bg-[#262626] transition-colors" onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex border-t border-[#1e1e1e]">
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] text-[#6b7280] hover:text-white hover:bg-[#1a1a1a] transition-colors border-r border-[#1e1e1e]"
                  onClick={() => setShowAddForm(true)}
                >
                  <span>+</span> Add proxy
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] text-[#6b7280] hover:text-white hover:bg-[#1a1a1a] transition-colors"
                  onClick={() => {
                    const input = prompt('Paste proxy (host:port or host:port:user:pass)')
                    if (!input) return
                    const parts = input.trim().split(':')
                    if (parts.length < 2) return
                    const proxy: ProxyConfig = {
                      id: `import-${Date.now()}`,
                      name: `Imported · ${parts[0]}`,
                      country: 'US', city: '', type: 'residential',
                      host: parts[0], port: parseInt(parts[1]),
                      username: parts[2] || undefined, password: parts[3] || undefined,
                      flag: '🌐', rotating: false,
                    }
                    onAddProxy(proxy)
                  }}
                >
                  <span className="font-mono text-[10px]">&lt;/&gt;</span> Import
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
