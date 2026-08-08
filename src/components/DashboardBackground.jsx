import {
  DASHBOARD_BACKGROUNDS,
  DEFAULT_BACKGROUND_ID,
} from '../lib/dashboardBackgrounds'
import { useBackground } from '../hooks/useBackground'

function DashboardBackground() {
  const { backgroundId } = useBackground()
  const entry =
    DASHBOARD_BACKGROUNDS.find((background) => background.id === backgroundId) ??
    DASHBOARD_BACKGROUNDS.find(
      (background) => background.id === DEFAULT_BACKGROUND_ID,
    )
  const Background = entry.Background

  return <Background />
}

export default DashboardBackground
