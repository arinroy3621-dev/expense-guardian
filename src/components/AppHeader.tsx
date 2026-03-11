import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Truck, BarChart3, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AppHeader = () => {
  const location = useLocation();
  const isDriver = location.pathname === '/' || location.pathname === '/driver';
  const isManager = location.pathname === '/manager';

  return (
    <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <ArrowLeftRight className="w-3 h-3" />
        <span>Switch View</span>
      </div>
      <div className="flex gap-1">
        <Button
          asChild
          size="sm"
          variant={isDriver ? 'default' : 'ghost'}
          className="h-7 text-xs gap-1.5"
        >
          <Link to="/driver">
            <Truck className="w-3 h-3" /> Driver
          </Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant={isManager ? 'default' : 'ghost'}
          className="h-7 text-xs gap-1.5"
        >
          <Link to="/manager">
            <BarChart3 className="w-3 h-3" /> Manager
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
