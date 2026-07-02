import { Outlet, Link } from 'react-router-dom';
import { Ticket, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <header className="border-b border-border bg-surface sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
            <Ticket size={28} />
            <span>TIXNOW</span>
          </Link>
          <nav className="flex items-center gap-4 md:gap-6">
            <Link to="/" className="text-sm font-medium text-text-primary hover:text-primary transition-colors">Movies</Link>
            <Link to="/" className="text-sm font-medium text-text-primary hover:text-primary transition-colors">Concerts</Link>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full border border-border hover:bg-border transition-colors text-text-primary"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-colors">
              Sign In
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="border-t border-border bg-card py-12 mt-20">
        <div className="container mx-auto px-4 text-center text-muted">
          <p>© 2026 TixNow India. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
