import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Splash } from './screens/Splash';
import { Home } from './screens/Home';
import { Login } from './screens/Login';
import { OtpVerification } from './screens/OtpVerification';
import { ServiceDetails } from './screens/ServiceDetails';
import { DateTimeSelection } from './screens/DateTimeSelection';
import { AddressScreen } from './screens/AddressScreen';
import { BookingReview } from './screens/BookingReview';
import { BookingSuccess } from './screens/BookingSuccess';
import { Layout } from './components/Layout';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/service" element={<ServiceDetails />} />
        <Route path="/date-time" element={<DateTimeSelection />} />
        <Route path="/address" element={<AddressScreen />} />
        <Route path="/review" element={<BookingReview />} />
        <Route path="/success" element={<BookingSuccess />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
