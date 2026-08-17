import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MapPin, Navigation, Check, ShieldCheck } from 'lucide-react';
import { BHUBANESWAR_LOCALITIES } from '../../data/mockProviders';

export function CoverageRadiusEditor() {
  const coverageRadius = useAppStore((state) => state.coverageRadius);
  const setCoverageRadius = useAppStore((state) => state.setCoverageRadius);
  const coverageAreas = useAppStore((state) => state.coverageAreas);
  const toggleCoverageArea = useAppStore((state) => state.toggleCoverageArea);
  const showToast = useAppStore((state) => state.showToast);

  const handleSliderChange = (e) => {
    setCoverageRadius(Number(e.target.value));
  };

  const handleSave = () => {
    showToast(`Coverage radius saved at ${coverageRadius} km.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <h3 className="font-serif text-lg tracking-wide uppercase font-normal text-[#111111]">
          Mobile Service Coverage &amp; Working Radius
        </h3>
        <p className="text-xs text-stone-500 font-light mt-0.5">
          Define the geographical reach for your mobile at-home beauty &amp; wellness appointments.
        </p>
      </div>

      {/* Radius Slider Section */}
      <div className="p-6 border border-stone-200 bg-[#FFFFFF] space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500">
              Active Radius
            </span>
            <div className="font-mono text-2xl font-bold text-[#111111]">
              {coverageRadius} km <span className="text-xs font-sans font-normal text-stone-500">from Base Location</span>
            </div>
          </div>
          <div className="p-3 bg-[#F9F9F9] border border-stone-200 text-xs font-mono font-bold text-[#111111]">
            Base: Patia, Bhubaneswar
          </div>
        </div>

        <input
          type="range"
          min="3"
          max="35"
          step="1"
          value={coverageRadius}
          onChange={handleSliderChange}
          className="w-full accent-[#111111] cursor-pointer h-2 bg-stone-200 rounded-none"
        />

        <div className="flex justify-between text-[10px] tracking-wider text-stone-500 uppercase">
          <span>3 km (Local Colony)</span>
          <span>15 km (Greater City)</span>
          <span>35 km (Full Metro &amp; Suburbs)</span>
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
                className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                  isCovered
                    ? 'border-[#111111] bg-[#111111] text-white'
                    : 'border-stone-200 bg-[#F9F9F9] text-stone-700 hover:border-stone-400'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold uppercase tracking-wider truncate">
                    {loc.name.split('&')[0].trim()}
                  </div>
                  <div className={`text-[9px] ${isCovered ? 'text-white/70' : 'text-stone-400'}`}>
                    {isCovered ? 'Active Coverage' : 'Off Route'}
                  </div>
                </div>
                {isCovered && <Check size={14} className="text-white shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Trigger */}
      <div className="pt-2">
        <button
          onClick={handleSave}
          className="bg-[#111111] text-white px-6 py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-black transition-colors"
        >
          Save Coverage Preferences
        </button>
      </div>
    </div>
  );
}
