import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export function RequirePartnerAuth({ children }) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const userRole = useAppStore((s) => s.userRole);
  const location = useLocation();

  if (!isAuthenticated || userRole !== 'partner') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
