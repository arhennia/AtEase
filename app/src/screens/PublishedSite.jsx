import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { mutedClass, pageClass, titleClass } from '../components/platform/ui';
import { SalonSite } from '../components/salon/SalonSite';

export function PublishedSite() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const currentPartnerId = useAppStore((s) => s.currentPartnerId);

  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const preview = searchParams.get('preview') === '1';

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { fetchPartnerBySlug, fetchPublishedSite } = useAppStore.getState();
      const [loaded, publishedConfig] = await Promise.all([
        fetchPartnerBySlug(slug),
        fetchPublishedSite(slug),
      ]);
      if (!active) return;
      if (loaded && publishedConfig) {
        setPartner({ ...loaded, siteConfig: publishedConfig });
      } else {
        setPartner(loaded || null);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className={`${pageClass} flex items-center justify-center`}>
        <p className="text-sm text-stone-400">Loading studio…</p>
      </div>
    );
  }

  const isOwner = partner && partner.id === currentPartnerId;
  const live = Boolean(partner?.siteConfig?.published) || (preview && isOwner);

  if (!partner || !live) {
    return (
      <div className={`${pageClass} flex items-center justify-center px-5`}>
        <div className="max-w-md space-y-3 text-center">
          <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400">Not published</p>
          <h1 className={`${titleClass} text-3xl`}>This website is not live yet</h1>
          <p className={mutedClass}>Ask the studio for their public booking link, or publish it from the dashboard.</p>
          <Link to="/" className="inline-block text-[13px] text-[#6D5A8D] underline underline-offset-2">
            Back to AtEase
          </Link>
        </div>
      </div>
    );
  }

  return <SalonSite partner={partner} preview={preview && !partner.siteConfig?.published} />;
}
