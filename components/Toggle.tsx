interface Props {
  label: string
  value: boolean
  onChange: (val: boolean) => void
}

export default function Toggle({ label, value, onChange }: Props) {
  return (
    <button
      className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-[#161616] transition-colors"
      onClick={() => onChange(!value)}
    >
      <span className="text-[13px] text-[#d1d5db]">{label}</span>
      <div
        className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${
          value ? 'bg-[#22c55e]' : 'bg-[#374151]'
        }`}
        style={{ width: 40, height: 22 }}
      >
        <div
          className="absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200"
          style={{
            width: 18,
            height: 18,
            top: 2,
            left: value ? 20 : 2,
            transition: 'left 0.2s',
          }}
        />
      </div>
    </button>
  )
}
