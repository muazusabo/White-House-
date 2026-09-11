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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.get<RestaurantSettings>('/settings').then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
        <nav className="hidden items-center gap-6 text-sm sm:flex">
          <Link href="/menu" className="hover:text-forest transition-colors">
            Menu
          </Link>
          <Link href="/track" className="hover:text-forest transition-colors">
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
        <button
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="relative flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-forest text-xl text-paper focus-ring sm:hidden"
        >
          {open ? '×' : '☰'}
          {itemCount > 0 && (
            <span
              key={itemCount}
              aria-label={`${itemCount} item${itemCount === 1 ? '' : 's'} in cart`}
              className="absolute -right-2 -top-2 flex h-6 min-w-6 animate-pulse items-center justify-center rounded-full bg-marigold px-1 text-xs font-bold text-ink ring-2 ring-paper"
            >
              {itemCount}
            </span>
          )}
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-paper px-4 py-3 shadow-lg sm:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1">
            <Link href="/menu" className="min-h-11 rounded-lg px-3 py-3 font-medium hover:bg-paperDim">Menu</Link>
            <Link href="/track" className="min-h-11 rounded-lg px-3 py-3 font-medium hover:bg-paperDim">Track order</Link>
            <Link href="/cart" className="min-h-11 rounded-lg px-3 py-3 font-medium hover:bg-paperDim">Cart {itemCount > 0 ? `(${itemCount})` : ''}</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
