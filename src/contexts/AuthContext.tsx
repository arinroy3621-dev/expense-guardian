import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type UserRole = 'driver' | 'manager';

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  vehicle?: string;
}

interface AuthContextType {
  user: AppUser | null;
  login: (userId: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('kharchabook_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (userId: string, password: string): Promise<string | null> => {
    const upperId = userId.toUpperCase();

    if (upperId.startsWith('D')) {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', upperId)
        .maybeSingle();

      if (error || !data) return 'Invalid User ID';
      if (data.password_hash !== password) return 'Incorrect password';

      const appUser: AppUser = {
        id: data.id,
        name: data.name,
        role: 'driver',
        vehicle: data.vehicle,
      };
      setUser(appUser);
      localStorage.setItem('kharchabook_user', JSON.stringify(appUser));
      return null;
    } else if (upperId.startsWith('M')) {
      const { data, error } = await supabase
        .from('managers')
        .select('*')
        .eq('id', upperId)
        .maybeSingle();

      if (error || !data) return 'Invalid User ID';
      if (data.password_hash !== password) return 'Incorrect password';

      const appUser: AppUser = {
        id: data.id,
        name: data.name,
        role: 'manager',
      };
      setUser(appUser);
      localStorage.setItem('kharchabook_user', JSON.stringify(appUser));
      return null;
    }

    return 'Invalid User ID';
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kharchabook_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
