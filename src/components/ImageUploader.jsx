const labelClass = 'block text-sm font-medium text-white/70'

function ImageUploader({
  image,
  label = 'Picture',
  previewClass = 'aspect-[4/3]',
}) {
  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div
        className={`relative mt-2 overflow-hidden rounded-xl border border-white/10 bg-white/5 ${previewClass}`}
      >
        {image ? (
          <img
            src={image}
            alt={`${label} preview`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-10 w-10 text-white/20"
            >
              <path d="m6.5 6.5 11 11" />
              <path d="m21 21-1-1" />
              <path d="m3 3 1 1" />
              <path d="m18 22 4-4" />
              <path d="m2 6 4-4" />
              <path d="m3 10 7-7" />
              <path d="m14 21 7-7" />
            </svg>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-3.5 w-3.5"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m17 8-5-5-5 5" />
            <path d="M12 3v12" />
          </svg>
          {image ? 'Change picture' : 'Upload picture'}
        </span>
        {image && (
          <span className="rounded-full px-4 py-2 text-xs font-semibold text-white/50">
            Remove
          </span>
        )}
      </div>
    </div>
  )
}

export default ImageUploader
