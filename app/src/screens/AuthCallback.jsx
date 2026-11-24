import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Loader2 } from 'lucide-react';

export function AuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const applyAuthenticatedUser = useAppStore((s) => s.applyAuthenticatedUser);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next = params.get('next') || '/';
      const result = await applyAuthenticatedUser({ nextPath: next });
      if (cancelled) return;
      if (!result.ok) {
        setError(result.error || 'Could not finish sign-in.');
        return;
      }
      navigate(result.redirectTo || '/', { replace: true });
    })();
    return () => {
      cancelled = true;
    };
  }, [applyAuthenticatedUser, navigate, params]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-3">
        <Loader2 size={22} className="animate-spin mx-auto" />
        <p className="text-sm text-stone-600">{error || 'Finishing sign-in…'}</p>
        {error && (
          <button type="button" onClick={() => navigate('/login')} className="underline text-sm">
            Back to login
          </button>
        )}
      </div>
    </div>
  );
}
