function SectionHeader({ title, subtitle }) {
  return (
    <div className="mt-8">
      <h2 className="text-base font-bold text-white">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-white/40">{subtitle}</p>}
    </div>
  )
}

export default SectionHeader
