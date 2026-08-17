import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/common/Header';
import { MOCK_PROVIDERS } from '../data/mockProviders';
import { RAJKUMARI_PROVIDER_DATA } from '../data/providerData';
import { 
  MapPin, 
  Star, 
  ArrowLeft, 
  ShoppingBag, 
  Clock, 
  Plus, 
  Check, 
  Home, 
  Building2, 
  ShieldCheck, 
  Phone, 
  Calendar,
  Sparkles
} from 'lucide-react';

export function ProviderStorefront() {
  const navigate = useNavigate();
  const { providerId } = useParams();

  const providerObj = MOCK_PROVIDERS.find((p) => p.slug === providerId || p.id === providerId) || MOCK_PROVIDERS[0];
  const categories = RAJKUMARI_PROVIDER_DATA.serviceCategories;

  const pricingMode = useAppStore((state) => state.pricingMode);
  const setPricingMode = useAppStore((state) => state.setPricingMode);
  const cart = useAppStore((state) => state.cart);
  const addToCart = useAppStore((state) => state.addToCart);
  const openBookingModal = useAppStore((state) => state.openBookingModal);
  const setCartDrawerOpen = useAppStore((state) => state.setCartDrawerOpen);

  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const isCartItem = (serviceId) => cart.some((c) => c.id === serviceId);

  const handleBookSingle = (service) => {
    const price = pricingMode === 'HOME_VISIT' ? service.homePrice : service.inSalonPrice;
    openBookingModal({
      provider: providerObj,
      serviceName: service.name,
      amount: price,
      pricingMode
    });
  };

  return (
    <div className="bg-[#FFFFFF] text-[#111111] font-sans antialiased min-h-screen selection:bg-[#111111] selection:text-white">
      
      {/* Global Header */}
      <Header />

      {/* Storefront Hero Cover */}
      <section className="relative w-full h-72 sm:h-96 bg-stone-900 overflow-hidden">
        <img
          src={providerObj.imageUrl}
          alt={providerObj.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute top-6 left-4 sm:left-10 z-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-[#111111] px-3.5 py-1.5 text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-white transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to Providers</span>
          </button>
        </div>

        {/* Hero Title & Provider Meta on Banner */}
        <div className="absolute bottom-6 sm:bottom-10 left-4 sm:left-10 right-4 sm:right-10 z-10 text-white space-y-2 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 border border-white/30">
              {providerObj.typeLabel}
            </span>
            <div className="flex items-center gap-1 bg-white text-[#111111] px-2 py-0.5 text-[10px] font-mono font-bold">
              <Star size={11} className="fill-[#111111] text-[#111111]" />
              <span>{providerObj.rating} ({providerObj.reviewCount} reviews)</span>
            </div>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl tracking-wide uppercase font-normal text-white">
            {providerObj.name}
          </h1>

          <p className="text-xs sm:text-sm text-white/90 font-light max-w-2xl">
            {providerObj.description}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 space-y-10">
        
        {/* Profile Info Strip & Mode Selector */}
        <div className="p-6 border border-stone-200 bg-[#F9F9F9] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-stone-600">
              <MapPin size={14} className="text-[#111111]" />
              <span>{providerObj.location}</span>
            </div>
            <p className="text-[11px] text-stone-500 font-light">
              Coverage Radius: <strong>{providerObj.coverageRadiusKm} km</strong> from base • Direct client payment (Cash/UPI/Card)
            </p>
          </div>

          {/* Treatment Mode Switcher */}
          <div className="space-y-1.5 w-full md:w-auto">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 block">
              Select Pricing Mode
            </span>
            <div className="flex p-1 bg-white border border-stone-200 rounded-sm text-[11px] tracking-wider uppercase font-semibold">
              <button
                type="button"
                onClick={() => setPricingMode('HOME_VISIT')}
                className={`px-4 py-2 flex items-center gap-1.5 transition-all ${
                  pricingMode === 'HOME_VISIT'
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
                className={`px-4 py-2 flex items-center gap-1.5 transition-all ${
                  pricingMode === 'IN_SALON'
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

        {/* Category Navigation Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-stone-200 pb-3 sticky top-16 sm:top-20 bg-white z-30 pt-2">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-semibold transition-all whitespace-nowrap rounded-full border ${
                  isSelected
                    ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                    : 'bg-[#FFFFFF] text-stone-700 border-stone-200 hover:border-[#111111]'
                }`}
              >
                {cat.categoryName.split('&')[0].trim()} ({cat.services.length})
              </button>
            );
          })}
        </div>

        {/* Services Grid for Active Category */}
        {categories
          .filter((cat) => cat.id === activeCategory)
          .map((cat) => (
            <section key={cat.id} className="space-y-6">
              <div className="border-b border-stone-200 pb-2">
                <h2 className="font-serif text-xl tracking-wide uppercase font-normal text-[#111111]">
                  {cat.categoryName}
                </h2>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Pricing updated for: <strong>{pricingMode === 'HOME_VISIT' ? 'Mobile Home Visit' : 'In-Studio Service'}</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.services.map((service) => {
                  const currentPrice = pricingMode === 'HOME_VISIT' ? service.homePrice : service.inSalonPrice;
                  const inCart = isCartItem(service.id);

                  return (
                    <div
                      key={service.id}
                      className="border border-stone-200 bg-[#FFFFFF] p-5 flex flex-col justify-between hover:border-stone-400 hover:shadow-md transition-all group"
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

                      {/* Action Buttons */}
                      <div className="pt-5 border-t border-stone-100 flex gap-2">
                        <button
                          onClick={() => {
                            addToCart({
                              ...service,
                              category: cat.categoryName,
                              homePrice: service.homePrice,
                              inSalonPrice: service.inSalonPrice
                            });
                          }}
                          className={`flex-1 py-2 text-[10px] tracking-[0.15em] uppercase font-semibold border transition-colors flex items-center justify-center gap-1 ${
                            inCart
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
                          onClick={() => handleBookSingle(service)}
                          className="flex-1 bg-[#111111] text-white py-2 text-[10px] tracking-[0.15em] uppercase font-bold hover:bg-black transition-colors"
                        >
                          Direct Book
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

        {/* Exact Payment Trust Notice */}
        <section className="p-6 border border-stone-300 bg-[#F9F9F9] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111]">
            <ShieldCheck size={16} />
            <span>Direct Payment Notice</span>
          </div>
          <p className="text-xs text-stone-600 font-light leading-relaxed">
            Pay directly to the service provider at the time of service via Cash, UPI, or Card. AtEase charges zero platform commission to independent providers.
          </p>
        </section>

      </main>

      {/* Floating Bag Bar if cart has items */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-[#111111] text-white p-4 shadow-2xl border border-black flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-0.5">
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-70">
              {cart.length} {cart.length === 1 ? 'Service' : 'Services'} Selected
            </span>
            <div className="text-xs font-mono font-bold">
              Total: ₹{cart.reduce((sum, item) => sum + (pricingMode === 'HOME_VISIT' ? item.homePrice : item.inSalonPrice), 0).toLocaleString()}
            </div>
          </div>
          <button
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
