import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function TenantHeader({ partner }) {
  const cart = useAppStore((s) => s.cart);
  const setCartDrawerOpen = useAppStore((s) => s.setCartDrawerOpen);
  const cartCount = cart.length;

  return (
    <header className="sticky top-0 w-full z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {partner?.logoUrl ? (
            <img src={partner.logoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : null}
          <span className="font-serif text-lg sm:text-xl tracking-tight truncate">
            {partner?.brandName || 'Studio'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setCartDrawerOpen(true)}
          className="relative p-2 text-[#111111] hover:opacity-70 flex items-center gap-1.5"
          aria-label="Shopping Bag"
        >
          <ShoppingBag size={19} />
          {cartCount > 0 && (
            <span className="bg-[#111111] text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
