export const STUDIO_IMAGE_BUCKETS = ['service-images', 'portfolio', 'brand-assets'];

export function isStudioImageBucket(bucket) {
  return STUDIO_IMAGE_BUCKETS.includes(bucket);
}

export function ownerObjectPath(userId, fileName) {
  const safeName = String(fileName || 'image').replace(/[^\w.\-]+/g, '-');
  return `${userId}/${Date.now()}-${safeName}`;
}

export function pathFromPublicUrl(url, bucket) {
  const marker = `/object/public/${bucket}/`;
  const value = String(url || '');
  const index = value.indexOf(marker);
  if (index === -1) return '';
  return decodeURIComponent(value.slice(index + marker.length).split('?')[0]);
}

export function ownsStoragePath(userId, path) {
  const ownerId = String(userId || '');
  const folder = String(path || '').split('/').filter(Boolean)[0] || '';
  if (!ownerId || !folder || folder !== ownerId) {
    return { ok: false, error: 'You can only change files in your own folder.' };
  }
  return { ok: true, path: String(path) };
}
