export { supabase, isSupabaseConfigured } from './client';

export {
  toE164,
  signInWithGoogle,
  sendPhoneOtp,
  verifyPhoneOtp,
  signUpWithEmail,
  signInWithEmail,
  signOutUser,
  getAuthUser,
} from './auth';

export { fetchProfile, ensureProfile } from './profiles';
export { mapBrandOwnerFromDb, normalizeAppointment } from './mappers';

export {
  fetchBrandOwnerByUserId,
  fetchBrandOwnerBySlug,
  hydratePartner,
  createBrandOwnerRecord,
  updateBrandOwnerRecord,
} from './brandOwners';

export { fetchPrimarySalon, createSalonRecord } from './salons';
export { fetchServicesByOwnerId, createServicesRecords, updateServiceRecord, deleteServiceRecord } from './services';
export { fetchAppointmentsByOwnerId, createAppointmentRecord } from './appointments';
export { fetchClientsByOwnerId, fetchAnalyticsByOwnerId } from './clients';
export { uploadOwnerImage } from './storage';

/** @deprecated Use signUpWithEmail */
export { signUpWithEmail as signUpProvider } from './auth';
/** @deprecated Use signInWithEmail */
export { signInWithEmail as signInProvider } from './auth';
/** @deprecated Use signOutUser */
export { signOutUser as signOutProvider } from './auth';
