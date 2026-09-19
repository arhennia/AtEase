import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatInr } from '../../lib/salonMenu';
import { SoftButton, SoftCard, eyebrowClass, inputClass, mutedClass, titleClass } from '../platform/ui';

const emptyPackage = () => ({
  id: `pkg-${Date.now()}`,
  categoryId: 'packages',
  name: '',
  description: '',
  duration: '2 hrs',
  price: 1999,
  originalPrice: 2499,
  discountPercent: 20,
  imageUrl: '',
  badge: 'package',
  isPackage: true,
  vipMonthly: false,
  vipDayOfMonth: 5,
  highlights: [],
  detailImages: [],
  packageItems: [''],
});

export function PackageManager({ partner }) {
  const updatePartnerPackages = useAppStore((s) => s.updatePartnerPackages);
  const showToast = useAppStore((s) => s.showToast);
  const packages = partner.packages || [];

  const write = (next) => updatePartnerPackages(next);

  const patch = (id, partial) => {
    write(packages.map((pkg) => (pkg.id === id ? { ...pkg, ...partial } : pkg)));
  };

  const add = () => {
    write([...packages, emptyPackage()]);
    showToast('Package added. Fill the details, then publish the site.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h3 className={`${titleClass} text-xl`}>Super saver & VIP packages</h3>
          <p className={`${mutedClass} mt-1`}>
            These appear as the first menu tile on the mobile site. VIP packages let a client book the same visit on a chosen date every month.
          </p>
        </div>
        <SoftButton onClick={add}>
          <Plus size={14} />
          Add package
        </SoftButton>
      </div>

      {packages.length === 0 ? (
        <SoftCard className="p-8 text-sm text-stone-500">No packages yet. Add a bundle or a monthly VIP plan.</SoftCard>
      ) : (
        <div className="space-y-4">
          {packages.map((pkg) => (
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
                  onClick={() => write(packages.filter((row) => row.id !== pkg.id))}
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
              <p className="text-xs text-stone-400">
                Shows as {formatInr(pkg.price)}
                {pkg.originalPrice ? ` (was ${formatInr(pkg.originalPrice)})` : ''} on the public menu.
              </p>
            </SoftCard>
          ))}
        </div>
      )}
    </div>
  );
}
