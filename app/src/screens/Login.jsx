import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhone(value);
  };

  const isFormValid = phone.length === 10;

  const handleSendOtp = () => {
    if (isFormValid) {
      navigate('/otp');
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-[480px] mx-auto px-container-margin py-6 min-h-screen flex flex-col bg-surface relative shadow-sm border-x border-outline-variant/30"
    >
      {/* TopAppBar */}
      <header className="w-full mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors duration-200"
          >
            <ArrowLeft className="text-on-surface" size={24} />
          </button>
          <h1 className="text-xl font-semibold text-on-surface">Login</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex flex-col justify-between">
        <div className="space-y-8">
          {/* Branding Section */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-on-surface tracking-tight">Welcome Back</h2>
            <p className="text-sm text-on-surface/70">Sign in to book your next session with the local experts you trust.</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-on-surface/60 uppercase tracking-wider">Phone Number</label>
              <div className="flex items-center border-b-2 border-outline-variant focus-within:border-accent-orange transition-colors duration-300 py-2">
                <span className="text-lg font-semibold text-on-surface mr-3">+91</span>
                <input 
                  className="flex-grow bg-transparent border-none p-0 focus:ring-0 text-lg font-semibold text-on-surface placeholder:text-on-surface/30 outline-none" 
                  maxLength={10} 
                  placeholder="98765 43210" 
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                />
              </div>
            </div>

            <button 
              onClick={handleSendOtp}
              disabled={!isFormValid}
              className={`w-full h-14 rounded-lg text-lg font-semibold transition-all duration-150 shadow-sm ${
                isFormValid 
                  ? 'bg-primary text-white active:scale-[0.98]' 
                  : 'bg-primary/60 text-white cursor-not-allowed'
              }`}
            >
              Send OTP
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink mx-4 text-xs font-medium text-on-surface/60">OR</span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>

            {/* Social Login */}
            <button className="w-full bg-transparent border border-accent-moss text-primary h-14 rounded-lg flex items-center justify-center gap-3 active:bg-accent-moss/10 transition-colors duration-200">
              <svg className="w-5 h-5 fill-primary" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
              </svg>
              <span className="text-lg font-semibold">Continue with Google</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 text-center">
          <p className="text-sm text-on-surface/70">
            New to Kumari & Co.?{' '}
            <button
              onClick={() => navigate('/create-account')}
              className="text-accent-orange font-bold ml-1 hover:underline decoration-2 underline-offset-4"
            >
              Create Account
            </button>
          </p>
        </footer>
      </div>
    </motion.main>
  );
}
