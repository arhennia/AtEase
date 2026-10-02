import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchProfile, getAuthUser, isSupabaseConfigured } from '../../lib/supabase';

export function RequirePartnerAuth({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isSupabaseConfigured) {
        if (!cancelled) setStatus('denied');
        return;
      }
      const user = await getAuthUser();
      if (!user) {
        if (!cancelled) setStatus('denied');
        return;
      }
      const profile = await fetchProfile(user.id);
      if (cancelled) return;
      setStatus(profile?.role === 'brand_owner' ? 'ok' : 'denied');
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-stone-500">
        Checking your session…
      </div>
    );
  }
  if (status !== 'ok') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
