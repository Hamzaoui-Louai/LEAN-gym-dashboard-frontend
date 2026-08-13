const PALETTE = [
  'bg-lime-400/20 text-lime-300',
  'bg-sky-400/20 text-sky-300',
  'bg-fuchsia-400/20 text-fuchsia-300',
  'bg-amber-400/20 text-amber-300',
  'bg-emerald-400/20 text-emerald-300',
  'bg-rose-400/20 text-rose-300',
]

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-xs',
  lg: 'h-14 w-14 text-lg',
}

function MemberAvatar({ name = '?', size = 'md', className = '' }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const color = PALETTE[
    name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      PALETTE.length
  ]

  return (
    <div
      aria-hidden="true"
      className={`${SIZE_CLASSES[size]} ${color} flex shrink-0 items-center justify-center rounded-full font-bold ${className}`}
    >
      {initials || '?'}
    </div>
  )
}

export default MemberAvatar
