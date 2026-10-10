import React from 'react';
import { 
  Camera, 
  MapPin, 
  Layers, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle, 
  Users, 
  Globe2, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Issue } from '../types';

interface HomeFeedProps {
  issues: Issue[];
  onOpenReportModal: () => void;
  onSelectIssue: (issue: Issue) => void;
  onNavigate: (view: 'nearby' | 'map' | 'reports' | 'authority' | 'serpapi') => void;
  onOpenProfile: () => void;
  userName: string;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  issues,
  onOpenReportModal,
  onSelectIssue,
  onNavigate,
  onOpenProfile,
  userName = 'Gaurav',
}) => {
  // Critical & high severity live issues
  const liveIssues = issues.slice(0, 4);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'Medium': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      default: return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Greeting Header matching Screen 2 */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Good Morning, {userName}</span>
          <span className="text-2xl">👋</span>
        </h1>
        <p className="text-sm text-slate-400">
          Together we can build a cleaner, safer and better city.
        </p>
      </div>

      {/* Hero Quick Action: Report an Issue matching Screen 2 */}
      <div
        onClick={onOpenReportModal}
        className="group relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-cyan-950 border border-slate-700/80 hover:border-cyan-500/50 rounded-3xl p-5 sm:p-6 shadow-xl cursor-pointer transition-all duration-200 hover:shadow-cyan-950/30 active:scale-[0.99]"
      >
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform shrink-0">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                Report an Issue
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Snap · Add location · AI Classification · Submit
              </p>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-cyan-600 group-hover:border-cyan-500 transition-all shrink-0">
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 4-Grid Quick Access Buttons matching Screen 2 */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        
        {/* Nearby Issues */}
        <button
          onClick={() => onNavigate('nearby')}
          className="text-left bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-lg group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
            Nearby Issues
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            See what's around you
          </p>
        </button>

        {/* My Reports */}
        <button
          onClick={onOpenProfile}
          className="text-left bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-lg group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
            My Reports
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Track your submissions
          </p>
        </button>

        {/* Public Map */}
        <button
          onClick={() => onNavigate('map')}
          className="text-left bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-lg group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
            Public Map
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Explore city issues
          </p>
        </button>

        {/* Verify Issues */}
        <button
          onClick={() => onNavigate('nearby')}
          className="text-left bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-lg group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
            Verify Issues
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Help confirm nearby issues
          </p>
        </button>

      </div>

      {/* Live Issues Near You Section matching Screen 2 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-base font-bold text-white">Live Issues Near You</h3>
          </div>
          <button
            onClick={() => onNavigate('nearby')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {liveIssues.map((issue, idx) => (
            <div
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-3 sm:p-4 transition flex items-center justify-between gap-3 cursor-pointer group shadow-lg"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={issue.imageUrl}
                  alt={issue.title}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-slate-700 group-hover:scale-102 transition-transform"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getSeverityBadge(issue.severity)}`}>
                      {issue.severity}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {issue.reportCount} reports
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {issue.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>{issue.location.address}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-cyan-400 font-medium">~ 320 m</span>
                  </p>
                </div>
              </div>

              <div className="shrink-0 p-2 text-slate-500 group-hover:text-cyan-400 transition">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SerpAPI Intelligence Widget */}
      <div className="bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-800/40 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
            <Globe2 className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">SerpAPI Municipal Intelligence</h4>
              <span className="text-[9px] font-mono font-bold bg-cyan-400/20 text-cyan-300 px-1.5 py-0.2 rounded">LIVE</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live Google Search &amp; Ward Office verification active for Bhopal Municipal Corporation.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('serpapi')}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-md shadow-cyan-600/30 flex items-center gap-1.5"
        >
          <span>Open Radar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* The Innovation & Differentiation Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            From Complaints to Confirmed Solutions
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Full Lifecycle</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          Unlike traditional grievance portals that only collect reports, FixMyCity connects community reporting with smart AI prioritization, SerpAPI municipal routing, real-time tracking, and in-person citizen resolution verification.
        </p>
        <div className="pt-2 flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-cyan-300 no-scrollbar">
          <span className="px-2 py-0.5 bg-slate-800 rounded">Report</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-slate-800 rounded">Verify</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-slate-800 rounded">Prioritize</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-slate-800 rounded">Assign</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-slate-800 rounded">Resolve</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">Confirm</span>
        </div>
      </div>

    </div>
  );
};
