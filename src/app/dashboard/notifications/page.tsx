import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { CheckCircle2, MessageSquare, Info, Trash2, Check, Loader2, Bell, AlertCircle } from 'lucide-react';
import { listNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from '../../../lib/api';

interface Notification {
  id: string;
  type: 'roadmap' | 'chat' | 'task' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

const ICONS: Record<string, { Icon: typeof Info; color: string }> = {
  roadmap: { Icon: CheckCircle2, color: 'text-green-500' },
  chat: { Icon: MessageSquare, color: 'text-blue-500' },
  task: { Icon: CheckCircle2, color: 'text-green-500' },
  system: { Icon: Info, color: 'text-slate-400' },
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listNotifications()
      .then((data: any) => setNotifications((data ?? []) as Notification[]))
      .catch((e) => setError(e.message || 'Unable to load notifications.'))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const visible = filter === 'unread' ? notifications.filter((notification) => !notification.read) : notifications;

  const handleMarkAllRead = async () => {
    setNotifications((previous) => previous.map((notification) => ({ ...notification, read: true })));
    try {
      await markAllNotificationsRead();
    } catch (e: any) {
      setError(e.message || 'Unable to mark notifications as read.');
    }
  };

  const handleMarkRead = async (id: string) => {
    setNotifications((previous) => previous.map((notification) => notification.id === id ? { ...notification, read: true } : notification));
    try {
      await markNotificationRead(id);
    } catch (e: any) {
      setError(e.message || 'Unable to update notification.');
    }
  };

  const handleDelete = async (id: string) => {
    setNotifications((previous) => previous.filter((notification) => notification.id !== id));
    try {
      await deleteNotification(id);
    } catch (e: any) {
      setError(e.message || 'Unable to delete notification.');
    }
  };

  if (loading) {
    return <DashboardLayout><div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-primary-600" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && <span className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{unreadCount}</span>}
          </h1>
          <p className="text-slate-500 mt-1">Stay updated with your project progress and alerts.</p>
        </div>
        <button type="button" onClick={handleMarkAllRead} disabled={unreadCount === 0} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
          <Check className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      {error && <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3"><AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>{error}</span></div>}

      <div className="flex gap-6 border-b border-slate-200 mb-6">
        {(['all', 'unread'] as const).map((value) => (
          <button key={value} type="button" onClick={() => setFilter(value)} className={`pb-3 text-sm font-medium border-b-2 capitalize ${filter === value ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500'}`}>
            {value === 'all' ? 'All Notifications' : 'Unread'}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm"><Bell className="w-10 h-10 mx-auto mb-3 text-slate-300" />{filter === 'unread' ? "You're all caught up." : 'No notifications yet.'}</div>
      ) : (
        <div className="space-y-3">
          {visible.map((notification) => {
            const { Icon, color } = ICONS[notification.type] || ICONS.system;
            return (
              <div key={notification.id} onClick={() => !notification.read && handleMarkRead(notification.id)} className={`flex items-start justify-between gap-4 p-4 rounded-xl border cursor-pointer ${notification.read ? 'bg-white border-slate-200' : 'bg-primary-50/50 border-primary-100'}`}>
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${color}`} />
                  <div><h4 className="font-bold text-sm text-slate-900">{notification.title}</h4><p className="text-sm text-slate-600">{notification.message}</p></div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0"><span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo(notification.created_at)}</span>{!notification.read && <span className="w-2 h-2 rounded-full bg-primary-600" />}<button type="button" onClick={(event) => { event.stopPropagation(); handleDelete(notification.id); }} aria-label={`Delete ${notification.title}`} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default NotificationsPage;
