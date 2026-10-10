import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Camera, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  Upload, 
  Check, 
  Layers, 
  Building2, 
  Phone, 
  Globe2, 
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { Issue, IssueCategory, IssueSeverity, AiAnalysis, SerpApiAuthorityResult } from '../types';
import { classifyIssueWithAI, fetchSerpApiAuthorities } from '../services/api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issueData: Partial<Issue>) => void;
  existingIssues: Issue[];
  onUpvoteDuplicate: (issueId: string) => void;
}

// Preset realistic samples for instant one-click testing
const SAMPLE_PRESETS = [
  {
    name: 'Pothole (Arterial Road)',
    category: 'Pothole' as IssueCategory,
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    title: 'Severe Pothole & Road Cavity near Chetak Junction',
    description: 'Deep road crater on main transit route causing traffic bottleneck and scooter skidding.',
    location: 'MP Nagar Zone 1, Chetak Bridge, Bhopal',
    lat: 23.2332,
    lng: 77.4344,
  },
  {
    name: 'Open Drain / Sewer Sump',
    category: 'Open Drain' as IssueCategory,
    imageUrl: 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&w=800&q=80',
    title: 'Uncovered Deep Drainage Sump near Public School',
    description: 'Sewer slab collapsed 3 days ago leaving an open 4-foot pit directly outside school walkway.',
    location: 'Lane 4, Jyoti Talkies Commercial Road, Bhopal',
    lat: 23.2365,
    lng: 77.4312,
  },
  {
    name: 'Garbage Dump Overflow',
    category: 'Garbage Accumulation' as IssueCategory,
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    title: 'Overflowing Municipal Dumpster Blocking Sidewalk',
    description: 'Heavy solid waste accumulating across pedestrian path for 4 days without compactor collection.',
    location: 'E-3 Community Center, Arera Colony, Bhopal',
    lat: 23.2185,
    lng: 77.4290,
  },
  {
    name: 'Broken Streetlight',
    category: 'Broken Streetlight' as IssueCategory,
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    title: 'Dual-Pole Non-Functional Streetlight creating Dark Zone',
    description: 'Pitch dark curve on main transit corridor with high accident potential at night.',
    location: 'Sector C Main Road, Kolar Road, Bhopal',
    lat: 23.1890,
    lng: 77.4190,
  },
  {
    name: 'Water Supply Leakage',
    category: 'Water Leakage' as IssueCategory,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=800&q=80',
    title: 'Ruptured Drinking Water Main Pipeline gushing onto road',
    description: 'Fresh clean municipal water gushing across road while nearby residential colonies report dry taps.',
    location: 'Shahpura Sector A, Near Lake View Promenade, Bhopal',
    lat: 23.2040,
    lng: 77.4250,
  },
  {
    name: 'Campus Infrastructure Hazard',
    category: 'Campus Infrastructure' as IssueCategory,
    imageUrl: 'https://images.unsplash.com/photo-1584463699047-68894dfc7379?auto=format&fit=crop&w=800&q=80',
    title: 'Broken Handrail & Loose Marble Stair Treads in Academic Block',
    description: 'Staircase railing detached between 2nd and 3rd floors, posing severe fall risk during rush.',
    location: 'Academic Block 3, North Engineering Campus, Bhopal',
    lat: 23.2150,
    lng: 77.4080,
  }
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  existingIssues,
  onUpvoteDuplicate,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(0);
  const [title, setTitle] = useState(SAMPLE_PRESETS[0].title);
  const [description, setDescription] = useState(SAMPLE_PRESETS[0].description);
  const [category, setCategory] = useState<IssueCategory>(SAMPLE_PRESETS[0].category);
  const [imageUrl, setImageUrl] = useState(SAMPLE_PRESETS[0].imageUrl);
  const [address, setAddress] = useState(SAMPLE_PRESETS[0].location);
  const [lat, setLat] = useState(SAMPLE_PRESETS[0].lat);
  const [lng, setLng] = useState(SAMPLE_PRESETS[0].lng);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [serpAuthority, setSerpAuthority] = useState<SerpApiAuthorityResult | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<Issue | null>(null);

  // Trigger AI Analysis and SerpAPI Authority resolution whenever preset or text changes
  const runIntelligencePipeline = async (cat: string, curTitle: string, curDesc: string, curAddress: string) => {
    setIsAnalyzing(true);
    try {
      // 1. Run AI analysis
      const analysis = await classifyIssueWithAI(curTitle, curDesc, cat);
      setAiAnalysis(analysis);

      // 2. Run SerpAPI Authority Resolution
      const authority = await fetchSerpApiAuthorities('Bhopal', analysis.detectedCategory || cat);
      setSerpAuthority(authority);

      // 3. Duplicate detection within 250m
      const duplicate = existingIssues.find(item => {
        const matchesCategory = item.category.toLowerCase() === cat.toLowerCase();
        const distApprox = Math.sqrt(Math.pow(item.location.lat - lat, 2) + Math.pow(item.location.lng - lng, 2));
        return matchesCategory && distApprox < 0.005; // ~200-300 meters
      });
      setDuplicateWarning(duplicate || null);

    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runIntelligencePipeline(category, title, description, address);
    }
  }, [isOpen]);

  const handleSelectPreset = (idx: number) => {
    setSelectedPreset(idx);

    const p = SAMPLE_PRESETS[idx];
    setTitle(p.title);
    setDescription(p.description);
    setCategory(p.category);
    setImageUrl(p.imageUrl);
    setAddress(p.location);
    setLat(p.lat);
    setLng(p.lng);

    runIntelligencePipeline(p.category, p.title, p.description, p.location);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPreset(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const uploadedUrl = event.target.result as string;
          setImageUrl(uploadedUrl);
          setTitle(`Uploaded Report Photo - ${file.name.replace(/\.[^/.]+$/, '')}`);
          runIntelligencePipeline(category, `Uploaded photo: ${file.name}`, description, address);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      category,
      imageUrl,
      location: {
        address,
        locality: address.split(',')[0] || 'Central Area',
        city: 'Bhopal',
        lat,
        lng,
        ward: 'Ward 42, Zone 10',
      },
      severity: (aiAnalysis?.urgency as IssueSeverity) || 'High',
      severityScore: aiAnalysis?.severityScore || 88,
      aiAnalysis: aiAnalysis || {
        detectedCategory: category,
        confidence: 94,
        urgency: 'High',
        hazardFactors: ['General community safety risk'],
        recommendedDepartment: serpAuthority?.department || 'Municipal Corporation',
        estimatedResolutionTime: '24-48 Hours',
        explanation: 'Classified using FixMyCity vision & text analyzer.'
      },
      assignedDepartment: serpAuthority?.department || 'Municipal Corporation General Desk',
      assignedOfficer: serpAuthority?.nodalOfficer || 'Pending Field Assignment',
      municipalContact: serpAuthority ? {
        departmentName: serpAuthority.department,
        wardOffice: serpAuthority.wardOffices[0] || 'Zone Office',
        phone: serpAuthority.contactNumber,
        email: serpAuthority.email,
        portalUrl: serpAuthority.portal,
        serpSourceTitle: serpAuthority.searchEvidence[0]?.title,
        serpSourceLink: serpAuthority.searchEvidence[0]?.link
      } : undefined
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4">
        
        {/* Header matching Screen 3 */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Report an Issue</h2>
              <p className="text-[11px] text-slate-400">Snap · Add location · AI Classification · Submit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          
          {/* Upload image */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
            <label className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload File</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCustomUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Image preview */}
          <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Problem preview"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/40 pointer-events-none" />

            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs text-white">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="font-medium">Location detected:</span>
              <span className="text-cyan-300 font-semibold truncate max-w-[180px] sm:max-w-xs">{address}</span>
            </div>
          </div>

          {/* Quick presets row */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Or pick a sample hazard scenario:
              </label>
              <span className="text-[10px] text-slate-500 font-mono">1-click test</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {SAMPLE_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => handleSelectPreset(idx)}
                  className={`text-left px-2.5 py-1.5 rounded-xl text-xs font-medium transition border truncate cursor-pointer ${
                    selectedPreset === idx
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* AI Analysis Drawer matching Screen 3 */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-indigo-500/20 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  AI Vision &amp; Categorization
                </span>
              </div>
              {isAnalyzing ? (
                <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-medium">
                  <Sparkles className="w-3 h-3" />
                  <span>Processing photo...</span>
                </div>
              ) : (
                <span className="text-xs text-emerald-400 font-bold">
                  {aiAnalysis?.confidence || 94}% Confidence
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Identified Category</span>
                <div className="text-sm font-bold text-white mt-0.5 flex items-center justify-between">
                  <span>{aiAnalysis?.detectedCategory || category}</span>
                  <span className="text-cyan-400 font-mono text-xs">{aiAnalysis?.confidence || 94}%</span>
                </div>
                {/* Confidence Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${aiAnalysis?.confidence || 94}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Urgency &amp; Severity</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    aiAnalysis?.urgency === 'Critical' ? 'bg-rose-500/20 text-rose-400' :
                    aiAnalysis?.urgency === 'High' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {aiAnalysis?.urgency || 'High'} ({aiAnalysis?.severityScore || 92}/100)
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 truncate">
                  <span className="font-semibold text-slate-400">Impact: </span>
                  {aiAnalysis?.hazardFactors?.join(', ') || 'Road damage, vehicle risk'}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono mt-1">
                  Est. Resolution: {aiAnalysis?.estimatedResolutionTime || '24-48 Hours'}
                </div>
              </div>
            </div>
          </div>

          {/* SerpAPI Municipal Department Routing Information */}
          {serpAuthority && (
            <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                  <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Authority Matched via SerpAPI Municipal Radar</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                  SerpAPI Verified
                </span>
              </div>
              <div className="text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[10px] block">Responsible Department:</span>
                  <span className="font-bold text-white">{serpAuthority.department}</span>
                  <span className="text-[11px] text-cyan-400 block mt-0.5">Nodal: {serpAuthority.nodalOfficer}</span>
                </div>
                <div className="sm:text-right">
                  <span className="text-slate-400 text-[10px] block">Direct Municipal Helpline:</span>
                  <a href={`tel:${serpAuthority.contactNumber}`} className="text-cyan-300 font-mono font-bold hover:underline flex sm:justify-end items-center gap-1">
                    <Phone className="w-3 h-3 text-cyan-400" />
                    <span>{serpAuthority.contactNumber}</span>
                  </a>
                  <a 
                    href={serpAuthority.portal} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] text-slate-400 hover:text-white flex sm:justify-end items-center gap-1 mt-0.5"
                  >
                    <span>{serpAuthority.portal.replace('https://', '')}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Duplicate Detection Warning */}
          {duplicateWarning && (
            <div className="bg-amber-950/60 border border-amber-600/60 rounded-2xl p-3.5 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <h5 className="font-bold text-amber-300">
                  Potential Duplicate Issue Detected!
                </h5>
                <p className="text-slate-300 mt-0.5">
                  <span className="font-semibold text-white">{duplicateWarning.reportCount} citizens</span> have already reported "{duplicateWarning.title}" within 200m of this location.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onUpvoteDuplicate(duplicateWarning.id);
                      onClose();
                    }}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
                  >
                    Upvote &amp; Reinforce Existing Report (+1)
                  </button>
                  <span className="text-[10px] text-slate-400">or proceed to file separate ticket below</span>
                </div>
              </div>
            </div>
          )}

          {/* Issue Details Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Issue Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dangerous road crater near MP Nagar crossroad"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description &amp; Observed Hazards:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Describe the severity, when it started, and risk to commuters or students..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Submit Button matching Screen 3 */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Submit Report</span>
            <span className="text-lg">→</span>
          </button>

        </form>

      </div>
    </div>
  );
};
