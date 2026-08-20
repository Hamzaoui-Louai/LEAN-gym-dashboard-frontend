import { useState } from 'react'
import MembersModal from './MembersModal'
import Select from '../Select'
import { MEMBERSHIP_PLANS } from '../../lib/members'

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20 [color-scheme:dark]'
const labelClass = 'block text-sm font-medium text-white/70'

function SelectField({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="mt-2">
        <Select id={id} value={value} onChange={onChange} options={options} />
      </div>
    </div>
  )
}

function MemberForm({ mode, member, onClose, onSubmit }) {
  const [name, setName] = useState(member ? member.name : '')
  const [email, setEmail] = useState(member ? member.email : '')
  const [phone, setPhone] = useState(member ? member.phone : '')
  const [planId, setPlanId] = useState(
    member
      ? MEMBERSHIP_PLANS.find((plan) => plan.label === member.membership.plan)
          ?.id ?? 'monthly'
      : 'monthly',
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

    if (mode === 'edit') {
      onSubmit({
        id: member.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      })
      return
    }

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      membership: {
        plan: selectedPlan.label,
        price: selectedPlan.price,
      },
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

      {mode === 'add' && (
        <SelectField
          id="member-plan"
          label="Membership plan"
          value={planId}
          onChange={setPlanId}
          options={MEMBERSHIP_PLANS.map((plan) => ({
            value: plan.id,
            label: `${plan.label} — $${plan.price}`,
          }))}
        />
      )}

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
          : `Update ${member?.name}'s profile details.`
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
