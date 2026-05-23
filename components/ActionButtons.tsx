const BoltIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L4.09 12.96A1 1 0 0 0 5 14.5h5.5L11 22l8.91-10.96A1 1 0 0 0 19 9.5H13.5L13 2z" />
  </svg>
)

interface Props {
  onRotate: () => void
  onTest: () => void
  rotating: boolean
  testing: boolean
  disabled: boolean
}

export default function ActionButtons({ onRotate, onTest, rotating, testing, disabled }: Props) {
  return (
    <div className="flex gap-2 p-3 border-t border-[#1a1a1a] mt-1">
      <button
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#161616] border border-[#2a2a2a] text-white text-[13px] font-semibold hover:bg-[#1e1e1e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={onRotate}
        disabled={disabled || rotating}
      >
        <BoltIcon />
        {rotating ? 'Rotating…' : 'Rotate'}
      </button>
      <button
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#22c55e] text-black text-[13px] font-semibold hover:bg-[#16a34a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={onTest}
        disabled={disabled || testing}
      >
        <BoltIcon />
        {testing ? 'Testing…' : 'Test connection'}
      </button>
    </div>
  )
}
