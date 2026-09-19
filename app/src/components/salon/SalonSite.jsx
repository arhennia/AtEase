import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Share2, Star, LayoutGrid } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { tenantToStorefrontProfile } from '../../data/tenants';
import { getTenantCatalog } from '../../lib/tenancy';
import {
  averageRating,
  decorateCatalog,
  formatInr,
  hasBookedService,
  reviewsForService,
  servicePrice,
} from '../../lib/salonMenu';
import { buildSiteConfigFromPartner, buildWhatsAppShareUrl, publicSiteUrl } from '../../lib/siteConfig';
import { ServiceDetailsSheet } from './ServiceDetailsSheet';
import { CategoryMenuSheet } from './CategoryMenuSheet';

function Badge({ kind }) {
  if (kind === 'bestseller') {
    return <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#6D5A8D]">Bestseller</span>;
  }
  if (kind === 'recommended') {
    return <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400">Recommended</span>;
  }
  if (kind === 'package') {
    return <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400">Package</span>;
  }
  return null;
}

export function SalonSite({ partner, preview = false }) {
  const navigate = useNavigate();
  const cart = useAppStore((s) => s.cart);
  const addToCart = useAppStore((s) => s.addToCart);
  const openBookingModal = useAppStore((s) => s.openBookingModal);
  const setCartDrawerOpen = useAppStore((s) => s.setCartDrawerOpen);
  const reviews = useAppStore((s) => s.reviews);
  const addReview = useAppStore((s) => s.addReview);
  const showToast = useAppStore((s) => s.showToast);

  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const sectionRefs = useRef({});

  const appearance = buildSiteConfigFromPartner(partner);
  const catalog = decorateCatalog(getTenantCatalog(partner));
  const packages = partner?.packages?.length ? partner.packages : [];
  const providerObj = tenantToStorefrontProfile(partner);

  const tiles = useMemo(() => {
    const list = [];
    if (packages.length) {
      list.push({
        id: 'packages',
        shortName: 'Packages',
        imageUrl: packages[0]?.imageUrl,
        isPackageCategory: true,
      });
    }
    catalog.forEach((cat) => list.push(cat));
    return list;
  }, [catalog, packages]);

  const sections = useMemo(() => {
    const rows = [];
    if (packages.length) {
      rows.push({ id: 'packages', title: 'Packages', items: packages });
    }
    catalog.forEach((cat) => {
      rows.push({
        id: cat.id,
        title: cat.shortName || cat.categoryName,
        items: cat.services || [],
      });
    });
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          `${item.name} ${item.description || ''}`.toLowerCase().includes(needle)
        ),
      }))
      .filter((section) => section.items.length);
  }, [catalog, packages, query]);

  const partnerReviews = reviews.filter((review) => review.partnerId === partner.id);
  const studioRating = averageRating(partnerReviews) || partner.rating || '4.9';
  const reviewCount = partnerReviews.length || partner.reviewCount || '0';

  const scrollTo = (id) => {
    setMenuOpen(false);
    const node = sectionRefs.current[id];
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const isCartItem = (id) => cart.some((item) => item.id === id);

  const handleAdd = (item, categoryName) => {
    const price = servicePrice(item);
    addToCart({
      ...item,
      category: categoryName,
      price,
      uptoPrice: price,
      homePrice: price,
      inSalonPrice: price,
      partnerId: partner.id,
    });
  };

  const handleBook = (item) => {
    openBookingModal({
      provider: providerObj,
      partnerId: partner.id,
      partnerSlug: partner.slug,
      serviceName: item.name,
      amount: servicePrice(item),
      serviceId: item.id,
      salonId: partner.salonId || null,
      whatsappNumber: partner.whatsappNumber || partner.ownerPhone || appearance.contactPhone || '',
    });
  };

  const handleShare = async () => {
    const url = publicSiteUrl(partner.slug);
    const text = `Book with ${appearance.businessName}: ${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: appearance.businessName, text, url });
        return;
      } catch {
        /* fall through */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied.');
    } catch {
      window.open(buildWhatsAppShareUrl(text), '_blank', 'noopener,noreferrer');
    }
  };

  const about = appearance.about || {};
  const bannerUrl = appearance.bannerUrl || partner.coverUrl;
  const cartTotal = cart.reduce((sum, item) => sum + servicePrice(item), 0);
  const ownerPhoto = about.ownerPhotoUrl || partner.logoUrl;

  return (
    <div className="min-h-screen bg-[#F6F4F1] text-[#1C1917] font-studio antialiased">
      {preview && (
        <div className="bg-[#F3EEF8] px-4 py-2 text-center text-[12px] text-[#4A3F5C]">
          Preview — publish from the dashboard to share this page
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-[#F6F4F1]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1080px] items-center gap-3 px-4 py-3 sm:px-8">
          <button
            type="button"
            onClick={() => (activeService ? setActiveService(null) : navigate('/'))}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-stone-200/80"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <p className="min-w-0 flex-1 truncate font-studioSerif text-[18px] sm:text-[20px] tracking-tight">
            {appearance.businessName}
          </p>
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-stone-200/80"
            aria-label="Search"
          >
            <Search size={15} />
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 ring-stone-200/80"
            aria-label="Share"
          >
            <Share2 size={15} />
          </button>
        </div>
        {searchOpen && (
          <div className="mx-auto max-w-[1080px] px-4 pb-3 sm:px-8">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu"
              className="w-full rounded-full bg-white px-4 py-2.5 text-sm outline-none ring-1 ring-stone-200"
            />
          </div>
        )}
      </header>

      <section className="relative h-[240px] overflow-hidden bg-stone-200 sm:h-[340px] lg:h-[420px]">
        {bannerUrl ? (
          <img src={bannerUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#EDE9FE] via-stone-100 to-[#F6F4F1]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1080px] px-5 pb-16 sm:px-8 sm:pb-20">
          <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-white/70">Private studio</p>
          <h1 className="max-w-2xl font-studioSerif text-[36px] leading-[1.05] text-white sm:text-[52px] lg:text-[60px]">
            {appearance.businessName}
          </h1>
        </div>
      </section>

      <main className="relative mx-auto max-w-[1080px] px-4 pb-36 sm:px-8">
        <section className="-mt-12 rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(28,25,23,0.08)] sm:-mt-16 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-stone-100 ring-4 ring-white sm:h-28 sm:w-28">
              {ownerPhoto ? <img src={ownerPhoto} alt="" className="h-full w-full object-cover" /> : null}
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400">About</p>
              <h2 className="mt-1 font-studioSerif text-[28px] leading-tight sm:text-[32px]">
                {about.ownerName || appearance.businessName}
              </h2>
              {about.experience ? <p className="mt-1 text-sm text-stone-500">{about.experience}</p> : null}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-stone-500">
                <Star size={12} className="fill-[#1C1917] text-[#1C1917]" />
                <span className="font-medium text-[#1C1917]">{studioRating}</span>
                <span>· {reviewCount} reviews</span>
              </div>
            </div>
          </div>
          {about.bio ? (
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-stone-600">{about.bio}</p>
          ) : null}
          {about.location ? <p className="mt-3 text-[13px] text-stone-400">{about.location}</p> : null}
        </section>

        <section className="mt-10 sm:mt-12">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400">Menu</p>
              <h3 className="mt-1 font-studioSerif text-[26px] sm:text-[30px]">Choose a category</h3>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {tiles.map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={() => scrollTo(tile.id)}
                className="group flex flex-col text-left"
              >
                <span className="relative aspect-square overflow-hidden rounded-2xl bg-stone-100">
                  {tile.imageUrl ? (
                    <img
                      src={tile.imageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : null}
                  {tile.badge ? (
                    <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-[#1C1917]">
                      {tile.badge}
                    </span>
                  ) : null}
                </span>
                <span className="mt-2 text-[12px] leading-snug text-stone-700 sm:text-[13px]">
                  {tile.shortName || tile.categoryName}
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-12 space-y-14 sm:mt-16">
          {sections.map((section) => (
            <section
              key={section.id}
              ref={(node) => {
                sectionRefs.current[section.id] = node;
              }}
              className="scroll-mt-24"
            >
              <h3 className="mb-5 font-studioSerif text-[26px] sm:text-[30px]">{section.title}</h3>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {section.items.map((item) => {
                  const inCart = isCartItem(item.id);
                  const itemReviews = reviewsForService(reviews, partner.id, item.id);
                  const rating = averageRating(itemReviews);
                  return (
                    <article key={item.id} className="flex gap-4 rounded-[22px] bg-white p-4 sm:p-5">
                      <div className="min-w-0 flex-1">
                        <Badge kind={item.isPackage ? 'package' : item.badge} />
                        <h4 className="mt-1 font-studioSerif text-[20px] leading-snug">{item.name}</h4>
                        <p className="mt-1.5 text-[13px] text-stone-500">
                          {rating ? (
                            <>
                              <Star size={11} className="mr-0.5 inline fill-[#1C1917] text-[#1C1917]" />
                              {rating} ({itemReviews.length}) ·{' '}
                            </>
                          ) : null}
                          <span className="font-medium text-[#1C1917]">{formatInr(servicePrice(item))}</span>
                          {item.duration ? ` · ${item.duration}` : ''}
                        </p>
                        {(item.packageItems || []).slice(0, 3).map((line) => (
                          <p key={line} className="mt-1 text-[12px] text-stone-500">
                            {line}
                          </p>
                        ))}
                        {!item.packageItems?.length && item.description ? (
                          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-stone-500">
                            {item.description}
                          </p>
                        ) : null}
                        <button
                          type="button"
                          onClick={() =>
                            setActiveService({ ...item, categoryId: section.id, categoryName: section.title })
                          }
                          className="mt-3 text-[13px] text-[#6D5A8D] underline-offset-2 hover:underline"
                        >
                          View details
                        </button>
                      </div>
                      <div className="relative w-[96px] shrink-0 sm:w-[112px]">
                        <div className="h-[96px] overflow-hidden rounded-2xl bg-stone-100 sm:h-[112px]">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAdd(item, section.title)}
                          className={`absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-[12px] font-medium shadow-sm ring-1 ${
                            inCart ? 'text-stone-400 ring-stone-200' : 'text-[#1C1917] ring-stone-200'
                          }`}
                        >
                          {inCart ? 'Added' : 'Add'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        className={`fixed right-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#1C1917] px-4 py-2.5 text-[13px] font-medium text-white shadow-lg sm:right-8 ${
          cart.length ? 'bottom-28' : 'bottom-6'
        }`}
      >
        <LayoutGrid size={14} />
        Menu
      </button>

      {cart.length > 0 && (
        <div className="fixed bottom-4 left-1/2 z-40 flex w-[min(92%,520px)] -translate-x-1/2 items-center justify-between rounded-full bg-[#1C1917] px-4 py-3 text-white shadow-xl">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/55">
              {cart.length} {cart.length === 1 ? 'service' : 'services'}
            </p>
            <p className="text-sm font-medium">{formatInr(cartTotal)}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="rounded-full bg-white/10 px-3 py-1.5 text-[12px]"
            >
              Bag
            </button>
            <button
              type="button"
              onClick={() =>
                openBookingModal({
                  services: cart,
                  totalAmount: cartTotal,
                  serviceName: cart.map((item) => item.name).join(', '),
                  partnerId: partner.id,
                  salonId: partner.salonId || null,
                  whatsappNumber: partner.whatsappNumber || partner.ownerPhone || appearance.contactPhone,
                  provider: providerObj,
                })
              }
              className="rounded-full bg-white px-3 py-1.5 text-[12px] font-medium text-[#1C1917]"
            >
              Book appointment
            </button>
          </div>
        </div>
      )}

      <CategoryMenuSheet open={menuOpen} tiles={tiles} onClose={() => setMenuOpen(false)} onSelect={scrollTo} />

      <ServiceDetailsSheet
        open={Boolean(activeService)}
        item={activeService}
        partner={partner}
        reviews={activeService ? reviewsForService(reviews, partner.id, activeService.id) : []}
        inCart={activeService ? isCartItem(activeService.id) : false}
        onClose={() => setActiveService(null)}
        onAdd={() => activeService && handleAdd(activeService, activeService.categoryName)}
        onBook={() => {
          if (!activeService) return;
          const item = activeService;
          setActiveService(null);
          handleBook(item);
        }}
        onReview={(payload) =>
          addReview({
            ...payload,
            partnerId: partner.id,
            serviceId: activeService.id,
            serviceName: activeService.name,
          })
        }
        canReview={(phone) =>
          hasBookedService(useAppStore.getState().appointments, partner.id, activeService?.name, phone)
        }
      />
    </div>
  );
}
