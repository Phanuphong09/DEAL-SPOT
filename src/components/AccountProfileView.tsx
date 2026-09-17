import React, { useState } from 'react';
import { NotificationItem } from '../types';

interface AccountProfileProps {
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const AccountProfileView: React.FC<AccountProfileProps> = ({
  notifications,
  onMarkNotificationRead,
  onShowToast,
}) => {
  const [radiusKm, setRadiusKm] = useState<number>(1.5);
  const [eveningClearancePush, setEveningClearancePush] = useState<boolean>(true);
  const [highAccuracyGps, setHighAccuracyGps] = useState<boolean>(true);

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto px-margin pt-space-sm pb-28 gap-space-md">
      {/* Profile Header Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex items-center gap-space-md border border-slate-100">
        <div className="relative shrink-0">
          <img
            alt="Profile Avatar"
            className="w-16 h-16 rounded-full object-cover ring-4 ring-primary-container/20 shadow-sm"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcKr8u4hSxXlAD0lsDgc7PWXYBUblJpagST7hyVWQxjtLdGp6DbhaSUMj4Pu7s3wO6BRngYxPQ0R-_8XtXKvZQQQhjFX4UOMS_h4h0wahQIng1WhPqbsiRrkqFJS6EOnt0AMW5ka-n9shYj0PRHdLMER_jan5qI5n42hXmagm2znLZRegYaJCNB-cq5qpzRh2bHMSBrPg-cyiuBhzQ6Nace2O7mRD63zrPBBT95zDx77qVqgQG38O4"
          />
          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-tertiary ring-2 ring-white" />
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
              Kittipong S.
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary-container font-label-sm text-[10px] font-bold">
              Gold Saver
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-secondary truncate mt-0.5">
            📍 Siam Square &amp; Pathum Wan
          </p>
          <span className="font-label-sm text-label-sm text-tertiary font-semibold mt-1">
            Member since Jan 2024
          </span>
        </div>
      </div>

      {/* Savings Metric Trio */}
      <div className="grid grid-cols-3 gap-space-xs">
        <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-xs flex flex-col items-center justify-center text-center border border-slate-100">
          <span className="font-headline-sm text-headline-sm text-primary font-extrabold">
            ฿3,480
          </span>
          <span className="font-label-sm text-[10px] text-secondary uppercase font-bold mt-0.5">
            Lifetime Saved
          </span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-xs flex flex-col items-center justify-center text-center border border-slate-100">
          <span className="font-headline-sm text-headline-sm text-tertiary font-extrabold">28</span>
          <span className="font-label-sm text-[10px] text-secondary uppercase font-bold mt-0.5">
            Deals Claimed
          </span>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-xs flex flex-col items-center justify-center text-center border border-slate-100">
          <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
            4
          </span>
          <span className="font-label-sm text-[10px] text-secondary uppercase font-bold mt-0.5">
            Followed Stores
          </span>
        </div>
      </div>

      {/* Neighborhood Radar Settings */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs flex flex-col gap-space-sm border border-slate-100">
        <h3 className="font-headline-sm text-body-md text-on-surface font-bold flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary-container text-[18px]">
            radar
          </span>
          Neighborhood Radar Preferences
        </h3>

        {/* Radius selector */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex justify-between items-center text-label-sm text-secondary">
            <span>Alert Walking Radius</span>
            <span className="font-bold text-primary">{radiusKm} km (~15 min walk)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[0.5, 1.0, 1.5, 2.0].slice(0, 3).map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => {
                  setRadiusKm(km);
                  onShowToast(`Radar radius set to ${km} km`);
                }}
                className={`py-1.5 rounded-xl font-label-md text-label-md font-bold transition-all active:scale-95 ${
                  radiusKm === km
                    ? 'bg-primary-container text-white shadow-xs'
                    : 'bg-surface-container text-secondary hover:bg-surface-container-high'
                }`}
              >
                {km} km
              </button>
            ))}
          </div>
        </div>

        {/* Evening Clearance Push */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              Daily 6 PM Clearance Alert
            </span>
            <span className="font-body-sm text-body-sm text-secondary">
              Notifies when fresh food prices drop 50%
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={eveningClearancePush}
              onChange={(e) => {
                setEveningClearancePush(e.target.checked);
                onShowToast(e.target.checked ? 'Clearance alerts enabled' : 'Clearance alerts paused');
              }}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-container" />
          </label>
        </div>

        {/* High Accuracy GPS Geofencing */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              Proximity Geofence
            </span>
            <span className="font-body-sm text-body-sm text-secondary">
              Vibrate phone when walking past a flash store
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={highAccuracyGps}
              onChange={(e) => {
                setHighAccuracyGps(e.target.checked);
                onShowToast(
                  e.target.checked ? 'Proximity radar activated' : 'Proximity radar turned off'
                );
              }}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-tertiary" />
          </label>
        </div>
      </div>

      {/* Notifications History */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-xs flex flex-col gap-space-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-body-md text-on-surface font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">notifications</span>
            Recent Alerts &amp; Pings
          </h3>
          <button
            type="button"
            onClick={() => {
              notifications.forEach((n) => onMarkNotificationRead(n.id));
              onShowToast('All notifications marked as read');
            }}
            className="font-label-sm text-label-sm text-secondary hover:text-primary font-bold"
          >
            Mark all read
          </button>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onMarkNotificationRead(notif.id)}
              className={`p-3 rounded-xl flex items-start gap-3 transition-colors cursor-pointer ${
                notif.isRead
                  ? 'bg-surface-container-low/40'
                  : 'bg-primary-fixed/30 border border-orange-100'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  {notif.type === 'flash'
                    ? 'bolt'
                    : notif.type === 'stock'
                    ? 'inventory_2'
                    : 'store'}
                </span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface font-bold truncate">
                    {notif.title}
                  </span>
                  <span className="font-label-sm text-[10px] text-secondary shrink-0">
                    {notif.timeAgo}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-secondary mt-0.5 line-clamp-2">
                  {notif.message}
                </p>
              </div>
              {!notif.isRead && (
                <span className="w-2 h-2 rounded-full bg-primary-container shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
