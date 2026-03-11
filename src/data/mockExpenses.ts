import { ExpenseEntry } from '@/types/expense';

export const DAILY_AVG_FUEL_PRICE = 104.5; // ₹ per liter

export const mockExpenses: ExpenseEntry[] = [
  {
    id: 'EXP-001', driverId: 'D01', driverName: 'Rajesh Kumar',
    vendorName: 'HP Fuel Station', amount: 4180, date: '2025-03-10',
    category: 'fuel', status: 'pending', route: 'Delhi → Jaipur',
    distanceKm: 280, fuelLiters: 40, fuelPricePerLiter: 104.5,
    receiptImageUrl: '/placeholder.svg', submittedAt: '2025-03-10T14:30:00Z',
  },
  {
    id: 'EXP-002', driverId: 'D01', driverName: 'Rajesh Kumar',
    vendorName: 'NHAI Toll Plaza', amount: 785, date: '2025-03-10',
    category: 'toll', status: 'pending', route: 'Delhi → Jaipur',
    distanceKm: 280, receiptImageUrl: '/placeholder.svg',
    submittedAt: '2025-03-10T15:00:00Z',
  },
  {
    id: 'EXP-003', driverId: 'D02', driverName: 'Suresh Yadav',
    vendorName: 'Indian Oil', amount: 5225, date: '2025-03-09',
    category: 'fuel', status: 'approved', route: 'Mumbai → Pune',
    distanceKm: 150, fuelLiters: 50, fuelPricePerLiter: 104.5,
    receiptImageUrl: '/placeholder.svg', submittedAt: '2025-03-09T10:00:00Z',
    reviewedAt: '2025-03-09T18:00:00Z',
  },
  {
    id: 'EXP-004', driverId: 'D03', driverName: 'Anil Sharma',
    vendorName: 'Dhaba Express', amount: 5000, date: '2025-03-09',
    category: 'food', status: 'pending', route: 'Lucknow → Varanasi',
    distanceKm: 300, receiptImageUrl: '/placeholder.svg',
    submittedAt: '2025-03-09T12:00:00Z',
  },
  {
    id: 'EXP-005', driverId: 'D01', driverName: 'Rajesh Kumar',
    vendorName: 'Bharat Petroleum', amount: 3640, date: '2025-03-08',
    category: 'fuel', status: 'approved', route: 'Jaipur → Udaipur',
    distanceKm: 395, fuelLiters: 35, fuelPricePerLiter: 104,
    receiptImageUrl: '/placeholder.svg', submittedAt: '2025-03-08T09:00:00Z',
    reviewedAt: '2025-03-08T17:00:00Z',
  },
  {
    id: 'EXP-006', driverId: 'D04', driverName: 'Vikram Singh',
    vendorName: 'NHAI Toll Plaza', amount: 650, date: '2025-03-08',
    category: 'toll', status: 'pending', route: 'Chennai → Bangalore',
    distanceKm: 350, receiptImageUrl: '/placeholder.svg',
    submittedAt: '2025-03-08T11:00:00Z',
  },
  {
    id: 'EXP-007', driverId: 'D05', driverName: 'Mohan Patel',
    vendorName: 'Shell Fuel Station', amount: 7320, date: '2025-03-07',
    category: 'fuel', status: 'approved', route: 'Ahmedabad → Mumbai',
    distanceKm: 530, fuelLiters: 70, fuelPricePerLiter: 104.57,
    receiptImageUrl: '/placeholder.svg', submittedAt: '2025-03-07T08:00:00Z',
    reviewedAt: '2025-03-07T16:00:00Z',
  },
  {
    id: 'EXP-008', driverId: 'D02', driverName: 'Suresh Yadav',
    vendorName: 'Road Side Dhaba', amount: 350, date: '2025-03-07',
    category: 'food', status: 'approved', route: 'Mumbai → Pune',
    distanceKm: 150, receiptImageUrl: '/placeholder.svg',
    submittedAt: '2025-03-07T13:00:00Z', reviewedAt: '2025-03-07T18:00:00Z',
  },
  {
    id: 'EXP-009', driverId: 'D03', driverName: 'Anil Sharma',
    vendorName: 'HP Petrol Pump', amount: 8360, date: '2025-03-06',
    category: 'fuel', status: 'pending', route: 'Delhi → Chandigarh',
    distanceKm: 250, fuelLiters: 80, fuelPricePerLiter: 104.5,
    receiptImageUrl: '/placeholder.svg', submittedAt: '2025-03-06T07:00:00Z',
  },
  {
    id: 'EXP-010', driverId: 'D04', driverName: 'Vikram Singh',
    vendorName: 'NHAI Toll', amount: 420, date: '2025-03-06',
    category: 'toll', status: 'approved', route: 'Chennai → Bangalore',
    distanceKm: 350, receiptImageUrl: '/placeholder.svg',
    submittedAt: '2025-03-06T10:00:00Z', reviewedAt: '2025-03-06T15:00:00Z',
  },
  {
    id: 'EXP-011', driverId: 'D05', driverName: 'Mohan Patel',
    vendorName: 'Indian Oil', amount: 2090, date: '2025-03-05',
    category: 'fuel', status: 'pending', route: 'Surat → Vadodara',
    distanceKm: 160, fuelLiters: 20, fuelPricePerLiter: 104.5,
    receiptImageUrl: '/placeholder.svg', submittedAt: '2025-03-05T09:00:00Z',
  },
  {
    id: 'EXP-012', driverId: 'D04', driverName: 'Vikram Singh',
    vendorName: 'NHAI Toll Plaza', amount: 650, date: '2025-03-05',
    category: 'toll', status: 'approved', route: 'Chennai → Bangalore',
    distanceKm: 350, receiptImageUrl: '/placeholder.svg',
    submittedAt: '2025-03-05T11:00:00Z', reviewedAt: '2025-03-05T16:00:00Z',
  },
  {
    id: 'EXP-013', driverId: 'D01', driverName: 'Rajesh Kumar',
    vendorName: 'Tyre Works', amount: 2800, date: '2025-03-05',
    category: 'maintenance', status: 'pending', route: 'Udaipur → Jodhpur',
    distanceKm: 260, receiptImageUrl: '/placeholder.svg',
    submittedAt: '2025-03-05T14:00:00Z',
  },
  {
    id: 'EXP-014', driverId: 'D02', driverName: 'Suresh Yadav',
    vendorName: 'Bharat Petroleum', amount: 3135, date: '2025-03-04',
    category: 'fuel', status: 'approved', route: 'Pune → Nashik',
    distanceKm: 210, fuelLiters: 30, fuelPricePerLiter: 104.5,
    receiptImageUrl: '/placeholder.svg', submittedAt: '2025-03-04T08:00:00Z',
    reviewedAt: '2025-03-04T14:00:00Z',
  },
  {
    id: 'EXP-015', driverId: 'D03', driverName: 'Anil Sharma',
    vendorName: 'Haldiram Dhaba', amount: 280, date: '2025-03-04',
    category: 'food', status: 'approved', route: 'Delhi → Chandigarh',
    distanceKm: 250, receiptImageUrl: '/placeholder.svg',
    submittedAt: '2025-03-04T12:00:00Z', reviewedAt: '2025-03-04T17:00:00Z',
  },
  {
    id: 'EXP-016', driverId: 'D05', driverName: 'Mohan Patel',
    vendorName: 'NHAI Toll', amount: 310, date: '2025-03-03',
    category: 'toll', status: 'pending', route: 'Vadodara → Ahmedabad',
    distanceKm: 110, receiptImageUrl: '/placeholder.svg',
    submittedAt: '2025-03-03T10:00:00Z',
  },
  {
    id: 'EXP-017', driverId: 'D01', driverName: 'Rajesh Kumar',
    vendorName: 'HP Fuel Station', amount: 5225, date: '2025-03-03',
    category: 'fuel', status: 'approved', route: 'Jodhpur → Delhi',
    distanceKm: 590, fuelLiters: 50, fuelPricePerLiter: 104.5,
    receiptImageUrl: '/placeholder.svg', submittedAt: '2025-03-03T07:00:00Z',
    reviewedAt: '2025-03-03T15:00:00Z',
  },
  {
    id: 'EXP-018', driverId: 'D04', driverName: 'Vikram Singh',
    vendorName: 'Mechanic Shop', amount: 1500, date: '2025-03-02',
    category: 'maintenance', status: 'pending', route: 'Bangalore → Mysore',
    distanceKm: 150, receiptImageUrl: '/placeholder.svg',
    submittedAt: '2025-03-02T16:00:00Z',
  },
  {
    id: 'EXP-019', driverId: 'D02', driverName: 'Suresh Yadav',
    vendorName: 'Reliance Fuel', amount: 4180, date: '2025-03-02',
    category: 'fuel', status: 'approved', route: 'Nashik → Mumbai',
    distanceKm: 180, fuelLiters: 40, fuelPricePerLiter: 104.5,
    receiptImageUrl: '/placeholder.svg', submittedAt: '2025-03-02T09:00:00Z',
    reviewedAt: '2025-03-02T14:00:00Z',
  },
  {
    id: 'EXP-020', driverId: 'D03', driverName: 'Anil Sharma',
    vendorName: 'Parking Lot', amount: 200, date: '2025-03-01',
    category: 'other', status: 'pending', route: 'Varanasi → Allahabad',
    distanceKm: 130, receiptImageUrl: '/placeholder.svg',
    submittedAt: '2025-03-01T11:00:00Z',
  },
];

export const getCategoryLabel = (cat: string) => {
  const labels: Record<string, string> = {
    fuel: 'Fuel', toll: 'Toll', food: 'Food',
    maintenance: 'Maintenance', other: 'Other',
  };
  return labels[cat] || cat;
};

export const getCategoryIcon = (cat: string) => {
  const icons: Record<string, string> = {
    fuel: 'Fuel', toll: 'Landmark', food: 'UtensilsCrossed',
    maintenance: 'Wrench', other: 'Package',
  };
  return icons[cat] || 'Package';
};
