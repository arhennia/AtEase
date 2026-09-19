import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { formatInr, nextVipDate, uniqueClients } from '../../lib/salonMenu';
import { SoftButton, SoftCard, eyebrowClass, inputClass, mutedClass, titleClass } from '../platform/ui';

export function ClientInsights({ partner }) {
  const appointments = useAppStore((s) => s.appointments).filter((row) => row.partnerId === partner.id);
  const reviews = useAppStore((s) => s.reviews).filter((row) => row.partnerId === partner.id);
  const subscribeVip = useAppStore((s) => s.subscribeVip);
  const removeVipMember = useAppStore((s) => s.removeVipMember);
  const showToast = useAppStore((s) => s.showToast);
  const clients = uniqueClients(appointments);
  const vips = partner.vipMembers || [];
  const packages = partner.packages || [];
  const revenue = appointments.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);

  const [vipName, setVipName] = useState('');
  const [vipPhone, setVipPhone] = useState('');
  const [vipPackageId, setVipPackageId] = useState(packages.find((pkg) => pkg.vipMonthly)?.id || packages[0]?.id || '');
  const [vipDay, setVipDay] = useState(5);

  const addVip = (e) => {
    e.preventDefault();
    const pkg = packages.find((row) => row.id === vipPackageId);
    if (!vipName.trim()) {
      showToast('Enter the client name.');
      return;
    }
    subscribeVip({
      partnerId: partner.id,
      clientName: vipName.trim(),
      clientPhone: vipPhone,
      packageId: vipPackageId,
      packageName: pkg?.name || 'Monthly package',
      dayOfMonth: vipDay,
    });
    setVipName('');
    setVipPhone('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`${titleClass} text-xl`}>Clients</h3>
        <p className={`${mutedClass} mt-1`}>
          Unique people who booked from your site, plus VIP monthly subscribers.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SoftCard className="p-5">
          <p className={eyebrowClass}>Clients</p>
          <p className="mt-2 text-3xl font-semibold">{clients.length}</p>
        </SoftCard>
        <SoftCard className="p-5">
          <p className={eyebrowClass}>Bookings</p>
          <p className="mt-2 text-3xl font-semibold">{appointments.length}</p>
        </SoftCard>
        <SoftCard className="p-5">
          <p className={eyebrowClass}>VIP members</p>
          <p className="mt-2 text-3xl font-semibold">{vips.length}</p>
        </SoftCard>
        <SoftCard className="p-5">
          <p className={eyebrowClass}>Reviews</p>
          <p className="mt-2 text-3xl font-semibold">{reviews.length}</p>
        </SoftCard>
      </div>
      <p className="text-sm text-stone-500">Recorded visit value {formatInr(revenue)} (paid to you directly).</p>

      <SoftCard className="p-5 space-y-3">
        <p className={`${titleClass} text-lg`}>Add a VIP subscriber</p>
        <form onSubmit={addVip} className="grid sm:grid-cols-2 gap-2">
          <input value={vipName} onChange={(e) => setVipName(e.target.value)} className={inputClass} placeholder="Client name" />
          <input
            value={vipPhone}
            onChange={(e) => setVipPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className={inputClass}
            placeholder="Phone"
          />
          <select value={vipPackageId} onChange={(e) => setVipPackageId(e.target.value)} className={inputClass}>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            max={28}
            value={vipDay}
            onChange={(e) => setVipDay(Number(e.target.value))}
            className={inputClass}
          />
          <SoftButton type="submit" className="sm:col-span-2">
            Save VIP
          </SoftButton>
        </form>
      </SoftCard>

      <div className="grid lg:grid-cols-2 gap-4">
        <SoftCard className="p-5">
          <p className={`${titleClass} text-lg mb-3`}>Client list</p>
          {clients.length === 0 ? (
            <p className="text-sm text-stone-500">No bookings yet.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {clients.map((client) => (
                <li key={client.id} className="py-3">
                  <p className="text-sm font-medium">{client.name}</p>
                  <p className="text-xs text-stone-500">
                    {client.phone} · {client.bookings} visit{client.bookings === 1 ? '' : 's'} · {formatInr(client.spent)}
                  </p>
                  <p className="text-xs text-stone-400">{client.lastService}</p>
                </li>
              ))}
            </ul>
          )}
        </SoftCard>

        <SoftCard className="p-5">
          <p className={`${titleClass} text-lg mb-3`}>VIP monthly</p>
          {vips.length === 0 ? (
            <p className="text-sm text-stone-500">No VIP members yet.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {vips.map((member) => (
                <li key={member.id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{member.clientName}</p>
                    <p className="text-xs text-stone-500">
                      {member.packageName} · {member.clientPhone}
                    </p>
                    <p className="text-xs text-stone-400">
                      Day {member.dayOfMonth} · next {nextVipDate(member.dayOfMonth)}
                    </p>
                  </div>
                  <button type="button" onClick={() => removeVipMember(member.id)} className="text-xs text-stone-400">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </SoftCard>
      </div>
    </div>
  );
}
