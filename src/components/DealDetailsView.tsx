import React, { useState, useEffect } from 'react';
import { DealItem } from '../types';

interface DealDetailsProps {
  deal: DealItem;
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

export const DealDetailsView: React.FC<DealDetailsProps> = ({
  deal,
  onToggleFavorite,
  onBack,
  onShowToast,
}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(5 * 3600 + 22 * 60 + 14);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSecs: number) => {
    const hours = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSecs % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleDirections = () => {
    setIsNavigating(true);
    onShowToast('Routing fastest walking path to 7-Eleven Siam Square #0142 (4 min)...');
    setTimeout(() => {
      setIsNavigating(false);
    }, 1800);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${deal.title} Deal on DealSpot`,
          text: `Get ${deal.discountBadge || deal.discountPercent + '% OFF'} on ${deal.title} at ${deal.storeName}!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      onShowToast('Deal link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto">
      {/* Content Body */}
      <div className="px-margin flex flex-col gap-space-md pb-28 pt-space-xs">
        {/* Hero Product Card Container */}
        <div className="relative w-full rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] flex flex-col items-center border border-slate-100/80">
          {/* Top Row: Category Pill & Heart Button */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px] text-primary">local_drink</span>
              Fresh Dairy • Food
            </span>
            <button
              aria-label="Toggle favorite"
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(249,115,22,0.3)] active:scale-90 transition-all ${
                deal.isFavorite
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:text-primary-container'
              }`}
              onClick={() => {
                onToggleFavorite(deal.id);
                onShowToast(
                  !deal.isFavorite ? 'Added to Saved Deals' : 'Removed from Saved Deals'
                );
              }}
              type="button"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: deal.isFavorite ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
          </div>

          {/* High Resolution Product Showcase */}
          <div className="relative w-full aspect-square max-w-[280px] my-space-xs flex items-center justify-center">
            <img
              className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:scale-105"
              alt={deal.title}
              src={deal.image}
            />
            {/* Zoom affordance indicator */}
            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface-variant flex items-center justify-center shadow-sm pointer-events-none">
              <span className="material-symbols-outlined text-[16px]">zoom_in</span>
            </div>
          </div>

          {/* Live Urgency Countdown Bar */}
          <div className="w-full rounded-xl bg-gradient-to-r from-primary-container via-primary to-primary-container p-[1px] shadow-sm mt-space-xs">
            <div className="w-full bg-surface-container-lowest rounded-[11px] px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-on-primary-container">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                <span className="font-label-md text-label-md text-on-surface">Deal ends in:</span>
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-mono font-bold">
                  {formatCountdown(timerSeconds)}
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full font-bold">
                Max 3/shopper
              </span>
            </div>
          </div>
        </div>

        {/* Product Details & Pricing Hero Block */}
        <div className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-[0_4px_16px_-2px_rgba(15,23,42,0.04)] flex flex-col gap-space-sm border border-slate-100/80">
          <div className="flex items-start justify-between gap-space-sm">
            <div>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight leading-tight font-bold">
                {deal.title}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                {deal.subtitle || '100% Pasteurized Whole Cow Milk • 830ml'}
              </p>
            </div>
            <span className="shrink-0 px-2.5 py-1 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg shadow-sm font-bold">
              {deal.discountBadge || `-${deal.discountPercent}% OFF`}
            </span>
          </div>

          {/* Price Breakdown */}
          <div className="flex items-baseline gap-2.5 pt-1">
            <span className="font-price-hero text-price-hero text-primary tracking-tight font-extrabold text-[28px]">
              ฿{deal.discountPrice.toFixed(2)}
            </span>
            <span className="font-body-lg text-body-lg text-on-surface-variant line-through opacity-70">
              ฿{deal.originalPrice.toFixed(2)}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 text-tertiary font-label-md text-label-md bg-tertiary-fixed/40 px-2 py-0.5 rounded-full font-bold">
              <span className="material-symbols-outlined text-[14px]">savings</span>
              You save ฿{(deal.originalPrice - deal.discountPrice).toFixed(2)}
            </span>
          </div>

          {/* Micro Stock Tracker */}
          <div className="pt-2 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-on-surface-variant font-label-sm text-label-sm">
              <span className="flex items-center gap-1 text-primary font-bold">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                Only 4 bottles left at this price
              </span>
              <span className="font-bold">82% Claimed</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
              <div className="h-full rounded-full bg-primary-container w-[82%]"></div>
            </div>
          </div>
        </div>

        {/* Nearby Store Price Comparison Widget */}
        <div className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-[0_4px_16px_-2px_rgba(15,23,42,0.04)] flex flex-col gap-space-md border border-slate-100/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">storefront</span>
              </span>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">
                  Nearby Price Check
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Live verified within 1.5 km
                </p>
              </div>
            </div>
            <span className="font-label-sm text-label-sm text-tertiary flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[14px]">sync</span>
              Live
            </span>
          </div>

          {/* Comparison List */}
          <div className="flex flex-col gap-2.5">
            {/* 7-Eleven Siam Sq (Best Deal) */}
            <div className="p-3 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between bg-gradient-to-r from-primary-fixed/30 via-transparent to-transparent border border-orange-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#007a3d] flex items-center justify-center font-headline-sm text-headline-sm text-white font-extrabold">
                  7
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-sm text-headline-sm text-on-surface text-[14px] font-bold">
                      7-Eleven
                    </span>
                    <span className="font-label-sm text-label-sm px-1.5 py-0.2 rounded bg-tertiary text-on-tertiary font-bold">
                      BEST DEAL
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Siam Sq • 0.2 km away
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-headline-md text-headline-md text-primary font-bold">
                  ฿31.50
                </span>
                <div className="text-tertiary font-label-sm text-label-sm font-bold">-35%</div>
              </div>
            </div>

            {/* Lotus's Go Fresh */}
            <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#00a39e] flex items-center justify-center text-white font-bold text-[13px]">
                  L
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface text-[14px] font-bold">
                    Lotus's Go Fresh
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Rama I • 0.5 km away
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  ฿38.00
                </span>
                <div className="text-on-surface-variant font-label-sm text-label-sm">-21%</div>
              </div>
            </div>

            {/* Big C Supercenter */}
            <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#e31b23] flex items-center justify-center text-white font-bold text-[13px]">
                  B
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface text-[14px] font-bold">
                    Big C Supercenter
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Ratchadamri • 0.8 km away
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  ฿42.00
                </span>
                <div className="text-on-surface-variant font-label-sm text-label-sm">-13%</div>
              </div>
            </div>

            {/* Tops Market */}
            <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between opacity-80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#f59e0b] flex items-center justify-center text-white font-bold text-[13px]">
                  T
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface text-[14px] font-bold">
                    Tops Market
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    CentralWorld • 1.2 km away
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-headline-sm text-headline-sm text-on-surface-variant font-bold">
                  ฿48.50
                </span>
                <div className="text-on-surface-variant font-label-sm text-label-sm">Standard</div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Location & Embedded Mini-Map Section */}
        <div className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-[0_4px_16px_-2px_rgba(15,23,42,0.04)] flex flex-col gap-space-md border border-slate-100/80">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  7-Eleven • Siam Square #0142
                </h3>
                <span
                  className="material-symbols-outlined text-[18px] text-tertiary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                388 Rama I Rd, Pathum Wan, Bangkok 10330
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm shrink-0 font-bold">
              Open 24/7
            </span>
          </div>

          {/* Mini Interactive Map Canvas */}
          <div className="relative w-full h-44 rounded-xl overflow-hidden shadow-inner">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDKHgiGbeq2JNvYxF2taSA2PnYxZltkuHBY3vXyNfl56uBk-ARqoVlkD-eD6llDExCBD2x6JpCbb2tM2P-dviex05pWaBeg8TCl3ko9CJ9gdJCrnnfRSKoyLzUYA07_SRf3qp2HQIG5vYxyN0L_BA1nEa_JFG0256coHGyBq4FjqlYOtNlYa2-vbmBArx58YB6S24fiuc83P-niAoPHHwPWqdqe3YGMreBI1R3uksN-sy3CZb4hUIZq')",
              }}
            >
              {/* Route Simulation Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex flex-col justify-between p-3 pointer-events-none">
                {/* Proximity Callout */}
                <div className="self-start px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm flex items-center gap-1.5 text-on-surface font-label-md text-label-md font-bold">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    directions_walk
                  </span>
                  280m • ~4 min walk
                </div>

                {/* Route Marker Visual Accent */}
                <div className="flex items-center justify-between text-on-primary font-label-sm text-label-sm px-1">
                  <span className="flex items-center gap-1 drop-shadow font-bold text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container ring-2 ring-white inline-block"></span>
                    You
                  </span>
                  <span className="flex items-center gap-1 drop-shadow font-bold text-white">
                    <span className="material-symbols-outlined text-[18px] text-tertiary-fixed drop-shadow">
                      store
                    </span>
                    Store Destination
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Verification & Stock Guarantee */}
          <div className="flex items-center justify-between bg-surface-container-low px-3 py-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-tertiary">
                check_circle
              </span>
              <span className="font-body-sm text-body-sm text-on-surface font-semibold">
                Confirmed in stock
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              15 mins ago
            </span>
          </div>
        </div>

        {/* Community Tip / Instant Micro Delight Card */}
        <div
          className="rounded-2xl bg-secondary-container/40 p-space-md flex items-center gap-3 cursor-pointer hover:bg-secondary-container/60 transition-colors border border-blue-100"
          onClick={() => setShowBarcodeModal(true)}
        >
          <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">lightbulb</span>
          </div>
          <div className="min-w-0">
            <p className="font-label-md text-label-md text-on-secondary-fixed font-bold">
              Smart Shopper Tip (Tap for barcode)
            </p>
            <p className="font-body-sm text-body-sm text-on-secondary-fixed-variant truncate">
              Show barcode on DealSpot app at checkout for automatic savings.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Sticky Bottom CTA Dock */}
      <div className="fixed bottom-4 inset-x-0 mx-margin z-40 max-w-lg mx-auto">
        <div className="w-full bg-surface-container-lowest/90 backdrop-blur-xl rounded-2xl p-space-xs shadow-[0_12px_36px_-4px_rgba(249,115,22,0.25)] flex items-center gap-space-xs border border-white/70">
          {/* Quick Save / Share Icon Button */}
          <button
            aria-label="Share Deal"
            className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-95 transition-transform shrink-0"
            onClick={handleShare}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">ios_share</span>
          </button>

          {/* Primary Large Turn-By-Turn Action Button */}
          <button
            className="flex-1 h-12 rounded-xl bg-primary-container hover:bg-primary active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(249,115,22,0.35)] px-4 cursor-pointer"
            onClick={handleDirections}
            type="button"
          >
            {isNavigating ? (
              <>
                <span className="material-symbols-outlined text-on-primary text-[22px] animate-spin">
                  progress_activity
                </span>
                <span className="font-label-lg text-label-lg text-on-primary font-bold tracking-wide">
                  Launching Map...
                </span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-on-primary text-[22px]">
                  explore
                </span>
                <span className="font-label-lg text-label-lg text-on-primary font-bold tracking-wide">
                  Get Directions (4 min)
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Barcode Checkout Modal */}
      {showBarcodeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowBarcodeModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-primary flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[28px]">qr_code_scanner</span>
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-on-surface">Scan at Cashier</h3>
            <p className="text-body-sm text-secondary mt-1">
              Present this barcode to apply the ฿{deal.discountPrice.toFixed(2)} DealSpot price
            </p>

            {/* Barcode Visual */}
            <div className="my-6 p-4 bg-slate-50 rounded-2xl w-full border border-slate-200 flex flex-col items-center">
              <div className="flex gap-1 h-16 items-center">
                {[
                  3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 6, 2, 6, 4, 3, 3, 8,
                ].map((w, idx) => (
                  <div
                    key={idx}
                    className={`h-full bg-slate-900 ${
                      w % 2 === 0 ? 'w-1' : w % 3 === 0 ? 'w-1.5' : 'w-0.5'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-sm tracking-widest text-slate-600 mt-2 font-bold">
                8 850123 456789
              </span>
            </div>

            <button
              type="button"
              className="w-full py-3 bg-primary-container text-white font-bold rounded-xl active:scale-95 transition-transform"
              onClick={() => {
                setShowBarcodeModal(false);
                onShowToast('Voucher barcode verified by cashier!');
              }}
            >
              Done Scanning
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
