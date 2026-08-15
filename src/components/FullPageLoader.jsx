function FullPageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-black px-6">
      <span className="text-4xl font-black tracking-tight text-lime-400">LEAN</span>
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400 [animation-delay:300ms]" />
      </div>
    </div>
  )
}

export default FullPageLoader
