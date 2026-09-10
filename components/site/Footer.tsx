'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { RestaurantSettings } from '@/lib/types';

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);

  useEffect(() => {
    api.get<RestaurantSettings>('/settings').then(setSettings).catch(() => {});
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="mt-20 bg-forest text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl">{settings?.restaurantName || 'White House Eatry'}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-paper/70">Fresh meals, snacks, and drinks ready when campus life gets busy.</p>
        </div>
        <div>
          <p className="font-semibold">Explore</p>
          <div className="mt-3 grid gap-2 text-sm text-paper/70">
            <a href="/menu" className="hover:text-white">Menu</a>
            <a href="/track" className="hover:text-white">Track order</a>
            <a href="/cart" className="hover:text-white">Cart</a>
          </div>
        </div>
        <div>
          <p className="font-semibold">Visit us</p>
          <div className="mt-3 grid gap-2 text-sm text-paper/70">
            {settings?.location && <p>{settings.location}</p>}
            {settings?.openingHours && <p>{settings.openingHours}</p>}
          </div>
        </div>
        <div>
          <p className="font-semibold">Restaurant team</p>
          <a href="/admin/login" className="mt-3 inline-block text-sm text-paper/70 hover:text-white">Staff login</a>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-4 text-center text-xs text-paper/50">© {new Date().getFullYear()} White House Eatry. Built for campus life.</div>
    </footer>
  );
}
