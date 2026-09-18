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
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  fetchBrandOwnerByUserId,
  fetchBrandOwnerBySlug,
  hydratePartner,
  createBrandOwnerRecord,
  createServicesRecords,
  updateServiceRecord,
  deleteServiceRecord,
  createSalonRecord,
  fetchAppointmentsByOwnerId,
  ensureProfile,
  getAuthUser,
  isSupabaseConfigured,
  updateBrandOwnerRecord,
} from '../lib/supabase';
import { isValidWhatsAppNumber, toWhatsAppDigits } from '../lib/whatsapp';

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
    userPhone: state.userPhone,
    currentPartnerId: state.currentPartnerId,
    partners: state.partners,
    appointments: state.appointments,
    pendingSignup: state.pendingSignup,
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
  userPhone: persisted.userPhone ?? '',

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

  applyAuthenticatedUser: async ({ intendedRole = 'client', nextPath } = {}) => {
    const user = await getAuthUser();
    if (!user) return { ok: false, error: 'No active session. Try signing in again.' };

    const profile = await ensureProfile(user, intendedRole);
    const role = profile?.role === 'brand_owner' ? 'partner' : 'client';

    if (role === 'partner') {
      const brandRow = await fetchBrandOwnerByUserId(user.id);
      if (brandRow) {
        const partner = await hydratePartner(brandRow);
        const appointments = await fetchAppointmentsByOwnerId(partner.id);
        set({
          partners: [...get().partners.filter((p) => p.id !== partner.id), partner],
          isAuthenticated: true,
          userRole: 'partner',
          userName: partner.ownerName || partner.brandName,
          userEmail: partner.ownerEmail || user.email || '',
          userPhone: partner.ownerPhone || user.phone || '',
          currentPartnerId: partner.id,
          appointments: appointments.length ? appointments : get().appointments,
          pendingSignup: null,
          authModalOpen: false,
        });
        persistSlice(get());
        return { ok: true, role: 'partner', partner, redirectTo: nextPath || '/dashboard' };
      }

      set({
        pendingSignup: {
          email: user.email,
          ownerName: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
          userId: user.id,
        },
        isAuthenticated: true,
        userRole: 'partner',
        userEmail: user.email || '',
        userPhone: user.phone || '',
        userName: user.user_metadata?.full_name || user.user_metadata?.name || 'Owner',
        authModalOpen: false,
      });
      persistSlice(get());
      return { ok: true, role: 'partner', needsOnboarding: true, redirectTo: '/onboarding' };
    }

    set({
      isAuthenticated: true,
      userRole: 'client',
      userName: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || 'Client',
      userEmail: user.email || profile?.email || '',
      userPhone: user.phone || profile?.phone || '',
      authModalOpen: false,
    });
    persistSlice(get());
    return { ok: true, role: 'client', redirectTo: nextPath || '/' };
  },

  loginPartner: async ({ email, password, partnerId } = {}) => {
    if (isSupabaseConfigured && email && password) {
      const authRes = await signInWithEmail({ email, password });
      if (!authRes.ok) {
        if (email === 'aisha@rajkumari.studio') {
          // fall through to local demo
        } else {
          return { ok: false, error: authRes.error };
        }
      } else {
        return get().applyAuthenticatedUser({ intendedRole: 'brand_owner', nextPath: '/dashboard' });
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
      const res = await signUpWithEmail({ email, password, ownerName, role: 'brand_owner' });
      if (!res.ok) {
        return { ok: false, error: res.error };
      }
      if (!res.session) {
        await signInWithEmail({ email, password });
      }
      set({
        pendingSignup: {
          email: email.trim().toLowerCase(),
          password: password || '',
          ownerName: ownerName?.trim() || email.split('@')[0],
          userId: res.user?.id,
        },
        isAuthenticated: true,
        userRole: 'partner',
        userEmail: email.trim().toLowerCase(),
        userName: ownerName?.trim() || email.split('@')[0],
      });
      persistSlice(get());
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
    persistSlice(get());
    return { ok: true };
  },

  completeOnboarding: async ({
    brandName,
    location,
    visitType,
    crafts,
    uptoPrice,
    services,
    whatsappNumber,
    logoUrl,
    theme,
  }) => {
    const pending = get().pendingSignup || {};
    const baseSlug = slugify(brandName) || `studio-${Date.now().toString(36)}`;
    let slug = baseSlug;
    const partners = get().partners;
    let n = 2;
    while (getTenantBySlug(partners, slug)) {
      slug = `${baseSlug}-${n++}`;
    }

    const selectedServices = (services || []).filter((s) => s.name);
    const defaultUpto = Number(uptoPrice) || 1000;
    const craftLabel = (crafts || []).join(', ') || 'Independent Studio';
    const visitLabel =
      visitType === 'home' ? 'Home visits' : visitType === 'studio' ? 'Studio' : 'Studio & home visits';
    const description = `${craftLabel}. ${visitLabel}.`;

    if (isSupabaseConfigured) {
      let userId = pending.userId;
      if (!userId) {
        const user = await getAuthUser();
        userId = user?.id;
      }

      if (userId) {
        const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();
        const brandPayload = {
          user_id: userId,
          brand_name: brandName.trim(),
          owner_name: pending.ownerName || 'Studio Owner',
          owner_email: pending.email || null,
          owner_phone: get().userPhone || null,
          whatsapp_number: toWhatsAppDigits(whatsappNumber || get().userPhone) || null,
          slug,
          professional_title: craftLabel,
          description,
          type_label: visitLabel,
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
          return { ok: false, error: createRes.error };
        } else {
          const brandRow = createRes.data;
          await createSalonRecord({
            owner_id: brandRow.id,
            name: brandName.trim(),
            address: location || '',
            city: location || '',
            is_primary: true,
          });
          if (selectedServices.length > 0) {
            const servicesPayload = selectedServices.map((svc, idx) => {
              const cap = Number(svc.uptoPrice || defaultUpto);
              return {
                owner_id: brandRow.id,
                category_name: svc.categoryName || 'MENU',
                title: svc.name,
                description: svc.description || '',
                duration: svc.duration || '60 mins',
                price_model: 'starting_at',
                price_fixed: cap,
                price_salon: cap,
                price_home: cap,
                image_url: svc.imageUrl || '',
                sort_order: idx,
                is_active: true,
              };
            });
            await createServicesRecords(servicesPayload);
          }

          const partner = await hydratePartner(brandRow);
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

    const catalogServices = selectedServices.map((svc, idx) => {
      const cap = Number(svc.uptoPrice || defaultUpto);
      return {
        id: svc.id || `custom-${idx}`,
        name: svc.name,
        description: svc.description || '',
        duration: svc.duration || '60 mins',
        uptoPrice: cap,
        inSalonPrice: cap,
        homePrice: cap,
        imageUrl: svc.imageUrl || '',
        pricingModel: 'starting_at',
      };
    });

    const partner = {
      id: `partner_${Date.now()}`,
      slug,
      brandName: brandName.trim(),
      professionalTitle: craftLabel,
      ownerEmail: pending.email,
      ownerName: pending.ownerName,
      logoUrl: logoUrl || '',
      coverUrl: logoUrl || '',
      theme: { accent: theme || '#111111', mode: 'light' },
      location: location || '',
      description,
      typeLabel: visitLabel,
      rating: '—',
      reviewCount: '0',
      coverageRadiusKm: 10,
      trialEndsAt: addDaysIso(TRIAL_DAYS),
      subscriptionStatus: 'trial',
      whatsappNumber: toWhatsAppDigits(whatsappNumber || get().userPhone),
      catalog: catalogServices.length
        ? [{ id: 'menu', categoryName: 'MENU', services: catalogServices }]
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

  updatePartnerCatalog: async (catalog) => {
    const id = get().currentPartnerId;
    if (!id) return;
    set({
      partners: get().partners.map((p) => (p.id === id ? { ...p, catalog } : p)),
    });
    persistSlice(get());

    if (!isSupabaseConfigured) return;
    const partner = get().partners.find((p) => p.id === id);
    if (!partner) return;

    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const flat = (catalog || []).flatMap((cat, catIdx) =>
      (cat.services || []).map((svc, idx) => ({
        ...svc,
        categoryName: cat.categoryName || 'MENU',
        sortOrder: catIdx * 50 + idx,
      }))
    );

    let inserted = false;
    for (const svc of flat) {
      const cap = Number(svc.uptoPrice || svc.inSalonPrice || svc.homePrice || 0);
      const patch = {
        category_name: svc.categoryName,
        title: svc.name,
        description: svc.description || '',
        duration: svc.duration || '60 mins',
        price_model: 'starting_at',
        price_fixed: cap,
        price_salon: cap,
        price_home: cap,
        image_url: svc.imageUrl || '',
        sort_order: svc.sortOrder,
        is_active: true,
      };
      if (uuidRe.test(svc.id)) {
        await updateServiceRecord(svc.id, patch);
      } else {
        const res = await createServicesRecords([{ ...patch, owner_id: partner.id }]);
        if (res.ok) inserted = true;
      }
    }
    if (inserted) {
      const user = await getAuthUser();
      const brandRow = user ? await fetchBrandOwnerByUserId(user.id) : null;
      if (brandRow) {
        const hydrated = await hydratePartner(brandRow);
        set({
          partners: get().partners.map((p) => (p.id === id ? hydrated : p)),
        });
        persistSlice(get());
      }
    }
  },

  removePartnerService: async (serviceId) => {
    const id = get().currentPartnerId;
    if (!id || !serviceId) return;
    const partner = get().partners.find((p) => p.id === id);
    if (!partner) return;
    const catalog = (partner.catalog || []).map((cat) => ({
      ...cat,
      services: (cat.services || []).filter((s) => s.id !== serviceId),
    }));
    set({
      partners: get().partners.map((p) => (p.id === id ? { ...p, catalog } : p)),
    });
    persistSlice(get());
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (isSupabaseConfigured && uuidRe.test(serviceId)) {
      await deleteServiceRecord(serviceId);
    }
  },

  updatePartnerWhatsApp: async (whatsappNumber) => {
    const id = get().currentPartnerId;
    if (!id) return { ok: false, error: 'No studio on this account.' };
    if (!isValidWhatsAppNumber(whatsappNumber)) {
      return { ok: false, error: 'Enter a valid 10-digit WhatsApp number.' };
    }
    const digits = toWhatsAppDigits(whatsappNumber);
    set({
      partners: get().partners.map((p) => (p.id === id ? { ...p, whatsappNumber: digits } : p)),
    });
    persistSlice(get());
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (isSupabaseConfigured && uuidRe.test(id)) {
      const res = await updateBrandOwnerRecord(id, { whatsapp_number: digits });
      if (!res.ok) return res;
    }
    get().showToast('WhatsApp number saved. Client bookings will message this number.');
    return { ok: true };
  },

  activateSubscription: async (partnerId) => {
    const id = partnerId || get().currentPartnerId;
    if (isSupabaseConfigured && id) {
      await updateBrandOwnerRecord(id, { subscription_status: 'active' });
    }
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
      await signOutUser();
    }
    set({
      isAuthenticated: false,
      userRole: null,
      currentPartnerId: null,
      cart: [],
      userEmail: '',
      userPhone: '',
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
        const partner = await hydratePartner(brandRow);
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
      const user = await getAuthUser();
      if (user) {
        await get().applyAuthenticatedUser({ intendedRole: 'client' });
      }
    } catch (e) {
      console.warn('Session sync failed:', e);
    }
  },

  getCurrentPartner: () => getTenantById(get().partners, get().currentPartnerId),
  getPartnerPlan: () => getPlanStatus(getTenantById(get().partners, get().currentPartnerId)),

  pendingSignup: persisted.pendingSignup ?? null,

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
    if (appt.status !== 'pending') {
      get().showToast('Booking confirmed! Direct payment details recorded.');
    }
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
