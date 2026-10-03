import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { normalizeWorkingHours } from '../../lib/availability';

export function AvailabilityEditor() {
  const partners = useAppStore((state) => state.partners);
  const currentPartnerId = useAppStore((state) => state.currentPartnerId);
  const saveWorkingHours = useAppStore((state) => state.saveWorkingHours);
  const showToast = useAppStore((state) => state.showToast);
  const partner = partners.find((p) => p.id === currentPartnerId);
  const savedHours = normalizeWorkingHours(partner?.workingHours);
  const savedKey = `${partner?.id || ''}|${savedHours.start}|${savedHours.end}|${savedHours.daysOpen.join(',')}`;

  const [startTime, setStartTime] = useState(savedHours.start);
  const [endTime, setEndTime] = useState(savedHours.end);
  const [selectedDays, setSelectedDays] = useState(savedHours.daysOpen);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const [, start, end, days] = savedKey.split('|');
    setStartTime(start || '09:00 AM');
    setEndTime(end || '08:00 PM');
    setSelectedDays(days ? days.split(',').filter(Boolean) : []);
  }, [savedKey]);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const closedDays = daysOfWeek.filter((day) => !selectedDays.includes(day));

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSaveHours = async () => {
    setSaving(true);
    setError('');
    const res = await saveWorkingHours({
      start: startTime,
      end: endTime,
      daysOpen: selectedDays,
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error || 'Could not save hours.');
      showToast(res.error || 'Could not save hours.');
      return;
    }
    showToast('Operating schedule saved.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <h3 className="font-heroSans text-xl font-semibold tracking-tight">Hours</h3>
        <p className="text-sm text-stone-500 font-light mt-1">Days and times clients can book.</p>
      </div>

      {/* Days Selector */}
      <div className="p-6 rounded-[22px] glass space-y-4">
        <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 block">
          Operating Days
        </span>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map((day) => {
            const isActive = selectedDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`min-w-[3.25rem] px-2 py-3 text-xs font-semibold uppercase tracking-wider rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-[#F3EEF8] text-[#4A3F5C] border-[#E4D9F0]'
                    : 'bg-[#F7F6F8] text-stone-400 border-stone-200 hover:border-stone-300'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-stone-500 font-light">
          {closedDays.length === 0
            ? 'Open every day.'
            : closedDays.length === 7
              ? 'Every day is closed. Clients will not see booking times.'
              : `Closed: ${closedDays.join(', ')}. Those days will not offer booking times.`}
        </p>

        {/* Operating Time Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600 mb-1">
              Opening Time
            </label>
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-[#F7F6F8] border border-stone-200 rounded-2xl p-2.5 text-xs font-mono font-bold text-[#1C1917] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase font-semibold text-stone-600 mb-1">
              Closing Time
            </label>
            <input
              type="text"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-[#F7F6F8] border border-stone-200 rounded-2xl p-2.5 text-xs font-mono font-bold text-[#1C1917] focus:outline-none"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-700">{error}</p>}

        <button
          type="button"
          onClick={handleSaveHours}
          disabled={saving}
          className="rounded-full bg-[#1C1917] text-white px-5 py-2.5 text-[13px] font-heroSans font-medium hover:bg-black transition-colors disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save Operating Schedule'}
        </button>
      </div>
    </div>
  );
}
