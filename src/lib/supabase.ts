import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbExpense {
  id: string;
  driver_id: string;
  driver_name: string;
  vendor_name: string;
  amount: number;
  date: string;
  category: 'fuel' | 'toll' | 'food' | 'maintenance' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  route: string;
  distance_km: number;
  fuel_liters?: number;
  fuel_price_per_liter?: number;
  receipt_image_url?: string;
  notes?: string;
  is_anomaly: boolean;
  anomaly_reason?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DbDriver {
  id: string;
  name: string;
  password_hash: string;
  role: string;
  vehicle?: string;
  created_at: string;
}

export interface DbManager {
  id: string;
  name: string;
  password_hash: string;
  role: string;
  created_at: string;
}
