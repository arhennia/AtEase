import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Check } from 'lucide-react';
import { BHUBANESWAR_LOCALITIES } from '../../data/mockProviders';

export function CoverageRadiusEditor() {
  const coverageRadius = useAppStore((state) => state.coverageRadius);
  const setCoverageRadius = useAppStore((state) => state.setCoverageRadius);
  const coverageAreas = useAppStore((state) => state.coverageAreas);
  const toggleCoverageArea = useAppStore((state) => state.toggleCoverageArea);
  const showToast = useAppStore((state) => state.showToast);
  const partners = useAppStore((state) => state.partners);
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const partner = partners.find((p) => p.id === currentPartnerId);

  const handleSliderChange = (e) => {
    setCoverageRadius(Number(e.target.value));
  };

  const handleSave = () => {
    showToast(`Coverage radius saved at ${coverageRadius} km.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heroSans text-xl font-semibold tracking-tight">Service area</h3>
        <p className="text-sm text-stone-500 font-light mt-1">
          How far you’ll travel for home visits.
        </p>
      </div>

      {/* Radius Slider Section */}
      <div className="p-6 rounded-[22px] glass space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500">
              Active Radius
            </span>
            <div className="font-mono text-2xl font-bold text-[#111111]">
              {coverageRadius} km{' '}
              <span className="text-xs font-sans font-normal text-stone-500">
                from {partner?.location || 'your city'}
              </span>
            </div>
          </div>
        </div>

        <input
          type="range"
          min="3"
          max="35"
          step="1"
          value={coverageRadius}
          onChange={handleSliderChange}
          className="w-full accent-[#B8A9D4] cursor-pointer h-2 bg-stone-200 rounded-full"
        />

        <div className="flex justify-between text-[10px] tracking-wider text-stone-500 uppercase">
          <span>3 km</span>
          <span>15 km</span>
          <span>35 km</span>
        </div>
      </div>

      {/* Neighborhood Coverage Checklist */}
      <div className="space-y-3">
        <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-600 block">
          Covered Localities ({coverageAreas.length} Selected)
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BHUBANESWAR_LOCALITIES.map((loc) => {
            const isCovered = coverageAreas.some(a => loc.name.toLowerCase().includes(a.toLowerCase()));
            return (
              <div
                key={loc.id}
                onClick={() => toggleCoverageArea(loc.name.split('&')[0].trim())}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCovered
                    ? 'border-[#E4D9F0] bg-[#F3EEF8] text-[#4A3F5C]'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold uppercase tracking-wider truncate">
                    {loc.name.split('&')[0].trim()}
                  </div>
                  <div className={`text-[9px] ${isCovered ? 'text-[#6D5A8D]' : 'text-stone-400'}`}>
                    {isCovered ? 'Active Coverage' : 'Off Route'}
                  </div>
                </div>
                {isCovered && <Check size={14} className="text-[#6D5A8D] shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Trigger */}
      <div className="pt-2">
        <button
          onClick={handleSave}
          className="rounded-full bg-[#1C1917] text-white px-6 py-3 text-[13px] font-heroSans font-medium hover:bg-black transition-colors"
        >
          Save Coverage Preferences
        </button>
      </div>
    </div>
  );
}
