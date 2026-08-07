function PageHeader({ eyebrow, title, description }) {
  return (
    <div>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-lime-400">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          {description}
        </p>
      )}
    </div>
  )
}

export default PageHeader
