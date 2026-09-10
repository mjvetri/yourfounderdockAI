import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Bell, Check, Info, AlertTriangle, CheckCircle, MessageSquare, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'message';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NotificationsPage = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'success', title: 'Roadmap Generated', message: 'Your MVP roadmap for "PetWalker App" is ready.', time: '2 hours ago', read: false },
    { id: '2', type: 'message', title: 'New Message from AI', message: 'I have some suggestions for your database schema.', time: '5 hours ago', read: false },
    { id: '3', type: 'warning', title: 'Subscription Expiring', message: 'Your trial ends in 3 days. Upgrade to keep features.', time: '1 day ago', read: true },
    { id: '4', type: 'info', title: 'System Update', message: 'We have added new export features to the dashboard.', time: '2 days ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'all' ? notifications : notifications.filter(n => !n.read);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const toggleRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            Notifications
            {unreadCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{unreadCount}</span>}
          </h1>
          <p className="text-slate-500 mt-1">Stay updated with your project progress and alerts.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={markAllRead}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
                <Check className="w-4 h-4" /> Mark all as read
            </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-slate-200">
        <button 
            onClick={() => setFilter('all')}
            className={`pb-4 px-2 font-medium text-sm transition-colors ${filter === 'all' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
            All Notifications
        </button>
        <button 
            onClick={() => setFilter('unread')}
            className={`pb-4 px-2 font-medium text-sm transition-colors ${filter === 'unread' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
            Unread
        </button>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-slate-900">No notifications found</h3>
                <p className="text-slate-500">You're all caught up!</p>
            </div>
        ) : (
            filteredNotifications.map((notification) => (
                <div 
                    key={notification.id} 
                    className={`flex items-start gap-4 p-5 rounded-xl border transition-all ${
                        notification.read 
                            ? 'bg-white border-slate-200 opacity-75' 
                            : 'bg-blue-50/50 border-blue-100 shadow-sm'
                    }`}
                >
                    <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className={`text-base font-semibold ${notification.read ? 'text-slate-700' : 'text-slate-900'}`}>
                                {notification.title}
                            </h4>
                            <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{notification.time}</span>
                        </div>
                        <p className={`text-sm mt-1 ${notification.read ? 'text-slate-500' : 'text-slate-700'}`}>
                            {notification.message}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        <button 
                            onClick={() => toggleRead(notification.id)}
                            title={notification.read ? "Mark as unread" : "Mark as read"}
                            className="p-2 text-slate-400 hover:text-primary-600 rounded-full hover:bg-slate-100"
                        >
                            <div className={`w-2 h-2 rounded-full ${notification.read ? 'border border-slate-400' : 'bg-primary-600'}`}></div>
                        </button>
                        <button 
                            onClick={() => deleteNotification(notification.id)}
                            title="Delete"
                            className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-slate-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;