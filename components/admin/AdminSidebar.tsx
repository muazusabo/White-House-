'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-full shrink-0 border-b border-line bg-paper px-4 py-4 sm:w-56 sm:min-h-screen sm:border-b-0 sm:border-r sm:px-4 sm:py-6 flex flex-col">
      <p className="font-display text-lg text-ink px-2 mb-4 sm:mb-6">Restaurant Admin</p>
      <nav className="flex flex-wrap gap-1 sm:flex-1 sm:block sm:space-y-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-2 text-sm transition-colors sm:block ${
                active ? 'bg-ink text-paper' : 'text-ink/70 hover:bg-paperDim'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line px-2 pt-3 text-sm sm:mt-4 sm:block sm:pt-4">
        {user && <p className="text-ink/50 mb-2 truncate">{user.email}</p>}
        <button onClick={logout} className="text-clay hover:underline">
          Log out
        </button>
      </div>
    </aside>
  );
}
