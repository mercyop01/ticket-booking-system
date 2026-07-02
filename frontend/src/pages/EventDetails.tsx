import { Link, useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, Info } from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams();
  
  return (
    <div>
      {/* Banner */}
      <div className="h-[40vh] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1540039155732-d688849b2575?q=80&w=2000&auto=format&fit=crop" 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20 -mt-32">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Main Info */}
          <div className="flex-1">
            <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-medium tracking-wide mb-4 inline-block">
              CONCERT
            </span>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">The Weeknd - After Hours</h1>
            
            <div className="flex flex-wrap gap-6 text-textMuted mb-8">
              <div className="flex items-center gap-2"><MapPin size={18} /> Wembley Stadium, London</div>
              <div className="flex items-center gap-2"><Calendar size={18} /> Dec 05, 2023</div>
              <div className="flex items-center gap-2"><Clock size={18} /> 20:00 (Duration: 2h 30m)</div>
            </div>
            
            <div className="prose prose-invert max-w-none mb-12">
              <h3 className="text-xl font-bold mb-4">About this event</h3>
              <p className="text-textMuted leading-relaxed">
                Experience the multi-platinum selling artist on his biggest global stadium tour to date. 
                Expect state-of-the-art production, an incredible setlist spanning his entire career, and a visual spectacle that redefines live entertainment.
              </p>
            </div>
          </div>
          
          {/* Booking Card */}
          <div className="w-full md:w-[350px] shrink-0 card p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-6">Book Tickets</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-3 rounded-lg border border-border bg-surface-elevated">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-secondary"></div>
                  <span className="font-medium">Premium</span>
                </div>
                <span className="font-bold">$150</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border border-border bg-surface-elevated">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  <span className="font-medium">Gold</span>
                </div>
                <span className="font-bold">$100</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg border border-border bg-surface-elevated">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span className="font-medium">Standard</span>
                </div>
                <span className="font-bold">$75</span>
              </div>
            </div>
            
            <Link to={`/event/${id}/seats`} className="btn-primary w-full block text-center py-4 text-lg">
              Select Seats on Map
            </Link>
            
            <div className="mt-4 flex items-start gap-2 text-sm text-textMuted">
              <Info size={16} className="shrink-0 mt-0.5" />
              <p>Seats are reserved for 10 minutes once selected.</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
