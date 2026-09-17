export type ViewMode =
  | 'explore-map'
  | 'deals-feed'
  | 'saved-deals'
  | 'account-profile'
  | 'deal-details'
  | 'store-radar';

export interface DealItem {
  id: string;
  title: string;
  subtitle?: string;
  volume?: string;
  storeName: string;
  storeId: string;
  storeBranch: string;
  distanceKm: number;
  originalPrice: number;
  discountPrice: number;
  discountPercent?: number;
  discountBadge?: string;
  timeLeft?: string;
  remainingCount: number;
  remainingText?: string;
  image: string;
  category: 'food' | 'beverages' | 'household' | 'personal';
  isFavorite: boolean;
  inStock: boolean;
  isFlash?: boolean;
  storeLogoCode?: string;
  storeColor?: string;
}

export interface LocationArea {
  id: string;
  name: string;
  nameTh: string;
  province?: string;
  provinceTh?: string;
  region?: 'bangkok' | 'north' | 'central' | 'south' | 'northeast' | 'east';
  district: string;
  districtTh: string;
  landmark: string;
  stationTag: string;
  coords: { x: number; y: number };
  geoLat: number;
  geoLng: number;
  dealsCount: number;
  storesCount: number;
  accentRoad?: string;
  isCustomPin?: boolean;
}

export interface StoreItem {
  id: string;
  name: string;
  brandCode: '7E' | 'L' | 'C' | 'T';
  branch: string;
  fullAddress: string;
  distanceKm: number;
  walkMinutes: number;
  rating: number;
  reviewCount: number;
  openHours: string;
  bannerImage: string;
  mapThumbnail: string;
  activeDealsCount: number;
  isFollowing: boolean;
  hasFlash: boolean;
  managerBroadcast?: string;
  deals: DealItem[];
  areaId?: string;
  mapCoords?: { x: number; y: number };
  pinDiscountBadge?: string;
}

export interface NotificationItem {
  id: string;
  type: 'flash' | 'price_drop' | 'clearance' | 'expiring' | 'system';
  storeName: string;
  brandCode?: string;
  title: string;
  description: string;
  timeAgo: string;
  isToday: boolean;
  isUnread: boolean;
  dealPreview?: {
    title: string;
    originalPrice: number;
    discountPrice: number;
    discountBadge: string;
    distanceText: string;
    timeLeft: string;
    image: string;
  };
  productDropPreview?: {
    image: string;
    walkDistance: string;
  };
  itemsLeftCount?: number;
  distanceText?: string;
}
