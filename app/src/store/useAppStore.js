import { create } from 'zustand';
import { createSeedPartners } from '../data/tenants';
import {
  addDaysIso,
  getPlanStatus,
  getTenantByEmail,
  getTenantById,
  getTenantBySlug,
  slugify,
  TRIAL_DAYS,
} from '../lib/tenancy';
import {
  signUpProvider,
  signInProvider,
  signOutProvider,
  fetchBrandOwnerByUserId,
  fetchBrandOwnerBySlug,
  fetchServicesByOwnerId,
  createBrandOwnerRecord,
  createServicesRecords,
  mapBrandOwnerFromDb,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabase';

const PERSIST_KEY = 'atease-whitelabel-v1';

function loadPersisted() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(PERSIST_KEY)) || {};
  } catch {
    return {};
  }
}

function persistSlice(state) {
  if (typeof window === 'undefined') return;
  const slice = {
    isAuthenticated: state.isAuthenticated,
    userRole: state.userRole,
    userName: state.userName,
    userEmail: state.userEmail,
    currentPartnerId: state.currentPartnerId,
    partners: state.partners,
    appointments: state.appointments,
  };
  window.localStorage.setItem(PERSIST_KEY, JSON.stringify(slice));
}

const persisted = loadPersisted();
const seedPartners = createSeedPartners();

