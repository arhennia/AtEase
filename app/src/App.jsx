import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Screens
import { ClientHome } from './screens/ClientHome';
import { ProviderStorefront } from './screens/ProviderStorefront';
import { ProviderDashboard } from './screens/ProviderDashboard';
import { Login } from './screens/Login';
import { BookingReview } from './screens/BookingReview';
import { BookingSuccess } from './screens/BookingSuccess';
import { DateTimeSelection } from './screens/DateTimeSelection';
import { AddressScreen } from './screens/AddressScreen';

// Global Modals & Notifications
import { AuthModal } from './components/common/AuthModal';
import { LocationModal } from './components/common/LocationModal';
import { CartDrawer } from './components/common/CartDrawer';
import { BookingModal } from './components/common/BookingModal';
import { Toast } from './components/common/Toast';

function App() {
  const location = useLocation();

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#111111] antialiased selection:bg-[#111111] selection:text-white">
      {/* Central Global Modals and Notification Components */}
      <AuthModal />
      <LocationModal />
      <CartDrawer />
      <BookingModal />
      <Toast />

      {/* Routes */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Client Discovery Layer */}
          <Route path="/" element={<ClientHome />} />
          <Route path="/home" element={<ClientHome />} />

          {/* Provider Public Storefront Experience */}
          <Route path="/storefront" element={<ProviderStorefront />} />
          <Route path="/storefront/:providerId" element={<ProviderStorefront />} />

          {/* Provider Turnkey SaaS Dashboard */}
          <Route path="/provider" element={<ProviderDashboard />} />
          <Route path="/dashboard" element={<ProviderDashboard />} />

          {/* Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Booking & Review Secondary Routes */}
          <Route path="/date-time" element={<DateTimeSelection />} />
          <Route path="/address" element={<AddressScreen />} />
          <Route path="/review" element={<BookingReview />} />
          <Route path="/success" element={<BookingSuccess />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
