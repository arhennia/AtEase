import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Plus, ImagePlus, Trash2 } from 'lucide-react';
import { PRICE_BANDS, formatUptoPrice, presetsForCrafts, serviceUptoPrice } from '../../data/onboardingQuiz';
import { getAuthUser, isSupabaseConfigured, uploadOwnerImage } from '../../lib/supabase';
import { getTenantCatalog } from '../../lib/tenancy';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ServiceCatalogManager() {
  const partners = useAppStore((s) => s.partners);
  const currentPartnerId = useAppStore((s) => s.currentPartnerId);
  const updatePartnerCatalog = useAppStore((s) => s.updatePartnerCatalog);
  const removePartnerService = useAppStore((s) => s.removePartnerService);
  const showToast = useAppStore((s) => s.showToast);
  const partner = partners.find((p) => p.id === currentPartnerId);

  const categories = useMemo(() => {
    const catalog = getTenantCatalog(partner);
    if (catalog.length) return catalog;
    return [{ id: 'menu', categoryName: 'MENU', services: [] }];
  }, [partner]);

  const [activeCatId, setActiveCatId] = useState(categories[0]?.id);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUpto, setNewUpto] = useState(1000);
  const [newImage, setNewImage] = useState('');
  const [uploading, setUploading] = useState('');

  useEffect(() => {
    if (!categories.some((c) => c.id === activeCatId)) {
      setActiveCatId(categories[0]?.id);
    }
  }, [categories, activeCatId]);

  const activeCategory = categories.find((c) => c.id === activeCatId) || categories[0];
  const usedNames = new Set(categories.flatMap((c) => (c.services || []).map((s) => s.name)));
  const suggestions = presetsForCrafts([]).filter((p) => !usedNames.has(p.name)).slice(0, 8);

  const writeCatalog = (next) => {
    updatePartnerCatalog(next);
  };

  const handleUptoChange = (serviceId, value) => {
    const cap = Number(value) || 0;
    writeCatalog(
      categories.map((cat) => ({
        ...cat,
        services: cat.services.map((s) =>
          s.id === serviceId ? { ...s, uptoPrice: cap, inSalonPrice: cap, homePrice: cap } : s
        ),
      }))
    );
  };

  const handleImage = async (serviceId, file) => {
    if (!file) return;
    setUploading(serviceId);
    try {
      const user = await getAuthUser();
      let url = '';
      if (isSupabaseConfigured && user?.id) {
        const uploaded = await uploadOwnerImage(user.id, file);
        url = uploaded.ok ? uploaded.url : '';
      }
      if (!url) url = await readFileAsDataUrl(file);
      writeCatalog(
        categories.map((cat) => ({
          ...cat,
          services: cat.services.map((s) => (s.id === serviceId ? { ...s, imageUrl: url } : s)),
        }))
      );
    } finally {
      setUploading('');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const cap = Number(newUpto) || 1000;
    const newService = {
      id: `s-${Date.now()}`,
      name: newName.trim(),
      description: '',
      duration: '60 mins',
      uptoPrice: cap,
      inSalonPrice: cap,
      homePrice: cap,
      imageUrl: newImage,
    };
    const next = categories.map((cat) =>
      cat.id === (activeCategory?.id || cat.id)
        ? { ...cat, services: [...cat.services, newService] }
        : cat
    );
    writeCatalog(next);
    setShowAddModal(false);
    setNewName('');
    setNewImage('');
    showToast(`Added ${newService.name}.`);
  };

  const handleNewImage = async (file) => {
    if (!file) return;
    setUploading('new');
    try {
      const user = await getAuthUser();
      let url = '';
      if (isSupabaseConfigured && user?.id) {
        const uploaded = await uploadOwnerImage(user.id, file);
        url = uploaded.ok ? uploaded.url : '';
      }
      if (!url) url = await readFileAsDataUrl(file);
      setNewImage(url);
    } finally {
      setUploading('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="font-serif text-xl tracking-tight">Menu</h3>
          <p className="text-sm text-stone-500 font-light mt-1">
            These services appear on your website. Prices show as “upto”, not a fixed rate.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="h-11 px-4 bg-[#111111] text-white text-[11px] tracking-[0.15em] uppercase font-bold inline-flex items-center gap-1.5"
        >
          <Plus size={14} />
          Add service
        </button>
      </div>

      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-stone-200 pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCatId(cat.id)}
              className={`px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold whitespace-nowrap ${
                (activeCatId || categories[0].id) === cat.id
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#F9F9F9] text-stone-600 border border-stone-200'
              }`}
            >
              {cat.categoryName} ({cat.services.length})
            </button>
          ))}
        </div>
      )}

      {(!activeCategory?.services?.length) ? (
        <p className="text-sm text-stone-500 border border-dashed border-stone-200 p-8 text-center">
          No services yet. Add a few so they show on your website.
        </p>
      ) : (
        <div className="space-y-3">
          {activeCategory.services.map((service) => (
            <div
              key={service.id}
              className="p-4 border border-stone-200 grid grid-cols-1 sm:grid-cols-[72px_1fr_auto] gap-4 items-center"
            >
              <label className="w-[72px] h-[72px] border border-stone-200 bg-[#F9F9F9] overflow-hidden cursor-pointer flex items-center justify-center">
                {service.imageUrl ? (
                  <img src={service.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImagePlus size={16} className="text-stone-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImage(service.id, e.target.files?.[0])}
                />
              </label>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-[#111111]">{service.name}</h4>
                <p className="text-xs text-stone-500 mt-0.5">{service.duration}</p>
                <p className="text-[11px] text-stone-400 mt-1">
                  {uploading === service.id ? 'Uploading photo…' : 'Tap the square to add a photo'}
                </p>
              </div>
              <div className="flex items-center gap-3 sm:justify-end">
                <label className="space-y-1">
                  <span className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-stone-400">
                    Upto (₹)
                  </span>
                  <input
                    type="number"
                    value={serviceUptoPrice(service)}
                    onChange={(e) => handleUptoChange(service.id, e.target.value)}
                    className="w-24 bg-[#F9F9F9] border border-stone-200 px-2.5 py-1.5 text-sm font-mono font-bold outline-none focus:border-black"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removePartnerService(service.id)}
                  className="p-2 text-stone-400 hover:text-black"
                  aria-label="Remove service"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white w-full max-w-md border border-stone-200 p-6 space-y-5">
            <div className="flex justify-between items-center">
              <h4 className="font-serif text-lg tracking-tight">Add a service</h4>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-black">
                ✕
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              {suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] tracking-[0.15em] uppercase font-bold text-stone-400">Quick add</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setNewName(item.name)}
                        className={`px-3 py-1.5 text-xs border ${
                          newName === item.name ? 'bg-[#111111] text-white border-[#111111]' : 'border-stone-200'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <label className="block space-y-1">
                <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-stone-400">Name</span>
                <input
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#F9F9F9] border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-black"
                />
              </label>
              <div className="space-y-2">
                <p className="text-[10px] tracking-[0.15em] uppercase font-semibold text-stone-400">Upto price</p>
                <div className="flex flex-wrap gap-2">
                  {PRICE_BANDS.map((band) => (
                    <button
                      key={band.value}
                      type="button"
                      onClick={() => setNewUpto(band.value)}
                      className={`px-3 py-1.5 text-xs border ${
                        newUpto === band.value ? 'bg-[#111111] text-white border-[#111111]' : 'border-stone-200'
                      }`}
                    >
                      {formatUptoPrice(band.value)}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="w-14 h-14 border border-stone-200 bg-[#F9F9F9] overflow-hidden flex items-center justify-center">
                  {newImage ? <img src={newImage} alt="" className="w-full h-full object-cover" /> : <ImagePlus size={16} className="text-stone-400" />}
                </span>
                <span className="text-sm text-stone-600">{uploading === 'new' ? 'Uploading…' : 'Photo for the menu'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleNewImage(e.target.files?.[0])} />
              </label>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="h-11 w-1/3 border border-stone-200 text-xs uppercase">
                  Cancel
                </button>
                <button type="submit" className="h-11 flex-1 bg-[#111111] text-white text-xs tracking-[0.15em] uppercase font-bold">
                  Add to menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
