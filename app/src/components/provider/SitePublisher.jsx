import React, { useEffect, useMemo, useState } from 'react';
import { Copy, ExternalLink, Share2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getAuthUser, isSupabaseConfigured, uploadOwnerImage } from '../../lib/supabase';
import {
  buildWhatsAppActionUrl,
  buildWhatsAppShareUrl,
  draftFromPartner,
  publicSitePath,
  publicSiteUrl,
  siteConfigIsReady,
} from '../../lib/siteConfig';
import { SoftButton, SoftCard, eyebrowClass, inputClass, mutedClass, titleClass } from '../platform/ui';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function SitePublisher({ partner }) {
  const publishSiteConfig = useAppStore((s) => s.publishSiteConfig);
  const saveSiteDraft = useAppStore((s) => s.saveSiteDraft);
  const showToast = useAppStore((s) => s.showToast);
  const [draft, setDraft] = useState(() => draftFromPartner(partner));
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState('');

  useEffect(() => {
    setDraft(draftFromPartner(partner));
  }, [partner?.id, partner?.siteConfig?.publishedAt]);

  const siteUrl = publicSiteUrl(partner.slug);
  const sitePath = publicSitePath(partner.slug);
  const actionUrl = useMemo(
    () => buildWhatsAppActionUrl(draft.contactPhone, draft.whatsappMessage),
    [draft.contactPhone, draft.whatsappMessage]
  );
  const shareUrl = useMemo(() => {
    const text = `Book with ${draft.businessName || partner.brandName}: ${siteUrl}`;
    return buildWhatsAppShareUrl(text);
  }, [draft.businessName, partner.brandName, siteUrl]);

  const patch = (partial) => setDraft((prev) => ({ ...prev, ...partial }));
  const patchAbout = (partial) =>
    setDraft((prev) => ({ ...prev, about: { ...(prev.about || {}), ...partial } }));

  const handleImage = async (field, file) => {
    if (!file) return;
    setUploading(field);
    try {
      const user = await getAuthUser();
      let url = '';
      if (isSupabaseConfigured && user?.id) {
        const uploaded = await uploadOwnerImage(user.id, file);
        url = uploaded.ok ? uploaded.url : '';
      }
      if (!url) url = await readFileAsDataUrl(file);
      if (field === 'bannerUrl') patch({ bannerUrl: url });
      if (field === 'ownerPhotoUrl') patchAbout({ ownerPhotoUrl: url });
    } finally {
      setUploading('');
    }
  };

  const handlePublish = async () => {
    const ready = siteConfigIsReady(draft);
    if (!ready.ok) {
      showToast(ready.error);
      return;
    }
    setSaving(true);
    const result = await publishSiteConfig(draft);
    setSaving(false);
    if (!result.ok) showToast(result.error || 'Could not publish.');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      showToast('Public link copied.');
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      showToast('Could not copy. Select the URL instead.');
    }
  };

  const handleSaveDraft = async () => {
    await saveSiteDraft(draft);
    showToast('Draft saved on this device.');
  };

  return (
    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
      <SoftCard className="p-6 sm:p-8 space-y-6">
        <div>
          <p className={eyebrowClass}>Website</p>
          <h3 className={`${titleClass} text-xl mt-1`}>Studio page</h3>
          <p className={`${mutedClass} mt-1`}>
            Banner, portrait, and about copy. The menu and packages are edited in their own tabs — they appear on this page automatically.
          </p>
        </div>

        <label className="block space-y-1.5">
          <span className={eyebrowClass}>Studio name</span>
          <input
            value={draft.businessName}
            onChange={(e) => patch({ businessName: e.target.value })}
            className={inputClass}
            placeholder="Rajkumari Beauty & Aesthetics"
          />
        </label>

        <label className="block space-y-1.5">
          <span className={eyebrowClass}>Title</span>
          <input
            value={draft.subtitle}
            onChange={(e) => patch({ subtitle: e.target.value })}
            className={inputClass}
            placeholder="Master hair & skin specialist"
          />
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className={eyebrowClass}>Banner</span>
            <label className="flex h-28 cursor-pointer overflow-hidden rounded-2xl border border-stone-200 bg-[#F7F6F8]">
              {draft.bannerUrl ? (
                <img src={draft.bannerUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="m-auto text-xs text-stone-400">
                  {uploading === 'bannerUrl' ? 'Uploading…' : 'Upload studio banner'}
                </span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage('bannerUrl', e.target.files?.[0])} />
            </label>
          </label>
          <label className="block space-y-1.5">
            <span className={eyebrowClass}>Portrait</span>
            <label className="flex h-28 cursor-pointer overflow-hidden rounded-2xl border border-stone-200 bg-[#F7F6F8]">
              {draft.about?.ownerPhotoUrl ? (
                <img src={draft.about.ownerPhotoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="m-auto text-xs text-stone-400">
                  {uploading === 'ownerPhotoUrl' ? 'Uploading…' : 'Upload portrait'}
                </span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage('ownerPhotoUrl', e.target.files?.[0])} />
            </label>
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className={eyebrowClass}>Owner name</span>
          <input
            value={draft.about?.ownerName || ''}
            onChange={(e) => patchAbout({ ownerName: e.target.value })}
            className={inputClass}
          />
        </label>

        <label className="block space-y-1.5">
          <span className={eyebrowClass}>Experience</span>
          <input
            value={draft.about?.experience || ''}
            onChange={(e) => patchAbout({ experience: e.target.value })}
            className={inputClass}
            placeholder="15+ years · Hair & skin"
          />
        </label>

        <label className="block space-y-1.5">
          <span className={eyebrowClass}>About</span>
          <textarea
            rows={4}
            value={draft.about?.bio || ''}
            onChange={(e) => patchAbout({ bio: e.target.value })}
            className={`${inputClass} resize-none`}
          />
        </label>

        <label className="block space-y-1.5">
          <span className={eyebrowClass}>Location</span>
          <input
            value={draft.about?.location || ''}
            onChange={(e) => patchAbout({ location: e.target.value })}
            className={inputClass}
          />
        </label>

        <label className="block space-y-1.5">
          <span className={eyebrowClass}>Contact phone (WhatsApp)</span>
          <div className="flex rounded-2xl border border-stone-200 focus-within:border-[#D4C8E8] focus-within:ring-2 focus-within:ring-[#EDE9FE] bg-[#F7F6F8]">
            <span className="px-3 py-3 text-xs text-stone-500 border-r border-stone-200 font-mono bg-[#EFECEF] rounded-l-2xl">
              +91
            </span>
            <input
              type="tel"
              value={String(draft.contactPhone || '').replace(/^91/, '').slice(-10)}
              onChange={(e) => patch({ contactPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              className="w-full bg-transparent px-4 py-3 text-sm outline-none font-heroSans"
              placeholder="98765 43210"
            />
          </div>
        </label>

        <label className="block space-y-1.5">
          <span className={eyebrowClass}>Default WhatsApp greeting</span>
          <textarea
            rows={3}
            value={draft.whatsappMessage}
            onChange={(e) => patch({ whatsappMessage: e.target.value })}
            className={`${inputClass} resize-none`}
            placeholder="Hi, I would like to book an appointment."
          />
          <p className="text-[11px] text-stone-400">
            Bookings still send date, time, and the selected service. This is the fallback greeting.
          </p>
        </label>

        <div className="flex flex-wrap gap-2 pt-2">
          <SoftButton onClick={handlePublish} disabled={saving}>
            {saving ? 'Publishing…' : 'Publish site'}
          </SoftButton>
          <SoftButton tone="ghost" onClick={handleSaveDraft}>
            Save draft
          </SoftButton>
          <SoftButton tone="ghost" onClick={() => window.open(`${sitePath}?preview=1`, '_blank', 'noopener,noreferrer')}>
            <ExternalLink size={14} />
            Preview
          </SoftButton>
        </div>
      </SoftCard>

      <div className="space-y-6">
        <SoftCard className="p-6 sm:p-8 space-y-4">
          <div>
            <p className={eyebrowClass}>Share website</p>
            <h3 className={`${titleClass} text-xl mt-1`}>Send clients this link</h3>
            <p className={`${mutedClass} mt-1`}>
              {partner.siteConfig?.published
                ? 'This URL is live on localhost and will stay the same in production.'
                : 'Publish first so this URL shows your latest details.'}
            </p>
          </div>
          <div className="rounded-2xl bg-[#F7F6F8] border border-stone-200 px-4 py-3 text-sm break-all font-mono text-[#1C1917]">
            {siteUrl}
          </div>
          <div className="flex flex-wrap gap-2">
            <SoftButton onClick={handleCopy}>
              <Copy size={14} />
              {copied ? 'Copied' : 'Copy link'}
            </SoftButton>
            <SoftButton tone="lavender" href={shareUrl} target="_blank" rel="noopener noreferrer">
              <Share2 size={14} />
              Share on WhatsApp
            </SoftButton>
          </div>
          {actionUrl ? (
            <a
              href={actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[13px] text-[#6D5A8D] underline underline-offset-2"
            >
              Test a WhatsApp greeting
            </a>
          ) : (
            <p className="text-xs text-stone-400">Add a valid phone number to test WhatsApp.</p>
          )}
        </SoftCard>
      </div>
    </div>
  );
}
