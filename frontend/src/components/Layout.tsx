import { Outlet, Link } from 'react-router-dom';
import { Ticket, Sun, Moon, MessageCircle, Globe, Briefcase } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary font-sans">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-[#0D0D0F]/90 border-b border-[#E5E7EB] dark:border-[#2A2A35]">
        <div className="container mx-auto px-4 h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-2xl tracking-tight ml-8">
            <Ticket size={28} className="text-[#6C63FF]" />
            <span>TIXNOW</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#6C63FF] relative group transition-colors">
              Movies
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#6C63FF] transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#6C63FF] relative group transition-colors">
              Concerts
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#6C63FF] transition-all group-hover:w-full"></span>
            </Link>
            
            <div className="w-px h-6 bg-border mx-2"></div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full border border-[#E5E7EB] dark:border-[#2A2A35] hover:bg-gray-100 dark:hover:bg-[#1E1E24] transition-colors text-text-primary"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold bg-[#6C63FF] text-white px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-all">
                Sign In
              </Link>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="bg-[#1a1a2e] text-white pt-16 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Column 1 */}
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight">
                <Ticket size={28} className="text-[#6C63FF]" />
                <span>TIXNOW</span>
              </Link>
              <p className="text-gray-400 text-sm">
                Book the best seats in India for movies, concerts, and exclusive live events.
              </p>
              <div className="flex items-center gap-4 text-gray-400">
                <a href="#" className="hover:text-white transition-colors"><MessageCircle size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><Globe size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><Briefcase size={20} /></a>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="text-white font-semibold mb-2">Explore</h3>
              <div className="w-8 h-0.5 bg-[#6C63FF] mb-6"></div>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Movies</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Concerts</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Events</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Cities</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="text-white font-semibold mb-2">Company</h3>
              <div className="w-8 h-0.5 bg-[#6C63FF] mb-6"></div>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="text-white font-semibold mb-2">Support</h3>
              <div className="w-8 h-0.5 bg-[#6C63FF] mb-6"></div>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Refund Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          {/* Section Divider */}
          <div className="border-t border-[#2A2A35] pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2026 TixNow India. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
