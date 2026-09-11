'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close admin navigation' : 'Open admin navigation'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="fixed left-4 top-4 z-50 flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-forest text-xl text-paper shadow-lg focus-ring sm:hidden"
      >
        {open ? '×' : '☰'}
      </button>
      {open && (
        <button
          type="button"
          aria-label="Close admin navigation overlay"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink/50 sm:hidden"
        />
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 w-[82vw] max-w-72 shrink-0 overflow-y-auto border-r border-white/10 bg-forest px-4 py-7 text-paper shadow-2xl transition-transform duration-200 sm:static sm:min-h-screen sm:w-64 sm:translate-x-0 sm:border-b-0 sm:px-5 sm:py-7 sm:shadow-none ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <p className="px-2 font-display text-xl">White House <span className="text-marigold">Admin</span></p>
      <p className="px-2 pb-6 pt-1 text-xs text-paper/50">Restaurant operations</p>
      <nav className="grid gap-1 sm:block sm:space-y-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              onClick={() => setOpen(false)}
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
        <button onClick={logout} className="min-h-11 text-marigold hover:underline">
          Log out
        </button>
      </div>
      </aside>
    </>
  );
}
