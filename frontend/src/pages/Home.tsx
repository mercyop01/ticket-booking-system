import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  bannerImage: string;
  eventDate: string;
  venue: {
    name: string;
    city: string;
  };
  categories: {
    categoryName: string;
    basePrice: number;
  }[];
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const dummyEvents: Event[] = [
    {
      id: 1,
      title: "Kalki 2898 AD",
      description: "Epic sci-fi mythology.",
      bannerImage: "https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg?auto=compress&cs=tinysrgb&w=800",
      eventDate: "2024-11-15T20:00:00",
      venue: { name: "Prasads IMAX", city: "Hyderabad" },
      categories: [{ categoryName: "Premium", basePrice: 500.00 }]
    },
    {
      id: 2,
      title: "Stree 2",
      description: "Horror comedy blockbuster.",
      bannerImage: "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=800",
      eventDate: "2024-12-01T18:30:00",
      venue: { name: "PVR Cinemas", city: "Delhi" },
      categories: [{ categoryName: "Premium", basePrice: 450.00 }]
    },
    {
      id: 3,
      title: "Pushpa 2: The Rule",
      description: "The most awaited sequel.",
      bannerImage: "https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=800",
      eventDate: "2024-10-25T21:00:00",
      venue: { name: "INOX Multiplex", city: "Mumbai" },
      categories: [{ categoryName: "Premium", basePrice: 480.00 }]
    },
    {
      id: 4,
      title: "Singham Returns",
      description: "Action packed cop drama.",
      bannerImage: "https://images.pexels.com/photos/1604991/pexels-photo-1604991.jpeg?auto=compress&cs=tinysrgb&w=800",
      eventDate: "2024-11-20T19:00:00",
      venue: { name: "Cinepolis", city: "Bangalore" },
      categories: [{ categoryName: "Premium", basePrice: 420.00 }]
    },
    {
      id: 5,
      title: "Arijit Singh Live Concert",
      description: "Soulful live music.",
      bannerImage: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800",
      eventDate: "2024-12-10T20:00:00",
      venue: { name: "Jawaharlal Nehru Stadium", city: "Delhi" },
      categories: [{ categoryName: "Premium", basePrice: 5000.00 }]
    },
    {
      id: 6,
      title: "Diljit Dosanjh World Tour",
      description: "The biggest Punjabi party.",
      bannerImage: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800",
      eventDate: "2024-12-25T19:30:00",
      venue: { name: "DY Patil Stadium", city: "Mumbai" },
      categories: [{ categoryName: "Premium", basePrice: 4500.00 }]
    }
  ];

  useEffect(() => {
    setEvents(dummyEvents);
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="group flex flex-col rounded-xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-lg">
              
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={event.bannerImage} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${event.id}/800/450`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                {event.categories && event.categories.length > 0 && (
                  <div className="absolute top-4 right-4 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                    From ₹{event.categories[0].basePrice.toFixed(2)}
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-xl font-bold mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                  {event.title}
                </h2>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm opacity-70">
                    <MapPin size={16} />
                    <span>{event.venue.name}, {event.venue.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm opacity-70">
                    <Calendar size={16} />
                    <span>{new Date(event.eventDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-border">
                  <Link 
                    to={`/event/${event.id}`}
                    className="flex justify-center w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
