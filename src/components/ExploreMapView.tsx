import React, { useState, useMemo } from 'react';
import { DealItem, StoreItem, LocationArea } from '../types';
import { LocationPickerModal } from './LocationPickerModal';
import { AVAILABLE_LOCATIONS } from '../data/mockData';

interface ExploreMapViewProps {
  stores: StoreItem[];
  currentLocation: LocationArea;
  availableLocations?: LocationArea[];
  onSelectLocation: (location: LocationArea) => void;
  onSelectDeal: (deal: DealItem) => void;
  onSelectStore: (store: StoreItem) => void;
  onShowToast: (msg: string) => void;
}

export const ExploreMapView: React.FC<ExploreMapViewProps> = ({
  stores,
  currentLocation,
  availableLocations = AVAILABLE_LOCATIONS,
  onSelectLocation,
  onSelectDeal,
  onSelectStore,
  onShowToast,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRecentering, setIsRecentering] = useState<boolean>(false);
  const [heatmapActive, setHeatmapActive] = useState<boolean>(false);
  const [isPinMode, setIsPinMode] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [followedStoreIds, setFollowedStoreIds] = useState<Record<string, boolean>>({
    'store-7eleven-siam': true,
    'store-7eleven-asok': true,
    'store-7eleven-ari': true,
    'store-7eleven-silom': true,
    'store-7eleven-ladprao': true,
    'store-7eleven-thonglo': true,
  });

  // Filter stores belonging to the current area, or fallback to nearest area stores
  const currentAreaStores = useMemo(() => {
    const matched = stores.filter((s) => s.areaId === currentLocation.id);
    if (matched.length > 0) return matched;
    
    // For custom pin or GPS, find stores in closest available area
    let closestAreaId = 'area-siam';
    let minD = Infinity;
    for (const loc of availableLocations) {
      if (loc.id.startsWith('gps') || loc.id.startsWith('custom')) continue;
      const dLat = loc.geoLat - currentLocation.geoLat;
      const dLng = loc.geoLng - currentLocation.geoLng;
      const d = dLat * dLat + dLng * dLng;
      if (d < minD) {
        minD = d;
        closestAreaId = loc.id;
      }
    }

    const nearbyStores = stores.filter((s) => s.areaId === closestAreaId);
    return nearbyStores.length > 0 ? nearbyStores : stores.slice(0, 4);
  }, [stores, currentLocation, availableLocations]);

  // Selected store on map
  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    currentAreaStores[0]?.id || stores[0]?.id || 'store-7eleven-siam'
  );

  // Sync selected store when area changes
  React.useEffect(() => {
    if (currentAreaStores.length > 0) {
      setSelectedStoreId(currentAreaStores[0].id);
    }
  }, [currentLocation.id, currentAreaStores]);

  const activeStore = useMemo(() => {
    const found = stores.find((s) => s.id === selectedStoreId);
    return found || currentAreaStores[0] || stores[0];
  }, [stores, selectedStoreId, currentAreaStores]);

  // Calculate distance between user pin and a store on map
  const getStoreRelativeDistance = (store: StoreItem) => {
    if (!store.mapCoords) return store.distanceKm;
    const dx = (store.mapCoords.x - currentLocation.coords.x) * 0.025;
    const dy = (store.mapCoords.y - currentLocation.coords.y) * 0.025;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return Math.max(0.1, Number(dist.toFixed(1)));
  };

  // Re-center handler
  const handleRecenter = () => {
    setIsRecentering(true);
    onShowToast(`Calibrated GPS at ${currentLocation.nameTh}`);
    setTimeout(() => setIsRecentering(false), 700);
  };

  // GPS auto-detect handler
  const handleUseCurrentGps = () => {
    setIsDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetectingGps(false);
          const { latitude, longitude } = pos.coords;

          // Find closest known city/area in Thailand
          let closestArea = availableLocations[0];
          let minD = Infinity;
          for (const loc of availableLocations) {
            if (loc.id.startsWith('gps') || loc.id.startsWith('custom')) continue;
            const dLat = loc.geoLat - latitude;
            const dLng = loc.geoLng - longitude;
            const d = dLat * dLat + dLng * dLng;
            if (d < minD) {
              minD = d;
              closestArea = loc;
            }
          }

          // Create custom GPS pinned location
          const newGpsLocation: LocationArea = {
            id: `gps-custom-${Date.now()}`,
            name: `GPS: ${closestArea.name}`,
            nameTh: `ตำแหน่ง GPS: ${closestArea.provinceTh || closestArea.nameTh}`,
            province: closestArea.province,
            provinceTh: closestArea.provinceTh,
            region: closestArea.region,
            district: closestArea.district,
            districtTh: `ใกล้${closestArea.landmark}`,
            landmark: `พิกัด GPS: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`,
            stationTag: 'GPS LIVE',
            coords: { x: 50, y: 50 },
            geoLat: latitude,
            geoLng: longitude,
            dealsCount: closestArea.dealsCount,
            storesCount: closestArea.storesCount,
            accentRoad: closestArea.accentRoad || 'พิกัดดาวเทียมสด',
            isCustomPin: true,
          };
          onSelectLocation(newGpsLocation);
          setIsLocationModalOpen(false);
          onShowToast(`📍 ตรวจพบตำแหน่ง GPS ของคุณใน ${closestArea.provinceTh || closestArea.nameTh}`);
        },
        () => {
          // Graceful simulated fallback if permission denied or iframe blocked
          setIsDetectingGps(false);
          const fallbackArea = availableLocations[0];
          const newGpsLocation: LocationArea = {
            id: `gps-sim-${Date.now()}`,
            name: `${fallbackArea.name} (GPS Calibrated)`,
            nameTh: `${fallbackArea.nameTh} (GPS จำลอง)`,
            province: fallbackArea.province,
            provinceTh: fallbackArea.provinceTh,
            region: fallbackArea.region,
            district: fallbackArea.district,
            districtTh: fallbackArea.districtTh,
            landmark: fallbackArea.landmark,
            stationTag: 'GPS LOCK',
            coords: { x: 48, y: 54 },
            geoLat: fallbackArea.geoLat,
            geoLng: fallbackArea.geoLng,
            dealsCount: fallbackArea.dealsCount,
            storesCount: fallbackArea.storesCount,
            accentRoad: fallbackArea.accentRoad,
            isCustomPin: true,
          };
          onSelectLocation(newGpsLocation);
          setIsLocationModalOpen(false);
          onShowToast('ระบุตำแหน่ง GPS สำเร็จ (ความแม่นยำสูง)');
        },
        { timeout: 4000 }
      );
    } else {
      setIsDetectingGps(false);
      onShowToast('อุปกรณ์นี้ไม่รองรับ Geolocation API');
    }
  };

  // Map Click Handler for Direct Tap-to-Pin
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only drop pin if not clicking directly on an interactive button or marker
    const target = e.target as HTMLElement;
    if (target.closest('.store-pin-marker') || target.closest('button')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const pctX = Math.max(10, Math.min(90, Math.round((clickX / rect.width) * 100)));
    const pctY = Math.max(15, Math.min(85, Math.round((clickY / rect.height) * 100)));

    // Create new pinned location
    const customPinnedLocation: LocationArea = {
      id: `custom-pin-${Date.now()}`,
      name: `Pinned Area (${pctX}%, ${pctY}%)`,
      nameTh: `ตำแหน่งปักหมุด (${pctX}%, ${pctY}%)`,
      district: `${currentLocation.districtTh || 'กรุงเทพมหานคร'}`,
      districtTh: `${currentLocation.districtTh || 'กรุงเทพมหานคร'}`,
      landmark: `จุดที่คุณปักหมุดบนแผนที่`,
      stationTag: 'PINNED',
      coords: { x: pctX, y: pctY },
      geoLat: currentLocation.geoLat + (pctY - 50) * 0.001,
      geoLng: currentLocation.geoLng + (pctX - 50) * 0.001,
      dealsCount: Math.floor(Math.random() * 40) + 80,
      storesCount: currentAreaStores.length,
      accentRoad: currentLocation.accentRoad || 'ถนนสายหลักใกล้เคียง',
      isCustomPin: true,
    };

    onSelectLocation(customPinnedLocation);
    onShowToast(`📍 ปักหมุดที่จุดใหม่เรียบร้อย (${pctX}%, ${pctY}%)`);
  };

  const handleToggleHeatmap = () => {
    setHeatmapActive(!heatmapActive);
    onShowToast(!heatmapActive ? 'เปิดใช้งาน Heatmap ความหนาแน่นของดีล' : 'สลับกลับสู่แผนที่มาตรฐาน');
  };

  // Filtered store deals for bottom sheet
  const activeStoreDeals = useMemo(() => {
    if (!activeStore.deals || activeStore.deals.length === 0) {
      return stores[0].deals.slice(0, 3);
    }
    if (activeCategory === 'all') {
      return activeStore.deals.slice(0, 3);
    }
    const filtered = activeStore.deals.filter((d) => d.category === activeCategory);
    return filtered.length > 0 ? filtered.slice(0, 3) : activeStore.deals.slice(0, 3);
  }, [activeStore, activeCategory, stores]);

  const isStoreSaved = !!followedStoreIds[activeStore.id];

  return (
    <div className="flex flex-col w-full relative select-none">
      {/* Top Floating Controls: Location Selector & Quick Search Strip */}
      <div className="px-margin pt-space-sm pb-space-xs flex flex-col gap-space-sm z-30 max-w-lg mx-auto w-full">
        {/* Proximity & Neighborhood Anchor Pill */}
        <div className="flex items-center justify-between">
          <button
            id="open-location-picker-btn"
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-space-xs bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-[0_4px_16px_-2px_rgba(15,23,42,0.06)] hover:bg-surface-container transition-all active:scale-95 text-left border border-slate-100 group"
          >
            <span
              className="material-symbols-outlined text-primary-container text-[18px] group-hover:scale-110 transition-transform"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_on
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-label-md text-label-md text-on-surface font-bold truncate max-w-[170px]">
                  {currentLocation.nameTh || currentLocation.name}
                </span>
                <span className="material-symbols-outlined text-secondary text-[16px]">
                  expand_more
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    currentLocation.isCustomPin ? 'bg-orange-500' : 'bg-tertiary'
                  } animate-pulse`}
                ></span>
                <span className="font-label-sm text-label-sm text-tertiary truncate max-w-[170px]">
                  {currentLocation.isCustomPin
                    ? 'ปักหมุดแล้ว • คำนวณรัศมีสด'
                    : 'GPS Active • ' + (currentLocation.stationTag || 'High Accuracy')}
                </span>
              </div>
            </div>
          </button>

          {/* Active Deals Radar Badge */}
          <div
            id="location-deals-count-badge"
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-sm border border-slate-100 cursor-pointer hover:bg-surface-container transition-colors"
          >
            <span
              className="material-symbols-outlined text-primary-container text-[16px] animate-spin"
              style={{ animationDuration: '4s' }}
            >
              radar
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
              {currentLocation.dealsCount} ดีลใกล้คุณ
            </span>
          </div>
        </div>

        {/* Floating Search Input Bar */}
        <div className="relative flex items-center bg-surface-container-lowest rounded-2xl shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08)] px-space-md py-2.5 transition-all focus-within:shadow-[0_12px_28px_-4px_rgba(249,115,22,0.18)] border border-slate-100/80">
          <span className="material-symbols-outlined text-secondary text-[22px] mr-2.5">
            search
          </span>
          <input
            id="main-map-search-input"
            className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-secondary focus:outline-none"
            placeholder={`ค้นหาร้านค้าหรือสินค้าใน ${currentLocation.nameTh.split(',')[0]}...`}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center gap-1 shrink-0 ml-1">
            <button
              aria-label="Change Location"
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-orange-50 active:scale-90 transition-transform"
              title="เลือกพื้นที่ใหม่"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>
        </div>

        {/* Pin Dropping Mode Banner */}
        {isPinMode && (
          <div
            id="pin-mode-banner"
            className="flex items-center justify-between bg-primary-container text-white px-3 py-2 rounded-xl shadow-md animate-in slide-in-from-top duration-200"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="material-symbols-outlined text-[20px] animate-bounce"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                pin_drop
              </span>
              <span className="text-xs font-semibold truncate">
                แตะที่ใดก็ได้บนแผนที่ เพื่อปักหมุดตำแหน่งใหม่
              </span>
            </div>
            <button
              id="exit-pin-mode-btn"
              type="button"
              onClick={() => {
                setIsPinMode(false);
                onShowToast('ออกจากโหมดปักหมุดแล้ว');
              }}
              className="text-[11px] font-bold bg-white text-primary-container px-2.5 py-1 rounded-lg shrink-0 ml-2 active:scale-95"
            >
              เสร็จสิ้น
            </button>
          </div>
        )}

        {/* Category Filter Horizontal Chips */}
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-0.5 -mx-margin px-margin">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all active:scale-95 ${
              activeCategory === 'all'
                ? 'bg-inverse-surface text-inverse-on-surface'
                : 'bg-surface-container-lowest text-secondary hover:bg-surface-container'
            }`}
          >
            <span>✨ ดีลทั้งหมด</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('food')}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all active:scale-95 ${
              activeCategory === 'food'
                ? 'bg-inverse-surface text-inverse-on-surface'
                : 'bg-surface-container-lowest text-secondary hover:bg-surface-container'
            }`}
          >
            <span className="text-sm">🍱</span>
            <span>อาหาร &amp; ของว่าง</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('beverages')}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all active:scale-95 ${
              activeCategory === 'beverages'
                ? 'bg-inverse-surface text-inverse-on-surface'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="text-sm">🧃</span>
            <span>เครื่องดื่ม</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('household')}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all active:scale-95 ${
              activeCategory === 'household'
                ? 'bg-inverse-surface text-inverse-on-surface'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="text-sm">🧹</span>
            <span>ของใช้ในบ้าน</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Canvas Container (Tappable anywhere to drop pin!) */}
      <div
        id="interactive-map-canvas"
        onClick={handleMapClick}
        className={`relative w-full h-[470px] overflow-hidden my-space-xs bg-[#e5ede9] ${
          isPinMode ? 'cursor-crosshair ring-2 ring-primary-container' : 'cursor-default'
        }`}
        title="แตะเพื่อปักหมุดตำแหน่งใหม่"
      >
        {/* Vector Map Simulation (Streets, Parks, Metro Line, Water) */}
        <svg
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 400 500"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Water Canal / Khlong */}
          <path
            d="M-20 80 C 80 120, 160 60, 260 110 C 340 150, 390 130, 440 140"
            stroke="#bae6fd"
            strokeLinecap="round"
            strokeWidth="26"
          />
          <path
            d="M-20 80 C 80 120, 160 60, 260 110 C 340 150, 390 130, 440 140"
            stroke="#7dd3fc"
            strokeLinecap="round"
            strokeWidth="12"
          />
          {/* Green Parks & Open Squares */}
          <rect fill="#d1fae5" height="90" opacity="0.85" rx="20" width="130" x="250" y="220" />
          <path d="M 280 240 L 320 230 L 340 270 L 300 290 Z" fill="#a7f3d0" opacity="0.6" />
          <rect fill="#dcfce7" height="110" opacity="0.7" rx="16" width="100" x="15" y="320" />
          {/* Building Footprint Blocks */}
          <rect fill="#e2e8f0" height="55" opacity="0.8" rx="8" width="70" x="35" y="160" />
          <rect fill="#e2e8f0" height="48" opacity="0.8" rx="8" width="85" x="120" y="150" />
          <rect fill="#cbd5e1" height="60" opacity="0.5" rx="8" width="80" x="40" y="235" />
          <rect fill="#f1f5f9" height="70" rx="10" width="95" x="135" y="225" />
          <rect fill="#e2e8f0" height="60" opacity="0.7" rx="6" width="60" x="235" y="120" />
          <rect fill="#cbd5e1" height="55" opacity="0.6" rx="6" width="75" x="310" y="110" />

          {/* Secondary Roads */}
          <path d="M -10 215 L 420 215" stroke="#ffffff" strokeWidth="14" />
          <path d="M 125 -10 L 125 520" stroke="#ffffff" strokeWidth="12" />
          <path d="M 240 -10 L 240 520" stroke="#ffffff" strokeWidth="10" />
          <path d="M -10 310 L 420 310" stroke="#ffffff" strokeWidth="10" />
          <path d="M 40 130 L 390 130" stroke="#f8fafc" strokeWidth="8" />
          <path d="M 330 215 L 330 520" stroke="#f8fafc" strokeWidth="7" />

          {/* Primary Arterial Highway */}
          <path
            d="M -10 180 C 120 180, 200 175, 420 195"
            opacity="0.9"
            stroke="#fde047"
            strokeLinecap="round"
            strokeWidth="16"
          />
          <path
            d="M -10 180 C 120 180, 200 175, 420 195"
            stroke="#ffffff"
            strokeLinecap="round"
            strokeWidth="12"
          />

          {/* Metro Skytrain Viaduct Line */}
          <path
            d="M -20 180 C 130 180, 210 175, 430 195"
            stroke="#059669"
            strokeDasharray="8 6"
            strokeWidth="3"
          />

          {/* Dynamic Metro Station Platform Box */}
          <rect fill="#047857" height="16" rx="4" width="68" x="160" y="170" />
          <text
            fill="#ffffff"
            fontFamily="Plus Jakarta Sans, sans-serif"
            fontSize="8"
            fontWeight="700"
            textAnchor="middle"
            x="194"
            y="181"
          >
            {currentLocation.stationTag || 'BTS STATION'}
          </text>

          {/* Accent Road Name Tag */}
          <text
            fill="#64748b"
            fontFamily="Plus Jakarta Sans, sans-serif"
            fontSize="7"
            fontWeight="600"
            x="40"
            y="210"
          >
            {currentLocation.accentRoad ? currentLocation.accentRoad.split('/')[0] : 'MAIN ROAD'}
          </text>

          {/* Optional Heatmap effect */}
          {heatmapActive && (
            <g opacity="0.45">
              <circle cx={currentLocation.coords.x * 4} cy={currentLocation.coords.y * 5} r="70" fill="url(#heatGrad1)" />
              <circle cx="280" cy="150" r="50" fill="url(#heatGrad2)" />
              <defs>
                <radialGradient id="heatGrad1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatGrad2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
              </defs>
            </g>
          )}
        </svg>

        {/* User Location Radar Pulse Wave & Pinned Marker */}
        <div
          id="user-location-pulse"
          style={{
            left: `${currentLocation.coords.x}%`,
            top: `${currentLocation.coords.y}%`,
          }}
          className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 ease-out z-15 ${
            isRecentering ? 'scale-150' : ''
          }`}
        >
          <span className="block w-24 h-24 rounded-full bg-primary-container/20 animate-ping duration-1000" />
        </div>

        {/* User Position Anchor Marker */}
        <div
          id="user-location-anchor"
          style={{
            left: `${currentLocation.coords.x}%`,
            top: `${currentLocation.coords.y}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 ease-out z-20"
        >
          <div className="relative flex flex-col items-center">
            {/* Custom Pin Floating Pill */}
            <div className="bg-slate-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap mb-1 backdrop-blur-xs flex items-center gap-1 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{currentLocation.isCustomPin ? 'จุดปักหมุดของคุณ' : 'ตำแหน่งของคุณ'}</span>
            </div>
            {/* Core Anchor Dot */}
            <div className="w-7 h-7 rounded-full bg-primary-container/30 flex items-center justify-center animate-pulse">
              <div className="w-3.5 h-3.5 rounded-full bg-primary-container ring-4 ring-white shadow-md" />
            </div>
          </div>
        </div>

        {/* Render Store Pins for the Active Area */}
        {currentAreaStores.map((store) => {
          const isSelected = store.id === selectedStoreId;
          const coords = store.mapCoords || { x: 50, y: 50 };
          const relativeDist = getStoreRelativeDistance(store);

          // Store brand styling
          let brandBg = '#007a3d';
          let brandLabel: React.ReactNode = <span>7<span className="text-[#ed1c24] text-[10px] ml-0.5">11</span></span>;

          if (store.brandCode === 'L') {
            brandBg = '#00a39e';
            brandLabel = 'L';
          } else if (store.brandCode === 'C') {
            brandBg = '#e31b23';
            brandLabel = 'C';
          } else if (store.brandCode === 'T') {
            brandBg = '#f59e0b';
            brandLabel = 'T';
          }

          return (
            <div
              key={store.id}
              id={`map-pin-${store.id}`}
              style={{
                left: `${coords.x}%`,
                top: `${coords.y}%`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStoreId(store.id);
                onShowToast(`เลือก ${store.name} (${store.branch})`);
              }}
              className={`store-pin-marker absolute -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'z-30 scale-110 drop-shadow-xl'
                  : 'z-10 opacity-95 hover:scale-105 hover:z-20'
              }`}
            >
              <div className="flex flex-col items-center">
                {/* Floating Discount Tag */}
                <div
                  className={`flex items-center gap-1 bg-surface-container-lowest px-2 py-0.5 rounded-full shadow-md mb-1 transition-transform ${
                    isSelected ? 'ring-2 ring-primary-container scale-105' : ''
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-primary-container' : 'bg-emerald-500'
                    }`}
                  ></span>
                  <span className="font-label-sm text-[10px] text-primary font-extrabold">
                    {store.pinDiscountBadge || '30% OFF'}
                  </span>
                </div>

                {/* Pin Circular Logo Icon */}
                <div
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all ${
                    isSelected
                      ? 'bg-white ring-4 ring-primary-container/40'
                      : 'bg-white ring-2 ring-white'
                  }`}
                >
                  <div
                    style={{ backgroundColor: brandBg }}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold text-[11px]"
                  >
                    {brandLabel}
                  </div>
                  <div className="absolute -bottom-1 w-2 h-2 bg-white rotate-45"></div>
                </div>

                {/* Proximity / Distance Tag */}
                <span
                  className={`mt-1 font-label-sm text-[9px] px-1.5 py-0.2 rounded-md shadow-xs font-semibold ${
                    isSelected
                      ? 'bg-inverse-surface text-inverse-on-surface'
                      : 'bg-surface-container-lowest/90 text-on-surface'
                  }`}
                >
                  {relativeDist} km
                </span>
              </div>
            </div>
          );
        })}

        {/* Floating Map Utility Action Dock (Recenter, Pin Mode, Layers, Heatmap) */}
        <div className="absolute right-margin top-space-sm flex flex-col gap-2 z-30">
          {/* Re-Center Location */}
          <button
            id="map-recenter-btn"
            aria-label="Re-center location"
            title="กลับมาจุดกึ่งกลาง"
            className={`w-11 h-11 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md text-primary flex items-center justify-center shadow-[0_8px_20px_rgba(15,23,42,0.12)] hover:bg-white active:scale-90 transition-transform relative group border border-slate-100 ${
              isRecentering ? 'rotate-45' : ''
            }`}
            onClick={handleRecenter}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">my_location</span>
            <span className="absolute -left-1 -top-1 w-3 h-3 rounded-full bg-primary-container ring-2 ring-white"></span>
          </button>

          {/* Toggle Tap-to-Pin Mode */}
          <button
            id="map-toggle-pin-mode-btn"
            aria-label="Toggle Drop Pin Mode"
            title="ปักหมุดตำแหน่งใหม่บนแผนที่"
            className={`w-11 h-11 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md flex items-center justify-center shadow-[0_8px_20px_rgba(15,23,42,0.12)] hover:bg-white active:scale-90 transition-transform border border-slate-100 ${
              isPinMode
                ? 'text-white bg-primary-container ring-2 ring-primary-container/40'
                : 'text-primary hover:text-primary-container'
            }`}
            onClick={() => {
              setIsPinMode(!isPinMode);
              onShowToast(!isPinMode ? 'เปิดโหมดปักหมุด: แตะบนแผนที่เพื่อเลือกตำแหน่ง' : 'ปิดโหมดปักหมุด');
            }}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              pin_drop
            </span>
          </button>

          {/* Choose Area Modal Trigger */}
          <button
            id="map-choose-area-btn"
            aria-label="Choose Area"
            title="เปลี่ยนย่าน/พื้นที่"
            className="w-11 h-11 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md text-secondary flex items-center justify-center shadow-[0_8px_20px_rgba(15,23,42,0.12)] hover:text-on-surface hover:bg-white active:scale-90 transition-transform border border-slate-100"
            onClick={() => setIsLocationModalOpen(true)}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">map</span>
          </button>

          {/* Traffic / Heatmap deals toggle */}
          <button
            id="map-toggle-heatmap-btn"
            aria-label="Deals Heatmap"
            title="แสดงความหนาแน่นของดีล"
            className={`w-11 h-11 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-md flex items-center justify-center shadow-[0_8px_20px_rgba(15,23,42,0.12)] hover:bg-white active:scale-90 transition-transform border border-slate-100 ${
              heatmapActive ? 'text-error ring-2 ring-error/30' : 'text-primary-container'
            }`}
            onClick={handleToggleHeatmap}
            type="button"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
          </button>
        </div>

        {/* In-map Live Savings Feed Marquee Pill */}
        <div className="absolute left-margin top-space-sm z-30">
          <div className="flex items-center gap-1.5 bg-surface-container-lowest/95 backdrop-blur-md py-1.5 px-3 rounded-full shadow-[0_4px_16px_rgba(15,23,42,0.08)] border border-slate-100">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            <span className="font-label-sm text-label-sm text-on-surface font-semibold">
              {currentLocation.nameTh.split(',')[0]} • {currentAreaStores.length} ร้านค้า
            </span>
          </div>
        </div>

        {/* Tap on Map Instruction Hint */}
        <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none z-20">
          <span className="bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-medium px-3 py-1 rounded-full shadow-sm">
            💡 แตะที่จุดใดบนแผนที่เพื่อปักหมุดตำแหน่งใหม่ หรือคลิกที่ร้านค้า
          </span>
        </div>
      </div>

      {/* Bottom Sheet Preview Card: Active Selected Store & Live Hot Deals */}
      <div className="px-margin -mt-8 relative z-30 pb-4 max-w-lg mx-auto w-full">
        <div
          id="store-preview-sheet"
          className="bg-surface-container-lowest rounded-2xl p-4 shadow-[0_12px_36px_-4px_rgba(15,23,42,0.14)] flex flex-col gap-space-sm border border-slate-100/90"
        >
          {/* Drag Indicator Bar */}
          <div className="w-10 h-1 rounded-full bg-surface-container-highest mx-auto -mt-1 mb-1"></div>

          {/* Store Header & Details Row */}
          <div className="flex items-start justify-between gap-space-sm">
            <div
              id={`select-store-header-${activeStore.id}`}
              className="flex items-start gap-3 min-w-0 cursor-pointer group"
              onClick={() => onSelectStore(activeStore)}
            >
              {/* Store mini branding avatar */}
              <div
                style={{
                  backgroundColor:
                    activeStore.brandCode === 'L'
                      ? '#00a39e'
                      : activeStore.brandCode === 'C'
                      ? '#e31b23'
                      : activeStore.brandCode === 'T'
                      ? '#f59e0b'
                      : '#007a3d',
                }}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-headline-sm font-extrabold text-[15px] shadow-sm shrink-0"
              >
                {activeStore.brandCode === '7E' ? (
                  <span>7<span className="text-[#ed1c24] text-[12px] ml-0.5">11</span></span>
                ) : (
                  activeStore.brandCode
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface truncate font-bold group-hover:text-primary transition-colors">
                    {activeStore.name} • {activeStore.branch}
                  </h2>
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {activeStore.openHours || 'OPEN 24H'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-secondary font-label-md text-label-md">
                  <div className="flex items-center gap-0.5 text-tertiary font-bold">
                    <span className="material-symbols-outlined text-[16px]">directions_walk</span>
                    <span>
                      {getStoreRelativeDistance(activeStore)} km ({Math.max(2, Math.round(getStoreRelativeDistance(activeStore) * 12))} นาที)
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-0.5 text-on-surface">
                    <span
                      className="material-symbols-outlined text-[15px] text-[#eab308]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="font-bold">{activeStore.rating || 4.8}</span>
                    <span className="text-secondary">({activeStore.reviewCount || 310})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookmark button */}
            <button
              id={`toggle-follow-store-${activeStore.id}`}
              aria-label="Save store"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shrink-0 ${
                isStoreSaved
                  ? 'bg-primary-fixed text-primary-container'
                  : 'bg-surface-container-low text-secondary hover:text-primary-container'
              }`}
              onClick={() => {
                setFollowedStoreIds((prev) => ({
                  ...prev,
                  [activeStore.id]: !prev[activeStore.id],
                }));
                onShowToast(
                  !isStoreSaved
                    ? `ติดตามร้าน ${activeStore.name} (${activeStore.branch}) แล้ว`
                    : `ยกเลิกการติดตาม ${activeStore.name}`
                );
              }}
              type="button"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: isStoreSaved ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>
          </div>

          {/* Micro Flash Banner Notice */}
          <div className="flex items-center justify-between bg-surface-container-low px-3 py-1.5 rounded-xl">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-primary-container text-[18px]">
                bolt
              </span>
              <span className="font-label-md text-label-md text-on-surface truncate">
                {activeStore.managerBroadcast || 'Flash Deals ลดพิเศษสูงสุด 50% สำหรับวันนี้'}
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-primary font-bold shrink-0 ml-2">
              {activeStore.activeDealsCount} รายการ
            </span>
          </div>

          {/* Mini Deal Carousel / Thumbnails (3 items from current store) */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {activeStoreDeals.map((deal) => (
              <div
                key={deal.id}
                id={`preview-deal-${deal.id}`}
                className="flex flex-col bg-surface-container-low/70 rounded-xl p-2 relative group hover:bg-surface-container transition-colors cursor-pointer"
                onClick={() => onSelectDeal(deal)}
              >
                <span className="absolute top-1.5 left-1.5 bg-primary-container text-on-primary font-label-sm text-[9px] font-extrabold px-1.5 py-0.2 rounded-full z-10 shadow-xs">
                  {deal.discountBadge || `-${deal.discountPercent}%`}
                </span>
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-1.5 bg-surface-container">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    alt={deal.title}
                    src={deal.image}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-label-sm text-[11px] text-on-surface font-semibold truncate">
                  {deal.title}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline-sm text-[13px] text-primary font-extrabold">
                    ฿{deal.discountPrice}
                  </span>
                  <span className="font-label-sm text-[10px] text-secondary line-through">
                    ฿{deal.originalPrice}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer: View Store Deals CTA */}
          <button
            id={`view-all-deals-btn-${activeStore.id}`}
            type="button"
            onClick={() => onSelectStore(activeStore)}
            className="w-full mt-1 py-3 px-4 rounded-xl bg-primary-container text-on-primary font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_10px_25px_-3px_rgba(249,115,22,0.35)] active:scale-[0.98] transition-transform hover:brightness-105 cursor-pointer"
          >
            <span>ดูดีลทั้งหมด ({activeStore.activeDealsCount} รายการ) ของสาขานี้</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        availableLocations={availableLocations}
        onSelectLocation={(loc) => {
          onSelectLocation(loc);
          setIsLocationModalOpen(false);
          onShowToast(`เลือกพื้นที่: ${loc.nameTh}`);
        }}
        onEnablePinMode={() => {
          setIsPinMode(true);
          onShowToast('โหมดปักหมุดเปิดใช้งาน: แตะบนแผนที่เพื่อเลือกตำแหน่ง');
        }}
        onUseCurrentGps={handleUseCurrentGps}
        isDetectingGps={isDetectingGps}
      />
    </div>
  );
};
