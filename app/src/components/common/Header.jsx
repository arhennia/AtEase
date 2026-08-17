import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { 
  MapPin, 
  Search, 
  ShoppingBag, 
  User, 
  LogIn, 
  LogOut, 
  Store, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

export function Header({ isProviderView = false }) {
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const userRole = useAppStore((state) => state.userRole);
  const userName = useAppStore((state) => state.userName);
  const cart = useAppStore((state) => state.cart);
  const selectedLocation = useAppStore((state) => state.selectedLocation);
  const selectedLocality = useAppStore((state) => state.selectedLocality);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const openAuthModal = useAppStore((state) => state.openAuthModal);
  const setLocationModalOpen = useAppStore((state) => state.setLocationModalOpen);
  const setCartDrawerOpen = useAppStore((state) => state.setCartDrawerOpen);
  const logout = useAppStore((state) => state.logout);

  const cartCount = cart.length;

  return (
    <header className="sticky top-0 w-full z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Left Section: Wordmark & Location */}
        <div className="flex items-center gap-4 sm:gap-8">
          <div 
            onClick={() => navigate('/')}
            className="cursor-pointer group flex items-baseline gap-1"
          >
            <span className="font-serif text-xl sm:text-2xl tracking-[0.18em] font-normal text-[#111111] uppercase transition-opacity group-hover:opacity-80">
              AtEase
            </span>
          </div>

          {/* Location Selector Button */}
          <button
            onClick={() => setLocationModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-stone-200 rounded-full hover:border-[#111111] transition-colors text-[11px] tracking-wider uppercase text-[#111111] font-medium bg-[#F9F9F9]"
            title="Change Location"
          >
            <MapPin size={13} className="text-[#111111] shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-[180px]">
              {selectedLocality ? `${selectedLocality.split('&')[0].trim()}, OD` : selectedLocation}
            </span>
            <ChevronDown size={12} className="text-stone-500" />
          </button>
        </div>

        {/* Center: Search Bar (Client View) */}
        {!isProviderView && (
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search salons, home services, or artists..."
              className="w-full bg-[#F9F9F9] border border-stone-200 focus:border-[#111111] focus:bg-[#FFFFFF] text-xs tracking-wider py-2 pl-9 pr-4 rounded-full focus:outline-none transition-all placeholder:text-stone-400 text-[#111111]"
            />
            <Search size={14} className="text-stone-400 absolute left-3 pointer-events-none" />
          </div>
        )}

        {/* Right Section: Actions, Auth & Cart */}
        <div className="flex items-center gap-3 sm:gap-6">
          
          {/* Provider Portal Link (Desktop) */}
          {!isProviderView ? (
            <button
              onClick={() => {
                if (isAuthenticated && userRole === 'provider') {
                  navigate('/provider');
                } else {
                  openAuthModal('provider');
                }
              }}
              className="hidden lg:flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase font-medium text-stone-600 hover:text-[#111111] transition-colors"
            >
              <Store size={13} />
              <span>For Providers</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="hidden sm:flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase font-medium text-stone-600 hover:text-[#111111] transition-colors"
            >
              <span>Client Discovery →</span>
            </button>
          )}

          {/* Cart / Bag Button (Client view) */}
          {!isProviderView && (
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 text-[#111111] hover:opacity-70 transition-opacity flex items-center gap-1.5"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="bg-[#111111] text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center -ml-1">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Login State */}
          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal('client')}
              className="flex items-center gap-1.5 bg-[#111111] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] tracking-[0.15em] uppercase font-medium hover:bg-black transition-colors rounded-sm shadow-sm"
            >
              <LogIn size={13} />
              <span>Login</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 border border-stone-200 hover:border-[#111111] p-1 sm:px-2.5 sm:py-1 rounded-full transition-colors bg-[#F9F9F9]"
              >
                <div className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-[10px] font-bold">
                  {userName.charAt(0)}
                </div>
                <span className="hidden sm:inline text-xs tracking-wider font-medium text-[#111111] truncate max-w-[90px]">
                  {userName.split(' ')[0]}
                </span>
                <ChevronDown size={12} className="text-stone-500 hidden sm:inline" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-[#FFFFFF] border border-stone-200 shadow-xl rounded-sm py-2 z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs font-semibold text-[#111111] truncate">{userName}</p>
                    <p className="text-[10px] text-stone-500 tracking-wider uppercase">
                      Role: {userRole === 'provider' ? 'Independent Provider' : 'Client'}
                    </p>
                  </div>

                  {userRole === 'provider' ? (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/provider');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#111111] hover:bg-[#F9F9F9] flex items-center gap-2 tracking-wider"
                    >
                      <Store size={14} />
                      <span>Provider Dashboard</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        useAppStore.getState().setUserRole('provider');
                        navigate('/provider');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#111111] hover:bg-[#F9F9F9] flex items-center gap-2 tracking-wider"
                    >
                      <Store size={14} />
                      <span>Switch to Provider Mode</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-stone-600 hover:bg-[#F9F9F9] hover:text-[#111111] flex items-center gap-2 tracking-wider border-t border-stone-100"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Mobile Search Bar Row (Client View) */}
      {!isProviderView && (
        <div className="md:hidden px-4 pb-3 pt-1">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search salons, home services, or artists..."
              className="w-full bg-[#F9F9F9] border border-stone-200 focus:border-[#111111] text-xs tracking-wider py-2 pl-9 pr-4 rounded-full focus:outline-none placeholder:text-stone-400 text-[#111111]"
            />
            <Search size={14} className="text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      )}
    </header>
  );
}
