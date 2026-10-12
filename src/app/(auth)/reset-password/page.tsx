import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, Lock } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { updatePassword } from '../../../lib/api';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'checking' | 'ready' | 'invalid'>('checking');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setStatus(data.session ? 'ready' : 'invalid'));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) return setError('Password must be at least 6 characters long.');
    setError('');
    setSaving(true);
    try {
      await updatePassword(password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Could not update your password.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'checking') return <div className="min-h-screen grid place-items-center bg-slate-50"><Loader2 className="h-6 w-6 animate-spin text-primary-600" /></div>;
  if (status === 'invalid') return <div className="min-h-screen grid place-items-center bg-slate-50 px-4"><div className="max-w-md rounded-lg border bg-white p-6 text-center shadow-sm"><AlertCircle className="mx-auto mb-3 h-7 w-7 text-red-500" /><h1 className="font-bold text-slate-900">This reset link is invalid or expired.</h1><Link to="/login" className="mt-4 inline-block text-sm font-medium text-primary-600">Return to sign in</Link></div></div>;

  return <div className="min-h-screen grid place-items-center bg-slate-50 px-4"><form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm"><h1 className="text-2xl font-bold text-slate-900">Choose a new password</h1><p className="mt-2 text-sm text-slate-600">Use at least six characters.</p>{error && <p className="mt-4 text-sm text-red-600">{error}</p>}<label className="mt-6 block text-sm font-medium text-slate-700" htmlFor="new-password">New password</label><div className="relative mt-1"><Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" /><input id="new-password" type="password" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-3" /></div><button disabled={saving} className="mt-6 flex w-full justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Update password'}</button></form></div>;
};

export default ResetPasswordPage;
