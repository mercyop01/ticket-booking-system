import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Clock, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock types
type SeatStatus = 'AVAILABLE' | 'HELD' | 'BOOKED';
type SeatCategory = 'PREMIUM' | 'GOLD' | 'STANDARD';

interface Seat {
  id: number;
  rowLabel: String;
  colNumber: number;
  category: SeatCategory;
  status: SeatStatus;
  price: number;
}

export default function SeatMap() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Colors based on district theme and user specs
  const getCategoryColor = (category: SeatCategory) => {
    switch(category) {
      case 'PREMIUM': return '#FFB300';
      case 'GOLD': return '#9B59B6';
      case 'STANDARD': return '#5B8CFF';
      default: return '#5B8CFF';
    }
  };

  const getSeatStyle = (seat: Seat) => {
    const isSelected = selectedSeatIds.includes(seat.id);
    
    if (isSelected) {
      return { backgroundColor: '#FFFFFF', borderColor: '#FF3366', color: '#FF3366', borderWidth: '2px' };
    }
    
    if (seat.status === 'BOOKED') {
      return { backgroundColor: 'var(--border)', borderColor: 'var(--border)', opacity: 0.5, cursor: 'not-allowed' };
    }
    
    if (seat.status === 'HELD') {
      return { backgroundColor: 'var(--text-muted)', borderColor: 'var(--text-muted)', opacity: 0.7, cursor: 'not-allowed' };
    }
    
    // Available
    return { 
      backgroundColor: getCategoryColor(seat.category) + '30', // with opacity
      borderColor: getCategoryColor(seat.category),
      borderWidth: '1px'
    };
  };

  // Mock initial data fetch
  useEffect(() => {
    // Generate mock grid 10x10
    const mockSeats: Seat[] = [];
    let seatId = 1;
    for (let r = 0; r < 10; r++) {
      const rowLabel = String.fromCharCode(65 + r);
      for (let c = 1; c <= 10; c++) {
        let cat: SeatCategory = 'STANDARD';
        let price = 190;
        if (r < 2) { cat = 'PREMIUM'; price = 480; }
        else if (r < 5) { cat = 'GOLD'; price = 320; }
        
        mockSeats.push({
          id: seatId++,
          rowLabel,
          colNumber: c,
          category: cat,
          status: Math.random() > 0.8 ? 'BOOKED' : 'AVAILABLE',
          price
        });
      }
    }
    setSeats(mockSeats);
  }, []);

  // WebSocket connection setup
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(() => socket);
    
    stompClient.connect({}, () => {
      console.log('Connected to WebSocket');
      stompClient.subscribe(`/topic/event/${id}/seats`, (message) => {
        const update = JSON.parse(message.body);
        setSeats(prev => prev.map(s => s.id === update.seatId ? { ...s, status: update.status } : s));
      });
    }, (error: any) => {
      console.error('WebSocket Error:', error);
    });

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, [id]);

  // Timer logic for selected seats
  useEffect(() => {
    let timer: any;
    if (selectedSeatIds.length > 0 && timeLeft === null) {
      // Start 10 min timer
      setTimeLeft(10 * 60);
    } else if (selectedSeatIds.length === 0) {
      setTimeLeft(null);
    }
    
    if (timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev !== null ? prev - 1 : null);
      }, 1000);
    } else if (timeLeft === 0) {
      // Time expired
      setSelectedSeatIds([]);
      setTimeLeft(null);
      alert("Your hold time has expired.");
    }
    
    return () => clearInterval(timer);
  }, [selectedSeatIds.length, timeLeft]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status !== 'AVAILABLE') return;
    
    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(prev => prev.filter(id => id !== seat.id));
    } else {
      setSelectedSeatIds(prev => [...prev, seat.id]);
      // In a real app, this would trigger an API call to place a hold.
      // If it fails (e.g. concurrent booking), we'd show an error.
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const selectedSeatsData = seats.filter(s => selectedSeatIds.includes(s.id));
  const totalPrice = selectedSeatsData.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] relative">
      
      {/* Timer Bar */}
      <AnimatePresence>
        {timeLeft !== null && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-primary text-white py-2 px-4 flex justify-center items-center gap-2 font-medium z-40 overflow-hidden"
          >
            <Clock size={18} className="animate-pulse" />
            <span>Your hold expires in {formatTime(timeLeft)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Area */}
      <div className="flex-1 overflow-auto bg-background p-8 relative flex flex-col items-center">
        
        {/* Stage */}
        <div className="w-full max-w-2xl h-12 border-2 border-border border-t-0 rounded-b-[50%] mb-16 flex items-center justify-center bg-surface text-textMuted font-display tracking-[0.5em] shadow-[0_20px_50px_rgba(255,51,102,0.1)]">
          STAGE
        </div>

        {/* Grid */}
        <div className="flex flex-col gap-4">
          {Array.from({ length: 10 }).map((_, rIndex) => {
            const rowLabel = String.fromCharCode(65 + rIndex);
            const rowSeats = seats.filter(s => s.rowLabel === rowLabel).sort((a, b) => a.colNumber - b.colNumber);
            
            return (
              <div key={rowLabel} className="flex items-center gap-4">
                <span className="w-6 text-center text-textMuted font-mono text-sm">{rowLabel}</span>
                <div className="flex gap-2">
                  {rowSeats.map((seat, cIndex) => {
                    // Add an aisle
                    const isAisle = cIndex === 5;
                    return (
                      <div key={seat.id} className={`flex items-center ${isAisle ? 'ml-8' : ''}`}>
                        <button
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status !== 'AVAILABLE' && !selectedSeatIds.includes(seat.id)}
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-mono text-xs transition-all duration-200 hover:scale-110 active:scale-95"
                          style={getSeatStyle(seat)}
                        >
                          {seat.colNumber}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <span className="w-6 text-center text-textMuted font-mono text-sm">{rowLabel}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-16 flex gap-6 p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-[#FFB300]/30 border border-[#FFB300]"></div><span className="text-sm">Premium</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-[#9B59B6]/30 border border-[#9B59B6]"></div><span className="text-sm">Gold</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-[#5B8CFF]/30 border border-[#5B8CFF]"></div><span className="text-sm text-text-primary">Standard</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-muted opacity-70"></div><span className="text-sm text-text-primary">Held</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-border opacity-50"></div><span className="text-sm text-text-primary">Booked</span></div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-md bg-white border-2 border-primary"></div><span className="text-sm text-text-primary">Selected</span></div>
        </div>

      </div>

      {/* Bottom Drawer */}
      <AnimatePresence>
        {selectedSeatIds.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-border p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50"
          >
            <div className="container mx-auto flex items-center justify-between">
              <div>
                <h4 className="text-textMuted text-sm mb-1">Selected Seats</h4>
                <div className="flex gap-2">
                  {selectedSeatsData.map(s => (
                    <span key={s.id} className="font-mono bg-surface px-2 py-1 rounded border border-border text-text-primary">
                      {s.rowLabel}{s.colNumber}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <h4 className="text-textMuted text-sm mb-1">Total</h4>
                  <span className="text-2xl font-bold text-text-primary">₹{totalPrice}</span>
                </div>
                <button 
                  onClick={() => navigate('/checkout', { state: { selectedSeatsData, totalPrice, eventId: id } })}
                  className="btn-primary py-3 px-8 flex items-center gap-2 text-lg"
                >
                  <ShoppingCart size={20} />
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
