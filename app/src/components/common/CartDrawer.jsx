import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, ArrowRight, Home, Building2, ShieldCheck, Clock } from 'lucide-react';

export function CartDrawer() {
  const cartDrawerOpen = useAppStore((state) => state.cartDrawerOpen);
  const setCartDrawerOpen = useAppStore((state) => state.setCartDrawerOpen);
  const cart = useAppStore((state) => state.cart);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const clearCart = useAppStore((state) => state.clearCart);
  const pricingMode = useAppStore((state) => state.pricingMode);
  const setPricingMode = useAppStore((state) => state.setPricingMode);
  const openBookingModal = useAppStore((state) => state.openBookingModal);
  const openAuthModal = useAppStore((state) => state.openAuthModal);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!cartDrawerOpen) return null;

  const totalAmount = cart.reduce((sum, item) => {
    const price = pricingMode === 'HOME_VISIT' ? (item.homePrice || item.price) : (item.inSalonPrice || item.price);
    return sum + Number(price || 0);
  }, 0);

  const handleProceed = () => {
    if (cart.length === 0) return;
    
    // Open Booking Modal with selected cart items
    openBookingModal({
      services: cart,
      pricingMode,
      totalAmount,
      serviceName: cart.map(c => c.name).join(', ')
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCartDrawerOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Slide-out Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-[#FFFFFF] w-full max-w-md h-full z-10 shadow-2xl flex flex-col justify-between border-l border-stone-200"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#111111]" />
              <h2 className="font-serif text-lg tracking-wider uppercase font-normal text-[#111111]">
                Your Selection ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="text-stone-400 hover:text-[#111111] transition-colors p-1"
              aria-label="Close bag"
            >
              <X size={18} />
            </button>
          </div>

          {/* Service Pricing Mode Switcher */}
          <div className="px-6 py-3 bg-[#F9F9F9] border-b border-stone-200 space-y-1.5">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 block">
              Treatment Mode
            </span>
            <div className="grid grid-cols-2 p-1 bg-white border border-stone-200 rounded-sm text-[11px] tracking-wider uppercase font-semibold">
              <button
                type="button"
                onClick={() => setPricingMode('HOME_VISIT')}
                className={`py-1.5 flex items-center justify-center gap-1.5 transition-all ${
                  pricingMode === 'HOME_VISIT'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-stone-600 hover:text-[#111111]'
                }`}
              >
                <Home size={12} />
                <span>At-Home Visit</span>
              </button>
              <button
                type="button"
                onClick={() => setPricingMode('IN_SALON')}
                className={`py-1.5 flex items-center justify-center gap-1.5 transition-all ${
                  pricingMode === 'IN_SALON'
                    ? 'bg-[#111111] text-white shadow-sm'
                    : 'text-stone-600 hover:text-[#111111]'
                }`}
              >
                <Building2 size={12} />
                <span>In-Studio</span>
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <ShoppingBag size={32} className="text-stone-300 stroke-[1.5]" />
                <div className="space-y-1">
                  <p className="text-xs tracking-[0.2em] uppercase font-semibold text-stone-700">
                    Your bag is empty
                  </p>
                  <p className="text-xs text-stone-500 font-light max-w-xs">
                    Explore curated mobile specialists &amp; boutique parlors to add treatments.
                  </p>
                </div>
                <button
                  onClick={() => setCartDrawerOpen(false)}
                  className="mt-2 bg-[#111111] text-white px-5 py-2 text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-black"
                >
                  Explore Services
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = pricingMode === 'HOME_VISIT' 
                  ? (item.homePrice || item.price) 
                  : (item.inSalonPrice || item.price);

                return (
                  <div 
                    key={item.id}
                    className="p-4 border border-stone-200 bg-[#FFFFFF] space-y-3 hover:border-stone-400 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-stone-500">
                          {item.category || 'Treatment'}
                        </span>
                        <h4 className="text-xs font-semibold text-[#111111] tracking-wide">
                          {item.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-stone-700 p-1 transition-colors"
                        title="Remove service"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
                      <div className="flex items-center gap-1 text-stone-500 text-[11px]">
                        <Clock size={12} />
                        <span>{item.duration || '60 mins'}</span>
                      </div>
                      <div className="font-mono font-bold text-[#111111]">
                        ₹{Number(itemPrice).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Total and Payment Disclosure Notice */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-[#F9F9F9] space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs tracking-wider uppercase text-stone-600">
                  <span>Selected Mode:</span>
                  <span className="font-semibold text-[#111111]">
                    {pricingMode === 'HOME_VISIT' ? 'Home Service' : 'In-Studio'}
                  </span>
                </div>
                <div className="flex justify-between text-sm tracking-wider uppercase font-bold text-[#111111]">
                  <span>Total Estimated Price:</span>
                  <span className="font-mono text-base">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Exact Payment Disclosure Badge */}
              <div className="border border-stone-300 bg-white p-2.5 rounded-sm text-[10px] text-stone-700 leading-relaxed flex items-start gap-2">
                <ShieldCheck size={14} className="text-[#111111] shrink-0 mt-0.5" />
                <span>
                  Pay directly to the service provider at the time of service via Cash, UPI, or Card.
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleProceed}
                  className="w-full bg-[#111111] text-white py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Select Date &amp; Time</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-[10px] tracking-wider uppercase text-stone-500 hover:text-[#111111] py-1"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
