import { useState } from 'react'
import MembersModal from './MembersModal'
import { MEMBERSHIP_PLANS } from '../../lib/members'

function toISO(date) {
  return date.toISOString().slice(0, 10)
}

function addMonths(date, months) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

function computeEndsAt(plan, startedAt) {
  const start = new Date(`${startedAt}T00:00:00`)
  return plan.months > 0 ? toISO(addMonths(start, plan.months)) : null
}

const now = new Date()
const TODAY_ISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20 [color-scheme:dark]'
const labelClass = 'block text-sm font-medium text-white/70'

function SelectField({ id, label, value, onChange, children }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative mt-2">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`${inputClass} appearance-none pr-10`}
        >
          {children}
        </select>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  )
}

function MemberForm({ mode, member, onClose, onSubmit }) {
  const [name, setName] = useState(member ? member.name : '')
  const [email, setEmail] = useState(member ? member.email : '')
  const [phone, setPhone] = useState(member ? member.phone : '')
  const [status, setStatus] = useState(member ? member.status : 'active')
  const [planId, setPlanId] = useState(
    member
      ? MEMBERSHIP_PLANS.find((plan) => plan.label === member.membership.plan)
          ?.id ?? 'monthly'
      : 'monthly',
  )
  const [startedAt, setStartedAt] = useState(
    member ? member.membership.started_at : TODAY_ISO,
  )
  const [errors, setErrors] = useState({})

  const selectedPlan = MEMBERSHIP_PLANS.find((plan) => plan.id === planId)

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Name is required.'
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      ...(mode === 'edit' && { id: member.id }),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      status,
      joined_at: mode === 'edit' ? member.joined_at : startedAt,
      membership: {
        plan: selectedPlan.label,
        price: selectedPlan.price,
        started_at: startedAt,
        ends_at: computeEndsAt(selectedPlan, startedAt),
      },
      payments: mode === 'edit' ? member.payments : [],
    })
  }

  const fieldError = (field) =>
    errors[field] ? <p className="mt-1 text-xs text-red-400">{errors[field]}</p> : null

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="member-name" className={labelClass}>
          Full name
        </label>
        <input
          id="member-name"
          type="text"
          placeholder="Jane Doe"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(errors.name)}
          className={`mt-2 ${inputClass}`}
        />
        {fieldError('name')}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="member-email" className={labelClass}>
            Email
          </label>
          <input
            id="member-email"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            className={`mt-2 ${inputClass}`}
          />
          {fieldError('email')}
        </div>
        <div>
          <label htmlFor="member-phone" className={labelClass}>
            Phone
          </label>
          <input
            id="member-phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={`mt-2 ${inputClass}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          id="member-plan"
          label="Membership plan"
          value={planId}
          onChange={(event) => setPlanId(event.target.value)}
        >
          {MEMBERSHIP_PLANS.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.label} — ${plan.price}
            </option>
          ))}
        </SelectField>
        <SelectField
          id="member-status"
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="active">Active</option>
          <option value="frozen">Frozen</option>
          <option value="expired">Expired</option>
        </SelectField>
      </div>

      <div>
        <label htmlFor="member-start" className={labelClass}>
          Membership starts
        </label>
        <input
          id="member-start"
          type="date"
          value={startedAt}
          onChange={(event) => setStartedAt(event.target.value)}
          className={`mt-2 ${inputClass}`}
        />
        <p className="mt-1 text-xs text-white/40">
          Ends on {computeEndsAt(selectedPlan, startedAt) ?? '—'}
        </p>
      </div>

      <div className="mt-2 flex justify-end gap-3 border-t border-white/10 pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300"
        >
          {mode === 'add' ? 'Add member' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

function MemberFormModal({ open, mode, member, onClose, onSubmit }) {
  return (
    <MembersModal
      open={open}
      onClose={onClose}
      title={mode === 'add' ? 'Add member' : 'Edit member'}
      description={
        mode === 'add'
          ? 'Create a profile so you can start tracking their membership.'
          : `Update ${member?.name}'s profile and membership details.`
      }
    >
      <MemberForm
        key={mode === 'edit' && member ? member.id : 'add'}
        mode={mode}
        member={member}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </MembersModal>
  )
}

export default MemberFormModal
