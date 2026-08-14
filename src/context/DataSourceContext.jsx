import { useCallback, useState } from 'react'
import { DataSourceContext } from '../hooks/useDataSource'

const STORAGE_KEY = 'data_source'

function readStoredSource() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'api' || stored === 'mock') return stored
  return localStorage.getItem('auth_token') ? 'api' : 'mock'
}

export function DataSourceProvider({ children }) {
  const [source, setSource] = useState(readStoredSource)

  const updateSource = useCallback((next) => {
    setSource(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  return (
    <DataSourceContext.Provider value={{ source, setSource: updateSource }}>
      {children}
    </DataSourceContext.Provider>
  )
}
