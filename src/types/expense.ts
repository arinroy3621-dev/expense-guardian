export type ExpenseCategory = 'fuel' | 'toll' | 'food' | 'maintenance' | 'other';
export type ExpenseStatus = 'pending' | 'approved' | 'rejected';

export interface ExpenseEntry {
  id: string;
  driverId: string;
  driverName: string;
  vendorName: string;
  amount: number; // in ₹
  date: string;
  category: ExpenseCategory;
  status: ExpenseStatus;
  route: string;
  distanceKm: number;
  fuelLiters?: number;
  fuelPricePerLiter?: number;
  receiptImageUrl?: string;
  notes?: string;
  isAnomaly?: boolean;
  anomalyReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface TripSummary {
  totalCost: number;
  fuelCost: number;
  tollCost: number;
  foodCost: number;
  otherCost: number;
  totalDistance: number;
  mileageRate: number; // ₹ per km
}
