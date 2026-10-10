import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Navigation2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  Sparkles
} from 'lucide-react';
import { Issue, IssueCategory } from '../types';

interface PublicMapProps {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onVerifyIssue: (issueId: string) => void;
}

export const PublicMap: React.FC<PublicMapProps> = ({
  issues,
  onSelectIssue,
  onVerifyIssue,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedPin, setSelectedPin] = useState<Issue | null>(issues[0] || null);

  const categories = ['All', 'Pothole', 'Garbage Accumulation', 'Broken Streetlight', 'Water Leakage', 'Open Drain', 'Campus Infrastructure'];

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    const matchesCat = selectedCategory === 'All' || issue.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.locality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculate coordinates mapped onto a visual grid
  const getMapCoordinates = (issue: Issue, index: number) => {
    // Map latitude 23.18 - 23.25 to percentage Y (90% to 15%)
    // Map longitude 77.40 - 77.45 to percentage X (15% to 85%)
    const minLat = 23.1800;
    const maxLat = 23.2500;
    const minLng = 77.4000;
    const maxLng = 77.4500;

    let x = ((issue.location.lng - minLng) / (maxLng - minLng)) * 100;
    let y = 100 - ((issue.location.lat - minLat) / (maxLat - minLat)) * 100;

    // Boundary constraints
    x = Math.max(12, Math.min(88, x));
    y = Math.max(15, Math.min(85, y));

    return { x, y };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return { bg: 'bg-rose-500', glow: 'shadow-rose-500/50', border: 'border-rose-400', text: 'text-rose-400' };
      case 'High': return { bg: 'bg-orange-500', glow: 'shadow-orange-500/50', border: 'border-orange-400', text: 'text-orange-400' };
      case 'Medium': return { bg: 'bg-amber-500', glow: 'shadow-amber-500/50', border: 'border-amber-400', text: 'text-amber-400' };
      default: return { bg: 'bg-emerald-500', glow: 'shadow-emerald-500/50', border: 'border-emerald-400', text: 'text-emerald-400' };
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden flex flex-col">
      
      {/* Top Search & Filter Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 max-w-2xl mx-auto flex flex-col gap-2.5">
        
        {/* Search Input */}
        <div className="flex items-center gap-2 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-xl shadow-black/40">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search road, sector, or complaint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium px-2 py-1 bg-cyan-950/60 rounded-lg">
            <span>{filteredIssues.length}</span>
            <span className="hidden sm:inline">Active</span>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const label = cat === 'Garbage Accumulation' ? 'Garbage' : 
                          cat === 'Broken Streetlight' ? 'Streetlight' : 
                          cat === 'Campus Infrastructure' ? 'Campus' : cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shadow-md ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-cyan-500/20 scale-105'
                    : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Interactive Map Visual Surface */}
      <div 
        className="relative flex-1 w-full h-full overflow-hidden select-none"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: 'transform 0.25s ease-out'
        }}
      >
        {/* Synthetic Map Background: Roads, Water, Wards Grid */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-800/60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="1" />
            </pattern>
            <radialGradient id="lakeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#083344" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid lines */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Upper Lake / Shahpura Lake water bodies */}
          <ellipse cx="28%" cy="55%" rx="18%" ry="12%" fill="url(#lakeGrad)" />
          <ellipse cx="38%" cy="75%" rx="10%" ry="8%" fill="url(#lakeGrad)" />

          {/* Arterial Road Network Lines */}
          <path d="M 10 200 Q 300 280 650 320 T 1200 400" fill="none" stroke="#334155" strokeWidth="6" strokeDasharray="8 4" />
          <path d="M 400 50 L 480 320 L 520 800" fill="none" stroke="#1e293b" strokeWidth="8" />
          <path d="M 150 120 L 800 600" fill="none" stroke="#1e293b" strokeWidth="4" />
          <path d="M 300 450 Q 550 500 950 480" fill="none" stroke="#334155" strokeWidth="5" />
          <circle cx="50%" cy="45%" r="180" fill="none" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {/* City & Ward Landmark Typography Overlays */}
        <div className="absolute top-[42%] left-[46%] -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
          <span className="text-2xl sm:text-4xl font-black text-slate-800/80 tracking-widest uppercase">
            BHOPAL
          </span>
          <p className="text-[11px] font-mono tracking-wider text-slate-700">Central Municipal Zone</p>
        </div>

        <div className="absolute top-[32%] left-[62%] pointer-events-none text-slate-700 font-mono text-[10px] uppercase tracking-wider">
          MP Nagar (Zone 10)
        </div>
        <div className="absolute top-[68%] left-[68%] pointer-events-none text-slate-700 font-mono text-[10px] uppercase tracking-wider">
          Arera Colony (Zone 12)
        </div>
        <div className="absolute top-[80%] left-[30%] pointer-events-none text-slate-700 font-mono text-[10px] uppercase tracking-wider">
          Kolar Road
        </div>
        <div className="absolute top-[60%] left-[24%] pointer-events-none text-cyan-900/60 font-mono text-[10px] uppercase tracking-wider">
          Shahpura Lake Area
        </div>
        <div className="absolute top-[22%] left-[28%] pointer-events-none text-slate-700 font-mono text-[10px] uppercase tracking-wider">
          Engineering Campus
        </div>

        {/* Live Issue Pins */}
        {filteredIssues.map((issue, idx) => {
          const coords = getMapCoordinates(issue, idx);
          const colors = getSeverityColor(issue.severity);
          const isSelected = selectedPin?.id === issue.id;

          return (
            <div
              key={issue.id}
              onClick={() => setSelectedPin(issue)}
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
            >
              {/* Pulsing ring for critical issues */}
              {issue.severity === 'Critical' && (
                <div className="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
              )}

              {/* Pin container */}
              <div
                className={`relative flex items-center justify-center transition-transform ${
                  isSelected ? 'scale-125 z-30' : 'group-hover:scale-115'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center text-white font-bold text-xs shadow-lg ${colors.glow} border-2 ${
                    isSelected ? 'border-white ring-4 ring-cyan-500/50' : colors.border
                  }`}
                >
                  <MapPin className="w-4 h-4 fill-current" />
                </div>

                {/* Badge showing duplicate report count */}
                {issue.reportCount > 1 && (
                  <span className="absolute -top-1 -right-1 px-1 bg-slate-900 border border-slate-700 text-[9px] font-extrabold text-white rounded-full">
                    {issue.reportCount}
                  </span>
                )}
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none whitespace-nowrap z-40">
                <div className="px-2.5 py-1 bg-slate-900/95 border border-slate-700 text-white rounded-lg shadow-xl text-xs font-semibold flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${colors.bg}`} />
                  <span>{issue.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({issue.reportCount} reports)</span>
                </div>
                <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-700 rotate-45 -mt-1" />
              </div>
            </div>
          );
        })}

      </div>

      {/* Map Floating Controls (Zoom, Reset, Layers) */}
      <div className="absolute bottom-36 sm:bottom-28 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
          className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white flex items-center justify-center shadow-lg hover:bg-slate-800 transition active:scale-95"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
          className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white flex items-center justify-center shadow-lg hover:bg-slate-800 transition active:scale-95"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 text-cyan-400 flex items-center justify-center shadow-lg hover:bg-slate-800 transition active:scale-95"
          title="Reset Center"
        >
          <Navigation2 className="w-4 h-4" />
        </button>
      </div>

      {/* Map Severity Legend matching Screen 4 */}
      <div className="absolute bottom-28 sm:bottom-6 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 shadow-xl flex flex-col gap-1.5 text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Severity Legend</span>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
          <span className="text-slate-300 text-xs">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
          <span className="text-slate-300 text-xs">High</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
          <span className="text-slate-300 text-xs">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span className="text-slate-300 text-xs">Low</span>
        </div>
      </div>

      {/* Selected Issue Preview Card / Bottom Sheet */}
      {selectedPin && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-16 sm:w-96 z-30 bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start gap-3">
            <img
              src={selectedPin.imageUrl}
              alt={selectedPin.title}
              className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  selectedPin.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  selectedPin.severity === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  selectedPin.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {selectedPin.severity}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedPin.reportCount} reports · {selectedPin.verifiedCount} verified
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1 truncate">
                {selectedPin.title}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>{selectedPin.location.address}</span>
              </p>
              <div className="text-[11px] text-cyan-400 font-medium mt-1">
                Dept: {selectedPin.assignedDepartment}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
            <button
              onClick={() => onVerifyIssue(selectedPin.id)}
              className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verify ({selectedPin.verifiedCount})</span>
            </button>
            <button
              onClick={() => onSelectIssue(selectedPin)}
              className="flex-1 py-1.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20 transition"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
