import React, { useState } from 'react';
import { DealItem } from '../types';

interface SavedDealsProps {
  deals: DealItem[];
  onSelectDeal: (deal: DealItem) => void;
  onToggleFavorite: (id: string) => void;
  onShowToast: (msg: string) => void;
  onNavigateToDeals: () => void;
}

export const SavedDealsView: React.FC<SavedDealsProps> = ({
  deals,
  onSelectDeal,
  onToggleFavorite,
  onShowToast,
  onNavigateToDeals,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'expiring'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const savedDeals = deals.filter((d) => d.isFavorite);

  const filteredDeals = savedDeals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterTab === 'expiring') {
      return matchesSearch && (deal.timeLeft?.includes('h') || deal.isFlash);
    }
    return matchesSearch;
  });

  const totalPotentialSavings = savedDeals.reduce(
    (acc, item) => acc + (item.originalPrice - item.discountPrice),
    0
  );

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto">
      {/* Sticky Top Header & Search */}
      <div className="sticky top-16 z-30 bg-surface-container-lowest/95 backdrop-blur-md px-margin py-space-sm shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)] flex flex-col gap-space-sm border-b border-slate-100">
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px] pointer-events-none">
            search
          </span>
          <input
            className="w-full h-11 pl-10 pr-4 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-full outline-none focus:bg-surface-container transition-all"
            placeholder="Search saved items or stores..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
              filterTab === 'all'
                ? 'bg-inverse-surface text-inverse-on-surface shadow-sm font-bold'
                : 'bg-surface-container text-secondary hover:bg-surface-container-high'
            }`}
          >
            All Saved ({savedDeals.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('active')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
              filterTab === 'active'
                ? 'bg-inverse-surface text-inverse-on-surface shadow-sm font-bold'
                : 'bg-surface-container text-secondary hover:bg-surface-container-high'
            }`}
          >
            Active Today ({savedDeals.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('expiring')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all active:scale-95 ${
              filterTab === 'expiring'
                ? 'bg-inverse-surface text-inverse-on-surface shadow-sm font-bold'
                : 'bg-surface-container text-secondary hover:bg-surface-container-high'
            }`}
          >
            Expiring Soon
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="px-margin pt-space-md flex flex-col gap-space-md pb-28">
        {/* Cumulative Savings Summary Card */}
        <div className="rounded-2xl bg-gradient-to-br from-primary-fixed/50 via-surface-container-lowest to-surface-container-lowest p-space-md shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)] flex flex-col gap-3 border border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[20px]">savings</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-secondary uppercase font-bold">
                  Total Saved This Month
                </span>
                <span className="font-price-hero text-price-hero text-primary font-extrabold text-[24px]">
                  ฿1,240.00
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-label-sm text-label-sm text-secondary uppercase font-bold block">
                Pending in Saved
              </span>
              <span className="font-headline-sm text-headline-sm text-tertiary font-bold">
                +฿{totalPotentialSavings.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div className="bg-primary-container h-full rounded-full w-[62%]"></div>
          </div>
          <div className="flex items-center justify-between text-secondary font-label-sm text-label-sm">
            <span>62% of monthly target (฿2,000)</span>
            <span className="text-primary font-bold">฿760 to go</span>
          </div>
        </div>

        {/* Saved Items List */}
        {filteredDeals.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center bg-surface-container-lowest rounded-2xl border border-slate-100 mt-4">
            <span className="material-symbols-outlined text-[48px] text-secondary/50 mb-2">
              bookmark_border
            </span>
            <h3 className="font-headline-sm text-on-surface font-bold">No saved deals found</h3>
            <p className="text-body-sm text-secondary mt-1 max-w-xs">
              Bookmark discounts from the Map or Deals feed to quickly access barcodes and route directions.
            </p>
            <button
              type="button"
              onClick={onNavigateToDeals}
              className="mt-4 px-4 py-2 bg-primary-container text-white rounded-xl font-label-md text-label-md font-bold active:scale-95 transition-transform"
            >
              Browse Hot Deals
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-space-sm">
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-2.5 border border-slate-100 hover:border-orange-200 transition-all"
              >
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => onSelectDeal(deal)}
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                    <img
                      className="w-full h-full object-cover"
                      alt={deal.title}
                      src={deal.image}
                    />
                    <span className="absolute top-1 left-1 bg-primary-container text-on-primary px-1.5 py-0.2 rounded-full font-label-sm text-[9px] font-bold">
                      {deal.discountBadge || `-${deal.discountPercent}%`}
                    </span>
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-headline-sm text-body-md text-on-surface font-bold truncate">
                        {deal.title}
                      </h4>
                      <button
                        aria-label="Remove from saved"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(deal.id);
                          onShowToast(`Removed ${deal.title} from Saved`);
                        }}
                        className="text-secondary hover:text-error active:scale-90 transition-transform p-0.5"
                      >
                        <span
                          className="material-symbols-outlined text-[18px] text-error"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          favorite
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm mt-0.5">
                      <span className="font-bold text-on-surface">{deal.storeName}</span>
                      <span>•</span>
                      <span>{deal.distanceKm} km</span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="font-price-hero text-headline-sm text-primary font-extrabold">
                        ฿{deal.discountPrice}
                      </span>
                      <span className="font-body-sm text-body-sm text-secondary line-through">
                        ฿{deal.originalPrice}
                      </span>
                      <span className="text-tertiary font-label-sm text-label-sm font-bold ml-auto">
                        Save ฿{deal.originalPrice - deal.discountPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[14px] text-primary">
                      schedule
                    </span>
                    <span>{deal.timeLeft || 'Expires today'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectDeal(deal)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[14px]">directions</span>
                      <span>Route</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onShowToast(`Voucher ready! Showing barcode for ${deal.title}`);
                        onSelectDeal(deal);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-primary text-white font-label-sm text-label-sm font-bold flex items-center gap-1 active:scale-95 transition-transform shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[14px]">qr_code</span>
                      <span>Barcode</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
