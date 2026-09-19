import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Home, Building2, MapPin, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { AtEaseLogo } from '../components/platform/AtEaseLogo';

export function AddressScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { partnerSlug } = useParams();
  const state = location.state || {};

  const [addressType, setAddressType] = useState('home');
  const [customAddress, setCustomAddress] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const handleProceed = () => {
    navigate(partnerSlug ? `/p/${partnerSlug}/review` : '/', {
      state: {
        ...state,
        clientName,
        clientPhone,
        location: customAddress,
        addressType,
        partnerSlug,
        partnerId: state.partnerId
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-[#1C1917] font-heroSans antialiased flex flex-col justify-between">
      {/* Top Header */}
      <header className="px-5 sm:px-8 py-5 border-b border-stone-200/70 bg-white/80 backdrop-blur-md flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[13px] text-stone-500 hover:text-[#1C1917]"
        >
          <ArrowLeft size={13} />
          <span>Back</span>
        </button>
        <AtEaseLogo className="text-xl" />
        <div className="w-16" />
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-8 space-y-6">
        <div className="rounded-[22px] border border-stone-200/70 p-6 sm:p-8 space-y-6 bg-white">
          
          <div className="space-y-1">
            <span className="text-[11px] tracking-[0.16em] uppercase text-stone-400">
              Service location
            </span>
            <h1 className="font-heroSans text-2xl font-semibold tracking-tight text-[#1C1917]">
              Where should we meet?
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
                  setCustomAddress('');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  addressType === 'home'
                    ? 'border-[#E4D9F0] bg-[#F3EEF8] text-[#4A3F5C]'
                    : 'border-stone-200 bg-[#F7F6F8] text-[#1C1917]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase">
                  <Home size={13} />
                  <span>Residence</span>
                </div>
                <p className={`text-[10px] pt-1 truncate ${addressType === 'home' ? 'text-[#6D5A8D]' : 'text-stone-500'}`}>
                  Kharabela Nagar, Bhubaneswar
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAddressType('office');
                  setCustomAddress('DLF Cyber City, Tower B, Infocity, Patia, Bhubaneswar');
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  addressType === 'office'
                    ? 'border-[#E4D9F0] bg-[#F3EEF8] text-[#4A3F5C]'
                    : 'border-stone-200 bg-[#F7F6F8] text-[#1C1917]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase">
                  <Building2 size={13} />
                  <span>Office / Suite</span>
                </div>
                <p className={`text-[10px] pt-1 truncate ${addressType === 'office' ? 'text-[#6D5A8D]' : 'text-stone-500'}`}>
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
                className="w-full bg-[#F7F6F8] border border-stone-200 rounded-2xl p-2.5 text-xs text-[#1C1917] focus:outline-none focus:border-[#D4C8E8] resize-none"
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
                  className="w-full bg-[#F7F6F8] border border-stone-200 rounded-2xl p-2.5 text-xs text-[#1C1917] focus:outline-none"
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
                  className="w-full bg-[#F7F6F8] border border-stone-200 rounded-2xl p-2.5 text-xs font-mono text-[#1C1917] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleProceed}
            className="w-full rounded-full bg-[#1C1917] text-white py-3.5 text-[13px] font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
          >
            <span>Proceed to Summary</span>
            <ArrowRight size={14} />
          </button>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-stone-200/70 text-[11px] text-stone-400 font-heroSans">
        AtEase • Discovery &amp; Direct Booking
      </footer>
    </div>
  );
}
