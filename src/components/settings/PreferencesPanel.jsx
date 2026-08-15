import Panel from '../Panel'
import { CURRENCIES, DATE_FORMATS, LANGUAGES } from './constants'
import { SelectField } from './form'

function PreferencesPanel({ preferences, onChange }) {
  return (
    <Panel title="Preferences" subtitle="Language, currency and formatting">
      <div className="space-y-4">
        <SelectField
          label="Language"
          value={preferences.language}
          onChange={(language) => onChange({ ...preferences, language })}
          options={LANGUAGES}
        />
        <SelectField
          label="Currency"
          value={preferences.currency}
          onChange={(currency) => onChange({ ...preferences, currency })}
          options={CURRENCIES}
        />
        <SelectField
          label="Date format"
          value={preferences.dateFormat}
          onChange={(dateFormat) => onChange({ ...preferences, dateFormat })}
          options={DATE_FORMATS}
        />
      </div>
    </Panel>
  )
}

export default PreferencesPanel
