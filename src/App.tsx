import React, { useState } from 'react';
import { ViewMode, DealItem, StoreItem, NotificationItem, LocationArea } from './types';
import { INITIAL_DEALS, ALL_STORES, INITIAL_NOTIFICATIONS, AVAILABLE_LOCATIONS } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ExploreMapView } from './components/ExploreMapView';
import { DealsFeedView } from './components/DealsFeedView';
import { DealDetailsView } from './components/DealDetailsView';
import { StoreRadarView } from './components/StoreRadarView';
import { SavedDealsView } from './components/SavedDealsView';
import { AccountProfileView } from './components/AccountProfileView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('explore-map');
  const [previousView, setPreviousView] = useState<ViewMode | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationArea>(AVAILABLE_LOCATIONS[0]);
  const [deals, setDeals] = useState<DealItem[]>(INITIAL_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<DealItem>(INITIAL_DEALS[0]);
  const [stores] = useState<StoreItem[]>(ALL_STORES);
  const [selectedStore, setSelectedStore] = useState<StoreItem>(ALL_STORES[0]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleSelectLocation = (location: LocationArea) => {
    setCurrentLocation(location);
    // Find closest or matching store in this area
    const areaStores = ALL_STORES.filter((s) => s.areaId === location.id);
    if (areaStores.length > 0) {
      setSelectedStore(areaStores[0]);
    }
  };

  const handleNavigate = (view: ViewMode) => {
    if (view === currentView) return;
    setPreviousView(currentView);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (previousView) {
      setCurrentView(previousView);
      setPreviousView(null);
    } else {
      setCurrentView('explore-map');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDeal = (deal: DealItem) => {
    setSelectedDeal(deal);
    setPreviousView(currentView);
    setCurrentView('deal-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStore = (store: StoreItem) => {
    setSelectedStore(store);
    setPreviousView(currentView);
    setCurrentView('store-radar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (dealId: string) => {
    setDeals((prev) =>
      prev.map((item) => (item.id === dealId ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const favoritesCount = deals.filter((d) => d.isFavorite).length;

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans text-on-surface antialiased selection:bg-primary-container selection:text-white pb-16">
      {/* Top Fixed App Bar */}
      <Header
        currentView={currentView}
        onBack={handleBack}
        onNavigate={handleNavigate}
        previousView={previousView}
        unreadCount={unreadCount}
        onShare={
          currentView === 'deal-details'
            ? () => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: `${selectedDeal.title} - DealSpot`,
                      text: `Check out ${selectedDeal.title} for only ฿${selectedDeal.discountPrice}!`,
                      url: window.location.href,
                    })
                    .catch(() => {});
                } else {
                  showToast('Deal link copied to clipboard!');
                }
              }
            : undefined
        }
      />

      {/* Main Body with Safe Area Padding */}
      <main className="flex-1 w-full pt-16 flex flex-col items-center">
        {currentView === 'explore-map' && (
          <ExploreMapView
            currentLocation={currentLocation}
            availableLocations={AVAILABLE_LOCATIONS}
            onSelectLocation={handleSelectLocation}
            onSelectDeal={handleSelectDeal}
            onSelectStore={handleSelectStore}
            onShowToast={showToast}
            stores={stores}
          />
        )}

        {currentView === 'deals-feed' && (
          <DealsFeedView
            deals={deals}
            currentLocation={currentLocation}
            onNavigateToMap={() => handleNavigate('explore-map')}
            onSelectDeal={handleSelectDeal}
            onShowToast={showToast}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentView === 'deal-details' && (
          <DealDetailsView
            deal={selectedDeal}
            onBack={handleBack}
            onShowToast={showToast}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentView === 'store-radar' && (
          <StoreRadarView
            onBack={handleBack}
            onSelectDeal={handleSelectDeal}
            onShowToast={showToast}
            store={selectedStore}
          />
        )}

        {currentView === 'saved-deals' && (
          <SavedDealsView
            deals={deals}
            onNavigateToDeals={() => handleNavigate('deals-feed')}
            onSelectDeal={handleSelectDeal}
            onShowToast={showToast}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentView === 'account-profile' && (
          <AccountProfileView
            notifications={notifications}
            onMarkNotificationRead={handleMarkNotificationRead}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Global Floating Toast Snackbar */}
      {toastMessage && (
        <div className="fixed top-20 inset-x-0 z-50 flex justify-center px-4 pointer-events-none transition-all animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="pointer-events-auto bg-inverse-surface/95 text-inverse-on-surface backdrop-blur-md px-4 py-2.5 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.2)] flex items-center gap-2 border border-white/10 font-label-md text-label-md">
            <span className="material-symbols-outlined text-[18px] text-tertiary-fixed">
              check_circle
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation (hidden on subpages like deal-details or store-radar to allow room for actions) */}
      {currentView !== 'deal-details' && (
        <BottomNav
          currentView={currentView}
          favoritesCount={favoritesCount}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
