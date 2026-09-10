'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const LINKS = [
  { href: '/admin', label: 'Overview', icon: '⌂' },
  { href: '/admin/orders', label: 'Orders', icon: '◷' },
  { href: '/admin/products', label: 'Products', icon: '▦' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-full shrink-0 border-b border-line bg-forest px-4 py-4 text-paper sm:min-h-screen sm:w-64 sm:border-b-0 sm:px-5 sm:py-7">
      <p className="px-2 font-display text-xl">White House <span className="text-marigold">Admin</span></p>
      <p className="px-2 pb-6 pt-1 text-xs text-paper/50">Restaurant operations</p>
      <nav className="flex gap-1 overflow-x-auto sm:block sm:space-y-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors sm:block ${
                active ? 'bg-white/15 text-white' : 'text-paper/65 hover:bg-white/10'
              }`}
            >
              <span className="mr-2 text-marigold">{link.icon}</span>{link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 px-2 pt-4 text-sm sm:mt-8 sm:block">
        {user && <p className="mb-2 truncate text-paper/50">{user.email}</p>}
        <button onClick={logout} className="text-marigold hover:underline">
          Log out
        </button>
      </div>
    </aside>
  );
}
