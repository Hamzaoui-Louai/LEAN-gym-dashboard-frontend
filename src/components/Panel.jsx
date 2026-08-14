function Panel({ title, subtitle, children, className }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] ${className ?? ''}`}>
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-white/40">{subtitle}</p>}
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  )
}

export default Panel
