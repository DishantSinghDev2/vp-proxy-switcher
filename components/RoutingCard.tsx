import type { ProxyConfig } from '../lib/types'

interface Props {
  proxy: ProxyConfig | null
  latency?: number
  currentIP?: string | null
  loadingIP?: boolean
}

export default function RoutingCard({ proxy, latency, currentIP, loadingIP }: Props) {
  const isConnected = !!proxy
  const displayLatency = latency ?? proxy?.latency

  return (
    <div className={`mx-3 mt-3 rounded-xl px-4 py-3 border ${
      isConnected ? 'bg-[#0f2318] border-[#1a4a2a]' : 'bg-[#161616] border-[#262626]'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isConnected ? 'bg-[#22c55e]' : 'bg-[#4b5563]'}`} />
          <div>
            <p className="text-[10px] text-[#6b7280] uppercase tracking-widest font-semibold mb-0.5">
              Routing Via
            </p>
            <p className="text-white font-semibold text-[14px] leading-tight">
              {proxy ? proxy.name : 'Direct connection'}
            </p>
            {isConnected && (
              <p className="text-[11px] text-[#4b5563] font-mono mt-0.5">
                {loadingIP ? (
                  <span className="animate-pulse">fetching ip…</span>
                ) : currentIP ? (
                  currentIP
                ) : null}
              </p>
            )}
          </div>
        </div>
        {isConnected && displayLatency !== undefined && (
          <span className="text-[#4ade80] font-mono font-semibold text-[13px] shrink-0">
            {displayLatency}ms
          </span>
        )}
      </div>
    </div>
  )
}
