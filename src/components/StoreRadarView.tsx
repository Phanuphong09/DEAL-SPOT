import React, { useState } from 'react';
import { StoreItem, DealItem } from '../types';
import { STORE_CATALOG_SECTIONS } from '../data/mockData';

interface StoreRadarViewProps {
  store: StoreItem;
  onSelectDeal: (deal: DealItem) => void;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export const StoreRadarView: React.FC<StoreRadarViewProps> = ({
  store,
  onSelectDeal,
  onBack,
  onShowToast,
}) => {
  const [isFollowing, setIsFollowing] = useState(store.isFollowing);
  const [notifyFlash, setNotifyFlash] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'meals' | 'beverages' | 'personal'>('all');
  const [favoritedItemIds, setFavoritedItemIds] = useState<Record<string, boolean>>({});

  const toggleFavoriteItem = (id: string) => {
    setFavoritedItemIds((prev) => {
      const next = !prev[id];
      onShowToast(next ? 'Item saved to your favorites!' : 'Item removed from favorites');
      return { ...prev, [id]: next };
    });
  };

  const handleClaim = (title: string, price: number) => {
    onShowToast(`Claimed voucher for ${title} at ฿${price}! Show at register.`);
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto">
      {/* Top Banner Image */}
      <div className="relative w-full h-44 bg-surface-container-high overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${store.bannerImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute top-3 right-3 flex items-center gap-space-xs bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-on-primary border border-white/20">
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping" />
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed -ml-3" />
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-white font-bold">
            {store.openHours}
          </span>
        </div>
      </div>

      {/* Store Header Card */}
      <div className="relative px-margin -mt-7 z-10 flex flex-col gap-space-md">
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md flex flex-col gap-space-md border border-slate-100/90">
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex items-center gap-space-md">
              <div className="w-14 h-14 rounded-xl bg-surface-container-lowest p-1.5 shadow-sm shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                <div className="w-full h-full rounded-lg bg-surface-container-low flex flex-col items-center justify-center font-display font-extrabold text-primary leading-none">
                  <span className="text-tertiary text-xs font-bold tracking-tight">7</span>
                  <span className="text-primary-container text-[10px] font-extrabold -mt-0.5">
                    ELEVEN
                  </span>
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                    {store.branch}
                  </h2>
                  <span
                    className="material-symbols-outlined text-primary-container text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-secondary truncate">
                  7-Eleven Convenience Retail
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center text-amber-500 font-label-sm text-label-sm">
                    <span
                      className="material-symbols-outlined text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="text-on-surface ml-0.5 font-bold">{store.rating}</span>
                  </div>
                  <span className="text-secondary text-body-sm">•</span>
                  <span className="font-body-sm text-body-sm text-secondary truncate">
                    {store.reviewCount}+ reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Follow Store Button */}
            <button
              type="button"
              onClick={() => {
                setIsFollowing(!isFollowing);
                onShowToast(
                  !isFollowing
                    ? 'Store alerts enabled! Following 7-Eleven Siam Square.'
                    : 'Unfollowed store'
                );
              }}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full font-label-md text-label-md shadow-sm active:scale-95 transition-all cursor-pointer ${
                isFollowing
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-surface-container-highest text-on-surface hover:bg-surface-container'
              }`}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: isFollowing ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              <span>{isFollowing ? 'Following' : '+ Follow'}</span>
            </button>
          </div>

          {/* Flash Discounts Toggle */}
          <div className="flex items-center justify-between bg-surface-container-low px-3.5 py-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container text-[18px]">
                notifications_active
              </span>
              <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                Notify me of new flash discounts
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifyFlash}
                onChange={(e) => {
                  setNotifyFlash(e.target.checked);
                  onShowToast(
                    e.target.checked
                      ? 'Flash discount alerts turned ON'
                      : 'Flash discount alerts paused'
                  );
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container" />
            </label>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-space-xs pt-1">
            <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
              <span className="font-price-hero text-headline-sm text-primary-container font-extrabold">
                {store.activeDealsCount}
              </span>
              <span className="font-label-sm text-label-sm text-secondary uppercase font-bold">
                Active Deals
              </span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
              <span className="font-headline-sm text-headline-sm text-tertiary font-bold">
                {store.distanceKm} km
              </span>
              <span className="font-label-sm text-label-sm text-secondary uppercase font-bold">
                {store.walkMinutes} min walk
              </span>
            </div>
            <div className="bg-primary-fixed rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-0.5 text-on-primary-fixed font-bold">
                <span className="material-symbols-outlined text-[16px] text-primary-container animate-pulse">
                  bolt
                </span>
                <span className="font-headline-sm text-headline-sm">Flash</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-primary-fixed uppercase font-bold">
                Active Today
              </span>
            </div>
          </div>
        </div>

        {/* Location Alley Card */}
        <div className="bg-secondary-fixed/50 rounded-2xl p-space-md flex items-center justify-between gap-space-md border border-blue-100">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-surface-container bg-cover bg-center shadow-xs"
              style={{ backgroundImage: `url('${store.mapThumbnail}')` }}
            />
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-secondary-fixed font-bold truncate">
                Siam Square Soi 5 Alley
              </span>
              <span className="font-body-sm text-body-sm text-on-secondary-fixed-variant truncate">
                Opposite Digital Gateway Center
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onShowToast('Opening turn-by-turn walking route to Siam Square Soi 5')}
            className="shrink-0 flex items-center gap-1 px-3 py-2 bg-on-secondary-fixed text-white rounded-xl font-label-md text-label-md shadow-sm active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">near_me</span>
            <span>Navigate</span>
          </button>
        </div>

        {/* Store Manager Broadcast Card */}
        <div className="bg-primary-fixed/40 rounded-2xl p-space-md flex items-start gap-space-sm border border-orange-200/60">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[18px]">campaign</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-label-md text-label-md text-on-primary-fixed font-bold">
                Store Manager Broadcast
              </span>
              <span className="font-label-sm text-label-sm text-primary font-bold">Just now</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-primary-fixed-variant mt-0.5">
              📢 Fresh batch of CP toasties and sushi boxes discounted up to 50% for evening
              clearance starting 6 PM! Stock is limited to shelf count.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Tab Switcher */}
      <div className="sticky top-16 z-30 bg-surface/95 backdrop-blur-md pt-space-md pb-space-sm mt-space-md border-b border-slate-100">
        <div className="flex items-center gap-space-sm overflow-x-auto px-margin no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`shrink-0 px-4 py-2 rounded-full font-label-md text-label-md shadow-sm transition-all active:scale-95 ${
              activeTab === 'all'
                ? 'bg-inverse-surface text-inverse-on-surface'
                : 'bg-surface-container-lowest text-secondary'
            }`}
          >
            All Deals (34)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('meals')}
            className={`shrink-0 px-4 py-2 rounded-full font-label-md text-label-md shadow-sm transition-all active:scale-95 ${
              activeTab === 'meals'
                ? 'bg-inverse-surface text-inverse-on-surface'
                : 'bg-surface-container-lowest text-secondary'
            }`}
          >
            Ready Meals &amp; Snacks (14)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('beverages')}
            className={`shrink-0 px-4 py-2 rounded-full font-label-md text-label-md shadow-sm transition-all active:scale-95 ${
              activeTab === 'beverages'
                ? 'bg-inverse-surface text-inverse-on-surface'
                : 'bg-surface-container-lowest text-secondary'
            }`}
          >
            Beverages (12)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`shrink-0 px-4 py-2 rounded-full font-label-md text-label-md shadow-sm transition-all active:scale-95 ${
              activeTab === 'personal'
                ? 'bg-inverse-surface text-inverse-on-surface'
                : 'bg-surface-container-lowest text-secondary'
            }`}
          >
            Personal &amp; Home (8)
          </button>
        </div>
      </div>

      {/* Deals Catalog Content */}
      <div className="flex flex-col gap-space-xl px-margin mt-space-md pb-28">
        {/* Section 1: Today's Top Highlights */}
        {(activeTab === 'all' || activeTab === 'meals' || activeTab === 'beverages') && (
          <section className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xl">🔥</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Today's Top Highlights
                </h3>
              </div>
              <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                Buy 1 Get 1 Free
              </span>
            </div>

            <div className="flex gap-space-md overflow-x-auto -mx-margin px-margin no-scrollbar pb-2">
              {STORE_CATALOG_SECTIONS[0].items.map((item) => (
                <div
                  key={item.id}
                  className="shrink-0 w-64 bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md flex flex-col border border-slate-100"
                >
                  <div className="relative h-36 w-full bg-surface-container">
                    <img className="w-full h-full object-cover" alt={item.title} src={item.image} />
                    <div className="absolute top-2 left-2 bg-primary-container text-on-primary px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold shadow-sm">
                      {item.badge}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavoriteItem(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur flex items-center justify-center text-secondary active:scale-90 transition-transform shadow-sm"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          favoritedItemIds[item.id] ? 'text-error' : ''
                        }`}
                        style={{
                          fontVariationSettings: favoritedItemIds[item.id]
                            ? "'FILL' 1"
                            : "'FILL' 0",
                        }}
                      >
                        favorite
                      </span>
                    </button>
                    <div className="absolute bottom-2 left-2 bg-inverse-surface/80 backdrop-blur-md px-2 py-0.5 rounded-full font-label-sm text-label-sm text-white flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-tertiary-fixed">
                        timer
                      </span>
                      <span>{item.timer}</span>
                    </div>
                  </div>
                  <div className="p-space-md flex flex-col justify-between flex-1 gap-space-sm">
                    <div>
                      <span className="font-label-sm text-label-sm text-tertiary font-bold">
                        {item.brand}
                      </span>
                      <h4 className="font-headline-sm text-body-md text-on-surface line-clamp-1 font-bold">
                        {item.title}
                      </h4>
                    </div>
                    <div className="flex items-end justify-between pt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-price-hero text-price-hero text-primary-container font-extrabold">
                          ฿{item.discountPrice}
                        </span>
                        <span className="font-body-sm text-body-sm text-secondary line-through">
                          ฿{item.originalPrice}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleClaim(item.title, item.discountPrice)}
                        className="px-3 py-1.5 rounded-xl bg-primary-container text-on-primary font-label-md text-label-md shadow-sm active:scale-95 transition-transform flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        <span>Claim</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Ready Meals & Fresh Food */}
        {(activeTab === 'all' || activeTab === 'meals') && (
          <section className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xl">🍱</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Ready Meals &amp; Fresh Food
                </h3>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-bold">
                Evening Clearance
              </span>
            </div>

            <div className="grid grid-cols-2 gap-space-sm">
              {STORE_CATALOG_SECTIONS[1].items.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col border border-slate-100"
                >
                  <div className="relative aspect-square w-full bg-surface-container">
                    <img
                      className="w-full h-full object-cover"
                      alt={item.title}
                      src={item.image}
                    />
                    <div className="absolute top-2 left-2 bg-error text-on-error px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold shadow-sm">
                      {item.badge}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavoriteItem(item.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-container-lowest/80 flex items-center justify-center text-secondary active:scale-90 transition-transform shadow-sm"
                    >
                      <span
                        className={`material-symbols-outlined text-[15px] ${
                          favoritedItemIds[item.id] ? 'text-error' : ''
                        }`}
                        style={{
                          fontVariationSettings: favoritedItemIds[item.id]
                            ? "'FILL' 1"
                            : "'FILL' 0",
                        }}
                      >
                        favorite
                      </span>
                    </button>
                    <div className="absolute bottom-2 left-2 right-2 bg-inverse-surface/80 backdrop-blur-sm px-2 py-0.5 rounded-md font-label-sm text-label-sm text-white flex items-center justify-between">
                      <span className="truncate">{item.statusText}</span>
                      <span className="text-tertiary-fixed font-bold shrink-0">
                        {item.stockText}
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 flex flex-col justify-between flex-1 gap-2">
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface line-clamp-2 font-bold">
                        {item.title}
                      </h4>
                      <span className="font-label-sm text-label-sm text-secondary">
                        {item.brand}
                      </span>
                    </div>
                    <div className="flex items-end justify-between pt-1">
                      <div className="flex flex-col">
                        <span className="font-body-sm text-body-sm text-secondary line-through">
                          ฿{item.originalPrice}
                        </span>
                        <span className="font-headline-sm text-headline-sm text-primary-container -mt-1 font-bold">
                          ฿{item.discountPrice}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleClaim(item.title, item.discountPrice)}
                        className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center active:bg-primary-container active:text-on-primary transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          add_shopping_cart
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Beverages & Coffee */}
        {(activeTab === 'all' || activeTab === 'beverages') && (
          <section className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xl">☕</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Beverages &amp; Coffee
                </h3>
              </div>
              <span className="font-label-sm text-label-sm text-secondary font-bold">
                All-Day Combos
              </span>
            </div>

            <div className="flex flex-col gap-space-sm">
              {STORE_CATALOG_SECTIONS[2].items.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex items-center gap-space-md border border-slate-100"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                    <img
                      className="w-full h-full object-cover"
                      alt={item.title}
                      src={item.image}
                    />
                    <span className="absolute top-1 left-1 bg-primary-container text-on-primary px-1.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
                      {item.badge}
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-label-sm text-label-sm text-tertiary font-bold">
                      {item.brand}
                    </span>
                    <h4 className="font-headline-sm text-body-md text-on-surface truncate font-bold">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="font-body-sm text-body-sm text-secondary truncate">
                        {item.subtitle}
                      </p>
                    )}
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-headline-sm text-headline-sm text-primary-container font-extrabold">
                        ฿{item.discountPrice}
                      </span>
                      <span className="font-body-sm text-body-sm text-secondary line-through">
                        ฿{item.originalPrice}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleClaim(item.title, item.discountPrice)}
                    className="shrink-0 px-3.5 py-2 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1 active:bg-primary-container active:text-on-primary transition-colors font-bold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
