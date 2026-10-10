import React from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  Search, 
  User, 
  Globe2, 
  Sparkles,
  Layers,
  ChevronDown,
  LogIn,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  activeView: 'home' | 'nearby' | 'map' | 'reports' | 'authority' | 'serpapi';
  setActiveView: (view: 'home' | 'nearby' | 'map' | 'reports' | 'authority' | 'serpapi') => void;
  onOpenReportModal: () => void;
  onOpenProfile: () => void;
  notificationCount: number;
  onOpenNotifications: () => void;
  currentCity: string;
  setCurrentCity: (city: string) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  authEmail: string | null;
  onOpenLogin: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenReportModal,
  onOpenProfile,
  notificationCount,
  onOpenNotifications,
  currentCity,
  setCurrentCity,
  isAdminMode,
  setIsAdminMode,
  authEmail,
  onOpenLogin,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveView('home')}
              className="flex items-center gap-2.5 text-left group transition"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-extrabold text-lg">F</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-white">
                    FixMy<span className="text-cyan-400">City</span>
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Live Civic Mesh" />
                </div>
                <p className="text-[10px] text-slate-400 -mt-0.5 tracking-wide">
                  Accountability &amp; Resolution Platform
                </p>
              </div>
            </button>

            {/* City / Campus Selector */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <select 
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                aria-label="Select city or campus location"
                className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                <option value="Bhopal (MP Nagar & City)" className="bg-slate-900 text-white">Bhopal (MP Nagar &amp; City)</option>
                <option value="Campus Mode (Engineering Campus)" className="bg-slate-900 text-white">Campus Mode (Engineering Campus)</option>
                <option value="Indore Smart City" className="bg-slate-900 text-white">Indore Smart City</option>
                <option value="Delhi NCR Civic Zone" className="bg-slate-900 text-white">Delhi NCR Civic Zone</option>
              </select>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => { setActiveView('home'); setIsAdminMode(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeView === 'home' && !isAdminMode
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Citizen Feed
            </button>
            <button
              onClick={() => { setActiveView('nearby'); setIsAdminMode(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeView === 'nearby' && !isAdminMode
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Nearby Issues
            </button>
            <button
              onClick={() => { setActiveView('map'); setIsAdminMode(false); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeView === 'map' && !isAdminMode
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Public Map
            </button>

            {/* SerpAPI Live Intelligence Explorer Button */}
            <button
              onClick={() => { setActiveView('serpapi'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                activeView === 'serpapi'
                  ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
                  : 'border-slate-700/80 text-cyan-400 hover:bg-slate-800/60 hover:border-cyan-500/40'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span>SerpAPI Civic Radar</span>
              <span className="px-1.5 py-0.2 text-[9px] bg-cyan-500/20 text-cyan-300 rounded font-mono font-semibold">LIVE</span>
            </button>
          </nav>

          {/* Right Controls & Role Switcher */}
          <div className="flex items-center gap-3">
            
            {/* Citizen vs Authority Dashboard Switch */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  setIsAdminMode(false);
                  if (activeView === 'authority') setActiveView('home');
                }}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition flex items-center gap-1.5 ${
                  !isAdminMode
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3 h-3" />
                <span className="hidden sm:inline">Citizen</span>
              </button>
              <button
                onClick={() => {
                  setIsAdminMode(true);
                  setActiveView('authority');
                }}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition flex items-center gap-1.5 ${
                  isAdminMode
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span className="hidden sm:inline">Authority</span>
                <span className="px-1 py-0.2 text-[9px] bg-amber-400/20 text-amber-200 rounded font-semibold">BMC</span>
              </button>
            </div>

            {/* Quick Report Button */}
            {!isAdminMode && (
              <button
                onClick={onOpenReportModal}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 transition active:scale-95 cursor-pointer"
              >
                <span className="text-base leading-none font-bold">+</span>
                <span>Report Issue</span>
              </button>
            )}

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {authEmail ? (
              <>
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/80 transition cursor-pointer"
                  title={authEmail}
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xs font-bold text-cyan-200">
                    {authEmail.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline max-w-32 truncate text-xs font-medium text-slate-200">{authEmail}</span>
                </button>
                <button
                  onClick={onSignOut}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
