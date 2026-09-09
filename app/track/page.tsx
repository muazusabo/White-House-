'use client';

import { useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { Order } from '@/lib/types';
import OrderTicket from '@/components/site/OrderTicket';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);
    try {
      const result = await api.post<Order>('/orders/track', { orderNumber, phone });
      setOrder(result);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not find that order. Please check the details and try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <h1 className="font-display text-3xl text-ink mb-2">Track your order</h1>
      <p className="text-ink/60 mb-8">
        Enter your order number and the phone number you ordered with.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-10">
        <input
          required
          placeholder="Order number, e.g. ORD-4F2KA"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="flex-1 rounded border border-line bg-white/60 px-4 py-2 focus-ring"
        />
        <input
          required
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 rounded border border-line bg-white/60 px-4 py-2 focus-ring"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-ink text-paper px-6 py-2 font-medium hover:bg-forest transition-colors focus-ring disabled:opacity-50"
        >
          {loading ? 'Looking…' : 'Track'}
        </button>
      </form>

      {error && <p className="text-clay mb-6">{error}</p>}
      {order && <OrderTicket order={order} />}
    </div>
  );
}
