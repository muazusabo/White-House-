'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatusBadge from '@/components/site/StatusBadge';
import { api, ApiError, assetUrl } from '@/lib/api';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDate, STATUS_LABEL } from '@/lib/format';

const STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'COMPLETED',
  'CANCELLED',
];

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  function load() {
    const params = new URLSearchParams();
    if (filter !== 'ALL') params.set('status', filter);
    if (search.trim()) params.set('search', search.trim());
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const query = params.toString() ? `?${params.toString()}` : '';
    api
      .get<Order[]>(`/admin/orders${query}`, true)
      .then(setOrders)
      .catch(() => setError('Could not load orders.'));
  }

  useEffect(() => {
    load();
    const interval = window.setInterval(load, 15000);
    return () => window.clearInterval(interval);
  }, [filter, search, from, to]);

  async function handleStatusChange(order: Order, status: OrderStatus) {
    setUpdating(order.id);
    try {
      await api.patch(`/admin/orders/${order.id}/status`, { status }, true);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update order status.');
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="min-w-0 flex-1 px-4 pb-6 pt-20 sm:px-8 sm:py-8">
      <div className="mb-6"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest">Operations</p><h1 className="font-display text-4xl text-ink">Orders</h1></div>

      <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order, customer or phone"
          className="rounded border border-line bg-white/60 px-3 py-2 text-sm focus-ring"
        />
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          aria-label="Orders from date"
          className="rounded border border-line bg-white/60 px-3 py-2 text-sm focus-ring"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          aria-label="Orders to date"
          className="rounded border border-line bg-white/60 px-3 py-2 text-sm focus-ring"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['ALL', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-sm border transition-colors ${
              filter === s ? 'bg-ink text-paper border-ink' : 'border-line hover:border-ink'
            }`}
          >
            {s === 'ALL' ? 'All' : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {error && <p className="text-clay mb-4">{error}</p>}

      {orders.length === 0 ? (
        <p className="text-ink/50">No orders in this view.</p>
      ) : (
        <div className="border border-line rounded bg-white/40 divide-y divide-line">
          {orders.map((order) => (
            <div key={order.id} className="px-5 py-4">
              <div
                className="flex flex-wrap items-center gap-3 cursor-pointer"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <span className="font-medium w-full sm:w-28">{order.orderNumber}</span>
                <span className="text-sm text-ink/60 min-w-0 flex-1">
                  {order.customerName} &middot; {order.phone}
                  {order.lodgeNumber && <> &middot; Lodge {order.lodgeNumber}</>}
                </span>
                <span className="text-sm text-ink/50 w-full sm:w-auto">
                  {formatDate(order.collectionDate)} &middot; {order.collectionTime}
                </span>
                <span className="font-medium sm:w-20 sm:text-right">{formatPrice(order.total)}</span>
                <StatusBadge status={order.status} />
              </div>

              {expanded === order.id && (
                <div className="mt-4 pt-4 border-t border-dashed border-line">
                  <div className="text-sm space-y-1 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="leader-row">
                        <span>
                          {item.quantity} × {item.name}
                        </span>
                        <span className="leader" />
                        <span>{formatPrice(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                  {order.note && (
                    <p className="text-sm text-ink/60 italic mb-4">&ldquo;{order.note}&rdquo;</p>
                  )}
                  {order.paymentProofUrl && (
                    <a
                      href={assetUrl(order.paymentProofUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-sm text-forest hover:underline mb-4"
                    >
                      View payment proof
                    </a>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        disabled={updating === order.id || order.status === s}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order, s);
                        }}
                        className={`rounded px-3 py-1.5 text-xs font-medium border transition-colors focus-ring disabled:opacity-40 ${
                          order.status === s
                            ? 'bg-forest text-white border-forest'
                            : 'border-line hover:border-ink'
                        }`}
                      >
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <OrdersContent />
      </div>
    </AdminGuard>
  );
}
