import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { TenantHeader } from '../components/tenant/TenantHeader';
import { TenantNotFound, TenantOffline } from './TenantStatus';
import { tenantToStorefrontProfile } from '../data/tenants';
import { getPlanStatus, getTenantBySlug, getTenantCatalog } from '../lib/tenancy';
import {
  MapPin,
  Star,
  Clock,
  Plus,
  Check,
  Home,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { formatUptoPrice, serviceUptoPrice } from '../data/onboardingQuiz';

export function ProviderStorefront() {
  const { partnerSlug } = useParams();
  const [searchParams] = useSearchParams();
  const partners = useAppStore((state) => state.partners);
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const userRole = useAppStore((state) => state.userRole);
  const fetchPartnerBySlug = useAppStore((state) => state.fetchPartnerBySlug);

  const partner = getTenantBySlug(partners, partnerSlug);
  const [loadingPartner, setLoadingPartner] = useState(!partner);

  useEffect(() => {
    let isMounted = true;
    if (!partner && partnerSlug) {
      setLoadingPartner(true);
      fetchPartnerBySlug(partnerSlug).then(() => {
        if (isMounted) setLoadingPartner(false);
      });
    } else {
      setLoadingPartner(false);
    }
    return () => {
      isMounted = false;
    };
  }, [partnerSlug, partner, fetchPartnerBySlug]);

  const plan = getPlanStatus(partner);
  const isOwner =
    isAuthenticated &&
    userRole === 'partner' &&
    currentPartnerId === partner?.id;
  const previewMode = searchParams.get('preview') === '1' && isOwner;

  const pricingMode = useAppStore((state) => state.pricingMode);
  const setPricingMode = useAppStore((state) => state.setPricingMode);
  const cart = useAppStore((state) => state.cart);
  const addToCart = useAppStore((state) => state.addToCart);
  const openBookingModal = useAppStore((state) => state.openBookingModal);
  const setCartDrawerOpen = useAppStore((state) => state.setCartDrawerOpen);

  const categories = getTenantCatalog(partner);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');

  if (loadingPartner) {
    return (
      <div className="min-h-screen bg-[#FAFAFB] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#B8A9D4] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-[0.16em] font-medium text-stone-400 font-heroSans">Loading studio…</p>
        </div>
      </div>
    );
  }

  if (!partner) return <TenantNotFound />;
  if (!plan.active && !previewMode) {
    return <TenantOffline brandName={partner.brandName} isOwnerPreview={isOwner} />;
  }

  const providerObj = tenantToStorefrontProfile(partner);

  const isCartItem = (serviceId) => cart.some((c) => c.id === serviceId);

  const offersHome = /home/i.test(partner?.typeLabel || '');
  const offersStudio = /studio/i.test(partner?.typeLabel || '');
  const offersBoth = offersHome && offersStudio;

  const handleBookSingle = (service) => {
    const price = serviceUptoPrice(service);
    openBookingModal({
      provider: providerObj,
      partnerId: partner.id,
      partnerSlug: partner.slug,
      serviceName: service.name,
      amount: price,
      pricingMode,
      serviceId: service.id,
      salonId: partner.salonId || null,
      whatsappNumber: partner.whatsappNumber || partner.ownerPhone || '',
    });
  };

  return (
    <div className="bg-[#FAFAFB] text-[#1C1917] font-heroSans antialiased min-h-screen selection:bg-[#EDE9FE] selection:text-[#1C1917]">
      <TenantHeader partner={partner} />

      {previewMode && (
        <div className="bg-[#F3EEF8] border-b border-[#E4D9F0] text-center py-2.5 text-[12px] font-heroSans text-[#4A3F5C]">
          Owner preview — clients cannot see this site while the plan is inactive
        </div>
      )}

      <section className="relative w-full h-80 sm:h-[28rem] bg-stone-200 overflow-hidden">
        {providerObj.imageUrl ? (
          <img
            src={providerObj.imageUrl}
            alt={providerObj.name}
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full bg-stone-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

        <div className="absolute bottom-8 sm:bottom-12 left-5 sm:left-10 right-5 sm:right-10 z-10 text-white space-y-3 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="text-[11px] tracking-[0.16em] uppercase font-medium bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/25">
              {providerObj.typeLabel}
            </span>
            {providerObj.reviewCount !== '0' && (
              <div className="flex items-center gap-1 bg-white/95 text-[#1C1917] px-2.5 py-1 rounded-full text-[11px] font-medium">
                <Star size={11} className="fill-[#B8A9D4] text-[#B8A9D4]" />
                <span>{providerObj.rating} ({providerObj.reviewCount} reviews)</span>
              </div>
            )}
          </div>

          <h1 className="font-heroSans text-3xl sm:text-5xl tracking-tight font-semibold text-white">
            {providerObj.name}
          </h1>

          <p className="text-sm sm:text-base text-white/80 font-light max-w-2xl leading-relaxed">
            {providerObj.description}
          </p>
        </div>
      </section>

      <main className="max-w-[1100px] mx-auto px-5 sm:px-8 py-10 sm:py-16 space-y-12">
        <div className="p-6 sm:p-8 rounded-[22px] border border-stone-200/70 bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-stone-600">
              <MapPin size={14} className="text-[#111111]" />
              <span>{providerObj.location || 'Private bookings'}</span>
            </div>
            <p className="text-[11px] text-stone-500 font-light">
              Book this studio directly. This page does not list other brands.
            </p>
          </div>

          {offersBoth && (
            <div className="space-y-1.5 w-full md:w-auto">
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 block">
                Visit type
              </span>
              <div className="flex p-1 bg-[#F7F6F8] rounded-full text-[12px] font-medium">
                <button
                  type="button"
                  onClick={() => setPricingMode('HOME_VISIT')}
                  className={`px-4 py-2 flex items-center gap-1.5 rounded-full ${
                    pricingMode === 'HOME_VISIT' ? 'bg-white text-[#1C1917] shadow-sm' : 'text-stone-500 hover:text-[#1C1917]'
                  }`}
                >
                  <Home size={13} />
                  At home
                </button>
                <button
                  type="button"
                  onClick={() => setPricingMode('IN_SALON')}
                  className={`px-4 py-2 flex items-center gap-1.5 rounded-full ${
                    pricingMode === 'IN_SALON' ? 'bg-white text-[#1C1917] shadow-sm' : 'text-stone-500 hover:text-[#1C1917]'
                  }`}
                >
                  <Building2 size={13} />
                  In studio
                </button>
              </div>
            </div>
          )}
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-stone-500">This studio has not published services yet.</p>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto no-scrollbar sticky top-[68px] bg-[#FAFAFB]/90 backdrop-blur-md z-30 py-3">
              {categories.map((cat) => {
                const isSelected = (activeCategory || categories[0].id) === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 text-[13px] font-medium transition-all whitespace-nowrap rounded-full border ${isSelected
                        ? 'bg-[#F3EEF8] text-[#4A3F5C] border-[#E4D9F0]'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                      }`}
                  >
                    {cat.categoryName.split('&')[0].trim()} ({cat.services.length})
                  </button>
                );
              })}
            </div>

            {categories
              .filter((cat) => cat.id === (activeCategory || categories[0].id))
              .map((cat) => (
                <section key={cat.id} className="space-y-6">
                  <div className="border-b border-stone-200 pb-2">
                    <h2 className="font-heroSans text-xl font-semibold tracking-tight text-[#1C1917]">
                      {cat.categoryName}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cat.services.map((service) => {
                      const cap = serviceUptoPrice(service);
                      const inCart = isCartItem(service.id);

                      return (
                        <div
                          key={service.id}
                          className="rounded-[22px] border border-stone-200/70 bg-white flex flex-col hover:border-stone-300 transition-colors overflow-hidden"
                        >
                          {service.imageUrl ? (
                            <div className="h-40 bg-stone-100 overflow-hidden">
                              <img src={service.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                          ) : null}
                          <div className="p-5 flex flex-col justify-between flex-1">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start gap-3">
                              <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-stone-500 flex items-center gap-1">
                                <Clock size={11} />
                                <span>{service.duration}</span>
                              </span>
                              <span className="font-mono text-sm font-bold text-[#111111] whitespace-nowrap">
                                {formatUptoPrice(cap)}
                              </span>
                            </div>
                            <h3 className="font-heroSans text-base font-semibold tracking-tight text-[#1C1917]">
                              {service.name}
                            </h3>
                            {service.description ? (
                              <p className="text-xs text-stone-600 font-light leading-relaxed">
                                {service.description}
                              </p>
                            ) : null}
                          </div>

                          <div className="pt-5 border-t border-stone-100 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                addToCart({
                                  ...service,
                                  category: cat.categoryName,
                                  uptoPrice: cap,
                                  homePrice: cap,
                                  inSalonPrice: cap,
                                  partnerId: partner.id,
                                });
                              }}
                              className={`flex-1 py-2.5 text-[12px] font-medium rounded-full border transition-colors flex items-center justify-center gap-1 ${inCart
                                  ? 'bg-[#F3EEF8] border-[#E4D9F0] text-[#4A3F5C]'
                                  : 'border-stone-200 text-[#1C1917] hover:border-stone-400'
                                }`}
                            >
                              {inCart ? (
                                <>
                                  <Check size={12} />
                                  <span>In Bag</span>
                                </>
                              ) : (
                                <>
                                  <Plus size={12} />
                                  <span>Add to Bag</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleBookSingle(service)}
                              className="flex-1 rounded-full bg-[#1C1917] text-white py-2.5 text-[12px] font-medium hover:bg-black transition-colors"
                            >
                              Book
                            </button>
                          </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
          </>
        )}

        <section className="p-6 sm:p-8 rounded-[22px] border border-stone-200/70 bg-white space-y-2">
          <div className="flex items-center gap-2 text-[13px] font-medium text-[#1C1917]">
            <ShieldCheck size={16} />
            <span>Pay {partner.brandName} directly</span>
          </div>
          <p className="text-xs text-stone-600 font-light leading-relaxed">
            Cash, UPI, or card at the time of service. Menu prices are fixed.
          </p>
        </section>
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-[#1C1917] text-white p-4 rounded-full shadow-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-70">
              {cart.length} {cart.length === 1 ? 'Service' : 'Services'} Selected
            </span>
            <div className="text-xs font-mono font-bold">
              {formatUptoPrice(cart.reduce((sum, item) => sum + serviceUptoPrice(item), 0))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            className="bg-white text-[#1C1917] px-4 py-2 text-[12px] font-medium rounded-full hover:bg-stone-100 transition-colors"
          >
            Review Selection →
          </button>
        </div>
      )}
    </div>
  );
}
