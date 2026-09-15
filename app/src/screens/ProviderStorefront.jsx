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
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-500">Loading Studio...</p>
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

  const handleBookSingle = (service) => {
    const price = pricingMode === 'HOME_VISIT' ? service.homePrice : service.inSalonPrice;
    openBookingModal({
      provider: providerObj,
      partnerId: partner.id,
      partnerSlug: partner.slug,
      serviceName: service.name,
      amount: price,
      pricingMode
    });
  };

  return (
    <div className="bg-[#FFFFFF] text-[#111111] font-sans antialiased min-h-screen selection:bg-[#111111] selection:text-white">
      <TenantHeader partner={partner} />

      {previewMode && (
        <div className="bg-amber-50 border-b border-amber-200 text-center py-2 text-[10px] tracking-[0.2em] uppercase font-bold text-amber-900">
          Owner preview — clients cannot see this site while the plan is inactive
        </div>
      )}

      <section className="relative w-full h-72 sm:h-96 bg-stone-900 overflow-hidden">
        {providerObj.imageUrl ? (
          <img
            src={providerObj.imageUrl}
            alt={providerObj.name}
            className="w-full h-full object-cover opacity-90"
          />
        ) : (
          <div className="w-full h-full bg-stone-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-6 sm:bottom-10 left-4 sm:left-10 right-4 sm:right-10 z-10 text-white space-y-2 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 border border-white/30">
              {providerObj.typeLabel}
            </span>
            {providerObj.reviewCount !== '0' && (
              <div className="flex items-center gap-1 bg-white text-[#111111] px-2 py-0.5 text-[10px] font-mono font-bold">
                <Star size={11} className="fill-[#111111] text-[#111111]" />
                <span>{providerObj.rating} ({providerObj.reviewCount} reviews)</span>
              </div>
            )}
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl tracking-wide uppercase font-normal text-white">
            {providerObj.name}
          </h1>

          <p className="text-xs sm:text-sm text-white/90 font-light max-w-2xl">
            {providerObj.description}
          </p>
        </div>
      </section>

      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-10">
        <div className="p-6 border border-stone-200 bg-[#F9F9F9] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-stone-600">
              <MapPin size={14} className="text-[#111111]" />
              <span>{providerObj.location || 'Private bookings'}</span>
            </div>
            <p className="text-[11px] text-stone-500 font-light">
              Book this studio directly. This page does not list other brands.
            </p>
          </div>

          <div className="space-y-1.5 w-full md:w-auto">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 block">
              Select Pricing Mode
            </span>
            <div className="flex p-1 bg-white border border-stone-200 rounded-sm text-[11px] tracking-wider uppercase font-semibold">
              <button
                type="button"
                onClick={() => setPricingMode('HOME_VISIT')}
                className={`px-4 py-2 flex items-center gap-1.5 transition-all ${pricingMode === 'HOME_VISIT'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-stone-600 hover:text-[#111111]'
                  }`}
              >
                <Home size={13} />
                <span>At-Home Visit</span>
              </button>
              <button
                type="button"
                onClick={() => setPricingMode('IN_SALON')}
                className={`px-4 py-2 flex items-center gap-1.5 transition-all ${pricingMode === 'IN_SALON'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-stone-600 hover:text-[#111111]'
                  }`}
              >
                <Building2 size={13} />
                <span>In-Studio</span>
              </button>
            </div>
          </div>
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-stone-500">This studio has not published services yet.</p>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-stone-200 pb-3 sticky top-16 sm:top-20 bg-white z-30 pt-2">
              {categories.map((cat) => {
                const isSelected = (activeCategory || categories[0].id) === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-semibold transition-all whitespace-nowrap rounded-full border ${isSelected
                        ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                        : 'bg-[#FFFFFF] text-stone-700 border-stone-200 hover:border-[#111111]'
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
                    <h2 className="font-serif text-xl tracking-wide uppercase font-normal text-[#111111]">
                      {cat.categoryName}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cat.services.map((service) => {
                      const currentPrice = pricingMode === 'HOME_VISIT' ? service.homePrice : service.inSalonPrice;
                      const inCart = isCartItem(service.id);

                      return (
                        <div
                          key={service.id}
                          className="border border-stone-200 bg-[#FFFFFF] p-5 flex flex-col justify-between hover:border-stone-400 hover:shadow-md transition-all"
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-stone-500 flex items-center gap-1">
                                <Clock size={11} />
                                <span>{service.duration}</span>
                              </span>
                              <span className="font-mono text-base font-bold text-[#111111]">
                                ₹{Number(currentPrice).toLocaleString()}
                              </span>
                            </div>
                            <h3 className="font-serif text-base font-semibold tracking-wide text-[#111111]">
                              {service.name}
                            </h3>
                            <p className="text-xs text-stone-600 font-light leading-relaxed">
                              {service.description}
                            </p>
                          </div>

                          <div className="pt-5 border-t border-stone-100 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                addToCart({
                                  ...service,
                                  category: cat.categoryName,
                                  homePrice: service.homePrice,
                                  inSalonPrice: service.inSalonPrice,
                                  partnerId: partner.id,
                                });
                              }}
                              className={`flex-1 py-2 text-[10px] tracking-[0.15em] uppercase font-semibold border transition-colors flex items-center justify-center gap-1 ${inCart
                                  ? 'bg-stone-100 border-stone-300 text-stone-800'
                                  : 'border-stone-300 text-[#111111] hover:border-black'
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
                              className="flex-1 bg-[#111111] text-white py-2 text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-black transition-colors"
                            >
                              Book
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
          </>
        )}

        <section className="p-6 border border-stone-300 bg-[#F9F9F9] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111]">
            <ShieldCheck size={16} />
            <span>Direct Payment Notice</span>
          </div>
          <p className="text-xs text-stone-600 font-light leading-relaxed">
            Pay {partner.brandName} directly at the time of service via Cash, UPI, or Card.
          </p>
        </section>
      </main>

      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-[#111111] text-white p-4 shadow-2xl border border-black flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-70">
              {cart.length} {cart.length === 1 ? 'Service' : 'Services'} Selected
            </span>
            <div className="text-xs font-mono font-bold">
              Total: ₹{cart.reduce((sum, item) => sum + (pricingMode === 'HOME_VISIT' ? item.homePrice : item.inSalonPrice), 0).toLocaleString()}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            className="bg-white text-[#111111] px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-stone-100 transition-colors"
          >
            Review Selection →
          </button>
        </div>
      )}
    </div>
  );
}
