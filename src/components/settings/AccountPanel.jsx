import Panel from '../Panel'
import ImageUploader from '../ImageUploader'
import { InputField, buttonLime } from './form'

function AccountPanel({ account, onChange, onSave, saved, submitting }) {
  return (
    <Panel title="Account" subtitle="Your profile details">
      <ImageUploader
        image={account.picture}
        label="Profile picture"
        previewClass="aspect-square w-24"
      />
      <div className="mt-6 space-y-4">
        <InputField
          label="Name"
          value={account.name}
          onChange={(name) => onChange({ ...account, name })}
        />
        <InputField
          label="Email"
          type="email"
          value={account.email}
          onChange={(email) => onChange({ ...account, email })}
        />
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <div>
            <p className="text-sm font-medium text-white">Password</p>
            <p className="mt-0.5 text-xs text-white/40">
              Last changed February 2026 — update it under Security.
            </p>
          </div>
          <span className="text-sm tracking-widest text-white/40">••••••••</span>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={submitting}
          className={`${buttonLime} disabled:pointer-events-none disabled:opacity-50`}
        >
          {submitting ? 'Saving changes…' : 'Save changes'}
        </button>
        {saved && <span className="text-xs font-medium text-lime-400">Saved ✓</span>}
      </div>
    </Panel>
  )
}

export default AccountPanel
