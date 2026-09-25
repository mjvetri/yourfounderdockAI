import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { User, Bell, Lock, Shield, Save, Loader2, AlertCircle, CheckCircle, Camera, ChevronRight, Mail, Trash2 } from 'lucide-react';
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
      <div className="mb-8 flex flex-col gap-2 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Workspace preferences</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Shape how YourFounderDock works for you.</p>
        </div>
        <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Account connected
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-8">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="mb-2 px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Account</p>
          </div>
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${activeTab === tab.id ? 'bg-white text-primary-600 shadow-sm' : 'bg-slate-100 text-slate-500 group-hover:text-slate-700'}`}>
                  <tab.icon className="h-4 w-4" />
                </span>
                <span className="flex-1">{tab.label}</span>
                <ChevronRight className={`h-4 w-4 ${activeTab === tab.id ? 'text-primary-500' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-slate-900 p-4 text-white">
            <p className="text-xs font-semibold text-white/70">Founder profile</p>
            <p className="mt-1 text-sm font-medium">Keep your workspace personal and current.</p>
          </div>
        </aside>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">{tabs.find((tab) => tab.id === activeTab)?.label}</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {activeTab === 'profile' ? 'Your public profile' : activeTab === 'account' ? 'Account access' : 'Notification preferences'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {activeTab === 'profile' ? 'This information helps your founder workspace feel like yours.' : activeTab === 'account' ? 'Review security options and account-level actions.' : 'Choose which updates deserve your attention.'}
            </p>
          </div>

          <div className="p-5 sm:p-8">
            {error && (
              <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {saved && (
              <div className="mb-6 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>Profile updated.</span>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                    <img
                      src={formData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || 'Founder')}&background=2563eb&color=fff&size=100`}
                      alt="Profile"
                      className="h-20 w-20 rounded-2xl object-cover shadow-sm ring-4 ring-white"
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute -bottom-2 -right-2 rounded-lg border border-slate-200 bg-white p-2 text-primary-600 shadow-sm hover:bg-primary-50 disabled:opacity-60"
                      aria-label="Upload profile photo"
                    >
                      {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    </button>
                    <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Profile image</p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">Make it recognizably you</h3>
                      <p className="mt-1 text-sm text-slate-500">Use a square image for the cleanest result.</p>
                    </div>
                  </div>
                  <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Visible to your team</span>
                </div>

                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="h-8 w-1 rounded-full bg-primary-600" />
                    <div>
                      <h3 className="font-bold text-slate-900">Personal details</h3>
                      <p className="text-sm text-slate-500">The basics your workspace uses to identify you.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Display name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Login email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      title="Changing your login email requires a verification step — not available here yet."
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-3 text-sm text-slate-500 outline-none"
                    />
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400"><Mail className="h-3.5 w-3.5" /> Login email is managed securely.</p>
                  </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Founder note</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell your future collaborators what you are building..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                  />
                  <p className="mt-2 text-xs text-slate-400">A short introduction helps keep collaboration focused.</p>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-5">
                <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Lock className="h-5 w-5" /></span>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">Password and sign-in</h3>
                    <p className="mt-1 text-sm text-slate-500">Keep access to your founder workspace protected.</p>
                    <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      Change password <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50/50 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-600"><Trash2 className="h-5 w-5" /></span>
                  <div>
                    <h3 className="font-bold text-red-700">Close workspace account</h3>
                    <p className="mt-1 text-sm text-red-600/80">This permanently removes your account and saved founder data.</p>
                    <button type="button" className="mt-4 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">Delete account</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-3">
                <div className="mb-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Choose the rhythm that keeps you informed without adding noise.</div>
                <div className="space-y-3">
                  {[
                    ['emailNotifications', 'Email Notifications', 'Receive weekly digests and updates.'],
                    ['pushNotifications', 'Push Notifications', 'Get real-time alerts on your devices.'],
                    ['marketingEmails', 'Marketing & Product Tips', 'Occasional advice on building MVPs.'],
                  ].map(([key, title, description]) => (
                    <div key={key} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300">
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

            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
              <p className="hidden text-xs text-slate-400 sm:block">Changes are saved to your secure workspace.</p>
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 focus:ring-4 focus:ring-primary-100 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
