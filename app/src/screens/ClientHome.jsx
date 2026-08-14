import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PROVIDERS } from '../data/providerData';

const CATEGORIES = [
  'ALL',
  'BEAUTY',
  'HAIR',
  'SKIN',
  'NAILS',
  'MAKEUP',
  'WELLNESS'
];

export function ClientHome() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = PROVIDERS.filter(provider => {
    const matchesSearch = 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'ALL' || 
      provider.categories.some(cat => cat.toUpperCase() === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white text-black font-sans antialiased min-h-screen selection:bg-black selection:text-white">
      
      {/* Top Navigation Header */}
      <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-black/10">
        <div className="max-w-[1300px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          
          {/* Left Brand */}
          <div className="flex items-center gap-6">
            <h1 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-serif text-xl tracking-[0.15em] uppercase font-bold cursor-pointer"
            >
              AtEase
            </h1>
            <button 
              onClick={() => navigate('/provider')}
              className="text-[10px] tracking-[0.2em] uppercase font-semibold text-black/50 hover:text-black transition-colors hidden md:block"
            >
              [ PROVIDER PORTAL ]
            </button>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex items-center relative w-72">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH PROVIDERS & SERVICES..."
              className="w-full bg-transparent border-b border-black/30 focus:border-black text-[10px] tracking-[0.2em] uppercase py-1 pr-6 focus:outline-none placeholder:text-black/40 text-black font-medium"
            />
            <span className="material-symbols-outlined text-xs absolute right-0 text-black/60 pointer-events-none">search</span>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-6 text-[10px] tracking-[0.2em] uppercase font-medium">
            <button 
              onClick={() => navigate('/login')}
              className="hover:opacity-60 transition-opacity"
            >
              ACCOUNT
            </button>
            <button 
              onClick={() => navigate('/provider')}
              className="hover:opacity-60 transition-opacity md:hidden font-semibold border-b border-black pb-0.5"
            >
              PARTNER
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1300px] mx-auto px-6 md:px-10 pt-10 pb-32 space-y-12">

        {/* Hero Editorial Banner */}
        <section className="border-b border-black/10 pb-10 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] tracking-[0.3em] uppercase text-black/50 font-bold block">
                BHUBANESWAR • HOME & IN-STUDIO BEAUTY
              </span>
              <h2 className="font-serif text-3xl md:text-5xl tracking-[0.05em] uppercase font-normal leading-tight">
                CURATED BEAUTY &amp; WELLNESS EXPERTS
              </h2>
              <p className="text-xs md:text-sm tracking-wider text-black/70 font-light leading-relaxed pt-1">
                Discover master aestheticians, hair artists, and wellness specialists delivering luxury treatments to your doorstep.
              </p>
            </div>

            {/* Mobile Search */}
            <div className="w-full md:hidden relative pt-2">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH PROVIDERS OR TREATMENTS..."
                className="w-full bg-transparent border-b border-black py-2 text-xs tracking-widest uppercase focus:outline-none placeholder:text-black/40"
              />
            </div>
          </div>
        </section>

        {/* Category Chips Filter */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-black">
              EXPLORE BY CATEGORY
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 text-[10px] tracking-[0.2em] uppercase font-bold transition-all whitespace-nowrap border ${
                  selectedCategory === cat
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black/20 hover:border-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Providers Grid */}
        <section className="space-y-6 pt-4">
          <div className="border-b border-black pb-3 flex justify-between items-end">
            <h3 className="text-xs md:text-sm tracking-[0.25em] uppercase font-bold text-black">
              FEATURED PROVIDERS ({filteredProviders.length})
            </h3>
            <span className="text-[10px] tracking-[0.2em] text-black/50 uppercase font-semibold">
              VERIFIED AtEase PARTNERS
            </span>
          </div>

          {filteredProviders.length === 0 ? (
            <div className="border border-dashed border-black/30 p-12 text-center space-y-3">
              <p className="text-xs tracking-[0.2em] uppercase font-bold">NO PROVIDERS FOUND</p>
              <p className="text-xs text-black/60 font-light">Try adjusting your search query or selecting a different category.</p>
              <button 
                onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
                className="bg-black text-white px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-bold"
              >
                CLEAR FILTERS
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProviders.map((provider) => (
                <motion.div
                  key={provider.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="border border-black flex flex-col justify-between bg-white group shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="space-y-4 p-6">
                    {/* Cover / Avatar Header */}
                    <div className="relative h-48 w-full overflow-hidden bg-black/5 border border-black/10">
                      <img 
                        src={provider.imageUrl} 
                        alt={provider.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-black text-white px-2.5 py-1 text-[9px] font-mono font-bold tracking-widest uppercase">
                        ★ {provider.rating} ({provider.reviewCount})
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1">
                      <span className="text-[9px] tracking-[0.25em] text-black/50 uppercase font-bold">
                        {provider.title}
                      </span>
                      <h4 className="font-serif text-xl tracking-[0.05em] uppercase font-bold text-black group-hover:underline">
                        {provider.name}
                      </h4>
                      <p className="text-[11px] text-black/60 font-medium tracking-wide">
                        📍 {provider.location}
                      </p>
                    </div>

                    <p className="text-xs text-black/80 font-light leading-relaxed line-clamp-2">
                      {provider.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {provider.tags.map((tag) => (
                        <span key={tag} className="text-[9px] tracking-[0.15em] uppercase font-bold border border-black/20 px-2 py-0.5 text-black/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="border-t border-black p-4 bg-black/[0.02]">
                    <button
                      onClick={() => navigate(provider.storefrontRoute)}
                      className="w-full bg-black text-white py-3 px-4 text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-black/80 transition-colors flex items-center justify-between"
                    >
                      <span>VIEW SERVICES &amp; STOREFRONT</span>
                      <span>→</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Explore Categories Showcase */}
        <section className="pt-8 border-t border-black/10 space-y-6">
          <div className="border-b border-black pb-3">
            <h3 className="text-xs md:text-sm tracking-[0.25em] uppercase font-bold text-black">
              POPULAR SERVICES IN BHUBANESWAR
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              onClick={() => navigate('/storefront/rajkumari-beauty')}
              className="border border-black p-6 cursor-pointer hover:bg-black hover:text-white transition-all space-y-2 group"
            >
              <div className="text-xl">💇‍♀️</div>
              <h4 className="text-xs tracking-[0.2em] uppercase font-bold">HAIR CARE &amp; SPA</h4>
              <p className="text-[10px] opacity-60 font-light">Keratin, Hair Spa, Balayage &amp; Rebonding</p>
            </div>

            <div 
              onClick={() => navigate('/storefront/rajkumari-beauty')}
              className="border border-black p-6 cursor-pointer hover:bg-black hover:text-white transition-all space-y-2 group"
            >
              <div className="text-xl">✨</div>
              <h4 className="text-xs tracking-[0.2em] uppercase font-bold">SKINCARE &amp; FACIALS</h4>
              <p className="text-[10px] opacity-60 font-light">Hydrafacial, Organic Glow &amp; Anti-Aging</p>
            </div>

            <div 
              onClick={() => navigate('/storefront/rajkumari-beauty')}
              className="border border-black p-6 cursor-pointer hover:bg-black hover:text-white transition-all space-y-2 group"
            >
              <div className="text-xl">💅</div>
              <h4 className="text-xs tracking-[0.2em] uppercase font-bold">SPA MANICURE &amp; PEDICURE</h4>
              <p className="text-[10px] opacity-60 font-light">Full Body Polish, De-Tan &amp; Luxury Nails</p>
            </div>

            <div 
              onClick={() => navigate('/storefront/rajkumari-beauty')}
              className="border border-black p-6 cursor-pointer hover:bg-black hover:text-white transition-all space-y-2 group"
            >
              <div className="text-xl">👑</div>
              <h4 className="text-xs tracking-[0.2em] uppercase font-bold">BRIDAL &amp; GLAM MAKEUP</h4>
              <p className="text-[10px] opacity-60 font-light">HD Bridal Makeover &amp; Event Styling</p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-black bg-white py-10 px-6 md:px-10 text-center space-y-3">
        <h2 className="font-serif text-lg tracking-[0.2em] uppercase font-bold">AtEase</h2>
        <p className="text-[10px] tracking-[0.2em] uppercase text-black/50">
          LUXURY BEAUTY &amp; WELLNESS DIRECTORY • BHUBANESWAR, ODISHA
        </p>
      </footer>

    </div>
  );
}
