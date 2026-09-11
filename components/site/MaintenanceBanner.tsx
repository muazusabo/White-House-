'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { RestaurantSettings } from '@/lib/types';

export default function MaintenanceBanner() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);

  useEffect(() => {
    let active = true;
    const load = () =>
      api.get<RestaurantSettings>('/settings').then((next) => {
        if (active) setSettings(next);
      }).catch(() => {});
    load();
    const interval = window.setInterval(load, 30000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  if (!settings?.maintenanceMode) return null;

  return (
    <div role="status" className="bg-marigold px-4 py-2 text-center text-sm font-medium text-ink">
      {settings.maintenanceMessage || 'We are temporarily paused while we refresh the kitchen. Please check back soon.'}
    </div>
  );
}
