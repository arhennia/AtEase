import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function OtpVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (!value && e.nativeEvent.inputType !== "deleteContentBackward") return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const isFormValid = otp.every(val => val !== '');

  const handleVerify = () => {
    if (!isFormValid) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    }, 1500);
  };

  return (
    <motion.main 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-[480px] mx-auto px-container-margin py-6 min-h-screen flex flex-col bg-background relative shadow-sm border-x border-outline-variant/30"
    >
      {/* TopAppBar */}
      <header className="w-full mb-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-on-surface/5 transition-colors"
          >
            <ArrowLeft className="text-primary" size={24} />
          </button>
          <h1 className="text-xl font-semibold text-primary">Kumari & Co.</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>

      <div className="flex-grow flex flex-col">
        {/* Identity Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-on-surface mb-2">Verify Phone Number</h2>
          <p className="text-sm text-on-surface/80">Enter the 4-digit code sent to <span className="font-bold text-on-surface">+91 98765 43210</span></p>
        </div>

        {/* OTP Input Section */}
        <div className="flex justify-between gap-4 mb-10">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputsRef.current[index] = el}
              className="w-full h-16 text-center text-3xl font-bold rounded-lg border-2 border-primary/20 bg-background text-primary transition-all focus:border-primary outline-none"
              inputMode="numeric"
              maxLength={1}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>

        {/* Primary Action */}
        <button 
          onClick={handleVerify}
          disabled={!isFormValid || isVerifying || isSuccess}
          className={`w-full h-14 rounded-lg text-lg font-semibold transition-all duration-150 shadow-sm flex items-center justify-center gap-2 mb-8 ${
            isSuccess ? 'bg-accent-moss text-white' : 
            isFormValid ? 'bg-primary text-white active:scale-[0.98]' : 
            'bg-primary/60 text-white cursor-not-allowed'
          }`}
        >
          {isSuccess ? (
            <><CheckCircle2 size={20} /> Success</>
          ) : isVerifying ? (
            <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Verifying...</>
          ) : (
            'Verify & Continue'
          )}
        </button>

        {/* Footer Resend */}
        <div className="mt-auto pb-8 text-center">
          <p className="text-sm text-on-surface/70">
            Didn't receive code?{' '}
            <span 
              className={`font-bold ${timer === 0 ? 'text-accent-orange cursor-pointer hover:underline' : 'text-primary'}`}
              onClick={() => timer === 0 && setTimer(30)}
            >
              {timer > 0 ? `Resend in ${timer}s` : 'Resend Now'}
            </span>
          </p>
        </div>
      </div>
    </motion.main>
  );
}
