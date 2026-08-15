export const VISIBLE_ON_LOAD = 3

export const LEAN_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    tagline: 'For a single gym',
    features: ['Up to 500 members', 'Core dashboard modules'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 59,
    tagline: 'For growing gyms',
    features: ['Unlimited members', 'Full analytics suite'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    tagline: 'For multi-location',
    features: ['Multiple locations', 'Priority support'],
  },
]

export const INITIAL_SESSIONS = [
  { id: 1, device: 'MacBook Pro · Chrome', location: 'Casablanca, MA', last_active: 'Now', current: true },
  { id: 2, device: 'iPhone 15 · Safari', location: 'Casablanca, MA', last_active: '2 hours ago', current: false },
  { id: 3, device: 'Windows PC · Edge', location: 'Rabat, MA', last_active: '3 days ago', current: false },
  { id: 4, device: 'iPad · Safari', location: 'Paris, FR', last_active: '1 week ago', current: false },
]

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'ar', label: 'العربية' },
  { value: 'es', label: 'Español' },
]

export const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
]

export const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
]
