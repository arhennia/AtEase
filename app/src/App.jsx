import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ClientHome } from './screens/ClientHome';
import { ProviderStorefront } from './screens/ProviderStorefront';
import { Login } from './screens/Login';
import { OtpVerification } from './screens/OtpVerification';
import { ProviderDashboard } from './screens/ProviderDashboard';
import { ServiceDetails } from './screens/ServiceDetails';
import { DateTimeSelection } from './screens/DateTimeSelection';
import { AddressScreen } from './screens/AddressScreen';
import { BookingReview } from './screens/BookingReview';
import { BookingSuccess } from './screens/BookingSuccess';
import { CreateAccount } from './screens/CreateAccount';
import { Splash } from './screens/Splash';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Client Discovery Discovery Platform */}
        <Route path="/" element={<ClientHome />} />
        <Route path="/home" element={<ClientHome />} />
        <Route path="/splash" element={<Splash />} />
        
        {/* Provider Storefront Experience */}
        <Route path="/storefront" element={<ProviderStorefront />} />
        <Route path="/storefront/:providerId" element={<ProviderStorefront />} />

        {/* Authentication Sheet (Dual Role Client & Provider Login) */}
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OtpVerification />} />

        {/* Provider Partner SaaS Dashboard & Catalog / Schedule Manager */}
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/dashboard" element={<ProviderDashboard />} />

        {/* Secondary / Booking Flow Routes */}
        <Route path="/service" element={<ServiceDetails />} />
        <Route path="/date-time" element={<DateTimeSelection />} />
        <Route path="/address" element={<AddressScreen />} />
        <Route path="/review" element={<BookingReview />} />
        <Route path="/success" element={<BookingSuccess />} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