export const useAppStore = create((set, get) => ({
  userRole: persisted.userRole ?? null,
  isAuthenticated: persisted.isAuthenticated ?? false,
  userName: persisted.userName ?? 'Aisha',
  userEmail: persisted.userEmail ?? '',
  userPhone: '+91 98765 43210',

  partners: persisted.partners?.length ? persisted.partners : seedPartners,
  currentPartnerId: persisted.currentPartnerId ?? null,

  setUserRole: (role) => {
    set({ userRole: role });
    persistSlice(get());
  },

  login: (role = 'partner', extras = {}) => {
    const next = {
      isAuthenticated: true,
      userRole: role === 'client' ? 'client' : 'partner',
      authModalOpen: false,
      ...extras,
    };
    set(next);
    persistSlice(get());
  },

  loginPartner: async ({ email, password, partnerId } = {}) => {
    // 1. Try Supabase sign in if credentials provided
    if (isSupabaseConfigured && email && password) {
      const authRes = await signInProvider({ email, password });
      if (authRes.ok && authRes.user) {
        const user = authRes.user;
        const brandRow = await fetchBrandOwnerByUserId(user.id);
        if (brandRow) {
          const services = await fetchServicesByOwnerId(brandRow.id);
          const partner = mapBrandOwnerFromDb(brandRow, services);
          const partners = get().partners;
          set({
            partners: [...partners.filter((p) => p.id !== partner.id), partner],
            isAuthenticated: true,
            userRole: 'partner',
            userName: partner.ownerName || partner.brandName,
            userEmail: partner.ownerEmail,
            currentPartnerId: partner.id,
            authModalOpen: false,
          });
          persistSlice(get());
          return { ok: true, partner };
        } else {
          set({
            pendingSignup: {
              email: user.email,
              ownerName: user.user_metadata?.owner_name || user.email.split('@')[0],
              userId: user.id,
            },
            isAuthenticated: true,
            userRole: 'partner',
            userEmail: user.email,
          });
          return { ok: true, needsOnboarding: true };
        }
      }
      if (!authRes.ok && email !== 'aisha@rajkumari.studio') {
        return { ok: false, error: authRes.error };
      }
    }

    // 2. Local / Demo partner fallback
    const partners = get().partners;
    const partner =
      getTenantById(partners, partnerId) ||
      getTenantByEmail(partners, email) ||
      getTenantByEmail(partners, 'aisha@rajkumari.studio');

    if (!partner) {
      return { ok: false, error: 'No partner account found for that email.' };
    }

    set({
      isAuthenticated: true,
      userRole: 'partner',
      userName: partner.ownerName || partner.brandName,
      userEmail: partner.ownerEmail,
      currentPartnerId: partner.id,
      authModalOpen: false,
    });
    persistSlice(get());
    return { ok: true, partner };
  },

  signupPartner: async ({ email, password, ownerName }) => {
    if (isSupabaseConfigured) {
      const res = await signUpProvider({ email, password, ownerName });
      if (!res.ok) {
        return { ok: false, error: res.error };
      }
      if (!res.session) {
        await signInProvider({ email, password });
      }
      set({
        pendingSignup: {
          email: email.trim().toLowerCase(),
          password: password || '',
          ownerName: ownerName?.trim() || email.split('@')[0],
          userId: res.user?.id,
        },
      });
      return { ok: true, user: res.user };
    }

    const partners = get().partners;
    if (getTenantByEmail(partners, email)) {
      return { ok: false, error: 'An account already exists for this email.' };
    }
    set({
      pendingSignup: {
        email: email.trim().toLowerCase(),
        password: password || '',
        ownerName: ownerName?.trim() || email.split('@')[0],
      },
    });
    return { ok: true };
  },

  completeOnboarding: async ({ brandName, logoUrl, theme, servicesText, location, description }) => {
    const pending = get().pendingSignup || {};
    const baseSlug = slugify(brandName) || `studio-${Date.now().toString(36)}`;
    let slug = baseSlug;
    const partners = get().partners;
    let n = 2;
    while (getTenantBySlug(partners, slug)) {
      slug = `${baseSlug}-${n++}`;
    }

    const servicesList = (servicesText || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (isSupabaseConfigured) {
      let userId = pending.userId;
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;
      }

      if (userId) {
        const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();
        const brandPayload = {
          user_id: userId,
          brand_name: brandName.trim(),
          owner_name: pending.ownerName || 'Studio Owner',
          owner_email: pending.email,
          slug,
          professional_title: 'Independent Studio',
          description: description || '',
          logo_url: logoUrl || '',
          cover_url: logoUrl || '',
          location: location || '',
          theme: { accent: theme || '#111111', mode: 'light' },
          subscription_status: 'trial',
          trial_ends_at: trialEndsAt,
          is_active: true,
        };

        const createRes = await createBrandOwnerRecord(brandPayload);
        if (!createRes.ok) {
          console.error('Failed to create brand_owner in Supabase:', createRes.error);
        } else {
          const brandRow = createRes.data;
          let dbServices = [];
          if (servicesList.length > 0) {
            const servicesPayload = servicesList.map((title, idx) => ({
              owner_id: brandRow.id,
              category_name: 'FEATURED SERVICES',
              title,
              description: 'Added during brand onboarding.',
              duration: '60 mins',
              price_salon: 1200,
              price_home: 1500,
              price_fixed: 1500,
              sort_order: idx,
              is_active: true,
            }));
            const servRes = await createServicesRecords(servicesPayload);
            if (servRes.ok) {
              dbServices = servRes.data;
            }
          }

          const partner = mapBrandOwnerFromDb(brandRow, dbServices);
          set({
            partners: [...partners.filter((p) => p.id !== partner.id), partner],
            pendingSignup: null,
            isAuthenticated: true,
            userRole: 'partner',
            userName: partner.ownerName,
            userEmail: partner.ownerEmail,
            currentPartnerId: partner.id,
          });
          persistSlice(get());
          return { ok: true, partner };
        }
      }
    }

    const catalog = servicesList.map((name, idx) => ({
      id: `custom-${idx}`,
      name,
      description: 'Added during brand onboarding.',
      duration: '60 mins',
      inSalonPrice: 1200,
      homePrice: 1500,
    }));

    const partner = {
      id: `partner_${Date.now()}`,
      slug,
      brandName: brandName.trim(),
      professionalTitle: 'Independent Studio',
      ownerEmail: pending.email,
      ownerName: pending.ownerName,
      logoUrl: logoUrl || '',
      coverUrl: logoUrl || '',
      theme: { accent: theme || '#111111', mode: 'light' },
      location: location || '',
      description: description || '',
      typeLabel: 'Private Brand Site',
      rating: '—',
      reviewCount: '0',
      coverageRadiusKm: 10,
      trialEndsAt: addDaysIso(TRIAL_DAYS),
      subscriptionStatus: 'trial',
      catalog: catalog.length
        ? [{ id: 'featured', categoryName: 'FEATURED SERVICES', services: catalog }]
        : [],
    };

    set({
      partners: [...partners, partner],
      pendingSignup: null,
      isAuthenticated: true,
      userRole: 'partner',
      userName: partner.ownerName,
      userEmail: partner.ownerEmail,
      currentPartnerId: partner.id,
    });
    persistSlice(get());
    return { ok: true, partner };
  },

  activateSubscription: (partnerId) => {
    const id = partnerId || get().currentPartnerId;
    set({
      partners: get().partners.map((p) =>
        p.id === id ? { ...p, subscriptionStatus: 'active' } : p
      ),
    });
    persistSlice(get());
    get().showToast('Subscription activated. Your brand site stays live.');
  },

  logout: async () => {
    if (isSupabaseConfigured) {
      await signOutProvider();
    }
    set({
      isAuthenticated: false,
      userRole: null,
      currentPartnerId: null,
      cart: [],
      userEmail: '',
    });
    persistSlice(get());
  },

  fetchPartnerBySlug: async (slug) => {
    if (!slug) return null;
    const local = getTenantBySlug(get().partners, slug);
    if (local) return local;

    if (isSupabaseConfigured) {
      const brandRow = await fetchBrandOwnerBySlug(slug);
      if (brandRow) {
        const services = await fetchServicesByOwnerId(brandRow.id);
        const partner = mapBrandOwnerFromDb(brandRow, services);
        set({
          partners: [...get().partners.filter((p) => p.id !== partner.id), partner],
        });
        return partner;
      }
    }
    return null;
  },

  syncAuthSession: async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const brandRow = await fetchBrandOwnerByUserId(session.user.id);
        if (brandRow) {
          const services = await fetchServicesByOwnerId(brandRow.id);
          const partner = mapBrandOwnerFromDb(brandRow, services);
          set({
            partners: [...get().partners.filter((p) => p.id !== partner.id), partner],
            isAuthenticated: true,
            userRole: 'partner',
            userName: partner.ownerName || partner.brandName,
            userEmail: partner.ownerEmail,
            currentPartnerId: partner.id,
          });
          persistSlice(get());
        }
      }
    } catch (e) {
      console.warn('Session sync failed:', e);
    }
  },

  getCurrentPartner: () => getTenantById(get().partners, get().currentPartnerId),
  getPartnerPlan: () => getPlanStatus(getTenantById(get().partners, get().currentPartnerId)),

  pendingSignup: null,

  cart: [],
  pricingMode: 'HOME_VISIT',
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

  selectedLocation: 'Bhubaneswar, OD',
  selectedLocality: 'Patia & Chandrasekharpur',
  setLocation: (location, locality) =>
    set({
      selectedLocation: location,
      selectedLocality: locality || get().selectedLocality,
      locationModalOpen: false,
    }),

  activeFilter: 'all',
  setActiveFilter: (filter) => set({ activeFilter: filter }),

  selectedCategory: 'ALL',
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

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
      cartDrawerOpen: false,
    });
  },
  closeBookingModal: () => set({ bookingModalOpen: false, bookingModalData: null }),

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

  coverageRadius: 15,
  setCoverageRadius: (radius) => set({ coverageRadius: radius }),

  coverageAreas: [
    'Patia',
    'Chandrasekharpur',
    'Jaydev Vihar',
    'Nayapalli',
    'Saheed Nagar',
    'Khandagiri',
    'Old Town',
    'KIIT Square',
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

  appointments: persisted.appointments?.length
    ? persisted.appointments
    : [
      {
        id: 'ATEASE-84920',
        partnerId: 'partner_rajkumari-beauty',
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
        createdAt: new Date().toISOString(),
      },
      {
        id: 'ATEASE-71829',
        partnerId: 'partner_rajkumari-beauty',
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
        createdAt: new Date().toISOString(),
      },
    ],

  addAppointment: (newAppt) => {
    const partnerId =
      newAppt.partnerId || get().bookingModalData?.provider?.partnerId || get().currentPartnerId;
    const appt = {
      id: newAppt.id || `ATEASE-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      paymentMethod: 'Direct Payment (Cash/UPI/Card)',
      ...newAppt,
      partnerId,
    };
    set({ appointments: [appt, ...get().appointments] });
    persistSlice(get());
    get().showToast('Booking confirmed! Direct payment details recorded.');
    return appt;
  },

  delayAppointment: (appointmentId, minutes = 15) => {
    const updated = get().appointments.map((a) => {
      if (a.id === appointmentId) {
        return {
          ...a,
          time: a.time.includes('Delayed') ? a.time : `${a.time} (+${minutes}m delayed)`,
          isDelayed: true,
        };
      }
      return a;
    });
    set({ appointments: updated });
    persistSlice(get());
    get().showToast(`Appointment delayed by ${minutes} mins. Client notified.`);
  },
}));
