import React from 'react';
import { ViewMode } from '../types';

interface BottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  favoritesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  favoritesCount,
}) => {
  // Determine if main tabs are active (subpages map to corresponding root tab)
  const isHomeActive = currentView === 'explore-map';
  const isDealsActive = currentView === 'deals-feed' || currentView === 'deal-details';
  const isFavsActive = currentView === 'saved-deals';
  const isProfileActive = currentView === 'account-profile';

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 px-margin pointer-events-none pb-[env(safe-area-inset-bottom,0px)]">
      <nav className="pointer-events-auto mx-auto max-w-md bg-surface-container-lowest/90 backdrop-blur-xl rounded-full shadow-[0_12px_32px_-4px_rgba(249,115,22,0.20)] px-space-sm py-space-xs border border-white/60">
        <div className="flex items-center justify-around">
          {/* Home */}
          <button
            type="button"
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] py-1 px-3 transition-colors group ${
              isHomeActive ? 'text-primary font-bold' : 'text-secondary hover:text-on-surface'
            }`}
            onClick={() => onNavigate('explore-map')}
          >
            <span
              className={`material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform ${
                isHomeActive ? 'scale-110' : ''
              }`}
              style={{ fontVariationSettings: isHomeActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              near_me
            </span>
            <span className="font-label-sm text-label-sm mt-0.5">Home</span>
          </button>

          {/* Deals */}
          <button
            type="button"
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] py-1 px-3 transition-colors group ${
              isDealsActive ? 'text-primary font-bold' : 'text-secondary hover:text-on-surface'
            }`}
            onClick={() => onNavigate('deals-feed')}
          >
            <span
              className={`material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform ${
                isDealsActive ? 'scale-110 text-primary-container' : ''
              }`}
              style={{ fontVariationSettings: isDealsActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              local_fire_department
            </span>
            <span className="font-label-sm text-label-sm mt-0.5">Deals</span>
          </button>

          {/* Favorites */}
          <button
            type="button"
            className={`relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] py-1 px-3 transition-colors group ${
              isFavsActive ? 'text-primary font-bold' : 'text-secondary hover:text-on-surface'
            }`}
            onClick={() => onNavigate('saved-deals')}
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform ${
                  isFavsActive ? 'scale-110' : ''
                }`}
                style={{ fontVariationSettings: isFavsActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark_heart
              </span>
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[14px] h-[14px] px-0.5 bg-primary-container text-on-primary font-label-sm text-[9px] rounded-full leading-none shadow-xs font-bold">
                  {favoritesCount}
                </span>
              )}
            </div>
            <span className="font-label-sm text-label-sm mt-0.5">Favorites</span>
          </button>

          {/* Profile */}
          <button
            type="button"
            className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] py-1 px-3 transition-colors group ${
              isProfileActive ? 'text-primary font-bold' : 'text-secondary hover:text-on-surface'
            }`}
            onClick={() => onNavigate('account-profile')}
          >
            <span
              className={`material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform ${
                isProfileActive ? 'scale-110' : ''
              }`}
              style={{ fontVariationSettings: isProfileActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              account_circle
            </span>
            <span className="font-label-sm text-label-sm mt-0.5">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
