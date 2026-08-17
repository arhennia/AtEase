import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Clock, Calendar, ShieldAlert, Check, Plus, Ban } from 'lucide-react';

export function AvailabilityEditor() {
  const businessHours = useAppStore((state) => state.businessHours);
  const updateBusinessHours = useAppStore((state) => state.updateBusinessHours);
  const showToast = useAppStore((state) => state.showToast);

  const [startTime, setStartTime] = useState(businessHours.start || '09:00 AM');
  const [endTime, setEndTime] = useState(businessHours.end || '08:00 PM');
  const [selectedDays, setSelectedDays] = useState(businessHours.daysOpen || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const [blockedSlots, setBlockedSlots] = useState([
    { id: 'b1', date: 'Today', time: '02:00 PM - 03:30 PM', reason: 'Travel buffer & prep' }
  ]);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [newBlockTime, setNewBlockTime] = useState('04:00 PM - 05:00 PM');

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) return; // Must have at least 1 day
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSaveHours = () => {
    updateBusinessHours({
      start: startTime,
      end: endTime,
      daysOpen: selectedDays
    });
    showToast('Operating schedule updated.');
  };

  const handleAddBlock = (e) => {
    e.preventDefault();
    setBlockedSlots([
      ...blockedSlots,
      { id: `b-${Date.now()}`, date: 'Today', time: newBlockTime, reason: 'Private block' }
    ]);
    setShowBlockModal(false);
    showToast(`Blocked slot: ${newBlockTime}`);
  };

  const handleRemoveBlock = (id) => {
    setBlockedSlots(blockedSlots.filter((b) => b.id !== id));
    showToast('Slot unblocked and reopened.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <h3 className="font-serif text-lg tracking-wide uppercase font-normal text-[#111111]">
          Opening Hours &amp; Booking Availability
        </h3>
        <p className="text-xs text-stone-500 font-light mt-0.5">
          Manage your operational hours, available days, and block emergency time slots.
        </p>
      </div>

      {/* Days Selector */}
      <div className="p-6 border border-stone-200 bg-[#FFFFFF] space-y-4">
        <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 block">
          Operating Days
        </span>
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => {
            const isActive = selectedDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`py-3 text-xs font-semibold uppercase tracking-wider border transition-all ${
                  isActive
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-[#F9F9F9] text-stone-400 border-stone-200 hover:border-stone-400'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

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
              className="w-full bg-[#F9F9F9] border border-stone-200 p-2 text-xs font-mono font-bold text-[#111111] focus:outline-none"
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
              className="w-full bg-[#F9F9F9] border border-stone-200 p-2 text-xs font-mono font-bold text-[#111111] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveHours}
          className="bg-[#111111] text-white px-5 py-2 text-[11px] tracking-[0.15em] uppercase font-bold hover:bg-black transition-colors"
        >
          Save Operating Schedule
        </button>
      </div>

      {/* Blocked Slots Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-600 block">
            Blocked Time Slots &amp; Travel Breaks
          </span>
          <button
            onClick={() => setShowBlockModal(true)}
            className="text-[10px] tracking-wider uppercase font-bold text-stone-600 hover:text-[#111111] border-b border-stone-400 pb-0.5 flex items-center gap-1"
          >
            <Ban size={12} />
            <span>+ Quick Block Slot</span>
          </button>
        </div>

        <div className="space-y-2">
          {blockedSlots.map((block) => (
            <div
              key={block.id}
              className="p-3.5 border border-stone-200 bg-[#F9F9F9] flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="font-mono font-bold text-[#111111]">
                  {block.date} • {block.time}
                </div>
                <div className="text-[10px] text-stone-500">
                  Reason: {block.reason}
                </div>
              </div>
              <button
                onClick={() => handleRemoveBlock(block.id)}
                className="text-[10px] tracking-wider uppercase font-semibold text-stone-500 hover:text-red-700"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm border border-stone-200 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h4 className="font-serif text-base uppercase font-bold">Block Slot</h4>
              <button onClick={() => setShowBlockModal(false)}>✕</button>
            </div>

            <form onSubmit={handleAddBlock} className="space-y-3">
              <div>
                <label className="block text-[10px] tracking-wider uppercase font-semibold mb-1">
                  Time Slot to Block
                </label>
                <select
                  value={newBlockTime}
                  onChange={(e) => setNewBlockTime(e.target.value)}
                  className="w-full bg-[#F9F9F9] border border-stone-200 p-2 text-xs text-[#111111]"
                >
                  <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM (Lunch Break)</option>
                  <option value="03:00 PM - 04:30 PM">03:00 PM - 04:30 PM (Travel Transit)</option>
                  <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM (Private Appointment)</option>
                  <option value="07:00 PM - 08:30 PM">07:00 PM - 08:30 PM (Evening Maintenance)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="w-1/3 border border-stone-200 text-xs py-2 uppercase font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#111111] text-white text-xs py-2 uppercase font-bold"
                >
                  Confirm Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
