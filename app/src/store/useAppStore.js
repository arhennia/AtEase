import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // Authentication & Role
  userRole: null, // null | 'client' | 'provider'
  isAuthenticated: false,
  userName: 'Namita Mohanty',
  userPhone: '+91 98765 43210',
  
  setUserRole: (role) => set({ userRole: role }),
  
  login: (role = 'client') => set({
    isAuthenticated: true,
    userRole: role,
    authModalOpen: false,
  }),
  
  logout: () => set({
    isAuthenticated: false,
    userRole: null,
    cart: [],
  }),

  // Cart
  cart: [],
  pricingMode: 'HOME_VISIT', // 'IN_SALON' | 'HOME_VISIT'
  setPricingMode: (mode) => set({ pricingMode: mode }),
  
  addToCart: (item) => {
    const { cart } = get();
    const exists = cart.some((i) => i.id === item.id);
    if (!exists) {
      set({ cart: [...cart, item] });
      get().showToast(`Added "${item.name}" to bag`);
    } else {
      get().showToast(`"${item.name}" is already in your bag`);
    }
  },

  removeFromCart: (itemId) => {
    const { cart } = get();
    const item = cart.find((i) => i.id === itemId);
    set({ cart: cart.filter((i) => i.id !== itemId) });
    if (item) {
      get().showToast(`Removed "${item.name}" from bag`);
    }
  },

  clearCart: () => set({ cart: [] }),

  // Discovery Filters & Search
  selectedLocation: 'Bhubaneswar, OD',
  selectedLocality: 'Patia & Chandrasekharpur',
  setLocation: (location, locality) => set({ 
    selectedLocation: location,
    selectedLocality: locality || get().selectedLocality,
    locationModalOpen: false 
  }),

  activeFilter: 'all', // 'all' | 'at-home' | 'in-studio'
  setActiveFilter: (filter) => set({ activeFilter: filter }),

  selectedCategory: 'ALL',
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Modals & Drawers
  authModalOpen: false,
  authModalRole: 'client',
  openAuthModal: (role = 'client') => set({ authModalOpen: true, authModalRole: role }),
  closeAuthModal: () => set({ authModalOpen: false }),

  locationModalOpen: false,
  setLocationModalOpen: (open) => set({ locationModalOpen: open }),

  cartDrawerOpen: false,
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),

  bookingModalOpen: false,
  bookingModalData: null,
  openBookingModal: (data = null) => {
    set({ 
      bookingModalOpen: true, 
      bookingModalData: data,
      cartDrawerOpen: false 
    });
  },
  closeBookingModal: () => set({ bookingModalOpen: false, bookingModalData: null }),

  // Global Toast Notifications
  toastMessage: null,
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 3500);
  },
  hideToast: () => set({ toastMessage: null }),

  // Provider Settings & Business Tools
  coverageRadius: 15, // km
  setCoverageRadius: (radius) => set({ coverageRadius: radius }),
  
  coverageAreas: [
    'Patia',
    'Chandrasekharpur',
    'Jaydev Vihar',
    'Nayapalli',
    'Saheed Nagar',
    'Khandagiri',
    'Old Town',
    'KIIT Square'
  ],
  toggleCoverageArea: (area) => {
    const { coverageAreas } = get();
    if (coverageAreas.includes(area)) {
      set({ coverageAreas: coverageAreas.filter((a) => a !== area) });
    } else {
      set({ coverageAreas: [...coverageAreas, area] });
    }
  },

  businessHours: {
    start: '09:00 AM',
    end: '08:00 PM',
    daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  updateBusinessHours: (hours) => set({ businessHours: { ...get().businessHours, ...hours } }),

  // Live Appointments
  appointments: [
    {
      id: 'ATEASE-84920',
      clientName: 'Priya Menon',
      clientPhone: '+91 98765 43210',
      serviceName: 'Keratin Smoothing Treatment, Organic Glow Facial',
      date: 'Today',
      time: '11:30 AM',
      location: 'Plot No. 42, Unit-III, Kharabela Nagar, Bhubaneswar',
      serviceType: 'at-home',
      status: 'confirmed',
      amount: 4300,
      paymentMethod: 'Direct Payment (Cash/UPI/Card)',
      createdAt: new Date().toISOString()
    },
    {
      id: 'ATEASE-71829',
      clientName: 'Ananya Pattnaik',
      clientPhone: '+91 94370 12345',
      serviceName: 'Luxury HD Bridal Makeover Trial',
      date: 'Tomorrow',
      time: '02:00 PM',
      location: 'Flat 402, Royal Palms, Patia, Bhubaneswar',
      serviceType: 'at-home',
      status: 'confirmed',
      amount: 5500,
      paymentMethod: 'Direct Payment (Cash/UPI/Card)',
      createdAt: new Date().toISOString()
    }
  ],

  addAppointment: (newAppt) => {
    const appt = {
      id: newAppt.id || `ATEASE-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      paymentMethod: 'Direct Payment (Cash/UPI/Card)',
      ...newAppt
    };
    set({ appointments: [appt, ...get().appointments] });
    get().showToast('Booking confirmed! Direct payment details recorded.');
    return appt;
  },

  delayAppointment: (appointmentId, minutes = 15) => {
    const updated = get().appointments.map((a) => {
      if (a.id === appointmentId) {
        return {
          ...a,
          time: a.time.includes('Delayed') ? a.time : `${a.time} (+${minutes}m delayed)`,
          isDelayed: true
        };
      }
      return a;
    });
    set({ appointments: updated });
    get().showToast(`Appointment delayed by ${minutes} mins. Client notified.`);
  }
}));
