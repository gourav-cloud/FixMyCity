import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Award, 
  ShieldCheck, 
  FileText, 
  ChevronRight,
  Sparkles,
  Bookmark,
  TrendingUp
} from 'lucide-react';
import { Issue } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  issues,
  onSelectIssue,
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'saved' | 'karma'>('reports');

  if (!isOpen) return null;

  // Filter issues reported by Gaurav
  const myReports = issues.filter(
    (i) => i.reportedBy.name.includes('Gaurav') || i.reportedBy.id === 'usr-1'
  );

  const resolvedCount = myReports.filter(
    (i) => i.status === 'Resolved' || i.status === 'Citizen Confirmed'
  ).length;

  const inProgressCount = myReports.filter(
    (i) => i.status === 'In Progress' || i.status === 'Assigned' || i.status === 'Under Review'
  ).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/70 hover:bg-slate-850 text-white border border-slate-700 backdrop-blur-md transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Background Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-900 via-indigo-900 to-cyan-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        </div>

        {/* Profile Card matching Screen 8 */}
        <div className="px-6 pb-6 pt-0 -mt-12 space-y-5">
          
          {/* Avatar & Name */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="flex items-end gap-3.5">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                alt="Gaurav Chotrani"
                className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-900 shadow-xl"
              />
              <div>
                <h3 className="text-lg font-black text-white">Gaurav Chotrani</h3>
                <p className="text-xs text-slate-400">gaurav@gmail.com</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Civic Guardian Level 3
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Metric Stats matching Screen 8 (Total Reports, Resolved, In Progress) */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {myReports.length || 5}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                Total Reports
              </div>
            </div>
            <div className="border-x border-slate-800">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {resolvedCount || 4}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                Resolved
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-amber-400">
                {inProgressCount || 1}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                In Progress
              </div>
            </div>
          </div>

          {/* Profile Tabs matching Screen 8 */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'reports'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Reports
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'saved'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Saved Locations
            </button>
            <button
              onClick={() => setActiveTab('karma')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'karma'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Civic Badges
            </button>
          </div>

          {/* Tab Content: My Reports */}
          {activeTab === 'reports' && (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 no-scrollbar">
              {myReports.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectIssue(item);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-800"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{item.location.locality}, Bhopal</span>
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.reportCount} reports merged
                      </span>
                    </div>
                  </div>

                  {/* Status Tag matching Screen 8 */}
                  <div className="shrink-0 text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      item.status === 'Resolved' || item.status === 'Citizen Confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : item.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab Content: Saved Locations */}
          {activeTab === 'saved' && (
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Home · MP Nagar Zone 1</div>
                  <div className="text-slate-400 text-[11px]">Bhopal Ward 42</div>
                </div>
                <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950 px-2 py-1 rounded-lg border border-cyan-800">
                  Primary Alert Zone
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">College Campus · Engineering Block</div>
                  <div className="text-slate-400 text-[11px]">Academic Zone North</div>
                </div>
                <span className="text-[10px] text-slate-400 font-bold bg-slate-900 px-2 py-1 rounded-lg">
                  Secondary
                </span>
              </div>
            </div>
          )}

          {/* Tab Content: Badges */}
          {activeTab === 'karma' && (
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white">Verified Reporter</div>
                  <div className="text-[11px] text-slate-400">Awarded for 5 accurate geolocated submissions with 0 false positives</div>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white">Resolution Auditor</div>
                  <div className="text-[11px] text-slate-400">Confirmed in-person resolution of 4 municipal tickets</div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
