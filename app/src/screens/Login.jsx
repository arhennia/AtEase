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
      setErrorNotice('PLEASE ENTER A VALID PHONE NUMBER.');
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

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = () => {
    const code = otp.join('');
    if (code.length < 4) {
      setErrorNotice('PLEASE ENTER 4-DIGIT OTP.');
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
    <div className="bg-white h-screen w-full relative overflow-hidden font-sans text-black antialiased flex items-center justify-center">
      
      {/* Editorial Backdrop Image */}
      <div 
        className="w-full h-full absolute inset-0 -z-10 bg-cover bg-center filter grayscale contrast-125 opacity-15" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200')" }}
      >
      </div>

      {/* Scrim Container */}
      <div className="fixed inset-0 bg-white/70 backdrop-blur-md z-40 flex flex-col justify-end md:justify-center items-center p-0 md:p-6">
        
        {/* Minimal ZARA Style Modal */}
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white w-full md:max-w-md md:mx-auto border-t md:border border-black min-h-[500px] flex flex-col justify-between p-8 md:p-12 shadow-2xl relative"
        >
          {/* Top Brand Title */}
          <div className="text-center border-b border-black pb-4">
            <h1 className="font-serif text-2xl tracking-[0.2em] uppercase font-normal text-black">
              AT EASE
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-black/50 mt-1">
              AUTHENTICATION & ACCESS
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="flex border-b border-black/20 text-[11px] tracking-[0.2em] uppercase font-medium">
            <button 
              onClick={() => setRole('CLIENT')}
              className={`flex-1 py-3 text-center transition-all ${
                role === 'CLIENT' 
                  ? 'border-b-2 border-black font-bold text-black' 
                  : 'text-black/40 hover:text-black'
              }`}
            >
              CLIENT
            </button>
            <button 
              onClick={() => setRole('PROVIDER')}
              className={`flex-1 py-3 text-center transition-all ${
                role === 'PROVIDER' 
                  ? 'border-b-2 border-black font-bold text-black' 
                  : 'text-black/40 hover:text-black'
              }`}
            >
              PROVIDER
            </button>
          </div>

          {/* Content Step */}
          <div className="py-6 flex-grow flex flex-col justify-between">
            {errorNotice && (
              <div className="mb-4 text-[10px] tracking-[0.2em] uppercase text-red-600 text-center">
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
                  className="flex-grow flex flex-col justify-between"
                >
                  <div className="text-center space-y-2">
                    <h2 className="text-sm tracking-[0.25em] uppercase font-bold text-black">
                      {role === 'PROVIDER' ? 'PROVIDER PARTNER ACCESS' : 'VERIFY YOUR NUMBER'}
                    </h2>
                    <p className="text-xs tracking-wider text-black/60 font-light">
                      ENTER MOBILE NUMBER TO CONTINUE
                    </p>
                  </div>

                  {/* Underlined Phone Input */}
                  <div className="my-auto py-6">
                    <div className="flex items-center border-b border-black py-2">
                      <select 
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 cursor-pointer font-semibold text-black text-sm tracking-wider pr-2"
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+971">+971</option>
                      </select>
                      <input 
                        type="tel"
                        autoComplete="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-3 bg-transparent border-none focus:ring-0 text-base tracking-[0.2em] text-black placeholder:text-black/30 outline-none font-medium" 
                        placeholder="98765 43210" 
                      />
                    </div>
                  </div>

                  <div>
                    <button 
                      onClick={handleSendOtp}
                      className="w-full bg-black text-white py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-black/80 transition-colors mb-3"
                    >
                      SEND OTP
                    </button>

                    <div className="text-center mb-3">
                      <button
                        onClick={() => navigate('/create-account')}
                        className="text-[10px] tracking-[0.2em] uppercase font-bold text-black border-b border-black pb-0.5 hover:opacity-60"
                      >
                        NEW TO AT EASE? CREATE ACCOUNT →
                      </button>
                    </div>

                    <p className="text-center text-[10px] tracking-[0.15em] text-black/50 uppercase leading-relaxed">
                      BY CONTINUING YOU AGREE TO AT EASE <br/>
                      <span className="underline font-semibold">TERMS</span> &amp; 
                      <span className="underline font-semibold ml-1">PRIVACY POLICY</span>.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex-grow flex flex-col justify-between"
                >
                  <div className="text-center space-y-2">
                    <button 
                      onClick={() => setStep('PHONE')}
                      className="text-[10px] tracking-[0.2em] text-black/50 hover:text-black uppercase mb-1"
                    >
                      ← EDIT ({countryCode} {phoneNumber})
                    </button>
                    <h2 className="text-sm tracking-[0.25em] uppercase font-bold text-black">ENTER 4-DIGIT OTP</h2>
                  </div>

                  <div className="my-auto flex justify-center gap-4 py-6">
                    {otp.map((digit, idx) => (
                      <input 
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-12 h-14 text-center text-xl font-bold border-b-2 border-black focus:border-black bg-transparent outline-none tracking-widest"
                      />
                    ))}
                  </div>

                  <div>
                    <button 
                      onClick={handleVerifyOtp}
                      disabled={isVerifying}
                      className="w-full bg-black text-white py-4 text-xs tracking-[0.25em] uppercase font-bold hover:bg-black/80 transition-colors mb-2 disabled:opacity-40"
                    >
                      {isVerifying ? 'VERIFYING...' : `LOG IN AS ${role}`}
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
