import { useState } from 'react'
import MembersModal from '../members/MembersModal'
import Select from '../Select'
import { STAFF_ROLES } from '../../lib/staff'

const now = new Date()
const TODAY_ISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

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

function StaffForm({ mode, person, onClose, onSubmit }) {
  const [name, setName] = useState(person ? person.name : '')
  const [email, setEmail] = useState(person ? person.email : '')
  const [phone, setPhone] = useState(person ? person.phone : '')
  const [role, setRole] = useState(person ? person.role : STAFF_ROLES[0])
  const [status, setStatus] = useState(person ? person.status : 'active')
  const [salary, setSalary] = useState(
    person ? String(person.salary) : '',
  )
  const [joinedAt, setJoinedAt] = useState(
    person ? person.joined_at : TODAY_ISO,
  )
  const [errors, setErrors] = useState({})

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Name is required.'
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    const salaryValue = Number(salary)
    if (!salary || Number.isNaN(salaryValue) || salaryValue <= 0) {
      nextErrors.salary = 'Enter a valid monthly salary.'
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      ...(mode === 'edit' && { id: person.id }),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      status,
      salary: salaryValue,
      joined_at: mode === 'edit' ? person.joined_at : joinedAt,
      payslips: mode === 'edit' ? person.payslips : [],
    })
  }

  const fieldError = (field) =>
    errors[field] ? <p className="mt-1 text-xs text-red-400">{errors[field]}</p> : null

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="staff-name" className={labelClass}>
          Full name
        </label>
        <input
          id="staff-name"
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
          <label htmlFor="staff-email" className={labelClass}>
            Email
          </label>
          <input
            id="staff-email"
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
          <label htmlFor="staff-phone" className={labelClass}>
            Phone
          </label>
          <input
            id="staff-phone"
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
          id="staff-role"
          label="Role"
          value={role}
          onChange={setRole}
          options={STAFF_ROLES.map((item) => ({ value: item, label: item }))}
        />
        <SelectField
          id="staff-status"
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'on_leave', label: 'On leave' },
            { value: 'departed', label: 'Departed' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="staff-salary" className={labelClass}>
            Monthly salary
          </label>
          <input
            id="staff-salary"
            type="number"
            min="0"
            step="50"
            placeholder="1800"
            value={salary}
            onChange={(event) => setSalary(event.target.value)}
            aria-invalid={Boolean(errors.salary)}
            className={`mt-2 ${inputClass}`}
          />
          {fieldError('salary')}
        </div>
        <div>
          <label htmlFor="staff-joined" className={labelClass}>
            Joined
          </label>
          <input
            id="staff-joined"
            type="date"
            value={joinedAt}
            onChange={(event) => setJoinedAt(event.target.value)}
            className={`mt-2 ${inputClass}`}
          />
        </div>
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
          {mode === 'add' ? 'Add staff' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

function StaffFormModal({ open, mode, person, onClose, onSubmit }) {
  return (
    <MembersModal
      open={open}
      onClose={onClose}
      title={mode === 'add' ? 'Add staff' : 'Edit staff'}
      description={
        mode === 'add'
          ? 'Create a profile so you can track them and their payslips.'
          : `Update ${person?.name}'s profile and pay details.`
      }
    >
      <StaffForm
        key={mode === 'edit' && person ? person.id : 'add'}
        mode={mode}
        person={person}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </MembersModal>
  )
}

export default StaffFormModal
