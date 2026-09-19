import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { DEMO_PARTNER_EMAIL, DEMO_PARTNER_PASSWORD } from '../lib/tenancy';
import { pageClass } from '../components/platform/ui';

export function DemoEntry() {
  const navigate = useNavigate();
  const loginPartner = useAppStore((s) => s.loginPartner);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await loginPartner({
        email: DEMO_PARTNER_EMAIL,
        password: DEMO_PARTNER_PASSWORD,
      });
      if (cancelled) return;
      if (!result.ok) {
        setError(result.error || 'Could not open the demo dashboard.');
        return;
      }
      navigate('/dashboard', { replace: true });
    })();
    return () => {
      cancelled = true;
    };
  }, [loginPartner, navigate]);

  return (
    <div className={`${pageClass} flex items-center justify-center px-5`}>
      <p className="text-sm text-stone-500">{error || 'Opening the demo dashboard…'}</p>
    </div>
  );
}
