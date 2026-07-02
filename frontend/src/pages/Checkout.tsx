import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Checkout() {
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Session expired.");
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const handleConfirm = () => {
    // In a real app, call API to confirm booking
    setIsConfirmed(true);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isConfirmed) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-success mb-6"
        >
          <CheckCircle2 size={80} />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-display font-bold mb-4"
        >
          Booking Confirmed!
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-textMuted mb-8 max-w-md"
        >
          Your tickets for <strong>The Weeknd - After Hours</strong> have been booked. A confirmation email with your QR code has been sent.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card p-6 bg-surface-elevated max-w-sm w-full mb-8 border-dashed"
        >
          <div className="flex justify-between items-center mb-6 border-b border-border border-dashed pb-6">
            <span className="text-textMuted">Booking Ref</span>
            <span className="font-mono text-lg font-bold">TX-8923-41A</span>
          </div>
          <div className="flex justify-center py-4">
            <div className="bg-white p-4 rounded-xl">
              <Ticket size={120} className="text-black" />
            </div>
          </div>
        </motion.div>
        
        <motion.button 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate('/')}
          className="btn-primary px-8"
        >
          Back to Home
        </motion.button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Payment Form */}
        <div className="flex-1">
          <div className="card p-8 mb-8">
            <h2 className="text-xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-2">Full Name</label>
                <input type="text" className="input-field" defaultValue="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-2">Email Address</label>
                <input type="email" className="input-field" defaultValue="john@example.com" />
              </div>
            </div>
          </div>
          
          <div className="card p-8">
            <h2 className="text-xl font-bold mb-6">Payment</h2>
            <div className="p-4 bg-surface-elevated border border-border rounded-xl text-center text-textMuted">
              Payment integration (Stripe/Razorpay) goes here.
            </div>
            <button 
              onClick={handleConfirm}
              className="btn-primary w-full mt-6 py-4 text-lg font-bold"
            >
              Pay $250.00
            </button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="card sticky top-24">
            <div className="bg-primary/10 p-4 border-b border-primary/20 flex justify-between items-center text-primary font-medium">
              <span>Time remaining to complete booking</span>
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold mb-2">The Weeknd - After Hours</h3>
              <p className="text-sm text-textMuted mb-6">Wembley Stadium, London • Dec 05, 2023</p>
              
              <div className="space-y-4 mb-6 border-b border-border pb-6">
                <div className="flex justify-between text-sm">
                  <span>Premium Ticket (A1, A2)</span>
                  <span>$300.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Booking Fee</span>
                  <span>$15.00</span>
                </div>
              </div>
              
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>$315.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
