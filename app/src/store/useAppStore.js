import { create } from 'zustand';
import { isSeedFixture, localSeedFixturesEnabled } from '../data/seedGuard';
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
  fetchPublishedSiteBySlug,
  hydratePartner,
  upsertSiteConfigRecord,
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
  createPackageRecord,
  updatePackageRecord,
  deletePackageRecord,
  upsertVipMemberRecord,
  deleteVipMemberRecord,
  subscribeVipAsGuest,
} from '../lib/supabase';
import { isValidWhatsAppNumber, toWhatsAppDigits } from '../lib/whatsapp';
import {
  defaultWorkingHours,
  normalizeServiceArea,
  normalizeWorkingHours,
  validateRadius,
  validateWorkingHours,
  workingHoursToDb,
} from '../lib/availability';
import { mapPackageFromDb, packageToDb, validatePackage } from '../lib/packages';
import { mapVipMemberFromDb, validateVipMember } from '../lib/vip';
import { normalizeSiteConfig, siteConfigIsReady } from '../lib/siteConfig';

const PERSIST_KEY = 'atease-whitelabel-v1';

function withoutSecrets(pending) {
  if (!pending || typeof pending !== 'object') return pending ?? null;
  const { password, ...rest } = pending;
  return rest;
}

function dropSeedFixtures(list) {
  return (list || []).filter((row) => !isSeedFixture(row));
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return UUID_RE.test(String(value || ''));
}

function loadPersisted() {
  if (typeof window === 'undefined') return {};
  try {
    const data = JSON.parse(window.localStorage.getItem(PERSIST_KEY)) || {};
    const pendingSignup = withoutSecrets(data.pendingSignup);
    const slice = { pendingSignup };
    const hadBusinessData = ['partners', 'appointments', 'reviews', 'isAuthenticated', 'userRole', 'currentPartnerId', 'userName', 'userEmail', 'userPhone'].some(
      (key) => Object.prototype.hasOwnProperty.call(data, key)
    );
    const hadPassword = Boolean(data.pendingSignup && Object.prototype.hasOwnProperty.call(data.pendingSignup, 'password'));
    if (hadBusinessData || hadPassword) {
      window.localStorage.setItem(PERSIST_KEY, JSON.stringify(slice));
    }
    return slice;
  } catch {
    return {};
  }
}

/** Only the in-progress signup handoff. Studios, bookings, menus, and reviews live in Supabase. */
function persistSlice(state) {
  if (typeof window === 'undefined') return;
  const slice = {
    pendingSignup: withoutSecrets(state.pendingSignup),
  };
  window.localStorage.setItem(PERSIST_KEY, JSON.stringify(slice));
}

const persisted = loadPersisted();

