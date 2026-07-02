import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Users, Plus } from 'lucide-react';

interface Venue {
  id: number;
  name: string;
  city: string;
  totalRows: number;
  totalCols: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState('');
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [venuesRes, usersRes] = await Promise.all([
        fetch('http://localhost:8080/api/v1/venues', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8080/api/v1/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (venuesRes.ok) setVenues(await venuesRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:8080/api/v1/venues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: venueName, city, totalRows: rows, totalCols: cols })
      });

      if (!res.ok) throw new Error('Failed to create venue');
      
      const newVenue = await res.json();
      setVenues([...venues, newVenue]);
      setSuccess('Venue created successfully!');
      setVenueName('');
      setCity('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Create Venue Form */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <Plus size={20} className="text-primary" />
              Create New Venue
            </h2>

            {error && <div className="text-destructive text-sm mb-4">{error}</div>}
            {success && <div className="text-success text-sm mb-4">{success}</div>}

            <form onSubmit={handleCreateVenue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Venue Name</label>
                <input 
                  type="text" required
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                  value={venueName} onChange={(e) => setVenueName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">City</label>
                <input 
                  type="text" required
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                  value={city} onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Rows</label>
                  <input 
                    type="number" min="1" required
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    value={rows} onChange={(e) => setRows(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Columns</label>
                  <input 
                    type="number" min="1" required
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                    value={cols} onChange={(e) => setCols(parseInt(e.target.value))}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors mt-4">
                Create Venue
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Data Tables */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Venues Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center gap-2">
              <MapPin className="text-primary" />
              <h2 className="text-xl font-bold text-text-primary">Manage Venues</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted">
                <thead className="bg-background text-xs uppercase text-muted">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">City</th>
                    <th className="px-6 py-4">Layout</th>
                  </tr>
                </thead>
                <tbody>
                  {venues.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-4 text-center">No venues found.</td></tr>
                  ) : (
                    venues.map(v => (
                      <tr key={v.id} className="border-b border-border hover:bg-background/50">
                        <td className="px-6 py-4 font-medium text-text-primary">#{v.id}</td>
                        <td className="px-6 py-4 text-text-primary">{v.name}</td>
                        <td className="px-6 py-4">{v.city}</td>
                        <td className="px-6 py-4">{v.totalRows}x{v.totalCols} ({v.totalRows * v.totalCols} seats)</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center gap-2">
              <Users className="text-primary" />
              <h2 className="text-xl font-bold text-text-primary">Manage Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted">
                <thead className="bg-background text-xs uppercase text-muted">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-4 text-center">No users found.</td></tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.id} className="border-b border-border hover:bg-background/50">
                        <td className="px-6 py-4 font-medium text-text-primary">#{u.id}</td>
                        <td className="px-6 py-4 text-text-primary">{u.name}</td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            u.role === 'ADMIN' ? 'bg-primary/20 text-primary' : 
                            u.role === 'ORGANISER' ? 'bg-secondary/20 text-secondary' : 
                            'bg-border text-text-primary'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
