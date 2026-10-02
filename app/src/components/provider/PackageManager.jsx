import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatInr } from '../../lib/salonMenu';
import { SoftButton, SoftCard, eyebrowClass, inputClass, mutedClass, titleClass } from '../platform/ui';

const EMPTY_PACKAGES = [];

export function PackageManager({ partner }) {
  const createPartnerPackage = useAppStore((s) => s.createPartnerPackage);
  const savePartnerPackage = useAppStore((s) => s.savePartnerPackage);
  const deletePartnerPackage = useAppStore((s) => s.deletePartnerPackage);
  const showToast = useAppStore((s) => s.showToast);
  const packages = partner?.packages || EMPTY_PACKAGES;

  const [drafts, setDrafts] = useState(packages);
  const [savingId, setSavingId] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setDrafts((current) => {
      const byId = new Map(current.map((pkg) => [pkg.id, pkg]));
      return packages.map((pkg) => byId.get(pkg.id) || pkg);
    });
  }, [packages]);

  const patch = (id, partial) => {
    setDrafts((current) => current.map((pkg) => (pkg.id === id ? { ...pkg, ...partial } : pkg)));
  };

  const add = async () => {
    const res = await createPartnerPackage();
    if (!res.ok) {
      showToast(res.error || 'Could not add a package.');
      return;
    }
    showToast('Package added. Fill the details and save.');
  };

  const save = async (pkg) => {
    setSavingId(pkg.id);
    const res = await savePartnerPackage(pkg);
    setSavingId('');
    if (!res.ok) {
      setErrors((current) => ({ ...current, [pkg.id]: res.error || 'Could not save this package.' }));
      showToast(res.error || 'Could not save this package.');
      return;
    }
    setErrors((current) => ({ ...current, [pkg.id]: '' }));
    setDrafts((current) => current.map((row) => (row.id === res.package.id ? res.package : row)));
    showToast('Package saved.');
  };

  const remove = async (packageId) => {
    const res = await deletePartnerPackage(packageId);
    if (!res.ok) {
      showToast(res.error || 'Could not remove this package.');
      return;
    }
    setDrafts((current) => current.filter((row) => row.id !== packageId));
    showToast('Package removed. Existing bookings stay on the calendar.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h3 className={`${titleClass} text-xl`}>Super saver & VIP packages</h3>
          <p className={`${mutedClass} mt-1`}>
            These appear as the first menu tile on the mobile site. Save each package to keep it on your account. VIP packages let a client book the same visit on a chosen date every month.
          </p>
        </div>
        <SoftButton onClick={add}>
          <Plus size={14} />
          Add package
        </SoftButton>
      </div>

      {drafts.length === 0 ? (
        <SoftCard className="p-8 text-sm text-stone-500">No packages yet. Add a bundle or a monthly VIP plan.</SoftCard>
      ) : (
        <div className="space-y-4">
          {drafts.map((pkg) => (
            <SoftCard key={pkg.id} className="p-5 space-y-3">
              <div className="flex justify-between gap-3">
                <input
                  value={pkg.name}
                  onChange={(e) => patch(pkg.id, { name: e.target.value })}
                  className={inputClass}
                  placeholder="Monthly maintenance package"
                />
                <button
                  type="button"
                  onClick={() => remove(pkg.id)}
                  className="px-3 text-stone-400 hover:text-[#111]"
                  aria-label="Remove package"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <textarea
                rows={2}
                value={pkg.description || ''}
                onChange={(e) => patch(pkg.id, { description: e.target.value })}
                className={`${inputClass} resize-none`}
                placeholder="What is included"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <label className="space-y-1">
                  <span className={eyebrowClass}>Price</span>
                  <input
                    type="number"
                    value={pkg.price || ''}
                    onChange={(e) => patch(pkg.id, { price: Number(e.target.value) })}
                    className={inputClass}
                  />
                </label>
                <label className="space-y-1">
                  <span className={eyebrowClass}>Was</span>
                  <input
                    type="number"
                    value={pkg.originalPrice || ''}
                    onChange={(e) => patch(pkg.id, { originalPrice: Number(e.target.value) })}
                    className={inputClass}
                  />
                </label>
                <label className="space-y-1">
                  <span className={eyebrowClass}>% off</span>
                  <input
                    type="number"
                    value={pkg.discountPercent || ''}
                    onChange={(e) => patch(pkg.id, { discountPercent: Number(e.target.value) })}
                    className={inputClass}
                  />
                </label>
                <label className="space-y-1">
                  <span className={eyebrowClass}>Duration</span>
                  <input
                    value={pkg.duration || ''}
                    onChange={(e) => patch(pkg.id, { duration: e.target.value })}
                    className={inputClass}
                  />
                </label>
              </div>
              <label className="block space-y-1">
                <span className={eyebrowClass}>Image URL</span>
                <input
                  value={pkg.imageUrl || ''}
                  onChange={(e) => patch(pkg.id, { imageUrl: e.target.value })}
                  className={inputClass}
                />
              </label>
              <label className="block space-y-1">
                <span className={eyebrowClass}>Included items (one per line)</span>
                <textarea
                  rows={3}
                  value={(pkg.packageItems || []).join('\n')}
                  onChange={(e) =>
                    patch(pkg.id, {
                      packageItems: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean),
                    })
                  }
                  className={`${inputClass} resize-none`}
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={pkg.isActive !== false}
                  onChange={(e) => patch(pkg.id, { isActive: e.target.checked })}
                />
                Visible on the public site
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(pkg.vipMonthly)}
                  onChange={(e) => patch(pkg.id, { vipMonthly: e.target.checked })}
                />
                Monthly VIP — same date every month
              </label>
              {pkg.vipMonthly && (
                <label className="block space-y-1 max-w-[140px]">
                  <span className={eyebrowClass}>Day of month</span>
                  <input
                    type="number"
                    min={1}
                    max={28}
                    value={pkg.vipDayOfMonth || 5}
                    onChange={(e) => patch(pkg.id, { vipDayOfMonth: Number(e.target.value) })}
                    className={inputClass}
                  />
                </label>
              )}
              {errors[pkg.id] ? <p className="text-xs text-red-700">{errors[pkg.id]}</p> : null}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-stone-400">
                  Shows as {formatInr(pkg.price)}
                  {pkg.originalPrice ? ` (was ${formatInr(pkg.originalPrice)})` : ''} on the public menu.
                </p>
                <SoftButton onClick={() => save(pkg)} disabled={savingId === pkg.id}>
                  {savingId === pkg.id ? 'Saving…' : 'Save package'}
                </SoftButton>
              </div>
            </SoftCard>
          ))}
        </div>
      )}
    </div>
  );
}
