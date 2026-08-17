import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, Building2, MapPin, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export function AddressScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const [addressType, setAddressType] = useState('home');
  const [customAddress, setCustomAddress] = useState('Plot No. 42, Unit-III, Kharabela Nagar, Bhubaneswar, Odisha');
  const [clientName, setClientName] = useState('Priya Menon');
  const [clientPhone, setClientPhone] = useState('+91 98765 43210');

  const handleProceed = () => {
    navigate('/review', {
      state: {
        ...state,
        clientName,
        clientPhone,
        location: customAddress,
        addressType
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] font-sans antialiased flex flex-col justify-between">
      {/* Top Header */}
      <header className="p-6 border-b border-stone-200 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-bold text-stone-600 hover:text-black"
        >
          <ArrowLeft size={13} />
          <span>Back</span>
        </button>
        <span className="font-serif text-lg tracking-[0.18em] font-normal uppercase text-[#111111]">
          AtEase
        </span>
        <div className="w-16" />
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-8 space-y-6">
        <div className="border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm bg-[#FFFFFF]">
          
          <div className="border-b border-stone-200 pb-4 space-y-1">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500">
              Service Location
            </span>
            <h1 className="font-serif text-2xl tracking-wide uppercase font-normal text-[#111111]">
              Where Should We Meet?
            </h1>
            <p className="text-xs text-stone-500 font-light">
              Enter your address for mobile home appointments.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setAddressType('home');
                  setCustomAddress('Plot No. 42, Unit-III, Kharabela Nagar, Bhubaneswar, Odisha');
                }}
                className={`p-3.5 border text-left transition-all ${
                  addressType === 'home'
                    ? 'border-[#111111] bg-[#111111] text-white'
                    : 'border-stone-200 bg-[#F9F9F9] text-[#111111]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase">
                  <Home size={13} />
                  <span>Residence</span>
                </div>
                <p className={`text-[10px] pt-1 truncate ${addressType === 'home' ? 'text-white/80' : 'text-stone-500'}`}>
                  Kharabela Nagar, Bhubaneswar
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAddressType('office');
                  setCustomAddress('DLF Cyber City, Tower B, Infocity, Patia, Bhubaneswar');
                }}
                className={`p-3.5 border text-left transition-all ${
                  addressType === 'office'
                    ? 'border-[#111111] bg-[#111111] text-white'
                    : 'border-stone-200 bg-[#F9F9F9] text-[#111111]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase">
                  <Building2 size={13} />
                  <span>Office / Suite</span>
                </div>
                <p className={`text-[10px] pt-1 truncate ${addressType === 'office' ? 'text-white/80' : 'text-stone-500'}`}>
                  DLF Cybercity, Patia
                </p>
              </button>
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600 mb-1">
                Full Street Address
              </label>
              <textarea
                rows="2"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                className="w-full bg-[#F9F9F9] border border-stone-200 p-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#111111] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#F9F9F9] border border-stone-200 p-2 text-xs text-[#111111] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-[#F9F9F9] border border-stone-200 p-2 text-xs font-mono text-[#111111] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleProceed}
            className="w-full bg-[#111111] text-white py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <span>Proceed to Summary</span>
            <ArrowRight size={14} />
          </button>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-stone-200 text-[10px] tracking-[0.2em] uppercase text-stone-400">
        AtEase • Discovery &amp; Direct Booking
      </footer>
    </div>
  );
}
