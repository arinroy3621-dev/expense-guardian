import { useState, useEffect } from 'react';
import { Truck, IndianRupee, Route } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ReceiptUpload from '@/components/driver/ReceiptUpload';
import VoiceTripLog from '@/components/driver/VoiceTripLog';
import ExpenseList from '@/components/driver/ExpenseList';
import { ExpenseEntry } from '@/types/expense';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, DbExpense } from '@/lib/supabase';
import { detectAnomalies } from '@/lib/anomalyDetection';
import { toast } from '@/hooks/use-toast';
import { generateExpenseId } from '@/lib/generateId';

const DriverDashboard = () => {
  const { user } = useAuth();
  const driverId = user?.id || 'D01';
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpenses();
    const channel = supabase
      .channel('driver-expenses')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `driver_id=eq.${driverId}`,
        },
        () => {
          loadExpenses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId]);

  const loadExpenses = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('driver_id', driverId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error loading expenses:', error);
      setLoading(false);
      return;
    }

    const mapped: ExpenseEntry[] = (data || []).map(dbToExpense);
    setExpenses(mapped);
    setLoading(false);
  };

  const pending = expenses.filter((e) => e.status === 'pending');
  const settled = expenses.filter((e) => e.status !== 'pending');
  const totalPending = pending.reduce((s, e) => s + e.amount, 0);
  const totalReimbursed = settled
    .filter((e) => e.status === 'approved')
    .reduce((s, e) => s + e.amount, 0);

  const handleTripLogged = async (data: any) => {
    const expenseId = await generateExpenseId();
    const newExpense = {
      id: expenseId,
      driver_id: driverId,
      driver_name: user?.name || 'Driver',
      vendor_name: data.vendorName || `${data.category} expense`,
      amount: data.amount || Math.round((data.fuelLiters || 0) * (data.fuelPricePerLiter || 0)) || 0,
      date: new Date().toISOString().split('T')[0],
      category: data.category,
      status: 'pending',
      route: `${data.from} → ${data.to}`,
      distance_km: data.distanceKm || 0,
      fuel_liters: data.fuelLiters || null,
      fuel_price_per_liter: data.fuelPricePerLiter || null,
      notes: data.notes || null,
      is_anomaly: false,
      anomaly_reason: null,
    };

    const anomalyCheck = detectAnomalies(
      {
        ...newExpense,
        id: 'temp',
        driverId: newExpense.driver_id,
        driverName: newExpense.driver_name,
        vendorName: newExpense.vendor_name,
        distanceKm: newExpense.distance_km,
        fuelLiters: newExpense.fuel_liters || undefined,
        fuelPricePerLiter: newExpense.fuel_price_per_liter || undefined,
        submittedAt: new Date().toISOString(),
      } as ExpenseEntry,
      expenses
    );

    if (anomalyCheck.isAnomaly) {
      newExpense.is_anomaly = true;
      newExpense.anomaly_reason = anomalyCheck.reasons.join(' | ');
    }

    const { error } = await supabase.from('expenses').insert([newExpense]);

    if (error) {
      console.error('Error submitting expense:', error);
      toast({ title: 'Error', description: 'Failed to submit expense', variant: 'destructive' });
    } else {
      toast({ title: 'Trip logged!', description: `${data.from} → ${data.to}` });
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20">
            <Truck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">{user?.name || 'Driver'}</h1>
            <p className="text-xs text-muted-foreground">Driver · Vehicle {user?.vehicle || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        <Card className="p-4 flex items-center gap-3">
          <IndianRupee className="w-5 h-5 text-primary" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Pending</p>
            <p className="font-mono font-bold text-lg">₹{totalPending.toLocaleString('en-IN')}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <Route className="w-5 h-5 text-success" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Reimbursed</p>
            <p className="font-mono font-bold text-lg text-success">₹{totalReimbursed.toLocaleString('en-IN')}</p>
          </div>
        </Card>
      </div>

      <div className="px-4 mb-4">
        <ReceiptUpload onReceiptProcessed={(data) => console.log('OCR:', data)} />
      </div>

      <div className="px-4 mb-4">
        <VoiceTripLog onTripLogged={handleTripLogged} />
      </div>

      <div className="px-4 space-y-6">
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Loading expenses...</p>
        ) : (
          <>
            <ExpenseList expenses={pending} title="Pending Approval" />
            <ExpenseList expenses={settled} title="Settled" />
          </>
        )}
      </div>

      <div className="mt-8 text-center text-xs text-muted-foreground">
        Developed by Code_Error!
      </div>
    </div>
  );
};

function dbToExpense(db: DbExpense): ExpenseEntry {
  return {
    id: db.id,
    driverId: db.driver_id,
    driverName: db.driver_name,
    vendorName: db.vendor_name,
    amount: Number(db.amount),
    date: db.date,
    category: db.category,
    status: db.status,
    route: db.route,
    distanceKm: Number(db.distance_km),
    fuelLiters: db.fuel_liters ? Number(db.fuel_liters) : undefined,
    fuelPricePerLiter: db.fuel_price_per_liter ? Number(db.fuel_price_per_liter) : undefined,
    receiptImageUrl: db.receipt_image_url || undefined,
    notes: db.notes || undefined,
    isAnomaly: db.is_anomaly,
    anomalyReason: db.anomaly_reason || undefined,
    submittedAt: db.submitted_at,
    reviewedAt: db.reviewed_at || undefined,
  };
}

export default DriverDashboard;
