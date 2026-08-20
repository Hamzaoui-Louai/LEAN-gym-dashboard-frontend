import { useState } from 'react'
import MembersModal from '../members/MembersModal'
import ImageUploader from '../ImageUploader'
import { EQUIPMENT_STATES, EQUIPMENT_STATE_ORDER } from '../../lib/equipment'

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

function EquipmentForm({ mode, item, onClose, onSubmit }) {
  const [name, setName] = useState(item ? item.name : '')
  const [category, setCategory] = useState(item ? item.category : '')
  const [state, setState] = useState(item ? item.state : 'operational')
  const [purchasedAt, setPurchasedAt] = useState(
    item ? item.purchased_at : TODAY_ISO,
  )
  const [price, setPrice] = useState(item ? String(item.price) : '')
  const [errors, setErrors] = useState({})

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Name is required.'
    const priceValue = Number(price)
    if (!price || Number.isNaN(priceValue) || priceValue <= 0) {
      nextErrors.price = 'Enter a valid price.'
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      ...(mode === 'edit' && { id: item.id }),
      name: name.trim(),
      category: category.trim() || 'General',
      state,
      purchased_at: mode === 'edit' ? item.purchased_at : purchasedAt,
      price: priceValue,
    })
  }

  const fieldError = (field) =>
    errors[field] ? <p className="mt-1 text-xs text-red-400">{errors[field]}</p> : null

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <ImageUploader image={item ? item.image : null} />

      <div>
        <label htmlFor="equipment-name" className={labelClass}>
          Name
        </label>
        <input
          id="equipment-name"
          type="text"
          placeholder="Treadmill"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(errors.name)}
          className={`mt-2 ${inputClass}`}
        />
        {fieldError('name')}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="equipment-category" className={labelClass}>
            Category
          </label>
          <input
            id="equipment-category"
            type="text"
            placeholder="Strength, Cardio…"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={`mt-2 ${inputClass}`}
          />
        </div>
        <SelectField
          id="equipment-state"
          label="State"
          value={state}
          onChange={(event) => setState(event.target.value)}
        >
          {EQUIPMENT_STATE_ORDER.map((value) => (
            <option key={value} value={value}>
              {EQUIPMENT_STATES[value]}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="equipment-price" className={labelClass}>
            Price
          </label>
          <input
            id="equipment-price"
            type="number"
            min="0"
            step="10"
            placeholder="1250"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            aria-invalid={Boolean(errors.price)}
            className={`mt-2 ${inputClass}`}
          />
          {fieldError('price')}
        </div>
        <div>
          <label htmlFor="equipment-purchased" className={labelClass}>
            Purchased
          </label>
          <input
            id="equipment-purchased"
            type="date"
            value={purchasedAt}
            onChange={(event) => setPurchasedAt(event.target.value)}
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
          {mode === 'add' ? 'Add equipment' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

function EquipmentFormModal({ open, mode, item, onClose, onSubmit }) {
  return (
    <MembersModal
      open={open}
      onClose={onClose}
      title={mode === 'add' ? 'Add equipment' : 'Edit equipment'}
      description={
        mode === 'add'
          ? 'Add a new piece of equipment to your inventory.'
          : `Update ${item?.name}'s details and condition.`
      }
    >
      <EquipmentForm
        key={mode === 'edit' && item ? item.id : 'add'}
        mode={mode}
        item={item}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </MembersModal>
  )
}

export default EquipmentFormModal
