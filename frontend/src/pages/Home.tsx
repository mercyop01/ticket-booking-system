import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_EVENTS = [
  { id: 1, title: "Oppenheimer (IMAX 70mm)", type: "MOVIE", date: "2023-11-20T19:00:00", venue: "BFI IMAX", city: "London", price: 20, image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, title: "The Weeknd - After Hours", type: "CONCERT", date: "2023-12-05T20:00:00", venue: "Wembley Stadium", city: "London", price: 75, image: "https://images.unsplash.com/photo-1540039155732-d688849b2575?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, title: "Dune: Part Two", type: "MOVIE", date: "2024-03-01T18:30:00", venue: "TCL Chinese Theatre", city: "Los Angeles", price: 18, image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop" }
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background z-0" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6"
          >
            Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Extraordinary</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-textMuted max-w-2xl mx-auto mb-10"
          >
            Book premium seats for the most exclusive movies and concerts in your city.
          </motion.p>
          
          {/* Search/Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface/50 backdrop-blur-md border border-border p-2 rounded-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto"
          >
            <input type="text" placeholder="Search events..." className="input-field bg-transparent border-none focus:ring-0 flex-1" />
            <select className="input-field bg-surface-elevated border-none w-full md:w-auto">
              <option>All Cities</option>
              <option>London</option>
              <option>Los Angeles</option>
            </select>
            <button className="btn-primary py-3 px-8 rounded-xl whitespace-nowrap">Find Tickets</button>
          </motion.div>
        </div>
      </section>

      {/* Events Listing */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-display font-bold">Trending Now</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_EVENTS.map((event, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={event.id} 
              className="card group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 bg-surface/80 backdrop-blur-sm border border-border rounded-full text-xs font-medium tracking-wide">
                    {event.type}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                <div className="flex items-center gap-4 text-sm text-textMuted mb-4">
                  <div className="flex items-center gap-1"><MapPin size={14} /> {event.venue}, {event.city}</div>
                  <div className="flex items-center gap-1"><Calendar size={14} /> {new Date(event.date).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <div>
                    <span className="text-xs text-textMuted block">Starting from</span>
                    <span className="text-lg font-bold text-white">${event.price}</span>
                  </div>
                  <Link to={`/event/${event.id}`} className="btn-primary px-6">Book</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
