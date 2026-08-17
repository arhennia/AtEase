import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Edit2, Check, Clock, Home, Building2, Trash2 } from 'lucide-react';
import { RAJKUMARI_PROVIDER_DATA } from '../../data/providerData';

export function ServiceCatalogManager() {
  const showToast = useAppStore((state) => state.showToast);
  const [categories, setCategories] = useState(RAJKUMARI_PROVIDER_DATA.serviceCategories);
  const [activeCatId, setActiveCatId] = useState(RAJKUMARI_PROVIDER_DATA.serviceCategories[0].id);
  const [showAddModal, setShowAddModal] = useState(false);

  // New service form state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('60 mins');
  const [newInSalonPrice, setNewInSalonPrice] = useState(1500);
  const [newHomePrice, setNewHomePrice] = useState(1800);

  const activeCategory = categories.find((c) => c.id === activeCatId) || categories[0];

  const handleUpdatePrice = (serviceId, field, value) => {
    const updated = categories.map((cat) => ({
      ...cat,
      services: cat.services.map((s) => {
        if (s.id === serviceId) {
          return { ...s, [field]: Number(value) };
        }
        return s;
      })
    }));
    setCategories(updated);
  };

  const handleToggleHome = (serviceId) => {
    const updated = categories.map((cat) => ({
      ...cat,
      services: cat.services.map((s) => {
        if (s.id === serviceId) {
          return { ...s, homeAvailable: s.homeAvailable === false ? true : false };
        }
        return s;
      })
    }));
    setCategories(updated);
    showToast('Catalog availability updated.');
  };

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const newService = {
      id: `s-${Date.now()}`,
      name: newServiceName,
      description: newServiceDesc || 'Bespoke beauty treatment tailored to client preferences.',
      duration: newServiceDuration,
      inSalonPrice: Number(newInSalonPrice),
      homePrice: Number(newHomePrice),
      homeAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400'
    };

    const updated = categories.map((cat) => {
      if (cat.id === activeCatId) {
        return {
          ...cat,
          services: [newService, ...cat.services]
        };
      }
      return cat;
    });

    setCategories(updated);
    setShowAddModal(false);
    setNewServiceName('');
    setNewServiceDesc('');
    showToast(`Added "${newService.name}" to catalog.`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-200 pb-4">
        <div>
          <h3 className="font-serif text-lg tracking-wide uppercase font-normal text-[#111111]">
            Service Catalog &amp; Multi-Tier Pricing
          </h3>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Configure In-Salon and Mobile Home Visit pricing for your services.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#111111] text-white px-4 py-2 text-[11px] tracking-[0.15em] uppercase font-bold hover:bg-black transition-colors flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-stone-200 pb-2">
        {categories.map((cat) => {
          const isSelected = activeCatId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCatId(cat.id)}
              className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold transition-all whitespace-nowrap rounded-sm ${
                isSelected
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#F9F9F9] text-stone-600 hover:text-[#111111] border border-stone-200'
              }`}
            >
              {cat.categoryName.split('&')[0].trim()} ({cat.services.length})
            </button>
          );
        })}
      </div>

      {/* Services List Table / Cards */}
      <div className="space-y-3">
        {activeCategory.services.map((service) => (
          <div
            key={service.id}
            className="p-4 border border-stone-200 bg-[#FFFFFF] hover:border-stone-400 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            {/* Left: Info */}
            <div className="space-y-1 md:w-2/5">
              <div className="flex items-center gap-2">
                <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-stone-500">
                  {service.duration}
                </span>
                {service.homeAvailable !== false && (
                  <span className="text-[9px] tracking-wider uppercase font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200">
                    Home Visit Enabled
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-[#111111] tracking-wide">
                {service.name}
              </h4>
              <p className="text-[11px] text-stone-500 font-light line-clamp-1">
                {service.description}
              </p>
            </div>

            {/* Middle: Pricing Inputs */}
            <div className="flex items-center gap-4 sm:gap-6 md:w-2/5">
              <div className="space-y-1">
                <label className="block text-[9px] tracking-[0.2em] uppercase font-semibold text-stone-500">
                  In-Salon (₹)
                </label>
                <input
                  type="number"
                  value={service.inSalonPrice}
                  onChange={(e) => handleUpdatePrice(service.id, 'inSalonPrice', e.target.value)}
                  className="w-24 bg-[#F9F9F9] border border-stone-200 px-2.5 py-1 text-xs font-mono font-bold text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] tracking-[0.2em] uppercase font-semibold text-stone-500">
                  Home Visit (₹)
                </label>
                <input
                  type="number"
                  value={service.homePrice}
                  onChange={(e) => handleUpdatePrice(service.id, 'homePrice', e.target.value)}
                  className="w-24 bg-[#F9F9F9] border border-stone-200 px-2.5 py-1 text-xs font-mono font-bold text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 justify-end w-full md:w-1/5">
              <button
                type="button"
                onClick={() => handleToggleHome(service.id)}
                className={`text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 border transition-colors ${
                  service.homeAvailable !== false
                    ? 'border-stone-300 text-stone-700 hover:bg-stone-50'
                    : 'border-amber-300 text-amber-800 bg-amber-50'
                }`}
              >
                {service.homeAvailable !== false ? 'Disable Home' : 'Enable Home'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md border border-stone-200 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h4 className="font-serif text-base tracking-wider uppercase font-bold text-[#111111]">
                Add New Service
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-black">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-3">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="e.g. Organic Botoplex Therapy"
                  className="w-full bg-[#F9F9F9] border border-stone-200 p-2 text-xs text-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Treatment details and benefits..."
                  className="w-full bg-[#F9F9F9] border border-stone-200 p-2 text-xs text-[#111111] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] tracking-wider uppercase font-semibold text-stone-600 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(e.target.value)}
                    className="w-full bg-[#F9F9F9] border border-stone-200 p-2 text-xs text-[#111111] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider uppercase font-semibold text-stone-600 mb-1">
                    In-Salon (₹)
                  </label>
                  <input
                    type="number"
                    value={newInSalonPrice}
                    onChange={(e) => setNewInSalonPrice(e.target.value)}
                    className="w-full bg-[#F9F9F9] border border-stone-200 p-2 text-xs font-mono font-bold text-[#111111] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider uppercase font-semibold text-stone-600 mb-1">
                    Home (₹)
                  </label>
                  <input
                    type="number"
                    value={newHomePrice}
                    onChange={(e) => setNewHomePrice(e.target.value)}
                    className="w-full bg-[#F9F9F9] border border-stone-200 p-2 text-xs font-mono font-bold text-[#111111] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/3 border border-stone-200 text-xs py-2 uppercase font-medium hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#111111] text-white text-xs py-2 uppercase font-bold hover:bg-black"
                >
                  Publish Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
