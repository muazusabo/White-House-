'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { api } from '@/lib/api';
import { DashboardSummary } from '@/lib/types';
import { formatPrice } from '@/lib/format';

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-line rounded p-5 bg-white/50">
      <p className="text-sm text-ink/50">{label}</p>
      <p className="font-display text-3xl text-ink mt-1">{value}</p>
    </div>
  );
}

function DashboardContent() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState('');
  const [newOrderAlert, setNewOrderAlert] = useState(0);

  useEffect(() => {
    let previousPending: number | null = null;
    function ring() {
      try {
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.frequency.value = 880;
        gain.gain.setValueAtTime(0.08, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.35);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.35);
      } catch {
        // Browsers may block audio until the admin interacts with the page.
      }
    }
    async function load() {
      try {
        const next = await api.get<DashboardSummary>('/admin/dashboard', true);
        if (previousPending !== null && next.pendingOrders > previousPending) {
          const increase = next.pendingOrders - previousPending;
          setNewOrderAlert((count) => count + increase);
          document.title = `(+${increase}) White House Eatry Admin`;
          ring();
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New White House Eatry order', { body: `+${increase} order(s) need attention.` });
          }
        }
        previousPending = next.pendingOrders;
        setSummary(next);
      } catch {
        setError('Could not load dashboard data.');
      }
    }
    load();
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    const interval = window.setInterval(load, 15000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
      <h1 className="font-display text-3xl text-ink mb-8">Dashboard</h1>
      {newOrderAlert > 0 && (
        <button
          type="button"
          onClick={() => {
            setNewOrderAlert(0);
            document.title = 'White House Eatry Admin';
          }}
          className="mb-6 rounded-full bg-clay px-4 py-2 text-sm font-medium text-white shadow-sm"
        >
          +{newOrderAlert} new order{newOrderAlert === 1 ? '' : 's'} — acknowledge
        </button>
      )}
      {error && <p className="text-clay mb-6">{error}</p>}
      {summary && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Orders today" value={summary.totalOrdersToday} />
          <StatCard label="Pending" value={summary.pendingOrders} />
          <StatCard label="Preparing" value={summary.preparingOrders} />
          <StatCard label="Ready for collection" value={summary.readyOrders} />
          <StatCard label="Completed" value={summary.completedOrders} />
          <StatCard label="Sales today" value={formatPrice(summary.totalSalesToday)} />
          <StatCard label="Available products" value={summary.availableProducts} />
          <StatCard label="Unavailable products" value={summary.unavailableProducts} />
        </div>
      )}
      {summary?.topItems && summary.topItems.length > 0 && (
        <section className="mt-10 max-w-2xl">
          <h2 className="font-display text-2xl text-ink mb-4">Best sellers today</h2>
          <div className="border border-line rounded bg-white/40 divide-y divide-line">
            {summary.topItems.map((item) => (
              <div key={item.productId} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{item.name}</span>
                <span className="font-medium">{item._sum.quantity || 0} sold</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <DashboardContent />
      </div>
    </AdminGuard>
  );
}
