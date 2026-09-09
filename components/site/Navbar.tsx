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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="group flex items-center gap-3 font-display text-2xl tracking-tight text-ink">
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-paper text-lg transition-transform group-hover:rotate-12">✦</span>
          )}
          <span>{settings?.restaurantName || 'White House Eatry'}</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:gap-6">
          <Link href="/menu" className="hover:text-forest transition-colors">
            Menu
          </Link>
          <Link href="/track" className="hover:text-forest transition-colors">
            Track order
          </Link>
          <Link
            href="/cart"
            className="relative rounded border border-ink px-3 py-1.5 transition-colors hover:bg-ink hover:text-paper"
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
