import { useState } from 'react'
import MembersModal from '../members/MembersModal'

const now = new Date()
const CURRENT_MONTH = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 transition focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20 [color-scheme:dark]'
const labelClass = 'block text-sm font-medium text-white/70'

function periodLabel(value) {
  const [year, month] = value.split('-')
  const date = new Date(year, Number(month) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

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

function PayslipForm({ person, onClose, onSubmit }) {
  const [period, setPeriod] = useState(CURRENT_MONTH)
  const [amount, setAmount] = useState(String(person.salary ?? ''))
  const [method, setMethod] = useState('Card')
  const [status, setStatus] = useState('paid')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    const amountValue = Number(amount)
    if (!amount || Number.isNaN(amountValue) || amountValue <= 0) {
      setErrors({ amount: 'Enter a valid payslip amount.' })
      return
    }
    setErrors({})
    setSubmitting(true)

    onSubmit({
      id: `payslip-${person.id}-${period}`,
      date: `${period}-01`,
      period: periodLabel(period),
      amount: amountValue,
      method,
      status,
    })
  }

  const fieldError = (field) =>
    errors[field] ? <p className="mt-1 text-xs text-red-400">{errors[field]}</p> : null

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="payslip-period" className={labelClass}>
          Period
        </label>
        <input
          id="payslip-period"
          type="month"
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          className={`mt-2 ${inputClass}`}
        />
      </div>

      <div>
        <label htmlFor="payslip-amount" className={labelClass}>
          Amount
        </label>
        <input
          id="payslip-amount"
          type="number"
          min="0"
          step="50"
          placeholder="1800"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          aria-invalid={Boolean(errors.amount)}
          className={`mt-2 ${inputClass}`}
        />
        {fieldError('amount')}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          id="payslip-method"
          label="Payment method"
          value={method}
          onChange={(event) => setMethod(event.target.value)}
        >
          <option value="Card">Card</option>
          <option value="Cash">Cash</option>
          <option value="Transfer">Transfer</option>
        </SelectField>
        <SelectField
          id="payslip-status"
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </SelectField>
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
          disabled={submitting}
          className="rounded-full bg-lime-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-lime-300 disabled:pointer-events-none disabled:opacity-50"
        >
          {submitting ? 'Saving payslip…' : 'Save payslip'}
        </button>
      </div>
    </form>
  )
}

function PayslipModal({ person, onClose, onSubmit }) {
  if (!person) return null
  return (
    <MembersModal
      open={Boolean(person)}
      onClose={onClose}
      title="New payslip"
      description={`Write a payslip for ${person.name}.`}
    >
      <PayslipForm
        key={person.id}
        person={person}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </MembersModal>
  )
}

export default PayslipModal
