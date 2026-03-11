import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LogIn, CircleAlert as AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const err = await login(userId, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      const upperUser = userId.toUpperCase();
      navigate(upperUser.startsWith('M') ? '/manager' : '/driver');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto p-3 rounded-2xl bg-primary/20 w-fit">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">KharchaBook</CardTitle>
          <CardDescription>Login with your User ID and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                placeholder="e.g. D01, M01"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-secondary/50 text-xs space-y-2">
            <p className="font-semibold text-muted-foreground uppercase tracking-wider">Sample Credentials</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
              <span className="font-mono">D01 / driver123</span>
              <span>Rajesh Kumar</span>
              <span className="font-mono">D02 / driver456</span>
              <span>Amit Sharma</span>
              <span className="font-mono">D03 / driver789</span>
              <span>Sunil Yadav</span>
              <span className="font-mono text-primary">M01 / manager123</span>
              <span className="text-primary">Priya Patel (Manager)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 text-xs text-muted-foreground">
        Developed by Code_Error!
      </div>
    </div>
  );
};

export default LoginPage;
