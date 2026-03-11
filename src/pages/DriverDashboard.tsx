import { useState } from 'react';
import { Truck, IndianRupee, Route } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ReceiptUpload from '@/components/driver/ReceiptUpload';
import VoiceTripLog from '@/components/driver/VoiceTripLog';
import ExpenseList from '@/components/driver/ExpenseList';
import { mockExpenses } from '@/data/mockExpenses';
import { ExpenseEntry } from '@/types/expense';
import { useAuth } from '@/contexts/AuthContext';

const DriverDashboard = () => {
  const { user } = useAuth();
  const driverId = user?.id || 'D01';
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(
    mockExpenses.filter((e) => e.driverId === driverId)
  );

  const pending = expenses.filter((e) => e.status === 'pending');
  const settled = expenses.filter((e) => e.status !== 'pending');
  const totalPending = pending.reduce((s, e) => s + e.amount, 0);
  const totalReimbursed = settled
    .filter((e) => e.status === 'approved')
    .reduce((s, e) => s + e.amount, 0);

  const handleTripLogged = (data: any) => {
    const newEntry: ExpenseEntry = {
      id: `EXP-${String(expenses.length + 21).padStart(3, '0')}`,
      driverId,
      driverName: 'Rajesh Kumar',
      vendorName: data.vendorName || `${data.category} expense`,
      amount: data.amount || Math.round(data.fuelLiters * data.fuelPricePerLiter) || 0,
      date: new Date().toISOString().split('T')[0],
      category: data.category,
      status: 'pending',
      route: `${data.from} → ${data.to}`,
      distanceKm: data.distanceKm,
      fuelLiters: data.fuelLiters || undefined,
      fuelPricePerLiter: data.fuelPricePerLiter || undefined,
      notes: data.notes,
      submittedAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newEntry, ...prev]);
  };

  return (
    <div className="min-h-screen pb-6">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20">
            <Truck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Rajesh Kumar</h1>
            <p className="text-xs text-muted-foreground">Driver · Vehicle MH-12-AB-1234</p>
          </div>
        </div>
      </div>

      {/* Stats */}
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

      {/* Receipt Upload */}
      <div className="px-4 mb-4">
        <ReceiptUpload onReceiptProcessed={(data) => console.log('OCR:', data)} />
      </div>

      {/* Voice Trip Log */}
      <div className="px-4 mb-4">
        <VoiceTripLog onTripLogged={handleTripLogged} />
      </div>

      {/* Expense Lists */}
      <div className="px-4 space-y-6">
        <ExpenseList expenses={pending} title="Pending Approval" />
        <ExpenseList expenses={settled} title="Settled" />
      </div>
    </div>
  );
};

export default DriverDashboard;
