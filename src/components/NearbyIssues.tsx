import React, { useState } from 'react';
import { 
  ArrowLeft, 
  SlidersHorizontal, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Issue } from '../types';

interface NearbyIssuesProps {
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onBack?: () => void;
  onOpenReportModal: () => void;
}

export const NearbyIssues: React.FC<NearbyIssuesProps> = ({
  issues,
  onSelectIssue,
  onBack,
  onOpenReportModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'distance' | 'urgency' | 'reports'>('urgency');

  const categories = ['All', 'Pothole', 'Garbage Accumulation', 'Broken Streetlight', 'Water Leakage', 'Open Drain', 'Campus Infrastructure'];

  // Filter issues
  const filtered = issues.filter(issue => {
    if (selectedCategory === 'All') return true;
    return issue.category === selectedCategory;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'urgency') return b.severityScore - a.severityScore;
    if (sortBy === 'reports') return b.reportCount - a.reportCount;
    return 0; // default order
  });

  const getDistanceEstimate = (index: number) => {
    const distances = ['~ 250 m', '~ 1.2 km', '~ 2.1 km', '~ 3.4 km', '~ 4.2 km', '~ 5.0 km'];
    return distances[index % distances.length];
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Header bar matching Screen 5 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Nearby Issues
            </h1>
            <p className="text-xs text-slate-400">
              Civic reports geolocated in your vicinity · Bhopal Central Ward
            </p>
          </div>
        </div>

        {/* Sort & Action */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="urgency">Highest Severity</option>
            <option value="reports">Most Reported</option>
            <option value="distance">Nearest Distance</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs matching Screen 5 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const label = cat === 'Garbage Accumulation' ? 'Garbage' : 
                        cat === 'Broken Streetlight' ? 'Streetlight' : 
                        cat === 'Campus Infrastructure' ? 'Campus' : cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25 scale-102'
                  : 'bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Issues List matching Screen 5 design */}
      <div className="space-y-3">
        {sorted.map((issue, idx) => {
          return (
            <div
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              className="group bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 sm:p-4 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-cyan-950/20 flex items-center justify-between gap-4"
            >
              {/* Left Photo & Content */}
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={issue.imageUrl}
                    alt={issue.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-700/80 group-hover:scale-102 transition-transform"
                  />
                  {issue.reportCount > 1 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-slate-900 border border-slate-700 text-cyan-400 text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow">
                      {issue.reportCount}×
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  
                  {/* Top line: Severity tag + Category */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getSeverityBadge(issue.severity)}`}>
                      {issue.severity}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {issue.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    {issue.title}
                  </h3>

                  {/* Location & Distance matching Screen 5 */}
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1 truncate max-w-[200px] sm:max-w-xs">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{issue.location.address}</span>
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-cyan-400 font-medium shrink-0">
                      {getDistanceEstimate(idx)}
                    </span>
                  </div>

                  {/* Reports & Verified metrics count */}
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-slate-300">
                      <Users className="w-3 h-3 text-cyan-400" />
                      <span>{issue.reportCount} reports</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-medium text-emerald-400">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{issue.verifiedCount} verified</span>
                    </span>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline text-slate-400 font-mono">
                      Status: <span className="text-amber-300 font-medium">{issue.status}</span>
                    </span>
                  </div>

                </div>
              </div>

              {/* Right Chevron Arrow */}
              <div className="shrink-0 p-2 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h4 className="text-base font-semibold text-slate-300">No issues found in this category</h4>
            <p className="text-xs text-slate-500 mt-1">Be the first to report an issue in your neighborhood!</p>
            <button
              onClick={onOpenReportModal}
              className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl"
            >
              Report an Issue
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
