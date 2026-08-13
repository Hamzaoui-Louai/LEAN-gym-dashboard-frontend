const GRADIENTS = [
  'from-lime-400/25 via-emerald-400/10 to-transparent',
  'from-sky-400/25 via-cyan-400/10 to-transparent',
  'from-amber-400/25 via-orange-400/10 to-transparent',
  'from-fuchsia-400/25 via-purple-400/10 to-transparent',
  'from-rose-400/25 via-red-400/10 to-transparent',
  'from-teal-400/25 via-emerald-400/10 to-transparent',
]

function EquipmentImage({ item }) {
  if (item.image) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0d0d0d]">
        <img
          src={item.image}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    )
  }
  const gradient = GRADIENTS[item.id % GRADIENTS.length]
  return (
    <div
      aria-hidden="true"
      className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#0d0d0d] bg-gradient-to-br ${gradient}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-12 w-12 text-white/25"
      >
        <path d="m6.5 6.5 11 11" />
        <path d="m21 21-1-1" />
        <path d="m3 3 1 1" />
        <path d="m18 22 4-4" />
        <path d="m2 6 4-4" />
        <path d="m3 10 7-7" />
        <path d="m14 21 7-7" />
      </svg>
      <span className="absolute bottom-2.5 right-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
        No photo
      </span>
    </div>
  )
}

export default EquipmentImage
