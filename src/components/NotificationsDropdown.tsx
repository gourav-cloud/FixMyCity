import React from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Clock, 
  X, 
  ChevronRight,
  Globe2 
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'status' | 'duplicate' | 'resolve' | 'serpapi';
  issueId?: string;
}

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onSelectNotification: (item: NotificationItem) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectNotification,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={onClose}>
      <div 
        className="absolute top-16 right-4 sm:right-16 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-4 space-y-3 animate-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Civic Notifications
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
          {notifications.map((n) => {
            return (
              <div
                key={n.id}
                onClick={() => {
                  onSelectNotification(n);
                  onClose();
                }}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                  n.read
                    ? 'bg-slate-950/60 border-slate-850 opacity-75'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {n.type === 'status' && <Clock className="w-4 h-4 text-amber-400" />}
                  {n.type === 'duplicate' && <Users className="w-4 h-4 text-cyan-400" />}
                  {n.type === 'resolve' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {n.type === 'serpapi' && <Globe2 className="w-4 h-4 text-blue-400" />}
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-white truncate">{n.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">{n.time}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                    {n.message}
                  </p>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="text-center py-6 text-slate-500 text-xs">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
