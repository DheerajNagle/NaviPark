import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { MapPin, Moon, Sun, Eye, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { darkMode, setDarkMode, accessibility, setAccessibility, currentUser, setCurrentUser, userRole } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setCurrentUser(null);
    setMenuOpen(false);
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 relative z-50">
      <div className="flex items-center gap-2">
        <MapPin className="text-sky-500 dark:text-sky-400" size={28} />
        <div>
          <h1 className="font-bold text-xl text-slate-900 dark:text-white leading-none">NaviPark</h1>
          <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase">{userRole === 'admin' ? 'Admin Mode' : 'Smart System'}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setAccessibility(!accessibility)}
          className={`p-2 rounded-lg transition-colors ${accessibility ? 'bg-sky-500 dark:bg-sky-400 text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          aria-label="Toggle Accessibility"
        >
          <Eye size={20} />
        </button>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {/* Profile Dropdown */}
        {currentUser && (
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-transparent focus:border-sky-500"
            >
              {currentUser.name === 'Facility Manager' ? (
                <span className="font-bold text-slate-600 dark:text-slate-300">AD</span>
              ) : (
                <User size={20} className="text-slate-600 dark:text-slate-300" />
              )}
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                  <p className="text-sm font-semibold">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 uppercase">{userRole}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
