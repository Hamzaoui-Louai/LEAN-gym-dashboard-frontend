import { useState } from 'react'
import MembersModal from '../members/MembersModal'
import ImageUploader from '../ImageUploader'
import { DAY_KEYS, DAY_LABELS } from '../../lib/gym'

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

function GymProfileForm({ gym, onClose, onSubmit }) {
  const [name, setName] = useState(gym.name)
  const [description, setDescription] = useState(gym.description)
  const [address, setAddress] = useState(gym.address)
  const [email, setEmail] = useState(gym.email)
  const [phone, setPhone] = useState(gym.phone)
  const [opensAt, setOpensAt] = useState(gym.opens_at)
  const [closesAt, setClosesAt] = useState(gym.closes_at)
  const [days, setDays] = useState(gym.days_open)
  const [status, setStatus] = useState(gym.status)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const toggleDay = (key) => {
    setDays((current) =>
      current.includes(key) ? current.filter((day) => day !== key) : [...current, key],
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Gym name is required.'
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    onSubmit({
      name: (name || '').trim(),
      description: (description || '').trim(),
      address: (address || '').trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      opens_at: opensAt,
      closes_at: closesAt,
      days_open: days,
      status,
    })
  }

  const fieldError = (field) =>
    errors[field] ? <p className="mt-1 text-xs text-red-400">{errors[field]}</p> : null

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <ImageUploader
        image={gym.logo}
        label="Gym logo"
        previewClass="aspect-square"
      />

      <div>
        <label htmlFor="gym-name" className={labelClass}>
          Gym name
        </label>
        <input
          id="gym-name"
          type="text"
          placeholder="Lean Fitness Club"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(errors.name)}
          className={`mt-2 ${inputClass}`}
        />
        {fieldError('name')}
      </div>

      <div>
        <label htmlFor="gym-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="gym-description"
          rows="3"
          placeholder="Tell members about your gym…"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={`mt-2 resize-y ${inputClass}`}
        />
      </div>

      <div>
        <label htmlFor="gym-address" className={labelClass}>
          Address
        </label>
        <input
          id="gym-address"
          type="text"
          placeholder="48 Fitness Avenue, Springfield"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className={`mt-2 ${inputClass}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="gym-email" className={labelClass}>
            Email
          </label>
          <input
            id="gym-email"
            type="email"
            placeholder="hello@leanfitness.example"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            className={`mt-2 ${inputClass}`}
          />
          {fieldError('email')}
        </div>
        <div>
          <label htmlFor="gym-phone" className={labelClass}>
            Phone number
          </label>
          <input
            id="gym-phone"
            type="tel"
            placeholder="+1 (555) 010-2000"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={`mt-2 ${inputClass}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="gym-opens" className={labelClass}>
            Opening time
          </label>
          <input
            id="gym-opens"
            type="time"
            value={opensAt}
            onChange={(event) => setOpensAt(event.target.value)}
            className={`mt-2 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="gym-closes" className={labelClass}>
            Closing time
          </label>
          <input
            id="gym-closes"
            type="time"
            value={closesAt}
            onChange={(event) => setClosesAt(event.target.value)}
            className={`mt-2 ${inputClass}`}
          />
        </div>
      </div>

      <div>
        <span className={labelClass}>Days open</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {DAY_KEYS.map((key) => {
            const selected = days.includes(key)
            return (
              <button
                type="button"
                key={key}
                onClick={() => toggleDay(key)}
                aria-pressed={selected}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  selected
                    ? 'border-lime-400 bg-lime-400 text-black'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {DAY_LABELS[key]}
              </button>
            )
          })}
        </div>
      </div>

      <SelectField
        id="gym-status"
        label="Gym status"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </SelectField>

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
          disabled={submitting}
          className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300 disabled:pointer-events-none disabled:opacity-50"
        >
          {submitting ? 'Saving changes…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

function GymProfileModal({ gym, onClose, onSubmit }) {
  return (
    <MembersModal
      open
      onClose={onClose}
      title="Edit gym profile"
      description="Update your gym's details, hours and status."
    >
      <GymProfileForm
        key={gym.id}
        gym={gym}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </MembersModal>
  )
}

export default GymProfileModal
