import { ExpenseEntry } from '@/types/expense';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fuel, Landmark, UtensilsCrossed, Wrench, Package } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  fuel: <Fuel className="w-5 h-5" />,
  toll: <Landmark className="w-5 h-5" />,
  food: <UtensilsCrossed className="w-5 h-5" />,
  maintenance: <Wrench className="w-5 h-5" />,
  other: <Package className="w-5 h-5" />,
};

interface ExpenseListProps {
  expenses: ExpenseEntry[];
  title: string;
}

const ExpenseList = ({ expenses, title }: ExpenseListProps) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
        {title} ({expenses.length})
      </h3>
      <div className="space-y-2">
        {expenses.length === 0 && (
          <p className="text-muted-foreground text-sm py-4 text-center">No entries</p>
        )}
        {expenses.map((exp) => (
          <Card
            key={exp.id}
            className={`p-4 flex items-center gap-3 ${exp.isAnomaly ? 'anomaly-row' : ''}`}
          >
            <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
              {categoryIcons[exp.category] || categoryIcons.other}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{exp.vendorName}</p>
              <p className="text-xs text-muted-foreground">
                {exp.route} · {exp.date}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-sm">
                ₹{exp.amount.toLocaleString('en-IN')}
              </p>
              <Badge
                variant="outline"
                className={`text-[10px] mt-1 ${
                  exp.status === 'pending'
                    ? 'status-pending'
                    : exp.status === 'approved'
                    ? 'status-approved'
                    : 'status-rejected'
                }`}
              >
                {exp.status.toUpperCase()}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
