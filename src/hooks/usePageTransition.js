import { createContext, useContext } from 'react'

export const PageTransitionContext = createContext(null)

export function usePageTransition() {
  const context = useContext(PageTransitionContext)
  if (!context) {
    throw new Error(
      'usePageTransition must be used within a PageTransitionProvider',
    )
  }
  return context
}
