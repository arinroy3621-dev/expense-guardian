import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'driver' | 'manager';

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  vehicle?: string;
}

interface AuthContextType {
  user: AppUser | null;
  login: (userId: string, password: string) => string | null; // returns error or null
  logout: () => void;
}

const SAMPLE_USERS: Record<string, { password: string; user: AppUser }> = {
  D01: {
    password: 'driver123',
    user: { id: 'D01', name: 'Rajesh Kumar', role: 'driver', vehicle: 'MH-12-AB-1234' },
  },
  D02: {
    password: 'driver456',
    user: { id: 'D02', name: 'Amit Sharma', role: 'driver', vehicle: 'MH-14-CD-5678' },
  },
  D03: {
    password: 'driver789',
    user: { id: 'D03', name: 'Sunil Yadav', role: 'driver', vehicle: 'DL-01-EF-9012' },
  },
  M01: {
    password: 'manager123',
    user: { id: 'M01', name: 'Priya Patel', role: 'manager' },
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  const login = (userId: string, password: string): string | null => {
    const entry = SAMPLE_USERS[userId.toUpperCase()];
    if (!entry) return 'Invalid User ID';
    if (entry.password !== password) return 'Incorrect password';
    setUser(entry.user);
    return null;
  };

  const logout = () => setUser(null);

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
