import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PlatformHeader } from '../components/platform/PlatformHeader';
import { ServiceCatalogManager } from '../components/provider/ServiceCatalogManager';
import { CoverageRadiusEditor } from '../components/provider/CoverageRadiusEditor';
import { AvailabilityEditor } from '../components/provider/AvailabilityEditor';
import { BookingsList } from '../components/provider/BookingsList';
import { Calendar, Layers, Navigation, Clock, ExternalLink, Copy } from 'lucide-react';
import { getPlanStatus, getTenantCatalog, tenantPath, tenantSiteUrl } from '../lib/tenancy';

export function ProviderDashboard() {
  const partners = useAppStore((state) => state.partners);
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const partner = partners.find((p) => p.id === currentPartnerId);
  const plan = getPlanStatus(partner);
  const activateSubscription = useAppStore((state) => state.activateSubscription);

  const [activeTab, setActiveTab] = useState('bookings');
  const [showPlanModal, setShowPlanModal] = useState(false);

  const allAppointments = useAppStore((state) => state.appointments);
  const showToast = useAppStore((state) => state.showToast);
  const appointments = allAppointments.filter((a) => a.partnerId === partner?.id);
  const serviceCount = getTenantCatalog(partner).reduce((n, cat) => n + (cat.services?.length || 0), 0);

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
    showToast('Client site link copied.');
  };

  const handleViewSite = () => {
    window.open(`${sitePath}?preview=1`, '_blank', 'noopener,noreferrer');
  };

  const tabs = [
    { id: 'bookings', label: 'Bookings', icon: Calendar, count: appointments.length },
    { id: 'catalog', label: 'Menu', icon: Layers, count: serviceCount },
    { id: 'availability', label: 'Hours', icon: Clock },
    { id: 'radius', label: 'Area', icon: Navigation },
  ];

  return (
    <div className="bg-white text-[#111111] min-h-screen">
      <PlatformHeader />

      {plan.status === 'trial' && (
        <div className="bg-[#111111] text-white text-center py-2.5 px-4 text-[11px]">
          {plan.daysLeft} day{plan.daysLeft === 1 ? '' : 's'} left on trial.{' '}
          <button type="button" onClick={() => setShowPlanModal(true)} className="underline font-semibold">
            Keep the site live
          </button>
        </div>
      )}

      <main className="max-w-[1100px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-stone-400">
              {plan.status === 'active' ? 'Paid plan' : `Trial · ${plan.daysLeft}d left`}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-tight">{partner.brandName}</h1>
            <p className="text-sm text-stone-500">
              {[partner.professionalTitle, partner.location].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleViewSite}
              className="h-11 px-4 bg-[#111111] text-white text-[11px] tracking-[0.15em] uppercase font-bold inline-flex items-center gap-2"
            >
              <ExternalLink size={14} />
              View website
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="h-11 px-4 border border-stone-300 text-[11px] tracking-[0.15em] uppercase font-bold inline-flex items-center gap-2 hover:border-black"
            >
              <Copy size={14} />
              Copy link
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="p-5 border border-stone-200">
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400">Bookings</p>
            <p className="font-mono text-2xl font-bold mt-2">{appointments.length}</p>
          </div>
          <div className="p-5 border border-stone-200">
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-400">Menu items</p>
            <p className="font-mono text-2xl font-bold mt-2">{serviceCount}</p>
          </div>
        </section>

        <section className="border-b border-stone-200">
          <div className="flex gap-1 sm:gap-6 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`h-12 px-1 text-xs tracking-[0.12em] uppercase font-semibold whitespace-nowrap inline-flex items-center gap-1.5 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#111111] text-[#111111]'
                    : 'border-transparent text-stone-400 hover:text-[#111111]'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
                {typeof tab.count === 'number' ? ` (${tab.count})` : ''}
              </button>
            ))}
          </div>
        </section>

        <section className="min-h-[360px]">
          {activeTab === 'bookings' && <BookingsList partnerId={partner.id} />}
          {activeTab === 'catalog' && <ServiceCatalogManager />}
          {activeTab === 'radius' && <CoverageRadiusEditor />}
          {activeTab === 'availability' && <AvailabilityEditor />}
        </section>
      </main>

      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white w-full max-w-md border border-stone-200 p-6 space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif text-xl tracking-tight">Keep {partner.brandName} live</h3>
                <p className="text-sm text-stone-500 mt-1">₹999 / month after the trial.</p>
              </div>
              <button type="button" onClick={() => setShowPlanModal(false)} className="text-stone-400 hover:text-black">
                ✕
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                activateSubscription(partner.id);
                setShowPlanModal(false);
              }}
              className="h-12 w-full bg-[#111111] text-white text-xs tracking-[0.18em] uppercase font-bold"
            >
              Activate plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
