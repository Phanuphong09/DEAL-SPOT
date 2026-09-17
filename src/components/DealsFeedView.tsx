import React, { useState, useEffect } from 'react';
import { DealItem, LocationArea } from '../types';

interface DealsFeedProps {
  deals: DealItem[];
  currentLocation?: LocationArea;
  onSelectDeal: (deal: DealItem) => void;
  onToggleFavorite: (id: string) => void;
  onNavigateToMap: () => void;
  onShowToast: (msg: string) => void;
}

export const DealsFeedView: React.FC<DealsFeedProps> = ({
  deals,
  currentLocation,
  onSelectDeal,
  onToggleFavorite,
  onNavigateToMap,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'discount' | 'distance' | 'flash'>('discount');

  // Live countdown timer for the top flash banner
  const [countdownSeconds, setCountdownSeconds] = useState(1 * 3600 + 42 * 60 + 18);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Filter deals
  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'food'
        ? deal.category === 'food'
        : selectedCategory === 'beverages'
        ? deal.category === 'beverages'
        : selectedCategory === 'household'
        ? deal.category === 'household'
        : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto">
      {/* Sticky search & filters strip */}
      <section className="sticky top-16 z-40 bg-surface-container-lowest/95 backdrop-blur-md px-margin py-space-sm shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)] flex flex-col gap-space-sm border-b border-slate-100">
        {/* Active Location Info Pill */}
        {currentLocation && (
          <div className="flex items-center justify-between pb-0.5">
            <button
              id="deals-feed-location-btn"
              type="button"
              onClick={onNavigateToMap}
              className="flex items-center gap-1.5 text-xs text-on-surface hover:text-primary transition-colors cursor-pointer group"
            >
              <span
                className="material-symbols-outlined text-primary-container text-[18px] group-hover:scale-110 transition-transform"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                location_on
              </span>
              <span className="font-bold truncate max-w-[210px]">
                {currentLocation.nameTh}
              </span>
              <span className="text-[11px] text-secondary">
                ({currentLocation.stationTag})
              </span>
              <span className="material-symbols-outlined text-secondary text-[16px]">
                edit_location_alt
              </span>
            </button>

            <button
              type="button"
              onClick={onNavigateToMap}
              className="text-[11px] font-bold text-primary bg-orange-50 hover:bg-orange-100 px-2 py-0.5 rounded-full flex items-center gap-0.5 transition-colors"
            >
              <span>เปลี่ยนพื้นที่/ปักหมุด</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
        )}

        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px] pointer-events-none">
            search
          </span>
          <input
            className="w-full h-11 pl-10 pr-10 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-full outline-none focus:bg-surface-container transition-all"
            placeholder="Search deals, snacks, essentials..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            aria-label="Clear or voice search"
            className="absolute right-3 text-secondary hover:text-on-surface flex items-center justify-center active:scale-90 transition-transform"
            onClick={() => onShowToast('Voice search activated')}
          >
            <span className="material-symbols-outlined text-[18px]">mic</span>
          </button>
        </div>

        {/* Sorting buttons */}
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar pb-1 -mx-margin px-margin">
          <button
            type="button"
            onClick={() => {
              setSortOption('discount');
              onShowToast('Sorted by Highest Discount');
            }}
            className={`shrink-0 h-8 px-3 rounded-full font-label-md text-label-md flex items-center gap-1 transition-all active:scale-95 ${
              sortOption === 'discount'
                ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-primary">swap_vert</span>
            <span>Highest Discount</span>
            <span className="material-symbols-outlined text-[14px] text-secondary">expand_more</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSortOption('distance');
              onShowToast('Filtered within 2.0 km');
            }}
            className={`shrink-0 h-8 px-3 rounded-full font-label-md text-label-md flex items-center gap-1 transition-all active:scale-95 ${
              sortOption === 'distance'
                ? 'bg-tertiary-fixed text-on-tertiary-fixed font-bold'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary">near_me</span>
            <span>&lt; 2 km</span>
            <span className="material-symbols-outlined text-[14px] text-secondary">expand_more</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSortOption('flash');
              onShowToast('Showing flash deals expiring first');
            }}
            className={`shrink-0 h-8 px-3 rounded-full font-label-md text-label-md flex items-center gap-1 transition-all active:scale-95 ${
              sortOption === 'flash'
                ? 'bg-primary-container text-on-primary font-bold'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-primary">bolt</span>
            <span>Flash Expiring</span>
          </button>

          <button
            type="button"
            onClick={() => onShowToast('Filter by: 7-Eleven, Lotus, Big C, Tops')}
            className="shrink-0 h-8 px-3 rounded-full bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1 hover:bg-surface-container-high transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">storefront</span>
            <span>Stores</span>
            <span className="material-symbols-outlined text-[14px] text-secondary">expand_more</span>
          </button>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar pb-1 -mx-margin px-margin">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
              selectedCategory === 'all'
                ? 'bg-inverse-surface text-inverse-on-surface shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            All Deals
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('food')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
              selectedCategory === 'food'
                ? 'bg-inverse-surface text-inverse-on-surface shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Food &amp; Snacks
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('beverages')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
              selectedCategory === 'beverages'
                ? 'bg-inverse-surface text-inverse-on-surface shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Beverages
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('household')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
              selectedCategory === 'household'
                ? 'bg-inverse-surface text-inverse-on-surface shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Household
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('personal')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
              selectedCategory === 'personal'
                ? 'bg-inverse-surface text-inverse-on-surface shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Health &amp; Beauty
          </button>
        </div>
      </section>

      {/* Main deals listing content */}
      <div className="px-margin pt-space-md flex flex-col gap-space-md">
        {/* Flash banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-container via-primary to-primary-fixed-dim p-space-md text-on-primary shadow-[0_8px_24px_-4px_rgba(249,115,22,0.28)] flex items-center justify-between gap-space-sm">
          <div className="flex items-start gap-space-sm min-w-0">
            <div className="w-9 h-9 rounded-full bg-surface-container-lowest/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px] text-on-primary">bolt</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-label-sm text-label-sm uppercase tracking-wider bg-surface-container-lowest/25 px-1.5 py-0.5 rounded-full">
                  Flash Near Siam Sq
                </span>
                <span className="font-label-sm text-label-sm bg-error text-on-error px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                  Ending Soon
                </span>
              </div>
              <p className="font-headline-sm text-headline-sm text-on-primary truncate mt-0.5">
                Up to 70% off neighborhood stock
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0 pl-1">
            <span className="font-headline-sm text-headline-sm tracking-tight text-on-primary font-extrabold font-mono">
              {formatTimer(countdownSeconds)}
            </span>
            <span className="font-label-sm text-label-sm text-on-primary/80">Claim quickly</span>
          </div>
        </div>

        {/* Section title & map view toggle */}
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Nearby Discounts{' '}
            <span className="text-secondary font-body-sm text-body-sm font-normal">
              ({filteredDeals.length} ready to pick)
            </span>
          </span>
          <button
            type="button"
            onClick={onNavigateToMap}
            className="flex items-center gap-1 text-primary font-label-md text-label-md active:scale-95 transition-transform cursor-pointer"
          >
            <span>Map View</span>
            <span className="material-symbols-outlined text-[16px]">location_on</span>
          </button>
        </div>

        {/* Deal Cards */}
        <div className="flex flex-col gap-space-md">
          {filteredDeals.map((deal) => {
            const isMeiji = deal.id.includes('meiji');
            const isSingha = deal.id.includes('singha');
            const isPringles = deal.id.includes('pringles');
            const isDowny = deal.id.includes('downy');

            return (
              <div
                key={deal.id}
                className="bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_4px_16px_-2px_rgba(15,23,42,0.04)] flex flex-col gap-space-sm relative transition-all active:scale-[0.995] border border-slate-100/90"
              >
                {/* Image showcase */}
                <div
                  className="relative w-full h-44 rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center cursor-pointer"
                  onClick={() => onSelectDeal(deal)}
                >
                  <img
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    alt={deal.title}
                    src={deal.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 via-transparent to-transparent"></div>

                  {/* Top discount & timer badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-1 rounded-full font-label-lg text-label-lg font-extrabold shadow-sm tracking-tight ${
                        isPringles ? 'bg-primary-container text-on-primary' : 'bg-error text-on-error'
                      }`}
                    >
                      {deal.discountBadge || `-${deal.discountPercent}% OFF`}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm font-bold flex items-center gap-0.5 shadow-sm">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      {deal.timeLeft || 'Limited time'}
                    </span>
                  </div>

                  {/* Heart Favorite button */}
                  <button
                    aria-label="Favorite deal"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(deal.id);
                      onShowToast(
                        !deal.isFavorite
                          ? `Saved "${deal.title}" to Favorites!`
                          : `Removed "${deal.title}" from Favorites`
                      );
                    }}
                    className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center shadow-md transition-transform active:scale-90 ${
                      deal.isFavorite ? 'text-error' : 'text-secondary hover:text-error'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: deal.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>

                  {/* Store name & distance pill */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                    <div className="px-2 py-1 rounded-full bg-surface-container-lowest/95 backdrop-blur-md flex items-center gap-1 shadow-sm">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: deal.storeColor || '#007a3d' }}
                      ></span>
                      <span className="font-label-sm text-label-sm font-bold text-on-surface">
                        {deal.storeName}
                      </span>
                    </div>
                    <div className="px-2 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">near_me</span>
                      <span>
                        {deal.distanceKm} km • {deal.storeBranch}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Title and price info */}
                <div
                  className="flex flex-col gap-1 cursor-pointer"
                  onClick={() => onSelectDeal(deal)}
                >
                  <div className="flex items-start justify-between gap-space-sm">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold hover:text-primary transition-colors">
                      {deal.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-space-sm mt-1">
                    <span className="font-price-hero text-price-hero text-primary font-extrabold">
                      ฿{deal.discountPrice}
                    </span>
                    <span className="font-body-md text-body-md text-secondary line-through">
                      ฿{deal.originalPrice}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold">
                      Save ฿{(deal.originalPrice - deal.discountPrice).toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Card footer CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-[16px] animate-pulse">
                      local_fire_department
                    </span>
                    <span className="font-label-sm text-label-sm font-bold">
                      {deal.remainingText || `${deal.remainingCount} left in stock`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onShowToast(`Voucher claimed for ${deal.title}! Ready for checkout.`);
                    }}
                    className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold shadow-[0_4px_12px_rgba(249,115,22,0.25)] hover:bg-primary-container active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Claim Deal</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Neighborhood clearance alert subscription prompt */}
        <div className="p-space-md rounded-2xl bg-surface-container-low flex flex-col items-center justify-center text-center gap-space-xs mt-space-sm mb-4 border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
          </div>
          <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Never miss neighborhood clearance
          </p>
          <p className="font-body-sm text-body-sm text-secondary max-w-xs">
            Stores around Siam drop prices every day after 6 PM. Turn on instant location pings.
          </p>
          <button
            type="button"
            onClick={() => onShowToast('Notifications enabled for 500m walking radius!')}
            className="mt-2 px-4 py-2 rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md font-bold active:scale-95 transition-transform shadow-sm cursor-pointer"
          >
            Notify for 500m radius
          </button>
        </div>
      </div>
    </div>
  );
};
