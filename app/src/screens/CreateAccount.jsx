import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const inputBase =
  'w-full bg-transparent border-b-2 border-outline-variant focus:border-accent-orange outline-none transition-colors duration-300 text-base font-medium text-on-surface placeholder:text-on-surface/30 py-2 pr-2';

function Field({ label, icon: Icon, children, error }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-on-surface/60 uppercase tracking-wider flex items-center gap-1.5">
        {Icon && <Icon size={11} strokeWidth={2.5} />}
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-red-500 font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CreateAccount() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '',
    gender: '',
    pincode: '',
    address: '',
    skinType: '',
    hairType: '',
    allergies: '',
    referralCode: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => {
    const val =
      field === 'phone'
        ? e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
        : field === 'pincode'
        ? e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
        : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (form.phone.length !== 10) e.phone = 'Enter a valid 10-digit number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address';
    if (form.dob) {
      const age = Math.floor((Date.now() - new Date(form.dob)) / (365.25 * 24 * 3600 * 1000));
      if (age < 13) e.dob = 'You must be at least 13 years old';
    }
    if (form.pincode && form.pincode.length !== 6) e.pincode = 'Enter a valid 6-digit pincode';
    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
    // TODO: send to backend
    setTimeout(() => navigate('/login'), 1800);
  };

  if (submitted) {
    return (
      <motion.main
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px] mx-auto px-container-margin min-h-screen flex flex-col items-center justify-center bg-surface"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
        >
          <span className="text-4xl">✨</span>
        </motion.div>
        <h2 className="text-2xl font-bold text-on-surface text-center">Account Created!</h2>
        <p className="text-sm text-on-surface/60 text-center mt-2">
          Welcome to Kumari & Co., {form.firstName}. Redirecting you to login…
        </p>
      </motion.main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      className="w-full max-w-[480px] mx-auto px-container-margin py-6 min-h-screen flex flex-col bg-surface relative shadow-sm border-x border-outline-variant/30"
    >
      {/* Header */}
      <header className="w-full mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors duration-200"
          >
            <ArrowLeft className="text-on-surface" size={24} />
          </button>
          <h1 className="text-xl font-semibold text-on-surface">Create Account</h1>
        </div>
      </header>

      {/* Hero copy */}
      <div className="space-y-1 mb-8">
        <h2 className="text-3xl font-bold text-on-surface tracking-tight">
          Join Kumari & Co.
        </h2>
        <p className="text-sm text-on-surface/70">
          Your profile helps us personalise every visit just for you.
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-6 pb-10">

        {/* ── Section: Personal Info ── */}
        <SectionHeading>Personal Info</SectionHeading>

        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" icon={User} error={errors.firstName}>
            <input
              id="firstName"
              className={inputBase}
              placeholder="Priya"
              value={form.firstName}
              onChange={set('firstName')}
            />
          </Field>
          <Field label="Last Name" icon={User} error={errors.lastName}>
            <input
              id="lastName"
              className={inputBase}
              placeholder="Kumari"
              value={form.lastName}
              onChange={set('lastName')}
            />
          </Field>
        </div>

        <Field label="Phone Number" icon={Phone} error={errors.phone}>
          <div className="flex items-center border-b-2 border-outline-variant focus-within:border-accent-orange transition-colors duration-300 py-2">
            <span className="text-base font-semibold text-on-surface mr-2">+91</span>
            <input
              id="phone"
              className="flex-grow bg-transparent outline-none text-base font-medium text-on-surface placeholder:text-on-surface/30"
              placeholder="98765 43210"
              type="tel"
              value={form.phone}
              onChange={set('phone')}
            />
          </div>
        </Field>

        <Field label="Email Address (optional)" icon={Mail} error={errors.email}>
          <input
            id="email"
            className={inputBase}
            placeholder="priya@example.com"
            type="email"
            value={form.email}
            onChange={set('email')}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Date of Birth" icon={Calendar} error={errors.dob}>
            <input
              id="dob"
              className={inputBase}
              type="date"
              value={form.dob}
              onChange={set('dob')}
              max={new Date().toISOString().split('T')[0]}
            />
          </Field>

          <Field label="Gender" error={errors.gender}>
            <div className="relative flex items-center border-b-2 border-outline-variant focus-within:border-accent-orange transition-colors duration-300">
              <select
                id="gender"
                className="w-full bg-transparent outline-none py-2 pr-6 text-base font-medium text-on-surface appearance-none cursor-pointer"
                value={form.gender}
                onChange={set('gender')}
              >
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
              <ChevronDown size={14} className="absolute right-1 text-on-surface/40 pointer-events-none" />
            </div>
          </Field>
        </div>

        {/* ── Section: Location ── */}
        <SectionHeading>Location</SectionHeading>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Pincode" icon={MapPin} error={errors.pincode}>
            <input
              id="pincode"
              className={inputBase}
              placeholder="751001"
              type="tel"
              value={form.pincode}
              onChange={set('pincode')}
            />
          </Field>
          <Field label="City" error={errors.city}>
            <input
              id="city"
              className={inputBase}
              placeholder="Bhubaneswar"
              value={form.city}
              onChange={set('city')}
            />
          </Field>
        </div>

        <Field label="Street / Locality (optional)" error={errors.address}>
          <input
            id="address"
            className={inputBase}
            placeholder="e.g. Saheed Nagar, Unit-4"
            value={form.address}
            onChange={set('address')}
          />
        </Field>

        {/* ── Section: Beauty Profile ── */}
        <SectionHeading>Beauty Profile
          <span className="ml-2 text-[10px] font-semibold text-accent-orange bg-accent-orange/10 rounded-full px-2 py-0.5">
            Helps personalise services
          </span>
        </SectionHeading>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Skin Type">
            <div className="relative flex items-center border-b-2 border-outline-variant focus-within:border-accent-orange transition-colors duration-300">
              <select
                id="skinType"
                className="w-full bg-transparent outline-none py-2 pr-6 text-base font-medium text-on-surface appearance-none cursor-pointer"
                value={form.skinType}
                onChange={set('skinType')}
              >
                <option value="">Select</option>
                <option value="normal">Normal</option>
                <option value="oily">Oily</option>
                <option value="dry">Dry</option>
                <option value="combination">Combination</option>
                <option value="sensitive">Sensitive</option>
              </select>
              <ChevronDown size={14} className="absolute right-1 text-on-surface/40 pointer-events-none" />
            </div>
          </Field>

          <Field label="Hair Type">
            <div className="relative flex items-center border-b-2 border-outline-variant focus-within:border-accent-orange transition-colors duration-300">
              <select
                id="hairType"
                className="w-full bg-transparent outline-none py-2 pr-6 text-base font-medium text-on-surface appearance-none cursor-pointer"
                value={form.hairType}
                onChange={set('hairType')}
              >
                <option value="">Select</option>
                <option value="straight">Straight</option>
                <option value="wavy">Wavy</option>
                <option value="curly">Curly</option>
                <option value="coily">Coily</option>
              </select>
              <ChevronDown size={14} className="absolute right-1 text-on-surface/40 pointer-events-none" />
            </div>
          </Field>
        </div>

        <Field label="Allergies / Sensitivities (optional)">
          <input
            id="allergies"
            className={inputBase}
            placeholder="e.g. Nickel, Fragrances, Latex"
            value={form.allergies}
            onChange={set('allergies')}
          />
        </Field>

        {/* ── Section: Referral ── */}
        <SectionHeading>Referral</SectionHeading>

        <Field label="Referral Code (optional)">
          <input
            id="referralCode"
            className={`${inputBase} uppercase`}
            placeholder="KUMARI10"
            value={form.referralCode}
            onChange={set('referralCode')}
            maxLength={12}
          />
        </Field>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="w-full h-14 rounded-lg bg-primary text-white text-lg font-semibold shadow-sm mt-2 active:scale-[0.98] transition-transform"
        >
          Create My Account
        </motion.button>

        <p className="text-xs text-center text-on-surface/50 -mt-2">
          By creating an account you agree to our{' '}
          <span className="text-accent-orange font-semibold">Terms of Service</span> &amp;{' '}
          <span className="text-accent-orange font-semibold">Privacy Policy</span>.
        </p>

        <p className="text-sm text-center text-on-surface/70">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-accent-orange font-bold hover:underline decoration-2 underline-offset-4"
          >
            Sign In
          </button>
        </p>
      </div>
    </motion.main>
  );
}

function SectionHeading({ children }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="h-px flex-grow bg-outline-variant" />
      <span className="text-xs font-semibold text-on-surface/50 uppercase tracking-widest whitespace-nowrap flex items-center gap-1">
        {children}
      </span>
      <div className="h-px flex-grow bg-outline-variant" />
    </div>
  );
}
