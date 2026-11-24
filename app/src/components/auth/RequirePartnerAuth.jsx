import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchProfile, getAuthUser, isSupabaseConfigured } from '../../lib/supabase';
import { supabase } from '../../lib/supabase/client';

export function RequirePartnerAuth({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState('checking');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    async function checkAuth() {
      if (!isSupabaseConfigured) {
        setStatus('denied');
        return;
      }
      const user = await getAuthUser();
      if (!mountedRef.current) return;
      if (!user) {
        setStatus('denied');
        return;
      }
      const profile = await fetchProfile(user.id);
      if (!mountedRef.current) return;
      setStatus(profile?.role === 'brand_owner' ? 'ok' : 'denied');
    }

    checkAuth();

    if (!supabase) return;

    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setStatus('denied');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setStatus('checking');
        checkAuth();
      }
    });

    return () => {
      mountedRef.current = false;
      subscription?.subscription?.unsubscribe();
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
