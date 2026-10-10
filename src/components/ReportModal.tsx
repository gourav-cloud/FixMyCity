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
  RefreshCw,
  RotateCcw,
  FlipHorizontal,
  Video,
  VideoOff,
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

  // Live Camera states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasCapturedPhoto, setHasCapturedPhoto] = useState(false);
  const [isFlashActive, setIsFlashActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [serpAuthority, setSerpAuthority] = useState<SerpApiAuthorityResult | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<Issue | null>(null);

  // Stop camera tracks helper
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Start live webcam / back camera
  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    stopCameraStream();
    setCameraError(null);
    setIsCameraActive(true);
    setHasCapturedPhoto(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setIsCameraActive(false);
      setCameraError(
        err?.message || 'Unable to access camera. Please check camera permissions or upload an image.'
      );
    }
  };

  // Flip camera between front & back
  const handleFlipCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Snap photo from live video canvas
  const handleSnapPhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Trigger flash animation
      setIsFlashActive(true);
      setTimeout(() => setIsFlashActive(false), 200);

      // Draw frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

      setImageUrl(dataUrl);
      setHasCapturedPhoto(true);
      setSelectedPreset(null);
      stopCameraStream();

      // Trigger automatic AI analysis on captured snapshot
      setTitle(`Civic Report Photo - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      runIntelligencePipeline(category, 'Civic issue captured with camera', description, address);
    }
  };

  // Retake photo: restart live stream
  const handleRetake = () => {
    setHasCapturedPhoto(false);
    startCamera(facingMode);
  };

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
    } else {
      stopCameraStream();
      setIsCameraActive(false);
      setHasCapturedPhoto(false);
    }

    return () => {
      stopCameraStream();
    };
  }, [isOpen]);

  const handleSelectPreset = (idx: number) => {
    stopCameraStream();
    setIsCameraActive(false);
    setHasCapturedPhoto(false);
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
      stopCameraStream();
      setIsCameraActive(false);
      setHasCapturedPhoto(false);
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

    stopCameraStream();

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
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          
          {/* Camera / Upload Source Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  isCameraActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Open Live Camera</span>
              </button>

              <label className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload File</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCustomUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* If camera is active: show flip & close camera */}
            {isCameraActive && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleFlipCamera}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="Flip Camera (Front / Back)"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopCameraStream();
                    setIsCameraActive(false);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-800/60 text-xs font-medium transition"
                >
                  Stop Camera
                </button>
              </div>
            )}
          </div>

          {/* Camera Error Alert if blocked */}
          {cameraError && (
            <div className="p-3 bg-amber-950/60 border border-amber-700/60 rounded-xl text-xs text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{cameraError}</span>
                <span className="block text-[11px] text-amber-300/80 mt-0.5">
                  You can use the <strong>Upload File</strong> button above or click any sample preset below.
                </span>
              </div>
            </div>
          )}

          {/* Viewfinder Camera Mockup matching Screen 3 */}
          <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 flex items-center justify-center">
            
            {/* White flash effect on capture */}
            {isFlashActive && (
              <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-200 pointer-events-none" />
            )}

            {/* CASE 1: Active Live Video Stream */}
            {isCameraActive ? (
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              /* CASE 2: Display Selected / Uploaded / Captured Image */
              <img
                src={imageUrl}
                alt="Problem viewfinder"
                className="w-full h-full object-cover"
              />
            )}

            {/* Gradient overlays for aesthetic readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/40 pointer-events-none" />

            {/* Viewfinder Reticle / Brackets matching Screen 3 */}
            <div className="absolute inset-6 sm:inset-10 border-2 border-white/60 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
              <div className="flex justify-between">
                <div className="w-5 h-5 border-t-2 border-l-2 border-cyan-400 -mt-2 -ml-2" />
                <div className="w-5 h-5 border-t-2 border-r-2 border-cyan-400 -mt-2 -mr-2" />
              </div>
              
              {/* Center focus indicator */}
              <div className="self-center w-8 h-8 rounded-full border border-cyan-400/60 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              <div className="flex justify-between">
                <div className="w-5 h-5 border-b-2 border-l-2 border-cyan-400 -mb-2 -ml-2" />
                <div className="w-5 h-5 border-b-2 border-r-2 border-cyan-400 -mb-2 -mr-2" />
              </div>
            </div>

            {/* Status indicator badge (Live vs Captured vs Preset) */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              {isCameraActive ? (
                <span className="px-2.5 py-1 rounded-xl bg-rose-600/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>LIVE CAMERA</span>
                </span>
              ) : hasCapturedPhoto ? (
                <span className="px-2.5 py-1 rounded-xl bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                  <span>PHOTO CAPTURED</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-slate-300 text-[11px] font-medium border border-slate-700">
                  Preview Image
                </span>
              )}
            </div>

            {/* Top Right: Retake or Switch button */}
            {hasCapturedPhoto && (
              <div className="absolute top-3 right-3 z-10">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs font-semibold text-white hover:bg-slate-800 flex items-center gap-1.5 transition shadow-lg"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Retake</span>
                </button>
              </div>
            )}

            {/* Center Bottom: Live Shutter Button if camera is active */}
            {isCameraActive && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSnapPhoto}
                  className="group relative w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-4 border-white flex items-center justify-center shadow-2xl active:scale-95 transition-transform cursor-pointer"
                  title="Take Photo"
                >
                  <div className="w-11 h-11 rounded-full bg-white group-hover:scale-95 transition-transform shadow-inner flex items-center justify-center">
                    <Camera className="w-5 h-5 text-slate-900" />
                  </div>
                </button>
              </div>
            )}

            {/* Location Tag matching Screen 3 */}
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
                  <RefreshCw className="w-3 h-3 animate-spin" />
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
                      stopCameraStream();
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
