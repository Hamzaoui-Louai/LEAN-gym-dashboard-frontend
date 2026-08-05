import { Link } from 'react-router-dom'
import { usePageTransition } from '../hooks/usePageTransition'

function TransitionLink({ to, onClick, ...props }) {
  const { start } = usePageTransition()

  return (
    <Link
      to={to}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        event.preventDefault()
        start(to)
      }}
      {...props}
    />
  )
}

export default TransitionLink
