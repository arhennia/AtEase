import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ServiceCatalogManager } from '../components/provider/ServiceCatalogManager';
import { CoverageRadiusEditor } from '../components/provider/CoverageRadiusEditor';
import { AvailabilityEditor } from '../components/provider/AvailabilityEditor';
import { BookingsList } from '../components/provider/BookingsList';
import { SitePublisher } from '../components/provider/SitePublisher';
import { PackageManager } from '../components/provider/PackageManager';
import { ClientInsights } from '../components/provider/ClientInsights';
import { DashboardHome } from '../components/provider/DashboardHome';
import { AtEaseLogo } from '../components/platform/AtEaseLogo';
import { Calendar, Layers, Navigation, Clock, Globe, Users, Gift, LayoutDashboard, LogOut } from 'lucide-react';
import { getPlanStatus, getTenantCatalog } from '../lib/tenancy';
import { uniqueClients } from '../lib/salonMenu';
import { isValidWhatsAppNumber, toNationalDigits } from '../lib/whatsapp';
import { SoftButton, SoftCard, mutedClass, titleClass } from '../components/platform/ui';
import { PastelShaderBackground } from '../components/ui/hero-shader';

export function ProviderDashboard() {
  const navigate = useNavigate();
  const partners = useAppStore((state) => state.partners);
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const partner = partners.find((p) => p.id === currentPartnerId);
  const plan = getPlanStatus(partner);
  const activateSubscription = useAppStore((state) => state.activateSubscription);
  const updatePartnerWhatsApp = useAppStore((state) => state.updatePartnerWhatsApp);
  const logout = useAppStore((state) => state.logout);

  const [activeTab, setActiveTab] = useState('overview');
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
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Calendar, count: appointments.length },
    { id: 'clients', label: 'Clients', icon: Users, count: clients.length },
    { id: 'catalog', label: 'Menu', icon: Layers, count: serviceCount },
    { id: 'packages', label: 'Packages', icon: Gift, count: packageCount },
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'availability', label: 'Hours', icon: Clock },
    { id: 'radius', label: 'Area', icon: Navigation },
  ];

  const navButton = (tab, compact = false) => {
    const active = activeTab === tab.id;
    return (
      <button
        key={tab.id}
        type="button"
        onClick={() => setActiveTab(tab.id)}
        className={`flex items-center gap-2.5 rounded-xl text-left font-heroSans text-[13px] font-medium transition-colors ${
          compact ? 'shrink-0 px-3 py-2' : 'w-full px-3 py-2.5'
        } ${active ? 'bg-[#6D5A8D] text-white' : 'text-stone-500 hover:bg-[#F6F3FB] hover:text-[#1C1917]'}`}
      >
        <tab.icon size={16} strokeWidth={1.7} />
        <span>{tab.label}</span>
        {!compact && typeof tab.count === 'number' ? (
          <span className={`ml-auto text-[11px] ${active ? 'text-white/80' : 'text-stone-400'}`}>{tab.count}</span>
        ) : null}
      </button>
    );
  };

  return (
    <div className="relative min-h-screen font-heroSans text-[#1C1917] antialiased">
      <PastelShaderBackground className="fixed inset-0 z-0" />
      <div className="relative z-10 min-h-screen p-3 sm:p-4 lg:p-5">
        <div className="flex min-h-[calc(100vh-1.5rem)] overflow-hidden rounded-[28px] border border-white/80 shadow-[0_28px_70px_-36px_rgba(88,28,135,0.45)] lg:min-h-[calc(100vh-2.5rem)]">
        <aside className="hidden w-[228px] shrink-0 flex-col border-r border-[#EFEAF6] bg-white p-4 lg:flex">
          <button type="button" onClick={() => navigate('/')} className="mb-6 px-2 text-left">
            <AtEaseLogo className="text-[1.35rem] text-[#1C1917]" />
          </button>
          <nav className="flex flex-1 flex-col gap-1">{tabs.map((tab) => navButton(tab))}</nav>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 font-heroSans text-[13px] text-stone-500 hover:bg-[#F6F3FB] hover:text-[#1C1917]"
          >
            <LogOut size={16} />
            Log out
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-white/40 backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-3 border-b border-[#EDE9FE] px-4 py-3 sm:px-6">
            <div className="lg:hidden">
              <AtEaseLogo className="text-[1.2rem] text-[#1C1917]" />
            </div>
            <p className="hidden font-heroSans text-sm font-medium text-[#1C1917] lg:block">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </p>
            <SoftButton onClick={handleViewSite}>View website</SoftButton>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-[#EDE9FE] px-3 py-3 lg:hidden">
            {tabs.map((tab) => navButton(tab, true))}
          </div>

          <main className="flex-1 overflow-auto p-4 sm:p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <DashboardHome
                  partner={partner}
                  plan={plan}
                  appointments={appointments}
                  clientCount={clients.length}
                  vipCount={vipCount}
                  serviceCount={serviceCount}
                  onOpenBookings={() => setActiveTab('bookings')}
                />
                <SoftCard className="p-5 space-y-3">
                  <div>
                    <p className="font-heroSans text-[11px] uppercase tracking-[0.16em] text-stone-400">WhatsApp for bookings</p>
                    <p className={`${mutedClass} text-xs mt-1`}>
                      After a client picks a date and time, the booking opens a chat with this number.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex flex-1 rounded-2xl border border-[#EDE9FE] bg-white">
                      <span className="px-3 py-2.5 text-xs text-stone-500 border-r border-[#EDE9FE] font-mono rounded-l-2xl">+91</span>
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
              </div>
            )}
            {activeTab === 'website' && <SitePublisher partner={partner} />}
            {activeTab === 'clients' && <ClientInsights partner={partner} />}
            {activeTab === 'bookings' && <BookingsList partnerId={partner.id} />}
            {activeTab === 'catalog' && <ServiceCatalogManager />}
            {activeTab === 'packages' && <PackageManager partner={partner} />}
            {activeTab === 'radius' && <CoverageRadiusEditor />}
            {activeTab === 'availability' && <AvailabilityEditor />}
          </main>
        </div>
        </div>
      </div>

      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-md">
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
