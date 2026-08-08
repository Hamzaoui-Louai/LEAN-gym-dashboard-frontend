const FULL_BLOBS = [
  'animate-drift-slow -left-24 -top-32 h-[36rem] w-[36rem] bg-lime-400/10 blur-[130px]',
  'animate-drift-slower -right-40 top-1/3 h-[32rem] w-[32rem] bg-white/[0.07] blur-[130px]',
  'animate-drift-slowest -bottom-40 left-1/4 h-[30rem] w-[30rem] bg-lime-300/10 blur-[120px]',
]

const COMPACT_BLOBS = [
  'animate-drift-slow -left-8 -top-8 h-36 w-36 bg-lime-400/15 blur-[50px]',
  'animate-drift-slower -right-10 top-1/3 h-32 w-32 bg-white/10 blur-[50px]',
  'animate-drift-slowest -bottom-10 left-1/3 h-28 w-28 bg-lime-300/15 blur-[45px]',
]

function BlobsBackground({ compact = false }) {
  const blobs = compact ? COMPACT_BLOBS : FULL_BLOBS

  return (
    <div
      aria-hidden="true"
      className={
        compact
          ? 'pointer-events-none absolute inset-0 overflow-hidden bg-black'
          : 'pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black'
      }
    >
      {blobs.map((blob) => (
        <div key={blob} className={`absolute rounded-full ${blob}`} />
      ))}
    </div>
  )
}

export default BlobsBackground
