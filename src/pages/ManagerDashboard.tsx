import { useState, useMemo } from 'react';
import { mockExpenses } from '@/data/mockExpenses';
import { applyAnomalyDetection } from '@/lib/anomalyDetection';
import { ExpenseEntry } from '@/types/expense';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle, Check, X, Download, Fuel, Landmark,
  UtensilsCrossed, Wrench, Package, BarChart3, Users,
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  fuel: <Fuel className="w-4 h-4" />,
  toll: <Landmark className="w-4 h-4" />,
  food: <UtensilsCrossed className="w-4 h-4" />,
  maintenance: <Wrench className="w-4 h-4" />,
  other: <Package className="w-4 h-4" />,
};

const ManagerDashboard = () => {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(() =>
    applyAnomalyDetection(mockExpenses)
  );
  const [filter, setFilter] = useState<'all' | 'pending' | 'anomaly'>('pending');

  const filtered = expenses.filter((e) => {
    if (filter === 'pending') return e.status === 'pending';
    if (filter === 'anomaly') return e.isAnomaly;
    return true;
  });

  const pendingCount = expenses.filter((e) => e.status === 'pending').length;
  const anomalyCount = expenses.filter((e) => e.isAnomaly).length;
  const totalApproved = expenses
    .filter((e) => e.status === 'approved')
    .reduce((s, e) => s + e.amount, 0);

  const handleApprove = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'approved' as const, reviewedAt: new Date().toISOString() } : e
      )
    );
  };

  const handleReject = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'rejected' as const, reviewedAt: new Date().toISOString() } : e
      )
    );
  };

  const exportCSV = () => {
    const approved = expenses.filter((e) => e.status === 'approved');
    const headers = ['ID', 'Driver', 'Vendor', 'Amount', 'Category', 'Date', 'Route', 'Distance(km)'];
    const rows = approved.map((e) => [
      e.id, e.driverName, e.vendorName, e.amount, e.category, e.date, e.route, e.distanceKm,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `approved-expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Fleet Expense Manager</h1>
              <p className="text-xs text-muted-foreground">Finance & Approvals</p>
            </div>
          </div>
          <Button onClick={exportCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 flex items-center gap-4">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending Review</p>
              <p className="font-mono text-2xl font-bold">{pendingCount}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-anomaly" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Anomalies</p>
              <p className="font-mono text-2xl font-bold text-anomaly">{anomalyCount}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <Check className="w-8 h-8 text-success" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Approved</p>
              <p className="font-mono text-2xl font-bold text-success">₹{totalApproved.toLocaleString('en-IN')}</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {(['pending', 'anomaly', 'all'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f === 'anomaly' ? '⚠ Anomalies' : f}
            </Button>
          ))}
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">ID</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Driver</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Vendor</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Category</th>
                  <th className="text-right p-3 text-xs uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Route</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="text-left p-3 text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-center p-3 text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((exp) => (
                  <tr
                    key={exp.id}
                    className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${
                      exp.isAnomaly ? 'anomaly-row' : ''
                    }`}
                  >
                    <td className="p-3 font-mono text-xs">{exp.id}</td>
                    <td className="p-3 font-semibold">{exp.driverName}</td>
                    <td className="p-3">{exp.vendorName}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {categoryIcons[exp.category]}
                        <span className="capitalize">{exp.category}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono font-bold">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-xs">{exp.route}</td>
                    <td className="p-3 font-mono text-xs">{exp.date}</td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          exp.status === 'pending'
                            ? 'status-pending'
                            : exp.status === 'approved'
                            ? 'status-approved'
                            : 'status-rejected'
                        }`}
                      >
                        {exp.status.toUpperCase()}
                      </Badge>
                      {exp.isAnomaly && (
                        <div className="flex items-center gap-1 mt-1 text-anomaly text-[10px]">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{exp.anomalyReason}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      {exp.status === 'pending' && (
                        <div className="flex items-center gap-1 justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-success hover:text-success hover:bg-success/20"
                            onClick={() => handleApprove(exp.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-anomaly hover:text-anomaly hover:bg-anomaly/20"
                            onClick={() => handleReject(exp.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
