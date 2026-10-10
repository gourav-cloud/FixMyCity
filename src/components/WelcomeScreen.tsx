import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onLogin,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between overflow-hidden">
      
      {/* Background Hero Skyline */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80"
          alt="City skyline at dusk"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      </div>

      {/* Top Bar with Brand */}
      <div className="relative z-10 p-6 flex justify-between items-center max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-cyan-500/30">
            F
          </div>
          <span className="font-black text-2xl tracking-tight text-white">
            FixMy<span className="text-cyan-400">City</span>
          </span>
        </div>

        <button
          onClick={onGetStarted}
          className="text-xs text-slate-300 hover:text-white bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-700/80 transition"
        >
          Skip to Live App →
        </button>
      </div>

      {/* Main Center Headline & Value Proposition matching Screen 1 */}
      <div className="relative z-10 max-w-lg mx-auto px-6 text-center space-y-6 my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Smart Civic &amp; Campus Problem Reporting</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            FixMy<span className="text-cyan-400">City</span>
          </h1>
          <p className="text-lg sm:text-xl font-medium text-slate-200">
            Real People. Real Issues. Real Change.
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
          Report potholes, open drains, garbage accumulation, broken streetlights, water leaks, and campus infrastructure with automatic AI classification and SerpAPI municipal routing.
        </p>

        {/* Action Buttons matching Screen 1 */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onGetStarted}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-base shadow-xl shadow-cyan-500/30 transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onLogin}
            className="text-xs text-slate-400 hover:text-white transition"
          >
            Already have an account? <span className="text-cyan-400 underline font-semibold">Login</span>
          </button>
        </div>
      </div>

      {/* Footer matching Screen 1 */}
      <div className="relative z-10 p-6 text-center text-xs text-slate-500 border-t border-slate-900/60 max-w-md mx-auto w-full">
        <p className="flex items-center justify-center gap-1.5 text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Smarter cities start with your voice.</span>
        </p>
      </div>

    </div>
  );
};
