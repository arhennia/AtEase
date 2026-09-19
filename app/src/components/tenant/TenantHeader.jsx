import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export function TenantHeader({ partner }) {
  const cart = useAppStore((s) => s.cart);
  const setCartDrawerOpen = useAppStore((s) => s.setCartDrawerOpen);
  const cartCount = cart.length;

  return (
    <header className="sticky top-0 w-full z-40 bg-white/85 backdrop-blur-md border-b border-stone-200/70">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {partner?.logoUrl ? (
            <img src={partner.logoUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
          ) : null}
          <span className="font-heroSans text-lg sm:text-xl font-semibold tracking-tight truncate text-[#1C1917]">
            {partner?.brandName || 'Studio'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setCartDrawerOpen(true)}
          className="relative p-2.5 rounded-full text-[#1C1917] hover:bg-stone-100 flex items-center gap-1.5"
          aria-label="Shopping Bag"
        >
          <ShoppingBag size={19} />
          {cartCount > 0 && (
            <span className="bg-[#B8A9D4] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
