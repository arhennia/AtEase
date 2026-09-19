import React, { useState } from 'react';
import { ArrowLeft, Star, Check } from 'lucide-react';
import { formatInr, nextVipDate, servicePrice } from '../../lib/salonMenu';
import { useAppStore } from '../../store/useAppStore';

export function ServiceDetailsSheet({
  open,
  item,
  partner,
  reviews,
  inCart,
  onClose,
  onAdd,
  onBook,
  onReview,
  canReview,
}) {
  const subscribeVip = useAppStore((s) => s.subscribeVip);
  const showToast = useAppStore((s) => s.showToast);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [vipName, setVipName] = useState('');
  const [vipPhone, setVipPhone] = useState('');

  if (!open || !item) return null;

  const images = (item.detailImages?.length ? item.detailImages : [item.imageUrl]).filter(Boolean);
  const highlights = (item.highlights || [item.description]).filter(Boolean).slice(0, 4);

  const submitReview = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      showToast('Add your name and a short review.');
      return;
    }
    const verified = canReview?.(phone);
    if (!verified) {
      showToast('Reviews are for clients who booked this service. Use the phone from your appointment.');
      return;
    }
    onReview({
      clientName: name.trim(),
      clientPhone: phone.trim(),
      rating,
      text: text.trim(),
      verified: true,
    });
    setText('');
    showToast('Review added.');
  };

  const submitVip = (e) => {
    e.preventDefault();
    if (!vipName.trim() || String(vipPhone).replace(/\D/g, '').length < 10) {
      showToast('Enter your name and a 10-digit WhatsApp number.');
      return;
    }
    subscribeVip({
      partnerId: partner.id,
      clientName: vipName.trim(),
      clientPhone: vipPhone,
      packageId: item.id,
      packageName: item.name,
      dayOfMonth: item.vipDayOfMonth || 5,
    });
    onBook();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6">
      <div className="flex h-[96vh] w-full max-w-lg flex-col bg-white sm:h-auto sm:max-h-[90vh] sm:rounded-[28px]">
        <div className="flex items-center gap-2 px-3 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-stone-200"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <p className="truncate font-studioSerif text-[18px]">{item.name}</p>
        </div>

        <div className="flex-1 overflow-y-auto pb-28">
          {images[0] ? (
            <img src={images[0]} alt="" className="h-48 w-full object-cover sm:h-56" />
          ) : (
            <div className="h-24 bg-stone-100" />
          )}

          <div className="px-5 py-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-studioSerif text-[26px] leading-tight">{item.name}</h2>
                <p className="mt-1 text-[13px] text-stone-500">
                  <span className="font-medium text-[#1C1917]">{formatInr(servicePrice(item))}</span>
                  {item.duration ? ` · ${item.duration}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={onAdd}
                className="rounded-full px-4 py-1.5 text-[13px] ring-1 ring-stone-200"
              >
                {inCart ? 'Added' : 'Add'}
              </button>
            </div>

            {highlights.length > 0 && (
              <section className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400">Details</p>
                <ul className="mt-2 space-y-1.5">
                  {highlights.map((line) => (
                    <li key={line} className="flex gap-2 text-[14px] leading-relaxed text-stone-600">
                      <Check size={14} className="mt-1 shrink-0 text-[#6D5A8D]" />
                      {line}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(item.packageItems || []).length > 0 && (
              <section className="mt-5">
                <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400">Included</p>
                <ul className="mt-2 space-y-1 text-[14px] text-stone-600">
                  {item.packageItems.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
            )}

            {images.length > 1 && (
              <section className="mt-5 grid grid-cols-3 gap-2">
                {images.slice(1).map((url) => (
                  <img key={url} src={url} alt="" className="h-20 w-full rounded-xl object-cover" />
                ))}
              </section>
            )}

            {item.vipMonthly && (
              <section className="mt-6 rounded-2xl bg-[#F7F6F8] p-4">
                <p className="text-[14px] font-medium">Monthly membership</p>
                <p className="mt-1 text-[13px] text-stone-500">
                  Recurring on the {item.vipDayOfMonth || 5}th — next visit {nextVipDate(item.vipDayOfMonth)}.
                </p>
                <form onSubmit={submitVip} className="mt-3 space-y-2">
                  <input
                    value={vipName}
                    onChange={(e) => setVipName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl bg-white px-3 py-2 text-sm outline-none ring-1 ring-stone-200"
                  />
                  <input
                    value={vipPhone}
                    onChange={(e) => setVipPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="WhatsApp number"
                    className="w-full rounded-xl bg-white px-3 py-2 text-sm outline-none ring-1 ring-stone-200"
                  />
                  <button type="submit" className="w-full rounded-full bg-[#1C1917] py-2.5 text-[13px] text-white">
                    Subscribe & book on WhatsApp
                  </button>
                </form>
              </section>
            )}

            <section className="mt-8">
              <p className="font-studioSerif text-[26px] leading-none">
                {reviews.length
                  ? (reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length).toFixed(2)
                  : '—'}
              </p>
              <p className="mt-1 text-[12px] text-stone-500">{reviews.length} reviews</p>
              <div className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <article key={review.id} className="border-t border-stone-100 pt-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[14px] font-medium">{review.clientName}</p>
                      <span className="text-[12px] text-stone-500">★ {review.rating}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-stone-400">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : ''}
                      {review.verified ? ' · Client visit' : ''}
                    </p>
                    <p className="mt-1 text-[14px] text-stone-600">{review.text}</p>
                  </article>
                ))}
              </div>

              <form onSubmit={submitReview} className="mt-5 space-y-2 rounded-2xl bg-[#F7F6F8] p-4">
                <p className="text-[14px] font-medium">Leave a review</p>
                <p className="text-[12px] text-stone-500">
                  Use the phone number from your booking. Only clients who took this service can review it.
                </p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl bg-white px-3 py-2 text-sm outline-none"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Phone used for booking"
                  className="w-full rounded-xl bg-white px-3 py-2 text-sm outline-none"
                />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} stars`}>
                      <Star size={16} className={value <= rating ? 'fill-[#1C1917] text-[#1C1917]' : 'text-stone-300'} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  placeholder="How was this service?"
                  className="w-full resize-none rounded-xl bg-white px-3 py-2 text-sm outline-none"
                />
                <button type="submit" className="w-full rounded-full bg-white py-2 text-[13px] ring-1 ring-stone-200">
                  Submit review
                </button>
              </form>
            </section>
          </div>
        </div>

        <div className="sticky bottom-0 grid grid-cols-2 gap-2 border-t border-stone-100 bg-white p-3 sm:rounded-b-[28px]">
          <button type="button" onClick={onAdd} className="rounded-full border border-stone-200 py-3 text-[13px]">
            {inCart ? 'Added' : 'Add'}
          </button>
          <button type="button" onClick={onBook} className="rounded-full bg-[#1C1917] py-3 text-[13px] text-white">
            Book appointment
          </button>
        </div>
      </div>
    </div>
  );
}
