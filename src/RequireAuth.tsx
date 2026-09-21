import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from './lib/supabaseClient';

// Wrap any route element in this to require a logged-in Supabase session.
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<'checking' | 'authed' | 'guest'>('checking');

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setStatus(data.session ? 'authed' : 'guest');
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'authed' : 'guest');
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
      </div>
    );
  }

  if (status === 'guest') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
