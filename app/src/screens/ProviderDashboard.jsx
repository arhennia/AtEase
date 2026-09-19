import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PlatformHeader } from '../components/platform/PlatformHeader';
import { ServiceCatalogManager } from '../components/provider/ServiceCatalogManager';
import { CoverageRadiusEditor } from '../components/provider/CoverageRadiusEditor';
import { AvailabilityEditor } from '../components/provider/AvailabilityEditor';
import { BookingsList } from '../components/provider/BookingsList';
import { SitePublisher } from '../components/provider/SitePublisher';
import { PackageManager } from '../components/provider/PackageManager';
import { ClientInsights } from '../components/provider/ClientInsights';
import { Calendar, Layers, Navigation, Clock, Globe, Users, Gift } from 'lucide-react';
import { getPlanStatus, getTenantCatalog } from '../lib/tenancy';
import { uniqueClients } from '../lib/salonMenu';
import { isValidWhatsAppNumber, toNationalDigits } from '../lib/whatsapp';
import { SoftButton, SoftCard, chipOff, chipOn, eyebrowClass, mutedClass, pageClass, shellClass, titleClass } from '../components/platform/ui';

export function ProviderDashboard() {
  const partners = useAppStore((state) => state.partners);
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const partner = partners.find((p) => p.id === currentPartnerId);
  const plan = getPlanStatus(partner);
  const activateSubscription = useAppStore((state) => state.activateSubscription);
  const updatePartnerWhatsApp = useAppStore((state) => state.updatePartnerWhatsApp);

  const [activeTab, setActiveTab] = useState('website');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [whatsappDraft, setWhatsappDraft] = useState('');
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);

  const allAppointments = useAppStore((state) => state.appointments);
  const showToast = useAppStore((state) => state.showToast);
  const appointments = allAppointments.filter((a) => a.partnerId === partner?.id);
  const clients = uniqueClients(appointments);
  const serviceCount = getTenantCatalog(partner).reduce((n, cat) => n + (cat.services?.length || 0), 0);
  const packageCount = partner?.packages?.length || 0;
  const vipCount = partner?.vipMembers?.length || 0;

  useEffect(() => {
    setWhatsappDraft(toNationalDigits(partner?.whatsappNumber || partner?.ownerPhone || ''));
  }, [partner?.id, partner?.whatsappNumber, partner?.ownerPhone]);

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-stone-500 font-heroSans">
        No partner profile on this account.
      </div>
    );
  }

  const sitePath = `/s/${partner.slug}`;

  const handleViewSite = () => {
    window.open(`${sitePath}?preview=1`, '_blank', 'noopener,noreferrer');
  };

  const handleSaveWhatsApp = async () => {
    setSavingWhatsapp(true);
    const result = await updatePartnerWhatsApp(whatsappDraft);
    setSavingWhatsapp(false);
    if (!result.ok) {
      showToast(result.error || 'Could not save WhatsApp number.');
    }
  };

  const tabs = [
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'clients', label: 'Clients', icon: Users, count: clients.length },
    { id: 'bookings', label: 'Bookings', icon: Calendar, count: appointments.length },
    { id: 'catalog', label: 'Menu', icon: Layers, count: serviceCount },
    { id: 'packages', label: 'Packages', icon: Gift, count: packageCount },
    { id: 'availability', label: 'Hours', icon: Clock },
    { id: 'radius', label: 'Area', icon: Navigation },
  ];

  return (
    <div className={pageClass}>
      <PlatformHeader />

      {plan.status === 'trial' && (
        <div className="bg-[#F3EEF8] text-[#4A3F5C] text-center py-2.5 px-4 text-[13px] font-heroSans">
          {plan.daysLeft} day{plan.daysLeft === 1 ? '' : 's'} left on trial.{' '}
          <button type="button" onClick={() => setShowPlanModal(true)} className="underline font-medium">
            Keep the site live
          </button>
        </div>
      )}

      <main className={`${shellClass} py-10 sm:py-14 space-y-8`}>
        <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="space-y-2">
            <p className={eyebrowClass}>
              {plan.status === 'active' ? 'Paid plan' : `Trial · ${plan.daysLeft}d left`}
            </p>
            <h1 className={`${titleClass} text-3xl sm:text-4xl`}>{partner.brandName}</h1>
            <p className={mutedClass}>
              {[partner.professionalTitle, partner.location].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SoftButton onClick={handleViewSite}>
              View website
            </SoftButton>
          </div>
        </section>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SoftCard className="p-6">
            <p className={eyebrowClass}>Clients</p>
            <p className="font-heroSans text-3xl font-semibold mt-2">{clients.length}</p>
          </SoftCard>
          <SoftCard className="p-6">
            <p className={eyebrowClass}>Bookings</p>
            <p className="font-heroSans text-3xl font-semibold mt-2">{appointments.length}</p>
          </SoftCard>
          <SoftCard className="p-6">
            <p className={eyebrowClass}>VIP members</p>
            <p className="font-heroSans text-3xl font-semibold mt-2">{vipCount}</p>
          </SoftCard>
          <SoftCard className="p-6">
            <p className={eyebrowClass}>Menu items</p>
            <p className="font-heroSans text-3xl font-semibold mt-2">{serviceCount}</p>
          </SoftCard>
        </section>

        <SoftCard className="p-6 space-y-3">
          <div>
            <p className={eyebrowClass}>WhatsApp for bookings</p>
            <p className={`${mutedClass} text-xs mt-1`}>
              After a client picks a date and time, the booking opens a chat with this number.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex flex-1 rounded-2xl border border-stone-200 focus-within:border-[#D4C8E8] focus-within:ring-2 focus-within:ring-[#EDE9FE] bg-[#F7F6F8]">
              <span className="px-3 py-2.5 text-xs text-stone-500 border-r border-stone-200 font-mono bg-[#EFECEF] rounded-l-2xl">
                +91
              </span>
              <input
                type="tel"
                value={whatsappDraft}
                onChange={(e) => setWhatsappDraft(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="98765 43210"
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none font-heroSans"
              />
            </div>
            <SoftButton
              disabled={savingWhatsapp || !isValidWhatsAppNumber(whatsappDraft)}
              onClick={handleSaveWhatsApp}
            >
              {savingWhatsapp ? 'Saving…' : 'Save number'}
            </SoftButton>
          </div>
        </SoftCard>

        <section>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`h-10 px-4 text-[13px] font-heroSans whitespace-nowrap inline-flex items-center gap-1.5 rounded-full transition-colors ${
                  activeTab === tab.id ? chipOn : chipOff
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
          {activeTab === 'website' && <SitePublisher partner={partner} />}
          {activeTab === 'clients' && <ClientInsights partner={partner} />}
          {activeTab === 'bookings' && <BookingsList partnerId={partner.id} />}
          {activeTab === 'catalog' && <ServiceCatalogManager />}
          {activeTab === 'packages' && <PackageManager partner={partner} />}
          {activeTab === 'radius' && <CoverageRadiusEditor />}
          {activeTab === 'availability' && <AvailabilityEditor />}
        </section>
      </main>

      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <SoftCard className="w-full max-w-md p-7 space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`${titleClass} text-xl`}>Keep {partner.brandName} live</h3>
                <p className={`${mutedClass} mt-1`}>₹999 / month after the trial.</p>
              </div>
              <button type="button" onClick={() => setShowPlanModal(false)} className="text-stone-400 hover:text-[#1C1917]">
                ✕
              </button>
            </div>
            <SoftButton
              className="w-full"
              onClick={() => {
                activateSubscription(partner.id);
                setShowPlanModal(false);
              }}
            >
              Activate plan
            </SoftButton>
          </SoftCard>
        </div>
      )}
    </div>
  );
}
