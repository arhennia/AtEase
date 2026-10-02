import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Check } from 'lucide-react';
import { BHUBANESWAR_LOCALITIES } from '../../data/localities';
import { validateRadius } from '../../lib/availability';

function sliderRadius(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 3 || n > 35) return 10;
  return n;
}

export function CoverageRadiusEditor() {
  const saveServiceArea = useAppStore((state) => state.saveServiceArea);
  const showToast = useAppStore((state) => state.showToast);
  const partners = useAppStore((state) => state.partners);
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const partner = partners.find((p) => p.id === currentPartnerId);
  const savedAreas = partner?.serviceArea || [];
  const savedKey = `${partner?.id || ''}|${partner?.coverageRadiusKm ?? ''}|${savedAreas.join(',')}`;

  const [coverageRadius, setCoverageRadius] = useState(sliderRadius(partner?.coverageRadiusKm));
  const [coverageAreas, setCoverageAreas] = useState(savedAreas);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const [, radius, areas] = savedKey.split('|');
    setCoverageRadius(sliderRadius(radius));
    setCoverageAreas(areas ? areas.split(',').filter(Boolean) : []);
  }, [savedKey]);

  const handleSliderChange = (e) => {
    setCoverageRadius(Number(e.target.value));
  };

  const toggleCoverageArea = (area) => {
    setCoverageAreas((current) =>
      current.includes(area) ? current.filter((name) => name !== area) : [...current, area]
    );
  };

  const handleSave = async () => {
    const check = validateRadius(coverageRadius);
    if (!check.ok) {
      setError(check.error);
      showToast(check.error);
      return;
    }
    setSaving(true);
    setError('');
    const res = await saveServiceArea({ radius: coverageRadius, areas: coverageAreas });
    setSaving(false);
    if (!res.ok) {
      setError(res.error || 'Could not save the service area.');
      showToast(res.error || 'Could not save the service area.');
      return;
    }
    const place = partner?.location || 'your city';
    const areaNote = res.areas.length === 0 ? ' No localities selected.' : ` ${res.areas.length} localities.`;
    showToast(`Coverage saved at ${res.radius} km from ${place}.${areaNote}`);
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
        {coverageAreas.length === 0 && (
          <p className="text-xs text-stone-500 font-light">
            No localities selected. The radius still saves, and home visits stay limited to {coverageRadius} km
            {partner?.location ? ` from ${partner.location}` : ''}.
          </p>
        )}

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
      <div className="pt-2 space-y-3">
        {error && <p className="text-xs text-red-700">{error}</p>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-[#1C1917] text-white px-6 py-3 text-[13px] font-heroSans font-medium hover:bg-black transition-colors disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save Coverage Preferences'}
        </button>
      </div>
    </div>
  );
}
