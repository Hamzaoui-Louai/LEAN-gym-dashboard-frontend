import { useEffect, useState } from 'react'
import { BackgroundContext } from '../hooks/useBackground'
import { DEFAULT_BACKGROUND_ID } from '../lib/dashboardBackgrounds'

const STORAGE_KEY = 'dashboard_background'

export function BackgroundProvider({ children }) {
  const [backgroundId, setBackgroundId] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? DEFAULT_BACKGROUND_ID,
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, backgroundId)
  }, [backgroundId])

  return (
    <BackgroundContext.Provider value={{ backgroundId, setBackgroundId }}>
      {children}
    </BackgroundContext.Provider>
  )
}
