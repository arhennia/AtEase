import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('CLIENT'); // 'CLIENT' | 'PROVIDER'
  const [step, setStep] = useState('PHONE'); // 'PHONE' | 'OTP'
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [errorNotice, setErrorNotice] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      setErrorNotice('Please enter a valid phone number.');
      return;
    }
    setErrorNotice('');
    setStep('OTP');
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = () => {
    const code = otp.join('');
    if (code.length < 4) {
      setErrorNotice('Please enter 4-digit OTP.');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (role === 'PROVIDER') {
        navigate('/provider');
      } else {
        navigate('/home');
      }
    }, 600);
  };

  return (
    <div className="bg-surface h-screen w-full relative overflow-hidden font-body-md text-on-surface antialiased">
      {/* Mock Background Content (Blurred/Dimmed by Scrim) */}
      <div 
        className="w-full h-full absolute inset-0 -z-10 bg-cover bg-center transition-all duration-700 filter brightness-90" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCdVC1j6EEOBGLeDVJeedRgKoO505w1lmnr_UY01V7tGVyHrPQrcZ1rOdqB5nDCDHwWwcMs4lEjHs90X7ytF2cCfp72pZEnYPAiqVxHtzdBtO1V8uyBmtXqTCj25JQ9KvZKfjajOFPk-6UxbptMMWBiz32BfQVYTgXeMcKAyWd3EE6RnZNgH8gj2wOUa_daGpx7GaGuBottipVjO1k7Z2lB7iOVmGzq1ybUvRLxMrVKKRCYOxf2fhph')" }}
      >
      </div>

      {/* Scrim Overlay */}
      <div className="fixed inset-0 scrim-bg z-40 flex flex-col justify-end p-0 md:p-6">
        
        {/* Bottom Sheet Modal */}
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-on-primary w-full md:w-[480px] md:mx-auto rounded-t-sheet md:rounded-b-sheet border-t border-primary md:border slide-up min-h-[460px] flex flex-col z-50 shadow-2xl overflow-hidden"
        >
          {/* Top Drag Handle (Mobile) */}
          <div className="w-full flex justify-center py-3 bg-surface-container-low">
            <div className="w-12 h-1 bg-surface-variant rounded-full md:hidden"></div>
          </div>

          {/* Persona Role Switcher Header */}
          <div className="flex border-b border-surface-variant bg-surface-container-low text-xs">
            <button 
              onClick={() => setRole('CLIENT')}
              className={`flex-1 py-3 font-label-caps text-center transition-colors flex items-center justify-center gap-1.5 ${
                role === 'CLIENT' 
                  ? 'border-b-2 border-primary text-primary font-bold bg-white' 
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
              Client (Book Services)
            </button>
            <button 
              onClick={() => setRole('PROVIDER')}
              className={`flex-1 py-3 font-label-caps text-center transition-colors flex items-center justify-center gap-1.5 ${
                role === 'PROVIDER' 
                  ? 'border-b-2 border-primary text-primary font-bold bg-white' 
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              Provider Partner (SaaS)
            </button>
          </div>

          {/* Content Container */}
          <div className="px-margin-mobile md:px-margin-desktop py-6 flex-grow flex flex-col">
            
            {errorNotice && (
              <div className="mb-4 p-2 bg-error-container text-on-error-container text-xs text-center rounded">
                {errorNotice}
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === 'PHONE' ? (
                <motion.div 
                  key="phone-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-grow flex flex-col"
                >
                  {/* Header */}
                  <div className="mb-stack-md text-center">
                    <h2 className="font-headline-sm text-headline-sm text-primary mb-2 font-medium">
                      {role === 'PROVIDER' ? 'Provider Partner Access' : 'Verify Your Number'}
                    </h2>
                    <p className="font-body-md text-body-md text-secondary">
                      {role === 'PROVIDER' 
                        ? 'Enter phone number to access studio manager & subscription.' 
                        : 'Enter phone number to receive instant booking updates.'}
                    </p>
                  </div>

                  {/* Input Group */}
                  <div className="mb-stack-xl flex-grow">
                    <div className="flex items-center border-b border-primary py-2 group focus-within:border-primary transition-colors">
                      <div className="flex items-center pr-3 border-r border-surface-variant text-primary font-body-lg text-body-lg">
                        <select 
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="bg-transparent border-none focus:ring-0 cursor-pointer font-medium text-primary text-sm pr-1"
                        >
                          <option value="+91">+91</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                          <option value="+971">+971</option>
                        </select>
                      </div>
                      <input 
                        type="tel"
                        autoComplete="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-3 bg-transparent border-none focus:ring-0 font-body-lg text-body-lg text-primary placeholder:text-secondary-fixed-dim outline-none" 
                        placeholder="98765 43210" 
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <button 
                      onClick={handleSendOtp}
                      className="w-full bg-primary text-on-primary font-button-text text-button-text py-4 flex items-center justify-center tracking-widest hover:bg-surface-tint transition-colors duration-200 mb-6 font-semibold uppercase"
                    >
                      SEND OTP
                    </button>

                    {/* Footer */}
                    <p className="text-center text-[11px] text-secondary font-body-md leading-tight">
                      By continuing, you agree to At Ease's <br className="md:hidden"/>
                      <a className="underline hover:text-primary transition-colors" href="#">Terms</a> &amp; 
                      <a className="underline hover:text-primary transition-colors ml-1" href="#">Privacy Policy</a>.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-grow flex flex-col"
                >
                  {/* Header */}
                  <div className="mb-stack-md text-center">
                    <button 
                      onClick={() => setStep('PHONE')}
                      className="text-xs text-secondary hover:text-primary mb-2 flex items-center justify-center gap-1 mx-auto"
                    >
                      <span className="material-symbols-outlined text-[14px]">arrow_back</span> Edit Number ({countryCode} {phoneNumber})
                    </button>
                    <h2 className="font-headline-sm text-headline-sm text-primary mb-2 font-medium">Enter 4-Digit OTP</h2>
                    <p className="font-body-md text-body-md text-secondary">
                      Sent via SMS to <span className="text-primary font-medium">{countryCode} {phoneNumber}</span>
                    </p>
                  </div>

                  {/* OTP Inputs */}
                  <div className="mb-stack-xl flex justify-center gap-3">
                    {otp.map((digit, idx) => (
                      <input 
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-12 h-14 text-center text-xl font-bold border-b-2 border-primary focus:border-black bg-surface-container-low outline-none transition-colors"
                      />
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <button 
                      onClick={handleVerifyOtp}
                      disabled={isVerifying}
                      className="w-full bg-primary text-on-primary font-button-text text-button-text py-4 flex items-center justify-center tracking-widest hover:bg-surface-tint transition-colors duration-200 mb-4 font-semibold uppercase disabled:opacity-50"
                    >
                      {isVerifying ? 'VERIFYING...' : `LOG IN AS ${role}`}
                    </button>

                    <button 
                      onClick={() => setStep('PHONE')}
                      className="w-full text-center text-xs text-secondary hover:text-primary py-1"
                    >
                      Resend Code in 00:24
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
