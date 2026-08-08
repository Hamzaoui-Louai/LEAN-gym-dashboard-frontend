import BlobsBackground from '../components/backgrounds/BlobsBackground'
import RainBackground from '../components/backgrounds/RainBackground'
import RipplesBackground from '../components/backgrounds/RipplesBackground'

export const DASHBOARD_BACKGROUNDS = [
  { id: 'blobs', name: 'Calm Blobs', Background: BlobsBackground },
  { id: 'rain', name: 'Lime Rain', Background: RainBackground },
  { id: 'ripples', name: 'Rain Ripples', Background: RipplesBackground },
]

export const DEFAULT_BACKGROUND_ID = 'blobs'
