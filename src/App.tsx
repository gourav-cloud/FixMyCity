/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  fetchIssues, 
  createIssue as apiCreateIssue, 
  upvoteIssue as apiUpvoteIssue, 
  verifyIssue as apiVerifyIssue, 
  updateIssue as apiUpdateIssue 
} from './services/api';
import { Issue } from './types';
import { Header } from './components/Header';
import { HomeFeed } from './components/HomeFeed';
import { NearbyIssues } from './components/NearbyIssues';
import { PublicMap } from './components/PublicMap';
import { ReportModal } from './components/ReportModal';
import { IssueDetailModal } from './components/IssueDetailModal';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { UserProfileModal } from './components/UserProfileModal';
import { SerpApiExplorer } from './components/SerpApiExplorer';
import { NotificationsDropdown, NotificationItem } from './components/NotificationsDropdown';
import { WelcomeScreen } from './components/WelcomeScreen';
import { 
  Home, 
  MapPin, 
  Plus, 
  FileText, 
  User, 
  ShieldCheck, 
  Globe2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activeView, setActiveView] = useState<'home' | 'nearby' | 'map' | 'reports' | 'authority' | 'serpapi'>('home');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState('Bhopal (MP Nagar & City)');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Ticket Forwarded to PWD Zone 10',
      message: 'Your report regarding the Pothole on Chetak Bridge has been routed via SerpAPI to BMC Road Maintenance.',
      time: '10m ago',
      read: false,
      type: 'status',
      issueId: 'iss-1'
    },
    {
      id: 'notif-2',
      title: '3 Citizens Verified Your Report',
      message: 'Multiple commuters in MP Nagar confirmed the Open Drain hazard.',
      time: '1h ago',
      read: false,
      type: 'duplicate',
      issueId: 'iss-2'
    },
    {
      id: 'notif-3',
      title: 'Resolution Ready for Confirmation',
      message: 'Broken Streetlight at Kolar Road marked resolved by BMC. Please confirm!',
      time: '3h ago',
      read: false,
      type: 'resolve',
      issueId: 'iss-4'
    },
    {
      id: 'notif-4',
      title: 'SerpAPI Civic Radar Alert',
      message: 'BMC announced deployment of automated asphalt jetpatchers for Ward 42.',
      time: '1d ago',
      read: true,
      type: 'serpapi'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load issues on mount
  useEffect(() => {
    fetchIssues().then((data) => {
      if (data && data.length > 0) {
        setIssues(data);
      }
    });
  }, []);

  // Handle report creation
  const handleCreateIssue = async (newIssueData: Partial<Issue>) => {
    try {
      const created = await apiCreateIssue(newIssueData);
      setIssues(prev => [created, ...prev]);
      showToast('Report submitted successfully! Classified by AI & routed to authority.');
      
      // Add notification
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'New Complaint Logged',
        message: `Your ticket "${created.title}" is registered under ${created.assignedDepartment}.`,
        time: 'Just now',
        read: false,
        type: 'status',
        issueId: created.id
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      showToast('Issue created locally.');
    }
  };

  // Handle upvote / reinforce duplicate
  const handleUpvote = async (issueId: string) => {
    try {
      const updated = await apiUpvoteIssue(issueId);
      setIssues(prev => prev.map(i => i.id === issueId ? updated : i));
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(updated);
      }
      showToast('Upvoted! Priority reinforced for municipal team.');
    } catch (err) {
      // Local fallback
      setIssues(prev => prev.map(i => {
        if (i.id === issueId) {
          return { ...i, reportCount: i.reportCount + 1, severityScore: Math.min(100, i.severityScore + 3) };
        }
        return i;
      }));
      showToast('Priority upvoted (+1).');
    }
  };

  // Handle verify (either active hazard confirmation or resolution confirmation)
  const handleVerify = async (issueId: string, isResolvedVerification = false, note = '') => {
    try {
      const updated = await apiVerifyIssue(issueId, isResolvedVerification, note);
      setIssues(prev => prev.map(i => i.id === issueId ? updated : i));
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(updated);
      }
      if (isResolvedVerification) {
        showToast('Resolution confirmed! Issue marked as Citizen Confirmed.');
      } else {
        showToast('Thank you! Community verification recorded.');
      }
    } catch (err) {
      setIssues(prev => prev.map(i => {
        if (i.id === issueId) {
          return {
            ...i,
            verifiedCount: i.verifiedCount + 1,
            status: isResolvedVerification ? 'Citizen Confirmed' : i.status
          };
        }
        return i;
      }));
      showToast('Verification recorded.');
    }
  };

  // Handle authority updates (assign, change status, add proof)
  const handleUpdateIssue = async (
    issueId: string,
    updates: {
      status?: string;
      assignedDepartment?: string;
      assignedOfficer?: string;
      resolutionProofImage?: string;
      note?: string;
    }
  ) => {
    try {
      const updated = await apiUpdateIssue(issueId, updates);
      setIssues(prev => prev.map(i => i.id === issueId ? updated : i));
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(updated);
      }
      showToast(`Ticket updated to ${updates.status || 'Assigned'}.`);
    } catch (err) {
      setIssues(prev => prev.map(i => {
        if (i.id === issueId) {
          return {
            ...i,
            ...(updates.status ? { status: updates.status as any } : {}),
            ...(updates.assignedDepartment ? { assignedDepartment: updates.assignedDepartment } : {}),
            ...(updates.assignedOfficer ? { assignedOfficer: updates.assignedOfficer } : {}),
            ...(updates.resolutionProofImage ? { resolutionProofImage: updates.resolutionProofImage } : {})
          };
        }
        return i;
      }));
      showToast('Ticket updated.');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 pb-20 lg:pb-0">
      
      {/* Welcome Screen / Onboarding (Optional trigger) */}
      {showWelcome && (
        <WelcomeScreen
          onGetStarted={() => setShowWelcome(false)}
          onLogin={() => setShowWelcome(false)}
        />
      )}

      {/* Main Top Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        notificationCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        currentCity={currentCity}
        setCurrentCity={setCurrentCity}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
      />

      {/* Toast Notification Bar */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-cyan-900/95 border border-cyan-500/60 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Body Views */}
      <main className="flex-1 w-full">
        {isAdminMode || activeView === 'authority' ? (
          <AuthorityDashboard
            issues={issues}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onUpdateIssue={handleUpdateIssue}
            onOpenSerpApiExplorer={() => setActiveView('serpapi')}
          />
        ) : activeView === 'home' ? (
          <HomeFeed
            issues={issues}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onNavigate={(view) => {
              if (view === 'reports') {
                setIsProfileOpen(true);
              } else {
                setActiveView(view);
              }
            }}
            onOpenProfile={() => setIsProfileOpen(true)}
            userName="Gaurav"
          />
        ) : activeView === 'nearby' ? (
          <NearbyIssues
            issues={issues}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onBack={() => setActiveView('home')}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        ) : activeView === 'map' ? (
          <PublicMap
            issues={issues}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onVerifyIssue={(id) => handleVerify(id, false)}
          />
        ) : activeView === 'serpapi' ? (
          <SerpApiExplorer
            currentCity={currentCity}
          />
        ) : (
          <HomeFeed
            issues={issues}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onNavigate={(view) => setActiveView(view)}
            onOpenProfile={() => setIsProfileOpen(true)}
            userName="Gaurav"
          />
        )}
      </main>

      {/* Report Modal Flow matching Screen 3 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateIssue}
        existingIssues={issues}
        onUpvoteDuplicate={handleUpvote}
      />

      {/* Issue Detail Modal matching Screen 7 */}
      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onVerify={handleVerify}
        onUpvote={handleUpvote}
        isAdminMode={isAdminMode}
        onOpenAssignModal={(issue) => {
          setIsAdminMode(true);
          setActiveView('authority');
        }}
      />

      {/* User Profile Modal matching Screen 8 */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        issues={issues}
        onSelectIssue={(issue) => setSelectedIssue(issue)}
      />

      {/* Notifications Dropdown */}
      <NotificationsDropdown
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onSelectNotification={(item) => {
          if (item.issueId) {
            const found = issues.find(i => i.id === item.issueId);
            if (found) setSelectedIssue(found);
          }
        }}
        onMarkAllAsRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
      />

      {/* Bottom Navigation Bar for Mobile matching all 8 screens */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 lg:hidden px-4 py-2">
        <div className="flex items-center justify-around">
          
          <button
            onClick={() => { setActiveView('home'); setIsAdminMode(false); }}
            className={`flex flex-col items-center gap-1 py-1 transition ${
              activeView === 'home' && !isAdminMode ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          <button
            onClick={() => { setActiveView('map'); setIsAdminMode(false); }}
            className={`flex flex-col items-center gap-1 py-1 transition ${
              activeView === 'map' && !isAdminMode ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-medium">Map</span>
          </button>

          {/* Center Floating Report Button matching screenshot */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/40 active:scale-95 transition-transform"
            title="Report Issue"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button
            onClick={() => { setActiveView('nearby'); setIsAdminMode(false); }}
            className={`flex flex-col items-center gap-1 py-1 transition ${
              activeView === 'nearby' && !isAdminMode ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] font-medium">Reports</span>
          </button>

          <button
            onClick={() => setIsProfileOpen(true)}
            className={`flex flex-col items-center gap-1 py-1 transition ${
              isProfileOpen ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>

        </div>
      </div>

    </div>
  );
}
