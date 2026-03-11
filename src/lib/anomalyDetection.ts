import { ExpenseEntry } from '@/types/expense';
import { DAILY_AVG_FUEL_PRICE } from '@/data/mockExpenses';

export interface AnomalyResult {
  isAnomaly: boolean;
  reasons: string[];
}

// Average fuel consumption for a heavy truck: ~3.5 km/liter
const AVG_KM_PER_LITER = 3.5;
// Allow 40% buffer for terrain/load
const FUEL_CAPACITY_BUFFER = 1.4;
// Fuel price tolerance: 5% above daily average
const FUEL_PRICE_TOLERANCE = 0.05;
// Food expense max for a single claim
const FOOD_MAX = 1500;

/**
 * Automatically detect anomalies in an expense entry
 */
export function detectAnomalies(
  entry: ExpenseEntry,
  allExpenses: ExpenseEntry[]
): AnomalyResult {
  const reasons: string[] = [];

  // 1. Fuel price >5% above daily average
  if (
    entry.category === 'fuel' &&
    entry.fuelPricePerLiter &&
    entry.fuelPricePerLiter > DAILY_AVG_FUEL_PRICE * (1 + FUEL_PRICE_TOLERANCE)
  ) {
    const pct = (
      ((entry.fuelPricePerLiter - DAILY_AVG_FUEL_PRICE) / DAILY_AVG_FUEL_PRICE) *
      100
    ).toFixed(1);
    reasons.push(
      `Fuel price ₹${entry.fuelPricePerLiter}/L is ${pct}% above daily avg ₹${DAILY_AVG_FUEL_PRICE}/L`
    );
  }

  // 2. Fuel amount exceeds logical capacity for route
  if (
    entry.category === 'fuel' &&
    entry.fuelLiters &&
    entry.distanceKm > 0
  ) {
    const expectedLiters = Math.ceil(
      (entry.distanceKm / AVG_KM_PER_LITER) * FUEL_CAPACITY_BUFFER
    );
    if (entry.fuelLiters > expectedLiters) {
      reasons.push(
        `Fuel ${entry.fuelLiters}L exceeds expected ~${expectedLiters}L for ${entry.distanceKm}km route`
      );
    }
  }

  // 3. Duplicate receipt: same vendor, amount, and route within 7 days
  const duplicates = allExpenses.filter(
    (other) =>
      other.id !== entry.id &&
      other.vendorName === entry.vendorName &&
      other.amount === entry.amount &&
      other.route === entry.route &&
      Math.abs(
        new Date(other.date).getTime() - new Date(entry.date).getTime()
      ) <
        7 * 24 * 60 * 60 * 1000
  );
  if (duplicates.length > 0) {
    reasons.push(
      `Duplicate receipt detected — matches ${duplicates.map((d) => d.id).join(', ')}`
    );
  }

  // 4. Food expense unusually high
  if (entry.category === 'food' && entry.amount > FOOD_MAX) {
    reasons.push(
      `Food bill ₹${entry.amount.toLocaleString('en-IN')} exceeds typical max ₹${FOOD_MAX.toLocaleString('en-IN')}`
    );
  }

  return {
    isAnomaly: reasons.length > 0,
    reasons,
  };
}

/**
 * Run anomaly detection on all expenses and return updated entries
 */
export function applyAnomalyDetection(
  expenses: ExpenseEntry[]
): ExpenseEntry[] {
  return expenses.map((entry) => {
    const result = detectAnomalies(entry, expenses);
    return {
      ...entry,
      isAnomaly: result.isAnomaly,
      anomalyReason: result.reasons.join(' | '),
    };
  });
}
