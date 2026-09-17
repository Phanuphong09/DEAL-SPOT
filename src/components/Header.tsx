import React from 'react';
import { ViewMode } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  previousView: ViewMode | null;
  onNavigate: (view: ViewMode) => void;
  onBack: () => void;
  unreadCount: number;
  onShare?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onBack,
  unreadCount,
  onShare,
}) => {
  const isSubPage = currentView === 'deal-details' || currentView === 'store-radar';

  const getTitle = () => {
    switch (currentView) {
      case 'explore-map':
        return 'Explore Map';
      case 'deals-feed':
        return 'Deals Feed';
      case 'saved-deals':
        return 'Saved Deals';
      case 'account-profile':
        return 'Account Profile';
      case 'deal-details':
        return 'Deal Details';
      case 'store-radar':
        return 'Store Radar Details';
      default:
        return 'Explore Map';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface-container-lowest/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-margin flex items-center justify-between gap-space-sm max-w-lg mx-auto w-full">
        {/* Left branding or back navigation */}
        <div className="flex items-center gap-space-xs min-w-0">
          {isSubPage ? (
            <button
              aria-label="Go back"
              className="w-11 h-11 -ml-1 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all"
              onClick={onBack}
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : null}

          <div
            className="flex items-center gap-space-sm min-w-0 cursor-pointer select-none"
            onClick={() => onNavigate('explore-map')}
          >
            <img
              alt="DealSpot Logo"
              className={`${isSubPage ? 'h-7' : 'h-8'} w-auto object-contain shrink-0`}
              src="https://lh3.googleusercontent.com/aida/AEtjO1XJfQPGp8RHpC628G13Q_jHpUjtkcm5EaZImKiyGn3dFlHeOMIhjKQhN9dn4qXubi1zk8wyRAzX8Mtle_Aw6Y3om06Md3CzU4WDJOU_Kyvs5kpvGn7cMRJM1qK6qA6vfiNlak63vsEvCFpT6xrZ4jtoUduREPPbk8t61XQMscE45SwZieHxZxs1CjVPzA33Aw6nWUpUZUwnkWGwBvvxA3FzsmXCpxE3si5-D70LOS0dYR2W9aJKQCHjieY"
            />
            <div className="flex flex-col min-w-0">
              {!isSubPage && (
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary truncate">
                  DealSpot
                </span>
              )}
              <h1 className="font-headline-sm text-headline-sm text-on-surface truncate leading-tight">
                {getTitle()}
              </h1>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-space-xs shrink-0">
          {isSubPage && onShare ? (
            <button
              aria-label="Share deal"
              className="w-11 h-11 rounded-full flex items-center justify-center text-secondary hover:text-on-surface active:scale-90 transition-all"
              onClick={onShare}
            >
              <span className="material-symbols-outlined text-[22px]">share</span>
            </button>
          ) : (
            <button
              aria-label="Notifications"
              className="relative w-11 h-11 rounded-full flex items-center justify-center text-secondary hover:text-on-surface active:scale-95 transition-colors"
              onClick={() => onNavigate('account-profile')}
            >
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-error text-on-error font-label-sm text-label-sm rounded-full leading-none shadow-[0_2px_4px_rgba(186,26,26,0.3)]">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          <div
            className="w-11 h-11 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            onClick={() => onNavigate('account-profile')}
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-container/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcKr8u4hSxXlAD0lsDgc7PWXYBUblJpagST7hyVWQxjtLdGp6DbhaSUMj4Pu7s3wO6BRngYxPQ0R-_8XtXKvZQQQhjFX4UOMS_h4h0wahQIng1WhPqbsiRrkqFJS6EOnt0AMW5ka-n9shYj0PRHdLMER_jan5qI5n42hXmagm2znLZRegYaJCNB-cq5qpzRh2bHMSBrPg-cyiuBhzQ6Nace2O7mRD63zrPBBT95zDx77qVqgQG38O4"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
