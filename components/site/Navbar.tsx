'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';
import { RestaurantSettings } from '@/lib/types';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);

  useEffect(() => {
    api.get<RestaurantSettings>('/settings').then(setSettings).catch(() => {});
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-2 font-display text-xl tracking-tight text-ink sm:text-2xl">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest text-paper text-lg transition-transform group-hover:rotate-6">✦</span>
          )}
          <span>{settings?.restaurantName || 'White House Eatry'}</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm sm:gap-6">
          <Link href="/menu" className="hidden hover:text-forest transition-colors sm:inline">
            Menu
          </Link>
          <Link href="/track" className="hidden hover:text-forest transition-colors sm:inline">
            Track order
          </Link>
          <Link
            href="/cart"
            className="relative min-h-11 rounded-lg bg-forest px-4 py-2.5 font-medium text-paper transition-colors hover:bg-forestDark"
          >
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-clay text-white text-xs">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
