import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { User, Bell, Lock, Shield, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { getMyProfile, updateMyProfile, uploadAvatar } from '../../../lib/api';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    bio: '',
    avatarUrl: '',
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false
  });

  useEffect(() => {
    getMyProfile()
      .then((profile: any) => {
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            fullName: profile.name || '',
            email: profile.email || '',
            bio: profile.bio || '',
            avatarUrl: profile.avatar_url || '',
          }));
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingProfile(false));
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSaved(false);
    try {
      await updateMyProfile(formData.fullName, formData.bio);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      setError(e.message || 'Could not save changes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadingAvatar(true);
    setError('');
    try {
      const avatarUrl = await uploadAvatar(file);
      setFormData((current) => ({ ...current, avatarUrl }));
    } catch (e: any) {
      setError(e.message || 'Could not upload profile photo.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  if (loadingProfile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences and profile.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
            {error && (
              <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {saved && (
              <div className="mb-6 flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md p-3">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Profile updated.</span>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <img
                      src={formData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || 'Founder')}&background=2563eb&color=fff&size=100`}
                      alt="Profile"
                      className="w-20 h-20 rounded-full ring-4 ring-slate-50 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-slate-200 hover:bg-slate-50 disabled:opacity-60"
                    >
                      {uploadingAvatar ? <Loader2 className="w-4 h-4 text-slate-600 animate-spin" /> : <User className="w-4 h-4 text-slate-600" />}
                    </button>
                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Profile Photo</h3>
                    <p className="text-sm text-slate-500">Click the icon to upload a new photo.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      title="Changing your login email requires a verification step — not available here yet."
                      className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                    <textarea
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-4">Password</h3>
                  <div className="space-y-4">
                    <button type="button" className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                      <Lock className="w-4 h-4" /> Change Password
                    </button>
                  </div>
                </div>
                <hr className="border-slate-100 my-6" />
                <div>
                  <h3 className="font-bold text-lg text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-slate-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <button type="button" className="px-4 py-2 border border-red-200 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {[
                    ['emailNotifications', 'Email Notifications', 'Receive weekly digests and updates.'],
                    ['pushNotifications', 'Push Notifications', 'Get real-time alerts on your devices.'],
                    ['marketingEmails', 'Marketing & Product Tips', 'Occasional advice on building MVPs.'],
                  ].map(([key, title, description]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div>
                        <h4 className="font-medium text-slate-900">{title}</h4>
                        <p className="text-sm text-slate-500">{description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[key as keyof typeof formData] as boolean}
                          onChange={(e) => setFormData({...formData, [key]: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 disabled:opacity-50 transition-all"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
