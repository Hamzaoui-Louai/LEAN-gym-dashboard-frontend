function GlowBackground({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden ${className}`}
    >
      <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-lime-400/25 blur-3xl" />
      <div className="absolute -right-28 top-[38%] h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
    </div>
  )
}

export default GlowBackground
