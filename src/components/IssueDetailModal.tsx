import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Globe2, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  ThumbsUp, 
  ShieldCheck, 
  ArrowRight,
  Image as ImageIcon,
  Check,
  Building2,
  FileCheck2
} from 'lucide-react';
import { Issue } from '../types';

interface IssueDetailModalProps {
  issue: Issue | null;
  onClose: () => void;
  onVerify: (issueId: string, isResolvedVerification?: boolean, note?: string) => void;
  onUpvote: (issueId: string) => void;
  isAdminMode: boolean;
  onOpenAssignModal?: (issue: Issue) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  onVerify,
  onUpvote,
  isAdminMode,
  onOpenAssignModal,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [verificationNote, setVerificationNote] = useState('');
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!issue) return null;

  const allImages = [
    issue.imageUrl, 
    ...(issue.additionalImages || []),
    ...(issue.resolutionProofImage ? [issue.resolutionProofImage] : [])
  ].filter(Boolean);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'Medium': return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      default: return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const isResolved = issue.status === 'Resolved' || issue.status === 'Citizen Confirmed';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-md transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image matching Screen 7 */}
        <div className="relative w-full h-64 sm:h-72 bg-slate-950 overflow-hidden">
          <img
            src={allImages[activeImageIndex] || issue.imageUrl}
            alt={issue.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30 pointer-events-none" />

          {/* If resolution proof is shown */}
          {issue.resolutionProofImage && activeImageIndex === allImages.length - 1 && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-500/90 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4" />
              <span>Official Resolution Proof</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 -mt-6 relative bg-slate-900 rounded-t-3xl">
          
          {/* Header Line matching Screen 7 */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getSeverityBadge(issue.severity)}`}>
                  {issue.severity}
                </span>
                <span className="text-xs text-slate-400 font-medium">{issue.category}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {issue.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{issue.location.address}</span>
                <span className="text-slate-600">·</span>
                <span className="text-cyan-400 font-medium">~ 250 m away</span>
              </p>
            </div>

            {/* Status Chip */}
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Status</span>
              <span className={`inline-block mt-0.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                issue.status === 'Citizen Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                issue.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                issue.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                issue.status === 'Assigned' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                'bg-slate-800 text-amber-400 border-slate-700'
              }`}>
                {issue.status}
              </span>
            </div>
          </div>

          {/* 3 Key Metric Stats matching Screen 7 (Severity Score, Reports, Verified) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 text-center">
            
            {/* Severity */}
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>Severity</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-white mt-0.5">
                {issue.severityScore}<span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
            </div>

            {/* Reports */}
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-cyan-400" />
                <span>Reports</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-cyan-300 mt-0.5">
                {issue.reportCount}
              </div>
            </div>

            {/* Verified */}
            <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Verified</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">
                {issue.verifiedCount}
              </div>
            </div>

          </div>

          {/* AI Confidence & Analysis matching Screen 7 */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Confidence &amp; Vision Categorization</span>
              </div>
              <span className="font-mono text-cyan-400 font-bold">
                {issue.aiAnalysis?.confidence || 94}%
              </span>
            </div>
            {/* Confidence Progress Bar matching Screen 7 */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-blue-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${issue.aiAnalysis?.confidence || 94}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {issue.aiAnalysis?.explanation || 'Evaluated high risk for road traffic and pedestrian hazard.'}
            </p>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
              Description
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
              {issue.description}
            </p>
          </div>

          {/* Photo Gallery matching Screen 7 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Photo Evidence ({allImages.length})
              </h4>
              <span className="text-[11px] text-slate-500">Citizen + Resolution Verification</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                    activeImageIndex === idx
                      ? 'border-cyan-400 ring-2 ring-cyan-400/40'
                      : 'border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* SerpAPI Official Municipal Department Routing Box */}
          <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Responsible Municipal Authority (SerpAPI Matched)
                </h4>
              </div>
              <span className="text-[10px] text-cyan-300 font-mono bg-cyan-900/60 px-2 py-0.5 rounded">
                Direct Routing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 text-[10px] block">Assigned Wing:</span>
                <span className="font-bold text-white">{issue.assignedDepartment}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Officer: <strong className="text-cyan-300">{issue.assignedOfficer || 'Zonal Engineer'}</strong>
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-slate-400 text-[10px] block">Official Ward Helpline:</span>
                <a 
                  href={`tel:${issue.municipalContact?.phone || '+91 755 2540220'}`}
                  className="font-mono text-cyan-300 font-bold hover:underline flex sm:justify-end items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-cyan-400" />
                  <span>{issue.municipalContact?.phone || '+91 755 2540220'}</span>
                </a>
                <a
                  href={issue.municipalContact?.portalUrl || 'https://smartbhopal.city/grievance'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-slate-400 hover:text-white flex sm:justify-end items-center gap-1 mt-1"
                >
                  <span>Municipal Portal</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Accountability Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Accountability Cycle &amp; Audit Trail
            </h4>
            <div className="space-y-2.5 border-l-2 border-slate-800 ml-2 pl-3">
              {issue.timeline.map((evt) => (
                <div key={evt.id} className="relative text-xs">
                  <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-500 border-2 border-slate-900" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{evt.status}</span>
                    <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    <span className="text-slate-300 font-medium">{evt.actor}:</span> {evt.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
            
            {/* Upvote Button */}
            <button
              onClick={() => onUpvote(issue.id)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>I Also Face This (+1)</span>
            </button>

            {/* Verify Button (Citizen verification) */}
            {!isResolved ? (
              <button
                onClick={() => onVerify(issue.id, false)}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/25 transition active:scale-95"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Live Hazard ({issue.verifiedCount})</span>
              </button>
            ) : (
              <button
                onClick={() => onVerify(issue.id, true, 'Citizen confirmed resolution in person')}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25 transition active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{issue.status === 'Citizen Confirmed' ? 'Resolution Confirmed by Citizens' : 'Confirm Issue is Resolved'}</span>
              </button>
            )}

            {/* Admin Management Button */}
            {isAdminMode && onOpenAssignModal && (
              <button
                onClick={() => onOpenAssignModal(issue)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <span>Manage Ticket</span>
              </button>
            )}

            {/* Share Link */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Share Link"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <ExternalLink className="w-4 h-4" />}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
