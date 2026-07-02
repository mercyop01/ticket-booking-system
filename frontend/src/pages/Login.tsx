import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';
      const payload = isLogin 
        ? { email, password } 
        : { name, email, password, role };

      const res = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Authentication failed');
      }

      const data = await res.json();
      
      // Decode JWT to get role
      const decoded: any = jwtDecode(data.token);
      // The role is typically in the authorities list or custom claim.
      // Spring Security usually stores it under `role` or in the sub/authorities.
      // If it's not present, we can fallback to the registered role or check authorities.
      const userRole = decoded.role || (decoded.authorities && decoded.authorities.length > 0 ? decoded.authorities[0].authority : role);

      // Clean 'ROLE_' prefix if present
      const cleanRole = userRole.replace('ROLE_', '').toUpperCase();

      login(data.token, cleanRole);

      // Redirect based on role
      if (cleanRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (cleanRole === 'ORGANISER') {
        navigate('/organiser/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[70vh]">
      <div className="bg-card border border-border rounded-xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">
          {isLogin ? 'Sign In to TixNow' : 'Create an Account'}
        </h1>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive text-sm p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Account Type</label>
              <select 
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="CUSTOMER">Customer</option>
                <option value="ORGANISER">Event Organiser</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors mt-6"
          >
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
