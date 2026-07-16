import React from 'react';
import { ShoppingCart, Bell } from 'lucide-react';
import { mockUser } from '../data/mockData';

export function TopNav() {
  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md flex items-center justify-between px-container-margin h-14 border-b border-outline-variant/50">
      {/* Brand Logo (Text for now) */}
      <div className="flex items-center">
        <h1 className="text-xl font-serif font-bold text-primary tracking-tight">
          Kumari & Co.
        </h1>
      </div>

      {/* Right side: Profile & Cart */}
      <div className="flex items-center gap-4">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full text-primary hover:bg-surface-container-low transition-colors">
          <ShoppingCart size={20} />
          {/* Optional: Add badge if cart has items */}
        </button>

        <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border border-outline-variant shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
          <img 
            className="w-full h-full object-cover" 
            alt={`Profile of ${mockUser.name}`} 
            src={mockUser.profileImage} 
          />
        </div>
      </div>
    </header>
  );
}