export const useAppStore = create((set, get) => {
  const replaceOwnerPartner = (partner) => {
    if (!partner) return;
    const others = get().partners.filter((p) => p.id !== partner.id);
    set({ partners: [partner, ...others], currentPartnerId: partner.id });
  };

  const reloadOwnerFromServer = async () => {
    const user = await getAuthUser();
    if (!user) return null;
    const brandRow = await fetchBrandOwnerByUserId(user.id);
    if (!brandRow) return null;
    const partner = await hydratePartner(brandRow);
    replaceOwnerPartner(partner);
    return partner;
  };

  return ({
  userRole: null,
  isAuthenticated: false,
  userName: '',
  userEmail: '',
  userPhone: '',

  partners: [],
  currentPartnerId: null,

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
          partners: [partner],
          isAuthenticated: true,
          userRole: 'partner',
          userName: partner.ownerName || partner.brandName,
          userEmail: partner.ownerEmail || user.email || '',
          userPhone: partner.ownerPhone || user.phone || '',
          currentPartnerId: partner.id,
          appointments,
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

  loginPartner: async ({ email, password } = {}) => {
    if (!isSupabaseConfigured) {
      return { ok: false, error: 'Supabase is not configured.' };
    }
    if (!email || !password) {
      return { ok: false, error: 'Enter your email and password.' };
    }
    const authRes = await signInWithEmail({ email, password });
    if (!authRes.ok) return { ok: false, error: authRes.error };
    return get().applyAuthenticatedUser({ intendedRole: 'brand_owner', nextPath: '/dashboard' });
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
                price_model: 'fixed',
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
        price: cap,
        uptoPrice: cap,
        inSalonPrice: cap,
        homePrice: cap,
        imageUrl: svc.imageUrl || '',
        pricingModel: 'fixed',
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
      serviceArea: [],
      workingHours: defaultWorkingHours(),
      trialEndsAt: addDaysIso(TRIAL_DAYS),
      subscriptionStatus: 'trial',
      whatsappNumber: toWhatsAppDigits(whatsappNumber || get().userPhone),
      catalog: catalogServices.length
        ? [{ id: 'menu', categoryName: 'MENU', services: catalogServices }]
        : [],
      packages: [],
      vipMembers: [],
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
    if (!id) return { ok: false, error: 'No studio on this account.' };
    if (!isSupabaseConfigured || !isUuid(id)) {
      return { ok: false, error: 'Supabase is not configured.' };
    }

    const flat = (catalog || []).flatMap((cat, catIdx) =>
      (cat.services || []).map((svc, idx) => ({
        ...svc,
        categoryName: cat.categoryName || 'MENU',
        sortOrder: catIdx * 50 + idx,
      }))
    );

    for (const svc of flat) {
      const cap = Number(svc.price || svc.uptoPrice || svc.inSalonPrice || svc.homePrice || 0);
      const patch = {
        category_name: svc.categoryName,
        title: svc.name,
        description: svc.description || '',
        duration: svc.duration || '60 mins',
        price_model: 'fixed',
        price_fixed: cap,
        price_salon: cap,
        price_home: cap,
        image_url: svc.imageUrl || '',
        sort_order: svc.sortOrder,
        is_active: true,
      };
      const res = isUuid(svc.id)
        ? await updateServiceRecord(svc.id, patch)
        : await createServicesRecords([{ ...patch, owner_id: id }]);
      if (!res.ok) {
        await reloadOwnerFromServer();
        get().showToast(res.error || 'Could not save the menu.');
        return res;
      }
    }

    const partner = await reloadOwnerFromServer();
    if (!partner) return { ok: false, error: 'Could not reload the menu.' };
    return { ok: true };
  },

  removePartnerService: async (serviceId) => {
    const id = get().currentPartnerId;
    if (!id || !serviceId) return { ok: false, error: 'Missing service.' };
    if (isSupabaseConfigured && isUuid(serviceId)) {
      const res = await deleteServiceRecord(serviceId);
      if (!res.ok) {
        get().showToast(res.error || 'Could not remove that service.');
        return res;
      }
      await reloadOwnerFromServer();
      return { ok: true };
    }
    const partner = get().partners.find((p) => p.id === id);
    if (!partner) return { ok: false, error: 'No studio on this account.' };
    const catalog = (partner.catalog || []).map((cat) => ({
      ...cat,
      services: (cat.services || []).filter((s) => s.id !== serviceId),
    }));
    set({
      partners: get().partners.map((p) => (p.id === id ? { ...p, catalog } : p)),
    });
    return { ok: true };
  },

  updatePartnerWhatsApp: async (whatsappNumber) => {
    const id = get().currentPartnerId;
    if (!id) return { ok: false, error: 'No studio on this account.' };
    if (!isValidWhatsAppNumber(whatsappNumber)) {
      return { ok: false, error: 'Enter a valid 10-digit WhatsApp number.' };
    }
    const digits = toWhatsAppDigits(whatsappNumber);
    if (!isSupabaseConfigured || !isUuid(id)) {
      return { ok: false, error: 'Supabase is not configured.' };
    }
    const res = await updateBrandOwnerRecord(id, { whatsapp_number: digits });
    if (!res.ok) return res;
    set({
      partners: get().partners.map((p) => (p.id === id ? { ...p, whatsappNumber: digits } : p)),
    });
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
    get().showToast('Subscription activated. Your brand site stays live.');
  },

  logout: async () => {
    if (isSupabaseConfigured) {
      await signOutUser();
    }
    set({
      isAuthenticated: false,
      userRole: null,
      userName: '',
      userEmail: '',
      userPhone: '',
      currentPartnerId: null,
      partners: [],
      appointments: [],
      reviews: [],
      cart: [],
      pendingSignup: null,
    });
    persistSlice(get());
  },

  fetchPartnerBySlug: async (slug) => {
    if (!slug) return null;

    if (isSupabaseConfigured) {
      const brandRow = await fetchBrandOwnerBySlug(slug);
      if (!brandRow) return null;
      const partner = await hydratePartner(brandRow);
      if (!partner) return null;
      set({
        partners: [...dropSeedFixtures(get().partners).filter((p) => p.id !== partner.id && p.slug !== partner.slug), partner],
      });
      return partner;
    }

    if (localSeedFixturesEnabled() && isSeedFixture({ slug })) {
      return getTenantBySlug(get().partners, slug);
    }

    const local = getTenantBySlug(get().partners, slug);
    if (local && !isSeedFixture(local)) return local;
    return null;
  },

  fetchPublishedSite: async (slug) => {
    if (!slug) return null;
    if (isSupabaseConfigured) {
      return fetchPublishedSiteBySlug(slug);
    }
    if (!localSeedFixturesEnabled()) return null;
    const local = getTenantBySlug(get().partners, slug);
    if (local?.siteConfig?.published && isSeedFixture(local)) {
      return normalizeSiteConfig(local.siteConfig, slug);
    }
    return null;
  },

  publishSiteConfig: async (draft) => {
    const id = get().currentPartnerId;
    if (!id) return { ok: false, error: 'No studio on this account.' };
    const partner = get().partners.find((p) => p.id === id);
    if (!partner) return { ok: false, error: 'No studio on this account.' };

    const config = normalizeSiteConfig(
      {
        ...draft,
        slug: partner.slug,
        published: true,
        publishedAt: new Date().toISOString(),
      },
      partner.slug
    );
    const ready = siteConfigIsReady(config);
    if (!ready.ok) return ready;
    if (!isSupabaseConfigured || !isUuid(id)) {
      return { ok: false, error: 'Supabase is not configured.' };
    }

    const res = await upsertSiteConfigRecord(id, config);
    if (!res.ok) return res;
    await updateBrandOwnerRecord(id, {
      brand_name: config.businessName,
      professional_title: config.subtitle || partner.professionalTitle,
      whatsapp_number: config.contactPhone,
    });
    const saved = res.data || config;
    set({
      partners: get().partners.map((p) =>
        p.id === id
          ? {
              ...p,
              brandName: saved.businessName || p.brandName,
              professionalTitle: saved.subtitle || p.professionalTitle,
              whatsappNumber: saved.contactPhone || p.whatsappNumber,
              coverUrl: saved.bannerUrl || p.coverUrl,
              logoUrl: saved.about?.ownerPhotoUrl || p.logoUrl,
              description: saved.about?.bio || p.description,
              location: saved.about?.location || p.location,
              siteConfig: saved,
            }
          : p
      ),
    });

    get().showToast('Website published. Share the public link with clients.');
    return { ok: true, config: saved };
  },

  saveSiteDraft: async (draft) => {
    const id = get().currentPartnerId;
    if (!id) return { ok: false, error: 'No studio on this account.' };
    const partner = get().partners.find((p) => p.id === id);
    if (!partner) return { ok: false, error: 'No studio on this account.' };
    if (!isSupabaseConfigured || !isUuid(id)) {
      return { ok: false, error: 'Supabase is not configured.' };
    }
    const alreadyPublished = Boolean(partner.siteConfig?.published);
    const config = normalizeSiteConfig(
      {
        ...draft,
        slug: partner.slug,
        published: alreadyPublished,
        publishedAt: alreadyPublished ? partner.siteConfig?.publishedAt || null : null,
      },
      partner.slug
    );
    const res = await upsertSiteConfigRecord(id, config);
    if (!res.ok) return res;
    const saved = res.data || config;
    set({
      partners: get().partners.map((p) => (p.id === id ? { ...p, siteConfig: saved } : p)),
    });
    return { ok: true, config: saved };
  },

  syncAuthSession: async () => {
    if (!isSupabaseConfigured) return;
    try {
      const user = await getAuthUser();
      if (user) {
        const intendedRole = get().pendingSignup?.userId ? 'brand_owner' : 'client';
        await get().applyAuthenticatedUser({ intendedRole });
        return;
      }
      set({
        isAuthenticated: false,
        userRole: null,
        userName: '',
        userEmail: '',
        userPhone: '',
        currentPartnerId: null,
        partners: [],
        appointments: [],
        reviews: [],
      });
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

  reviews: [],

  addReview: (review) => {
    const row = {
      id: review.id || `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      verified: Boolean(review.verified),
      ...review,
    };
    set({ reviews: [row, ...get().reviews] });
  },

  createPartnerPackage: async () => {
    const id = get().currentPartnerId;
    if (!id || !isSupabaseConfigured || !isUuid(id)) {
      return { ok: false, error: 'Supabase is not configured.' };
    }
    const sortOrder = (get().partners.find((p) => p.id === id)?.packages || []).length;
    const res = await createPackageRecord({
      owner_id: id,
      name: 'New package',
      description: '',
      price: 0,
      duration: '',
      image_url: '',
      included_items: [],
      is_active: true,
      vip_monthly: false,
      sort_order: sortOrder,
    });
    if (!res.ok) return res;
    const created = mapPackageFromDb(res.data);
    set({
      partners: get().partners.map((p) =>
        p.id === id ? { ...p, packages: [...(p.packages || []), created] } : p
      ),
    });
    return { ok: true, package: created };
  },

  savePartnerPackage: async (pkg) => {
    const check = validatePackage(pkg);
    if (!check.ok) return check;
    const id = get().currentPartnerId;
    if (!id || !isSupabaseConfigured || !isUuid(id)) {
      return { ok: false, error: 'Supabase is not configured.' };
    }
    if (!isUuid(pkg?.id)) return { ok: false, error: 'This package is not saved to your account yet.' };
    const res = await updatePackageRecord(pkg.id, packageToDb(check.package));
    if (!res.ok) return res;
    const saved = mapPackageFromDb(res.data);
    set({
      partners: get().partners.map((p) =>
        p.id === id
          ? { ...p, packages: (p.packages || []).map((row) => (row.id === saved.id ? saved : row)) }
          : p
      ),
    });
    return { ok: true, package: saved };
  },

  deletePartnerPackage: async (packageId) => {
    const id = get().currentPartnerId;
    if (!id || !packageId) return { ok: false, error: 'Missing package.' };
    if (!isSupabaseConfigured || !isUuid(id) || !isUuid(packageId)) {
      return { ok: false, error: 'Supabase is not configured.' };
    }
    const res = await deletePackageRecord(packageId);
    if (!res.ok) return res;
    set({
      partners: get().partners.map((p) =>
        p.id === id ? { ...p, packages: (p.packages || []).filter((row) => row.id !== packageId) } : p
      ),
    });
    return { ok: true };
  },

  subscribeVip: async (member) => {
    const check = validateVipMember(member);
    if (!check.ok) return check;
    const partnerId = member.partnerId || get().currentPartnerId;
    if (!partnerId || !isSupabaseConfigured || !isUuid(partnerId)) {
      return { ok: false, error: 'Supabase is not configured.' };
    }

    const isOwner = get().currentPartnerId === partnerId;
    if (isOwner) {
      const res = await upsertVipMemberRecord(partnerId, check.member);
      if (!res.ok) return res;
      const row = mapVipMemberFromDb(res.data);
      set({
        partners: get().partners.map((p) =>
          p.id === partnerId
            ? {
                ...p,
                vipMembers: [
                  row,
                  ...(p.vipMembers || []).filter((m) => m.id !== row.id && m.clientPhone !== row.clientPhone),
                ],
              }
            : p
        ),
      });
      return { ok: true, member: row };
    }

    if (!isUuid(check.member.packageId)) {
      return { ok: false, error: 'This membership is not available.' };
    }
    return subscribeVipAsGuest({
      ownerId: partnerId,
      packageId: check.member.packageId,
      clientName: check.member.clientName,
      clientPhone: check.member.clientPhone,
      dayOfMonth: check.member.dayOfMonth,
    });
  },

  removeVipMember: async (memberId) => {
    const id = get().currentPartnerId;
    if (!id || !memberId) return { ok: false, error: 'Missing membership.' };
    if (!isSupabaseConfigured || !isUuid(id) || !isUuid(memberId)) {
      return { ok: false, error: 'Supabase is not configured.' };
    }
    const res = await deleteVipMemberRecord(memberId);
    if (!res.ok) return res;
    set({
      partners: get().partners.map((p) =>
        p.id === id ? { ...p, vipMembers: (p.vipMembers || []).filter((m) => m.id !== memberId) } : p
      ),
    });
    return { ok: true };
  },

  saveWorkingHours: async (hours) => {
    const check = validateWorkingHours(hours);
    if (!check.ok) return check;
    const id = get().currentPartnerId;
    if (!id) return { ok: false, error: 'No studio on this account.' };
    if (!isSupabaseConfigured || !isUuid(id)) {
      return { ok: false, error: 'Supabase is not configured.' };
    }
    const res = await updateBrandOwnerRecord(id, { working_hours: workingHoursToDb(check.hours) });
    if (!res.ok) return res;
    const workingHours = normalizeWorkingHours(res.data?.working_hours);
    set({
      partners: get().partners.map((p) => (p.id === id ? { ...p, workingHours } : p)),
    });
    return { ok: true, hours: workingHours };
  },

  saveServiceArea: async ({ radius, areas } = {}) => {
    const check = validateRadius(radius);
    if (!check.ok) return check;
    const id = get().currentPartnerId;
    if (!id) return { ok: false, error: 'No studio on this account.' };
    if (!isSupabaseConfigured || !isUuid(id)) {
      return { ok: false, error: 'Supabase is not configured.' };
    }
    const serviceArea = normalizeServiceArea(areas);
    const res = await updateBrandOwnerRecord(id, {
      coverage_radius_km: check.value,
      service_area: serviceArea,
    });
    if (!res.ok) return res;
    const savedRadius = Number(res.data?.coverage_radius_km);
    const savedAreas = normalizeServiceArea(res.data?.service_area);
    set({
      partners: get().partners.map((p) =>
        p.id === id
          ? {
              ...p,
              coverageRadiusKm: Number.isInteger(savedRadius) ? savedRadius : check.value,
              serviceArea: savedAreas,
            }
          : p
      ),
    });
    return { ok: true, radius: Number.isInteger(savedRadius) ? savedRadius : check.value, areas: savedAreas };
  },

  appointments: [],

  addAppointment: (newAppt) => {
    const partnerId =
      newAppt.partnerId || get().bookingModalData?.provider?.partnerId || get().currentPartnerId;
    if (isSupabaseConfigured && isUuid(partnerId) && !newAppt.id) {
      return null;
    }
    const appt = {
      id: newAppt.id || `ATEASE-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      paymentMethod: 'Direct Payment (Cash/UPI/Card)',
      ...newAppt,
      partnerId,
    };
    set({
      appointments: [appt, ...get().appointments.filter((row) => row.id !== appt.id)],
    });
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
    get().showToast(`Appointment delayed by ${minutes} mins. Client notified.`);
  },
});
});

if (
  import.meta.env.DEV === true &&
  import.meta.env.VITE_USE_LOCAL_FIXTURES === 'true' &&
  !isSupabaseConfigured &&
  typeof window !== 'undefined'
) {
  import('../data/seedFixtures').then(({ createSeedPartners }) => {
    const fixtures = createSeedPartners();
    const existing = dropSeedFixtures(useAppStore.getState().partners);
    useAppStore.setState({ partners: [...fixtures, ...existing] });
  });
}
