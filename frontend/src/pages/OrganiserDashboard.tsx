import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, DollarSign, Ticket } from 'lucide-react';

interface EventStats {
  id: number;
  title: string;
  eventDate: string;
  totalBookings: number;
  totalRevenue: number;
  venue: {
    name: string;
  };
}

export default function OrganiserDashboard() {
  const { token } = useAuth();
  const [events, setEvents] = useState<EventStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/events/organiser', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setEvents(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const overallRevenue = events.reduce((sum, e) => sum + (e.totalRevenue || 0), 0);
  const overallBookings = events.reduce((sum, e) => sum + (e.totalBookings || 0), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Organiser Dashboard</h1>
        <button className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg transition-colors">
          Create New Event
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
          <div className="p-3 bg-primary/20 text-primary rounded-lg">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-muted">Total Events</p>
            <p className="text-2xl font-bold text-text-primary">{events.length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
          <div className="p-3 bg-secondary/20 text-secondary rounded-lg">
            <Ticket size={24} />
          </div>
          <div>
            <p className="text-sm text-muted">Total Tickets Sold</p>
            <p className="text-2xl font-bold text-text-primary">{overallBookings}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
          <div className="p-3 bg-success/20 text-success rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-muted">Total Revenue</p>
            <p className="text-2xl font-bold text-text-primary">₹{overallRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">Your Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted">
            <thead className="bg-background text-xs uppercase text-muted">
              <tr>
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">Venue</th>
                <th className="px-6 py-4">Tickets Sold</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <p className="text-lg text-text-primary mb-2">No events created yet.</p>
                    <p>Click "Create New Event" to get started.</p>
                  </td>
                </tr>
              ) : (
                events.map(event => {
                  const eventDate = new Date(event.eventDate);
                  const isPast = eventDate < new Date();
                  return (
                    <tr key={event.id} className="border-b border-border hover:bg-background/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-text-primary text-base">{event.title}</p>
                        <p className="text-xs">{eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString()}</p>
                      </td>
                      <td className="px-6 py-4 text-text-primary">
                        {event.venue?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {event.totalBookings || 0}
                      </td>
                      <td className="px-6 py-4 font-bold text-success">
                        ₹{(event.totalRevenue || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          isPast ? 'bg-border text-muted' : 'bg-primary/20 text-primary'
                        }`}>
                          {isPast ? 'COMPLETED' : 'UPCOMING'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
