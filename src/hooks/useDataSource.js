import { createContext, useContext } from 'react'

export const DataSourceContext = createContext(null)

export function useDataSource() {
  const context = useContext(DataSourceContext)
  if (!context) {
    throw new Error('useDataSource must be used within a DataSourceProvider')
  }
  return context
}
