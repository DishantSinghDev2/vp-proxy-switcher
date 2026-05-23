import { useState, useRef } from 'react'
import { USER_AGENTS } from '../lib/defaults'

const GearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

interface Props {
  value: string
  onChange: (label: string, ua: string | null) => void
}

const POPUP_H = 600
const FOOTER_H = 52

export default function UserAgentSelector({ value, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0, maxH: 200 })

  const toggleOpen = () => {
    if (!open && containerRef.current) {
      const r = containerRef.current.getBoundingClientRect()
      setDropPos({ top: r.bottom, left: r.left, width: r.width, maxH: Math.max(POPUP_H - r.bottom - FOOTER_H, 120) })
    }
    setOpen(o => !o)
  }

  return (
    <div className="mx-3 mb-2">
      <p className="text-[10px] text-[#4b5563] uppercase tracking-widest font-semibold px-1 mb-1.5">
        User Agent
      </p>

      {/* Trigger */}
      <div ref={containerRef} className="rounded-xl border border-[#1e1e1e] overflow-hidden bg-[#111111]">
        <button
          className="flex items-center gap-3 w-full px-3.5 py-3 text-left hover:bg-[#161616] transition-colors"
          onClick={toggleOpen}
        >
          <span className="text-[#6b7280]"><GearIcon /></span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-white font-medium truncate">{value}</p>
            <p className="text-[11px] text-[#4b5563] font-mono">
              {value === 'Browser default' ? 'no override' : 'custom'}
            </p>
          </div>
          <span className="text-[#4b5563]"><ChevronDown open={open} /></span>
        </button>
      </div>

      {/* Floating dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="fixed z-50 bg-[#111111] border border-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden flex flex-col"
            style={{ top: dropPos.top + 4, left: dropPos.left, width: dropPos.width, maxHeight: dropPos.maxH }}
          >
            <div className="overflow-y-auto flex-1">
              {USER_AGENTS.map(ua => (
                <button
                  key={ua.label}
                  className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-left hover:bg-[#1a1a1a] transition-colors ${value === ua.label ? 'bg-[#161616]' : ''}`}
                  onClick={() => { onChange(ua.label, ua.value); setOpen(false) }}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${value === ua.label ? 'border-[#22c55e]' : 'border-[#374151]'}`}>
                    {value === ua.label && <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />}
                  </div>
                  <span className="text-[13px] text-[#d1d5db] truncate">{ua.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
