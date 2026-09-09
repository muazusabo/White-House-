'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { RestaurantSettings } from '@/lib/types';
import { whatsappUrl } from '@/lib/format';

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);

  useEffect(() => {
    api.get<RestaurantSettings>('/settings').then(setSettings).catch(() => {});
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  const whatsapp = settings?.phone ? whatsappUrl(settings.phone) : null;

  return (
    <footer className="mt-20 border-t border-line bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-10 grid gap-8 sm:grid-cols-[1fr_auto] items-start">
        <div>
          <p className="font-display text-2xl">{settings?.restaurantName || 'White House Eatry'}</p>
          <p className="mt-2 max-w-sm text-sm text-paper/65">Fresh meals, snacks, and drinks ready when campus life gets busy.</p>
          {settings?.location && <p className="mt-4 text-sm text-paper/75">{settings.location}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-paper/75 sm:justify-end">
          {settings?.openingHours && <span>{settings.openingHours}</span>}
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="text-[#8fe0a8] hover:text-white transition-colors font-medium"
            >
              Chat on WhatsApp
            </a>
          )}
          <a href="/admin/login" className="hover:text-white transition-colors">
            Staff login
          </a>
        </div>
      </div>
    </footer>
  );
}
