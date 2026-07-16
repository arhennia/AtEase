import React from 'react';
import { motion } from 'framer-motion';
import { mockCategories, mockUpcomingAppointment, mockRecentBookings, mockOffers } from '../data/mockData';
import { Search, Calendar, Clock } from 'lucide-react';

export function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="px-container-margin pt-4 space-y-5 pb-10"
    >
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={18} className="text-on-surface-variant/60" />
        </div>
        <input 
          className="w-full h-10 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary/20 focus:border-primary/40 text-sm transition-all placeholder:text-on-surface-variant/50 outline-none" 
          placeholder="Search services..." 
          type="text" 
        />
      </div>

      {/* Categories Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-on-surface tracking-tight">Categories</h2>
          <button className="text-xs font-medium text-accent-orange uppercase tracking-wide">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">
          {mockCategories.map(cat => (
            <div key={cat.id} className="flex-shrink-0 flex flex-col items-center gap-1.5 group cursor-pointer">
              <div className={`w-11 h-11 rounded-full ${cat.bgColor} ${cat.textColor} ${cat.border} flex items-center justify-center shadow-sm group-active:scale-95 transition-transform`}>
                <span className="material-symbols-outlined text-xl">{cat.icon}</span>
              </div>
              <span className="text-[11px] font-medium text-on-surface">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Appointment */}
      <section>
        <h2 className="text-base font-semibold text-on-surface mb-2 tracking-tight">Your Next Session</h2>
        <div className="bg-primary text-white p-3.5 rounded-xl shadow-md relative overflow-hidden group border border-primary/20">
          <div className="absolute right-0 top-0 w-20 h-20 bg-white/5 rounded-full -mr-8 -mt-8"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-2.5">
              <div>
                <h3 className="text-base font-semibold leading-tight">{mockUpcomingAppointment.serviceName}</h3>
                <p className="text-[11px] text-white/70 font-light tracking-wide">{mockUpcomingAppointment.staffName}</p>
              </div>
              <div className="bg-white/10 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-widest border border-white/20">
                {mockUpcomingAppointment.status}
              </div>
            </div>
            <div className="flex items-center gap-4 pt-2.5 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="opacity-80" />
                <span className="text-[11px] font-medium">{mockUpcomingAppointment.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="opacity-80" />
                <span className="text-[11px] font-medium">{mockUpcomingAppointment.time}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Bookings */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-base font-semibold text-on-surface tracking-tight">Book Again</h2>
          <button className="text-xs font-medium text-on-surface-variant underline underline-offset-2">History</button>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
          {mockRecentBookings.map(booking => (
            <div key={booking.id} className="flex-shrink-0 w-36 bg-white border border-outline-variant p-2 rounded-lg flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              <div className="w-full h-20 rounded-md overflow-hidden mb-2">
                <img className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all" alt={booking.name} src={booking.image} />
              </div>
              <h4 className="text-[12px] font-semibold text-on-surface truncate mb-1">{booking.name}</h4>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-[10px] font-medium text-on-surface-variant">₹{booking.price}</span>
                <button 
                  onClick={() => navigate('/service')}
                  className="bg-primary text-white px-2.5 py-1 rounded text-[10px] font-semibold tracking-wide"
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offers */}
      <section>
        {mockOffers.map(offer => (
          <div key={offer.id} className="relative w-full h-28 rounded-xl overflow-hidden shadow-sm group cursor-pointer border border-outline-variant mb-4">
            <img className="absolute inset-0 w-full h-full object-cover brightness-[0.8] group-hover:scale-105 transition-transform duration-1000" alt={offer.title} src={offer.image} />
            <div className="absolute inset-0 bg-gradient-to-r from-on-surface/80 via-on-surface/40 to-transparent flex flex-col justify-center px-5">
              <span className="text-[9px] font-bold tracking-widest text-white bg-accent-orange self-start px-2 py-0.5 rounded-sm mb-1 uppercase">{offer.badge}</span>
              <h3 className="text-base font-semibold text-white tracking-tight leading-tight">{offer.title}</h3>
              <p className="text-[11px] text-white/80 font-medium mt-0.5">Code: {offer.code}</p>
            </div>
          </div>
        ))}
      </section>
    </motion.div>
  );
}
