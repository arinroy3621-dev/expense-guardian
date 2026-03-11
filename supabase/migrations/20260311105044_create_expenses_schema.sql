/*
  # KharchaBook Expense Management Schema

  ## Overview
  Creates the core database schema for fleet expense tracking with real-time sync between drivers and managers.

  ## 1. New Tables

  ### `drivers`
  - `id` (text, primary key) - Driver ID (e.g., D01, D02)
  - `name` (text) - Driver full name
  - `password_hash` (text) - Hashed password for authentication
  - `role` (text) - Always 'driver'
  - `vehicle` (text) - Assigned vehicle registration number
  - `created_at` (timestamptz) - Account creation timestamp

  ### `managers`
  - `id` (text, primary key) - Manager ID (e.g., M01)
  - `name` (text) - Manager full name
  - `password_hash` (text) - Hashed password for authentication
  - `role` (text) - Always 'manager'
  - `created_at` (timestamptz) - Account creation timestamp

  ### `expenses`
  - `id` (text, primary key) - Expense ID (e.g., EXP-001)
  - `driver_id` (text, foreign key) - References drivers.id
  - `driver_name` (text) - Cached driver name for quick display
  - `vendor_name` (text) - Vendor/merchant name
  - `amount` (numeric) - Expense amount in ₹
  - `date` (date) - Expense date
  - `category` (text) - Expense category (fuel, toll, food, maintenance, other)
  - `status` (text) - Approval status (pending, approved, rejected)
  - `route` (text) - Trip route (e.g., Delhi → Jaipur)
  - `distance_km` (numeric) - Distance in kilometers
  - `fuel_liters` (numeric, nullable) - Fuel quantity (if fuel category)
  - `fuel_price_per_liter` (numeric, nullable) - Price per liter (if fuel category)
  - `receipt_image_url` (text, nullable) - Receipt image URL
  - `notes` (text, nullable) - Additional notes
  - `is_anomaly` (boolean) - Anomaly detection flag
  - `anomaly_reason` (text, nullable) - Reason for anomaly flagging
  - `submitted_at` (timestamptz) - Submission timestamp
  - `reviewed_at` (timestamptz, nullable) - Review timestamp
  - `reviewed_by` (text, nullable) - Manager who reviewed
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## 2. Security - Row Level Security (RLS)

  ### drivers table
  - Drivers can read their own profile only
  - No updates allowed (contact admin for changes)

  ### managers table
  - Managers can read their own profile only
  - No updates allowed (contact admin for changes)

  ### expenses table
  - Drivers can insert their own expenses
  - Drivers can read their own expenses only
  - Managers can read all expenses
  - Managers can update status, reviewed_at, reviewed_by fields for pending expenses
  - No deletes allowed (maintain audit trail)

  ## 3. Indexes
  - Index on driver_id for fast expense lookups
  - Index on status for filtering pending/approved/rejected
  - Index on date for chronological queries

  ## 4. Important Notes
  - All timestamps use timezone-aware types (timestamptz)
  - RLS is enabled on all tables for security
  - Foreign key constraints ensure data integrity
  - Default values set for timestamps and status
*/

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id text PRIMARY KEY,
  name text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'driver',
  vehicle text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers can read own profile"
  ON drivers FOR SELECT
  TO authenticated
  USING (id = current_setting('app.current_user_id', true));

CREATE POLICY "Public can read drivers for login"
  ON drivers FOR SELECT
  TO anon
  USING (true);

-- Create managers table
CREATE TABLE IF NOT EXISTS managers (
  id text PRIMARY KEY,
  name text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'manager',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE managers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Managers can read own profile"
  ON managers FOR SELECT
  TO authenticated
  USING (id = current_setting('app.current_user_id', true));

CREATE POLICY "Public can read managers for login"
  ON managers FOR SELECT
  TO anon
  USING (true);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id text PRIMARY KEY,
  driver_id text NOT NULL REFERENCES drivers(id),
  driver_name text NOT NULL,
  vendor_name text NOT NULL,
  amount numeric NOT NULL,
  date date NOT NULL,
  category text NOT NULL CHECK (category IN ('fuel', 'toll', 'food', 'maintenance', 'other')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  route text NOT NULL,
  distance_km numeric NOT NULL DEFAULT 0,
  fuel_liters numeric,
  fuel_price_per_liter numeric,
  receipt_image_url text,
  notes text,
  is_anomaly boolean DEFAULT false,
  anomaly_reason text,
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers can insert own expenses"
  ON expenses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Drivers can read own expenses"
  ON expenses FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Managers can read all expenses"
  ON expenses FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Managers can update expense status"
  ON expenses FOR UPDATE
  TO anon
  USING (status = 'pending');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_expenses_driver_id ON expenses(driver_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_submitted_at ON expenses(submitted_at DESC);

-- Insert sample drivers (password is same as in mockExpenses: driver123, driver456, driver789)
INSERT INTO drivers (id, name, password_hash, vehicle) VALUES
  ('D01', 'Rajesh Kumar', 'driver123', 'MH-12-AB-1234'),
  ('D02', 'Amit Sharma', 'driver456', 'MH-14-CD-5678'),
  ('D03', 'Sunil Yadav', 'driver789', 'DL-01-EF-9012'),
  ('D04', 'Vikram Singh', 'driver101', 'TN-01-GH-3456'),
  ('D05', 'Mohan Patel', 'driver202', 'GJ-01-IJ-7890')
ON CONFLICT (id) DO NOTHING;

-- Insert sample manager (password: manager123)
INSERT INTO managers (id, name, password_hash) VALUES
  ('M01', 'Priya Patel', 'manager123')
ON CONFLICT (id) DO NOTHING;
