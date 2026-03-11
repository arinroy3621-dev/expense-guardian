import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppHeader from "@/components/AppHeader";
import DriverDashboard from "./pages/DriverDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ role, children }: { role: 'driver' | 'manager'; children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === 'manager' ? '/manager' : '/driver'} replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      {user && <AppHeader />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to={user.role === 'manager' ? '/manager' : '/driver'} replace /> : <LoginPage />} />
        <Route path="/" element={<Navigate to={user ? (user.role === 'manager' ? '/manager' : '/driver') : '/login'} replace />} />
        <Route path="/driver" element={<ProtectedRoute role="driver"><DriverDashboard /></ProtectedRoute>} />
        <Route path="/manager" element={<ProtectedRoute role="manager"><ManagerDashboard /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
