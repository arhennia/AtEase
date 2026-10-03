import { supabase, isSupabaseConfigured } from './client';
import { getAuthUser } from './auth';
import { isStudioImageBucket, ownerObjectPath, ownsStoragePath, pathFromPublicUrl } from '../storagePaths';

async function requireOwner(requestedUserId) {
  if (!isSupabaseConfigured) return { ok: false, error: 'Supabase is not configured.' };
  const user = await getAuthUser();
  if (!user?.id) return { ok: false, error: 'Sign in to change images.' };
  if (requestedUserId && requestedUserId !== user.id) {
    return { ok: false, error: 'You can only change files in your own folder.' };
  }
  return { ok: true, userId: user.id };
}

function publicUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadOwnerImage(userId, file, bucket = 'service-images') {
  const owner = await requireOwner(userId);
  if (!owner.ok) return { ok: false, error: owner.error, url: '' };
  if (!file) return { ok: false, error: 'Missing file.', url: '' };
  if (!isStudioImageBucket(bucket)) return { ok: false, error: 'Unknown image folder.', url: '' };

  const path = ownerObjectPath(owner.userId, file.name);
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (error) return { ok: false, error: error.message, url: '' };
  return { ok: true, url: publicUrl(bucket, path), path };
}

export async function replaceOwnerImage(userId, pathOrUrl, file, bucket = 'service-images') {
  const owner = await requireOwner(userId);
  if (!owner.ok) return { ok: false, error: owner.error, url: '' };
  if (!file) return { ok: false, error: 'Missing file.', url: '' };
  if (!isStudioImageBucket(bucket)) return { ok: false, error: 'Unknown image folder.', url: '' };

  const path = String(pathOrUrl || '').includes('/object/public/')
    ? pathFromPublicUrl(pathOrUrl, bucket)
    : String(pathOrUrl || '');
  const owned = ownsStoragePath(owner.userId, path);
  if (!owned.ok) return { ok: false, error: owned.error, url: '' };

  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) return { ok: false, error: error.message, url: '' };
  return { ok: true, url: publicUrl(bucket, path), path };
}

export async function deleteOwnerImage(userId, pathOrUrl, bucket = 'service-images') {
  const owner = await requireOwner(userId);
  if (!owner.ok) return { ok: false, error: owner.error };
  if (!isStudioImageBucket(bucket)) return { ok: false, error: 'Unknown image folder.' };

  const path = String(pathOrUrl || '').includes('/object/public/')
    ? pathFromPublicUrl(pathOrUrl, bucket)
    : String(pathOrUrl || '');
  const owned = ownsStoragePath(owner.userId, path);
  if (!owned.ok) return owned;

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) return { ok: false, error: error.message };
  return { ok: true, path };
}
