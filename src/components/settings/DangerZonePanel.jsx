import Panel from '../Panel'
import { buttonGhost } from './form'

function DeactivateRow({ confirmAction, onConfirm, onSubmit }) {
  if (confirmAction === 'deactivate') {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={() => onConfirm(null)} className={buttonGhost}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSubmit('deactivate')}
          className="rounded-full border border-amber-400/50 px-5 py-2.5 text-sm font-semibold text-amber-400 transition hover:bg-amber-400/10"
        >
          Confirm deactivation
        </button>
      </div>
    )
  }
  return (
    <button
      type="button"
      onClick={() => onConfirm('deactivate')}
      className="shrink-0 rounded-full border border-amber-400/50 px-5 py-2.5 text-sm font-semibold text-amber-400 transition hover:bg-amber-400/10"
    >
      Deactivate
    </button>
  )
}

function DeleteRow({ confirmAction, onConfirm, onSubmit }) {
  if (confirmAction === 'delete') {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <button type="button" onClick={() => onConfirm(null)} className={buttonGhost}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSubmit('delete')}
          className="rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-400"
        >
          Confirm delete
        </button>
      </div>
    )
  }
  return (
    <button
      type="button"
      onClick={() => onConfirm('delete')}
      className="shrink-0 rounded-full border border-rose-400/50 px-5 py-2.5 text-sm font-semibold text-rose-400 transition hover:bg-rose-400/10"
    >
      Delete account
    </button>
  )
}

function DangerZonePanel({ confirmAction, onConfirm, onSubmit, notice }) {
  return (
    <Panel title="Danger zone" subtitle="Irreversible actions">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white">Deactivate account</p>
          <p className="mt-0.5 text-xs text-white/40">
            Suspend your account temporarily. You can reactivate it at any time.
          </p>
        </div>
        <DeactivateRow
          confirmAction={confirmAction}
          onConfirm={onConfirm}
          onSubmit={onSubmit}
        />
      </div>

      <div className="my-5 h-px bg-white/10" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-white">Delete account</p>
          <p className="mt-0.5 text-xs text-white/40">
            Permanently remove your account and all associated data.
          </p>
        </div>
        <DeleteRow confirmAction={confirmAction} onConfirm={onConfirm} onSubmit={onSubmit} />
      </div>
      {notice && <p className="mt-4 text-xs font-medium text-lime-400">{notice}</p>}
    </Panel>
  )
}

export default DangerZonePanel
