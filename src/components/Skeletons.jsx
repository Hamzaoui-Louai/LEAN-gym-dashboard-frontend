export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-white/10 ${className}`} />
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="divide-y divide-white/5">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-40 max-w-full" />
              <Skeleton className="mt-2 h-3 w-64 max-w-full" />
            </div>
          </div>
          <Skeleton className="hidden h-4 w-20 sm:block" />
          <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-4 w-3/4" />
          <Skeleton className="mt-2 h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function TileSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-8 w-16" />
      <Skeleton className="mt-2 h-3 w-28" />
    </div>
  )
}

export function PanelSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-1 h-3 w-56" />
      <Skeleton className="mt-6 h-40 w-full" />
      <Skeleton className="mt-4 h-3 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="mt-2 h-4 w-96 max-w-full" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <TileSkeleton key={index} />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <PanelSkeleton />
        <div className="grid gap-6 xl:col-span-2">
          <PanelSkeleton />
        </div>
      </div>
    </div>
  )
}

export function GymProfileSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Profile card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-5">
            <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="mt-3 h-4 w-64 max-w-full" />
              <Skeleton className="mt-3 h-3 w-48" />
              <Skeleton className="mt-2 h-3 w-36" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 shrink-0 rounded-full" />
        </div>
      </div>

      {/* 4 stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-4 h-8 w-12" />
          </div>
        ))}
      </div>

      {/* 2 info panels */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4">
          <Skeleton className="h-4 w-36" />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="mt-2 h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4">
          <Skeleton className="h-4 w-32" />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-2 h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
