import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';

import { PlatformLanding } from './screens/PlatformLanding';
import { Signup } from './screens/Signup';
import { Onboarding } from './screens/Onboarding';
import { ProviderStorefront } from './screens/ProviderStorefront';
import { ProviderDashboard } from './screens/ProviderDashboard';
import { Login } from './screens/Login';
import { BookingReview } from './screens/BookingReview';
import { BookingSuccess } from './screens/BookingSuccess';
import { DateTimeSelection } from './screens/DateTimeSelection';
import { AddressScreen } from './screens/AddressScreen';
import { RequirePartnerAuth } from './components/auth/RequirePartnerAuth';
import { RequireActivePlan } from './components/auth/RequireActivePlan';

import { AuthModal } from './components/common/AuthModal';
import { LocationModal } from './components/common/LocationModal';
import { CartDrawer } from './components/common/CartDrawer';
import { BookingModal } from './components/common/BookingModal';
import { Toast } from './components/common/Toast';
import { AuthCallback } from './screens/AuthCallback';

function LegacyStorefrontRedirect() {
  const { providerId } = useParams();
  return <Navigate to={`/p/${providerId}`} replace />;
}

function App() {
  const location = useLocation();
  const syncAuthSession = useAppStore((s) => s.syncAuthSession);

  useEffect(() => {
    syncAuthSession();
  }, [syncAuthSession]);

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#111111] antialiased selection:bg-[#111111] selection:text-white">
      <AuthModal />
      <LocationModal />
      <CartDrawer />
      <BookingModal />
      <Toast />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PlatformLanding />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route
            path="/dashboard"
            element={
              <RequirePartnerAuth>
                <RequireActivePlan>
                  <ProviderDashboard />
                </RequireActivePlan>
              </RequirePartnerAuth>
            }
          />

          <Route path="/p/:partnerSlug" element={<ProviderStorefront />} />
          <Route path="/p/:partnerSlug/date-time" element={<DateTimeSelection />} />
          <Route path="/p/:partnerSlug/address" element={<AddressScreen />} />
          <Route path="/p/:partnerSlug/review" element={<BookingReview />} />
          <Route path="/p/:partnerSlug/success" element={<BookingSuccess />} />

          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/storefront" element={<Navigate to="/" replace />} />
          <Route path="/storefront/:providerId" element={<LegacyStorefrontRedirect />} />
          <Route path="/provider" element={<Navigate to="/dashboard" replace />} />
          <Route path="/date-time" element={<Navigate to="/" replace />} />
          <Route path="/address" element={<Navigate to="/" replace />} />
          <Route path="/review" element={<Navigate to="/" replace />} />
          <Route path="/success" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
