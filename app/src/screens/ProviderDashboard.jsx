import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PlatformHeader } from '../components/platform/PlatformHeader';
import { ServiceCatalogManager } from '../components/provider/ServiceCatalogManager';
import { CoverageRadiusEditor } from '../components/provider/CoverageRadiusEditor';
import { AvailabilityEditor } from '../components/provider/AvailabilityEditor';
import { BookingsList } from '../components/provider/BookingsList';
import { 
  Calendar, 
  Layers, 
  Navigation, 
  Clock, 
  ExternalLink,
  X
} from 'lucide-react';
import { getPlanStatus, tenantPath, tenantSiteUrl } from '../lib/tenancy';

export function ProviderDashboard() {
  const partners = useAppStore((state) => state.partners);
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const partner = partners.find((p) => p.id === currentPartnerId);
  const plan = getPlanStatus(partner);

  const [activeTab, setActiveTab] = useState('bookings');
  const [showMarketingModal, setShowMarketingModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);

  const allAppointments = useAppStore((state) => state.appointments);
  const coverageRadius = useAppStore((state) => state.coverageRadius);
  const showToast = useAppStore((state) => state.showToast);
  const appointments = allAppointments.filter((a) => a.partnerId === partner?.id);
  const totalRevenue = appointments.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-stone-500">
        No partner profile on this account.
      </div>
    );
  }

  const sitePath = tenantPath(partner.slug);
  const siteUrl = tenantSiteUrl(partner.slug);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    showToast('Your private client site link was copied.');
  };

  const handleViewSite = () => {
    window.open(`${sitePath}?preview=1`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-[#FFFFFF] text-[#111111] font-sans antialiased min-h-screen selection:bg-[#111111] selection:text-white">
      <PlatformHeader />

      {plan.status === 'trial' && (
        <div className="bg-stone-900 text-white text-center py-2.5 px-4 text-[11px] tracking-wide">
          {plan.daysLeft} day{plan.daysLeft === 1 ? '' : 's'} left on your free trial.{' '}
          <button type="button" onClick={() => setShowProModal(true)} className="underline font-semibold">
            Add payment to keep {partner.brandName} live
          </button>
        </div>
      )}

      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-10">
        <section className="border-b border-stone-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-500">
                Partner dashboard
              </span>
              <span className="text-[9px] tracking-wider uppercase font-bold text-black bg-stone-100 border border-stone-300 px-2 py-0.5">
                {plan.status === 'active' ? 'Paid plan' : `Trial • ${plan.daysLeft}d left`}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl tracking-wide uppercase font-normal text-[#111111]">
              {partner.brandName}
            </h1>
            <p className="text-xs text-stone-600 font-light">
              {partner.professionalTitle} • {partner.location} • Coverage: {coverageRadius} km
            </p>
            <div className="flex flex-wrap gap-2 pt-3">
              <button
                type="button"
                onClick={handleViewSite}
                className="inline-flex items-center gap-2 bg-[#111111] text-white px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase font-bold hover:bg-black"
              >
                <ExternalLink size={14} />
                View my website
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 border border-stone-300 px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase font-bold hover:border-black"
              >
                Copy client link
              </button>
            </div>
          </div>

          {/* Revenue & Booking KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto">
            <div className="p-4 border border-stone-200 bg-[#F9F9F9] space-y-1">
              <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-stone-500 block">
                Active Bookings
              </span>
              <div className="font-mono text-xl font-bold text-[#111111]">
                {appointments.length}
              </div>
            </div>

            <div className="p-4 border border-stone-200 bg-[#F9F9F9] space-y-1">
              <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-stone-500 block">
                Direct Revenue
              </span>
              <div className="font-mono text-xl font-bold text-[#111111]">
                ₹{totalRevenue.toLocaleString()}
              </div>
            </div>

            <div className="p-4 border border-stone-200 bg-[#F9F9F9] space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-stone-500 block">
                Commission
              </span>
              <div className="font-mono text-xl font-bold text-emerald-800">
                0% Direct
              </div>
            </div>
          </div>
        </section>

        {/* Quick Management Actions Bar */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('catalog')}
            className="p-4 border border-stone-200 bg-[#FFFFFF] hover:border-[#111111] hover:bg-[#F9F9F9] text-left transition-all space-y-1 group"
          >
            <div className="text-[9px] tracking-[0.2em] uppercase font-semibold text-stone-500">
              Catalog
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Manage 30 Services
            </div>
          </button>

          <button
            onClick={() => setShowMarketingModal(true)}
            className="p-4 border border-stone-200 bg-[#FFFFFF] hover:border-[#111111] hover:bg-[#F9F9F9] text-left transition-all space-y-1 group"
          >
            <div className="text-[9px] tracking-[0.2em] uppercase font-semibold text-stone-500">
              Marketing
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              WhatsApp Graphic
            </div>
          </button>

          <button
            onClick={handleCopyLink}
            className="p-4 border border-stone-200 bg-[#FFFFFF] hover:border-[#111111] hover:bg-[#F9F9F9] text-left transition-all space-y-1 group"
          >
            <div className="text-[9px] tracking-[0.2em] uppercase font-semibold text-stone-500">
              Storefront URL
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Copy Public Link
            </div>
          </button>

          <button
            onClick={() => setShowProModal(true)}
            className="p-4 border border-stone-200 bg-[#FFFFFF] hover:border-[#111111] hover:bg-[#F9F9F9] text-left transition-all space-y-1 group"
          >
            <div className="text-[9px] tracking-[0.2em] uppercase font-semibold text-stone-500">
              Membership
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Pro Tier (₹999/mo)
            </div>
          </button>
        </section>

        {/* Tab Navigation Controls */}
        <section className="border-b border-stone-200">
          <div className="flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar text-xs tracking-wider uppercase font-semibold">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-3 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'bookings'
                  ? 'border-b-2 border-[#111111] text-[#111111] font-bold'
                  : 'text-stone-500 hover:text-[#111111]'
              }`}
            >
              <Calendar size={14} />
              <span>Incoming Bookings ({appointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`pb-3 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'border-b-2 border-[#111111] text-[#111111] font-bold'
                  : 'text-stone-500 hover:text-[#111111]'
              }`}
            >
              <Layers size={14} />
              <span>Service Catalog &amp; Pricing</span>
            </button>

            <button
              onClick={() => setActiveTab('radius')}
              className={`pb-3 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'radius'
                  ? 'border-b-2 border-[#111111] text-[#111111] font-bold'
                  : 'text-stone-500 hover:text-[#111111]'
              }`}
            >
              <Navigation size={14} />
              <span>Working Radius ({coverageRadius} km)</span>
            </button>

            <button
              onClick={() => setActiveTab('availability')}
              className={`pb-3 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'availability'
                  ? 'border-b-2 border-[#111111] text-[#111111] font-bold'
                  : 'text-stone-500 hover:text-[#111111]'
              }`}
            >
              <Clock size={14} />
              <span>Opening Hours &amp; Schedule</span>
            </button>
          </div>
        </section>

        {/* Tab Content Section */}
        <section className="min-h-[400px]">
          {activeTab === 'bookings' && <BookingsList partnerId={partner.id} />}
          {activeTab === 'catalog' && <ServiceCatalogManager />}
          {activeTab === 'radius' && <CoverageRadiusEditor />}
          {activeTab === 'availability' && <AvailabilityEditor />}
        </section>

      </main>

      {/* MODAL 1: Festival Marketing Graphic */}
      {showMarketingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md border border-stone-200 p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowMarketingModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-black"
            >
              <X size={18} />
            </button>

            <div className="border-b border-stone-200 pb-3">
              <h3 className="font-serif text-lg tracking-wide uppercase font-normal text-[#111111]">
                Festival Marketing Graphic
              </h3>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                Generate high-resolution WhatsApp Status banners to share with your clients.
              </p>
            </div>

            {/* Graphic Preview */}
            <div className="bg-[#111111] text-white p-8 text-center space-y-3 relative overflow-hidden border border-black">
              <div className="text-[10px] tracking-[0.3em] uppercase text-amber-200 font-bold">
                Special Festive Offer
              </div>
              <h4 className="font-serif text-2xl tracking-[0.1em] uppercase font-normal">
                {partner.brandName}
              </h4>
              <p className="text-xs text-white/80 font-light tracking-wide">
                Keratin Smoothing + Custom Organic Glow Facial Combo
              </p>
              <div className="inline-block border border-white px-4 py-1 text-xs tracking-[0.2em] uppercase font-bold mt-2">
                Flat 20% Off This Week
              </div>
              <p className="text-[9px] text-white/50 tracking-widest uppercase pt-2">
                Book direct on AtEase • 0% Platform Markup
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowMarketingModal(false);
                  showToast('Graphic generated and saved for WhatsApp status.');
                }}
                className="w-full bg-[#111111] text-white py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors"
              >
                Download Graphic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Pro Tier Subscription */}
      {showProModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg border border-stone-200 p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowProModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-black"
            >
              <X size={18} />
            </button>

            <div className="border-b border-stone-200 pb-3">
              <h3 className="font-serif text-lg tracking-wide uppercase font-normal text-[#111111]">
                Turnkey Pro Tier Membership
              </h3>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                Transparent flat monthly pricing for independent beauty owners.
              </p>
            </div>

            <div className="p-4 border border-stone-200 bg-[#F9F9F9] space-y-1">
              <div className="flex justify-between items-center text-xs font-bold tracking-wider uppercase">
                <span>Current Plan: Pro Tier</span>
                <span className="font-mono text-sm">₹999 / Month</span>
              </div>
              <p className="text-[10px] text-stone-500 tracking-wider uppercase">
                0% Transaction Cuts • Zero Booking Fees
              </p>
            </div>

            <div className="space-y-2 text-xs text-stone-700">
              <h4 className="text-[11px] tracking-wider uppercase font-bold text-[#111111]">
                Included Tools:
              </h4>
              <ul className="space-y-1.5 list-disc list-inside font-light text-stone-600">
                <li>Hyper-local mobile discovery within up to 35 km radius</li>
                <li>Unlimited direct client appointment scheduling</li>
                <li>Multi-tier In-Salon vs Mobile pricing management</li>
                <li>Private client site at {sitePath}</li>
                <li>Instant schedule delay notifications via SMS &amp; WhatsApp</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setShowProModal(false);
                showToast('Annual Plan active (Saved 20%).');
              }}
              className="w-full bg-[#111111] text-white py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors"
            >
              Upgrade to Annual (₹9,588/yr)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
