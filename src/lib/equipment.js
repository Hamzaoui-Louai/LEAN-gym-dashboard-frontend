// Mock data mirroring the future Laravel API shape:
//   GET /api/equipment -> { data: Equipment[] }
//   Equipment: {
//     id, name, category,
//     state: 'operational' | 'in_use' | 'under_repair' | 'out_of_order',
//     purchased_at: 'YYYY-MM-DD',
//     price: number, image: string | null
//   }
//   GET /api/equipment/payments -> { data: Payment[] }  (purchases)
//   Payment: { id, date, item, amount, method, status: 'paid'|'pending'|'failed' }
//   GET /api/equipment/repairs -> { data: Repair[] }
//   Repair: { id, date, equipment, issue, cost, status: 'paid'|'pending'|'failed' }
// EquipmentPage owns these in useState — swap that for react-query fetches
// and these mocks drop out.

export const EQUIPMENT_STATES = {
  operational: 'Operational',
  in_use: 'In use',
  under_repair: 'Under repair',
  out_of_order: 'Out of order',
}

export const EQUIPMENT_STATE_ORDER = Object.keys(EQUIPMENT_STATES)

const SEEDS = [
  ['Squat Rack', 'Strength', 1850, 'operational', '2024-01-15'],
  ['Olympic Barbell Set', 'Strength', 620, 'in_use', '2024-02-08'],
  ['Bench Press', 'Strength', 480, 'operational', '2024-03-21'],
  ['Dumbbell Rack', 'Strength', 350, 'operational', '2024-04-02'],
  ['Cable Crossover', 'Strength', 1450, 'out_of_order', '2024-05-17'],
  ['Leg Press', 'Strength', 2100, 'operational', '2024-06-09'],
  ['Lat Pulldown', 'Strength', 890, 'in_use', '2024-07-01'],
  ['Power Rack', 'Strength', 2400, 'operational', '2024-08-14'],
  ['Treadmill', 'Cardio', 1250, 'operational', '2024-09-05'],
  ['Elliptical', 'Cardio', 1100, 'in_use', '2024-10-19'],
  ['Stationary Bike', 'Cardio', 520, 'operational', '2024-11-11'],
  ['Rowing Machine', 'Cardio', 940, 'in_use', '2024-12-01'],
  ['Stair Climber', 'Cardio', 1780, 'under_repair', '2025-01-22'],
  ['Spin Bike', 'Cardio', 480, 'in_use', '2025-02-14'],
  ['Yoga Mats (Set of 20)', 'Flexibility', 210, 'operational', '2025-03-03'],
  ['Stability Balls (Set of 10)', 'Flexibility', 260, 'operational', '2025-03-30'],
  ['Kettlebell Set', 'Functional', 540, 'operational', '2025-04-18'],
  ['Battle Ropes', 'Functional', 120, 'operational', '2025-05-06'],
  ['Plyo Boxes (Set)', 'Functional', 420, 'under_repair', '2025-06-25'],
  ['Medicine Balls (Set)', 'Functional', 300, 'operational', '2025-07-12'],
  ['Leg Curl Machine', 'Strength', 760, 'operational', '2025-08-04'],
  ['Preacher Curl Bench', 'Strength', 300, 'operational', '2025-09-15'],
  ['Smith Machine', 'Strength', 1650, 'under_repair', '2025-10-20'],
  ['Upright Bike', 'Cardio', 760, 'out_of_order', '2025-11-28'],
]

export const MOCK_EQUIPMENT = SEEDS.map((seed, index) => ({
  id: index + 1,
  name: seed[0],
  category: seed[1],
  price: seed[2],
  state: seed[3],
  purchased_at: seed[4],
  image: null,
}))

const METHODS = ['Card', 'Cash', 'Transfer']

export const MOCK_PAYMENTS = MOCK_EQUIPMENT.map((equipment) => ({
  id: `payment-${equipment.id}`,
  date: equipment.purchased_at,
  item: equipment.name,
  amount: equipment.price,
  method: METHODS[(equipment.id - 1) % METHODS.length],
  status: [5, 17].includes(equipment.id) ? 'pending' : 'paid',
}))

const REPAIR_SEEDS = [
  ['Squat Rack', 'Replaced worn J-hooks and tightened frame bolts', 85, '2026-07-02', 'paid'],
  ['Cable Crossover', 'Replaced snapped pulley cable', 240, '2026-06-18', 'paid'],
  ['Smith Machine', 'Replaced worn carriage rollers', 130, '2026-06-10', 'pending'],
  ['Stair Climber', 'Serviced drive belt and pedals', 175, '2026-05-28', 'paid'],
  ['Leg Press', 'Fixed hydraulic piston leak', 320, '2026-05-12', 'paid'],
  ['Plyo Boxes (Set)', 'Recovered tops with anti-slip coating', 90, '2026-04-20', 'paid'],
  ['Treadmill', 'Calibrated belt tension and replaced rollers', 145, '2026-04-02', 'paid'],
  ['Rowing Machine', 'Replaced chain and cleaned rail', 110, '2026-03-15', 'paid'],
  ['Bench Press', 'Replaced safety catches', 60, '2026-03-01', 'paid'],
  ['Upright Bike', 'Replaced resistance magnet assembly', 200, '2026-02-11', 'paid'],
  ['Lat Pulldown', 'Re-routed cable and replaced pulley', 95, '2026-01-26', 'paid'],
  ['Elliptical', 'Replaced worn pedal straps', 40, '2026-01-08', 'pending'],
  ['Stationary Bike', 'Lubricated drivetrain and adjusted seat post', 55, '2025-12-19', 'paid'],
  ['Spin Bike', 'Replaced handlebar grips and brake pads', 70, '2025-12-02', 'paid'],
  ['Power Rack', 'Welded a cracked base joint', 180, '2025-11-14', 'paid'],
  ['Cable Crossover', 'Replaced grips and tightened stack pins', 65, '2025-10-30', 'paid'],
  ['Treadmill', 'Replaced console power supply', 120, '2025-10-06', 'paid'],
  ['Dumbbell Rack', 'Replaced rusty plate pins', 35, '2025-09-18', 'paid'],
]

export const MOCK_REPAIRS = REPAIR_SEEDS.map((seed, index) => ({
  id: index + 1,
  equipment: seed[0],
  issue: seed[1],
  cost: seed[2],
  date: seed[3],
  status: seed[4],
}))
