import DashboardPage from '../pages/DashboardPage'
import MembersPage from '../pages/MembersPage'
import StaffPage from '../pages/StaffPage'
import EquipmentPage from '../pages/EquipmentPage'
import CheckInsPage from '../pages/CheckInsPage'
import SubscriptionsPage from '../pages/SubscriptionsPage'
import FinancesPage from '../pages/FinancesPage'
import GymProfilePage from '../pages/GymProfilePage'
import SettingsPage from '../pages/SettingsPage'

export const DASHBOARD_PAGES = [
  { path: '/dashboard', label: 'Dashboard', component: DashboardPage },
  { path: '/dashboard/members', label: 'Members', component: MembersPage },
  { path: '/dashboard/staff', label: 'Staff', component: StaffPage },
  { path: '/dashboard/equipment', label: 'Equipment', component: EquipmentPage },
  { path: '/dashboard/check-ins', label: 'Check-ins', component: CheckInsPage },
  {
    path: '/dashboard/subscriptions',
    label: 'Subscriptions',
    component: SubscriptionsPage,
  },
  { path: '/dashboard/finances', label: 'Finances', component: FinancesPage },
  {
    path: '/dashboard/gym-profile',
    label: 'Gym Profile',
    component: GymProfilePage,
  },
  { path: '/dashboard/settings', label: 'Settings', component: SettingsPage },
]
