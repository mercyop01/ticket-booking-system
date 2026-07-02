import { Outlet, Link } from 'react-router-dom';
import { Ticket, User } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <Ticket size={28} />
            <span className="font-display font-bold text-xl tracking-tight text-white">TIX<span className="text-primary">NOW</span></span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-textMuted hover:text-white transition-colors">Movies</Link>
            <Link to="/" className="text-sm font-medium text-textMuted hover:text-white transition-colors">Concerts</Link>
            <button className="flex items-center gap-2 text-sm font-medium text-white bg-surface-elevated border border-border px-4 py-2 rounded-full hover:bg-border transition-colors">
              <User size={16} />
              Sign In
            </button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="border-t border-border bg-surface py-12 mt-20">
        <div className="container mx-auto px-4 text-center text-textMuted">
          <p>© {new Date().getFullYear()} TixNow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
