import { Link, useLocation } from 'react-router-dom';
import { Truck, BarChart3, ArrowLeftRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const AppHeader = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isDriver = location.pathname === '/' || location.pathname === '/driver';
  const isManager = location.pathname === '/manager';

  return (
    <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {user && (
          <>
            <span className="font-semibold text-foreground">{user.name}</span>
            <span>·</span>
            <span className="capitalize">{user.role}</span>
          </>
        )}
      </div>
      <div className="flex gap-1 items-center">
        {user?.role === 'driver' && (
          <Button asChild size="sm" variant="default" className="h-7 text-xs gap-1.5">
            <Link to="/driver"><Truck className="w-3 h-3" /> Dashboard</Link>
          </Button>
        )}
        {user?.role === 'manager' && (
          <Button asChild size="sm" variant="default" className="h-7 text-xs gap-1.5">
            <Link to="/manager"><BarChart3 className="w-3 h-3" /> Dashboard</Link>
          </Button>
        )}
        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5" onClick={logout}>
          <LogOut className="w-3 h-3" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
