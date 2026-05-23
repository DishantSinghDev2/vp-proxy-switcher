import logoUrl from "url:../assets/icon.png"

const IconChip = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="7" y="7" width="10" height="10" rx="1" />
    <path d="M9 7V4M12 7V4M15 7V4M9 17v3M12 17v3M15 17v3M7 9H4M7 12H4M7 15H4M17 9h3M17 12h3M17 15h3" />
  </svg>
)

const IconShield = () => (
  <svg width="15" height="15" viewBox="0 0 23 23" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const IconRefresh = () => (
  <svg width="15" height="15" viewBox="0 0 23 23" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M23 4v6h-6" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
)

const IconHelp = () => (
  <svg width="15" height="15" viewBox="0 0 23 23" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

export default function Header() {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-[#111111] border-b border-[#1e1e1e]">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md overflow-hidden shrink-0">
          <img src={logoUrl} alt="logo" className="w-full h-full object-cover" />
        </div>
        <span className="text-white font-semibold text-[15px] tracking-tight">v-proxies</span>
        <span className="text-[10px] text-[#6b7280] border border-[#2a2a2a] rounded px-1.5 py-0.5 font-mono">
          v1.4
        </span>
      </div>
      <div className="flex items-center gap-3 text-[#6b7280]">
        <button className="hover:text-white transition-colors"><IconChip /></button>
        <button className="hover:text-white transition-colors"><IconShield /></button>
        <button className="hover:text-white transition-colors"><IconRefresh /></button>
        <button className="hover:text-white transition-colors"><IconHelp /></button>
      </div>
    </div>
  )
}
