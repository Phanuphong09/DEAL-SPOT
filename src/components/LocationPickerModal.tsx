import React, { useState } from 'react';
import { LocationArea } from '../types';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: LocationArea;
  availableLocations: LocationArea[];
  onSelectLocation: (location: LocationArea) => void;
  onEnablePinMode: () => void;
  onUseCurrentGps: () => void;
  isDetectingGps?: boolean;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  availableLocations,
  onSelectLocation,
  onEnablePinMode,
  onUseCurrentGps,
  isDetectingGps = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  if (!isOpen) return null;

  const regionTabs = [
    { id: 'all', label: 'ทั่วประเทศ' },
    { id: 'bangkok', label: 'กทม. & ปริมณฑล' },
    { id: 'north', label: 'ภาคเหนือ' },
    { id: 'east', label: 'ภาคตะวันออก' },
    { id: 'south', label: 'ภาคใต้' },
    { id: 'northeast', label: 'ภาคอีสาน' },
  ];

  const filteredLocations = availableLocations.filter((loc) => {
    // Region tab filter
    if (selectedRegion !== 'all') {
      if (selectedRegion === 'bangkok' && !(loc.region === 'bangkok' || loc.region === 'central')) {
        return false;
      }
      if (selectedRegion !== 'bangkok' && loc.region !== selectedRegion) {
        return false;
      }
    }

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.nameTh.toLowerCase().includes(q) ||
      (loc.province && loc.province.toLowerCase().includes(q)) ||
      (loc.provinceTh && loc.provinceTh.toLowerCase().includes(q)) ||
      loc.district.toLowerCase().includes(q) ||
      loc.districtTh.toLowerCase().includes(q) ||
      loc.landmark.toLowerCase().includes(q) ||
      loc.stationTag.toLowerCase().includes(q)
    );
  });

  return (
    <div
      id="location-picker-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="location-picker-sheet"
        className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-slate-100"
      >
        {/* Header with drag indicator & close button */}
        <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-primary-container text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                pin_drop
              </span>
              <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                เลือกพื้นที่ หรือ ปักหมุด
              </h2>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              ค้นหาหรือแตะปักหมุดตำแหน่งเพื่อดูดีลใกล้คุณ
            </p>
          </div>
          <button
            id="close-location-modal-btn"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-secondary hover:text-on-surface transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Search Bar & Region Tabs */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative flex items-center bg-surface-container-lowest rounded-xl px-3 py-2.5 shadow-sm border border-slate-200/70 focus-within:border-primary-container">
            <span className="material-symbols-outlined text-secondary text-[20px] mr-2">
              search
            </span>
            <input
              id="location-search-input"
              type="text"
              placeholder="ค้นหาชื่อย่าน, จังหวัด, อำเภอ หรือเขต..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-on-surface placeholder:text-secondary focus:outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
          </div>

          {/* Region Tabs (Nationwide) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 pb-1">
            {regionTabs.map((tab) => {
              const isActive = selectedRegion === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`region-tab-${tab.id}`}
                  type="button"
                  onClick={() => setSelectedRegion(tab.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                    isActive
                      ? 'bg-primary-container text-white shadow-xs'
                      : 'bg-white text-secondary hover:text-on-surface border border-slate-200/70'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Quick Action Buttons: GPS & Drop Pin on Map */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {/* 1. GPS Auto Detect */}
            <button
              id="use-current-gps-btn"
              type="button"
              onClick={onUseCurrentGps}
              disabled={isDetectingGps}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-surface-container-lowest border border-slate-200 hover:border-primary-container text-primary-container font-semibold text-xs shadow-xs active:scale-95 transition-all"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${
                  isDetectingGps ? 'animate-spin' : ''
                }`}
              >
                my_location
              </span>
              <span>{isDetectingGps ? 'กำลังค้นหา GPS...' : 'ตำแหน่งปัจจุบัน (GPS)'}</span>
            </button>

            {/* 2. Direct Tap-to-Pin on Map */}
            <button
              id="enable-drop-pin-btn"
              type="button"
              onClick={() => {
                onClose();
                onEnablePinMode();
              }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-primary-container text-white font-semibold text-xs shadow-xs hover:brightness-105 active:scale-95 transition-all"
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                touch_app
              </span>
              <span>แตะปักหมุดบนแผนที่</span>
            </button>
          </div>
        </div>

        {/* Current Active Location Highlight Card */}
        <div className="px-4 py-2.5 bg-orange-50/70 border-b border-orange-100/60 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="material-symbols-outlined text-primary-container text-[20px] shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <div className="truncate">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                พื้นที่ที่เลือกอยู่:
              </span>
              <p className="text-xs font-bold text-on-surface truncate">
                {currentLocation.nameTh} ({currentLocation.name})
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-primary-container text-white font-bold px-2 py-0.5 rounded-full shrink-0">
            {currentLocation.dealsCount} ดีลใกล้เคียง
          </span>
        </div>

        {/* Areas List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          <div className="px-3 py-1.5 flex items-center justify-between">
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
              พื้นที่และจังหวัดทั่วไทย ({filteredLocations.length})
            </span>
            {selectedRegion !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedRegion('all')}
                className="text-[11px] text-primary font-semibold hover:underline"
              >
                ดูทุกภาค
              </button>
            )}
          </div>

          {filteredLocations.map((loc) => {
            const isSelected = loc.id === currentLocation.id;
            return (
              <div
                key={loc.id}
                id={`location-item-${loc.id}`}
                onClick={() => {
                  onSelectLocation(loc);
                  onClose();
                }}
                className={`p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50/80 border border-orange-200/80 shadow-xs'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-primary-container text-white shadow-sm'
                        : 'bg-surface-container-low text-secondary'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      location_city
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {loc.provinceTh && (
                        <span className="bg-orange-100 text-orange-900 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                          {loc.provinceTh}
                        </span>
                      )}
                      <span className="font-semibold text-sm text-on-surface">
                        {loc.nameTh}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {loc.stationTag}
                      </span>
                    </div>
                    <span className="text-xs text-secondary truncate mt-0.5">
                      {loc.landmark}
                    </span>
                    <span className="text-[11px] text-tertiary font-medium">
                      {loc.districtTh}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 ml-2">
                  <span className="text-xs font-bold text-primary">
                    {loc.dealsCount} ดีล
                  </span>
                  <span className="text-[10px] text-secondary">
                    {loc.storesCount} ร้านค้า
                  </span>
                  {isSelected && (
                    <span className="mt-1 text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">done</span>
                      เลือกอยู่
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredLocations.length === 0 && (
            <div className="p-8 text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-secondary text-[40px] mb-2">
                location_off
              </span>
              <p className="text-sm font-semibold text-on-surface">
                ไม่พบย่านที่ตรงกับ "{searchQuery}"
              </p>
              <p className="text-xs text-secondary mt-1">
                คุณสามารถใช้โหมด "แตะปักหมุดบนแผนที่" เพื่อเลือกพิกัดใดก็ได้
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEnablePinMode();
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-primary-container text-white text-xs font-bold shadow-xs hover:brightness-105 active:scale-95"
              >
                เปิดโหมดปักหมุดบนแผนที่
              </button>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-secondary">
            💡 แตะที่จุดใดก็ได้บนแผนที่เพื่อปักหมุดตำแหน่งใหม่ได้ทันที
          </p>
        </div>
      </div>
    </div>
  );
};
