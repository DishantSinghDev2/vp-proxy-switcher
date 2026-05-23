import { useState } from 'react'

const PRESETS = [
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '5m', value: 300 },
  { label: '10m', value: 600 },
  { label: '30m', value: 1800 },
]

interface Props {
  enabled: boolean
  intervalSeconds: number
  onToggle: (enabled: boolean) => void
  onIntervalChange: (seconds: number) => void
}

export default function RotationSettings({ enabled, intervalSeconds, onToggle, onIntervalChange }: Props) {
  const isCustom = !PRESETS.some((p) => p.value === intervalSeconds)
  const [customVal, setCustomVal] = useState(isCustom ? String(intervalSeconds) : '')

  const handlePreset = (val: number) => {
    setCustomVal('')
    onIntervalChange(val)
  }

  const handleCustomChange = (raw: string) => {
    setCustomVal(raw)
    const n = parseInt(raw)
    if (!isNaN(n) && n >= 10) onIntervalChange(n)
  }

  return (
    <div className="mx-3 mb-2">
      <p className="text-[10px] text-[#4b5563] uppercase tracking-widest font-semibold px-1 mb-1.5">
        Auto-Rotate
      </p>
      <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] overflow-hidden">
        {/* Toggle row */}
        <button
          className="flex items-center justify-between w-full px-3.5 py-3 hover:bg-[#161616] transition-colors"
          onClick={() => onToggle(!enabled)}
        >
          <div>
            <p className="text-[13px] text-white font-medium text-left">Auto-rotate proxy</p>
            <p className="text-[11px] text-[#4b5563] font-mono text-left">
              {enabled ? `every ${formatInterval(intervalSeconds)}` : 'disabled'}
            </p>
          </div>
          {/* Toggle */}
          <div
            className={`relative rounded-full transition-colors duration-200 shrink-0 ${enabled ? 'bg-[#22c55e]' : 'bg-[#374151]'}`}
            style={{ width: 40, height: 22 }}
          >
            <div
              className="absolute bg-white rounded-full shadow"
              style={{ width: 18, height: 18, top: 2, left: enabled ? 20 : 2, transition: 'left 0.2s' }}
            />
          </div>
        </button>

        {/* Interval picker — only shown when enabled */}
        {enabled && (
          <div className="border-t border-[#1e1e1e] px-3.5 py-3 space-y-2">
            <p className="text-[10px] text-[#4b5563] uppercase tracking-wider font-semibold">Interval</p>
            <div className="flex gap-1.5 flex-wrap">
              {PRESETS.map((p) => (
                <button
                  key={p.value}
                  className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-colors ${
                    intervalSeconds === p.value && !isCustom
                      ? 'bg-[#22c55e] text-black'
                      : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#9ca3af] hover:text-white hover:border-[#3a3a3a]'
                  }`}
                  onClick={() => handlePreset(p.value)}
                >
                  {p.label}
                </button>
              ))}
              {/* Custom input */}
              <div className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 transition-colors ${
                isCustom && customVal ? 'border-[#22c55e] bg-[#0f2318]' : 'border-[#2a2a2a] bg-[#1a1a1a]'
              }`}>
                <input
                  className="w-10 bg-transparent text-[12px] text-white outline-none placeholder:text-[#4b5563] font-mono"
                  placeholder="60"
                  value={customVal}
                  onChange={(e) => handleCustomChange(e.target.value.replace(/\D/g, ''))}
                  onClick={() => setCustomVal(isCustom ? String(intervalSeconds) : '')}
                />
                <span className="text-[11px] text-[#4b5563]">sec</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function formatInterval(s: number): string {
  if (s < 60) return `${s}s`
  if (s % 3600 === 0) return `${s / 3600}h`
  if (s % 60 === 0) return `${s / 60}m`
  return `${s}s`
}
