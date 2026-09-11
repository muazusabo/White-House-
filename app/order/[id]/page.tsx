'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';
import { Order, RestaurantSettings } from '@/lib/types';
import OrderTicket from '@/components/site/OrderTicket';
import { useCart } from '@/context/CartContext';

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const { addItem } = useCart();
  const [reordering, setReordering] = useState(false);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [readyNotice, setReadyNotice] = useState(false);

  useEffect(() => {
    let active = true;
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
    async function load() {
      try {
        const next = await api.get<Order>(`/orders/${params.id}`);
        if (active) {
          setOrder((previous) => {
            if (previous?.status !== 'READY' && next.status === 'READY') {
              setReadyNotice(true);
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Your order is ready', {
                  body: `Order ${next.orderNumber} is ready for pickup.`,
                });
              }
            }
            return next;
          });
        }
      } catch (err) {
        if (active) setError(err instanceof ApiError ? err.message : 'Could not load that order.');
      }
    }
    load();
    api.get<RestaurantSettings>('/settings').then(setSettings).catch(() => {});
    const interval = window.setInterval(load, 20000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [params.id]);

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <p className="text-clay mb-4">{error}</p>
        <Link href="/menu" className="text-forest hover:underline">
          Back to the menu
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="mx-auto max-w-xl px-5 py-20 text-center text-ink/50">Loading your order&hellip;</div>;
  }

  async function handleRepeatOrder() {
    if (!order) return;
    const currentOrder = order;
    setReordering(true);
    try {
      const products = await api.get<import('@/lib/types').Product[]>('/products');
      for (const item of currentOrder.items) {
        const product = products.find((candidate) => candidate.id === item.productId && candidate.available);
        if (product) addItem(product, item.quantity);
      }
      window.location.href = '/cart';
    } finally {
      setReordering(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <h1 className="font-display text-3xl text-ink mb-2 text-center">Order received</h1>
      <p className="text-ink/60 text-center mb-10">
        Your order has been submitted successfully. Show your order number at the counter when you arrive.
      </p>
      {(settings?.bankName || settings?.accountName || settings?.accountNumber || settings?.paymentInstructions) && (
        <div className="mb-6 rounded border border-line bg-white/50 px-4 py-4 text-sm">
          <p className="font-medium text-ink mb-2">White House Eatry payment details</p>
          <div className="grid sm:grid-cols-3 gap-3 text-ink/70">
            {settings.bankName && <p><span className="block text-xs text-ink/45">Bank</span>{settings.bankName}</p>}
            {settings.accountName && <p><span className="block text-xs text-ink/45">Account name</span>{settings.accountName}</p>}
            {settings.accountNumber && <p><span className="block text-xs text-ink/45">Account number</span>{settings.accountNumber}</p>}
          </div>
          {settings.paymentInstructions && <p className="mt-3 text-ink/60">{settings.paymentInstructions}</p>}
        </div>
      )}
      <OrderTicket order={order} />
      {readyNotice && order.status === 'READY' && (
        <div role="alert" className="mt-5 rounded-xl border border-success/30 bg-success/10 px-4 py-4 text-center text-sm text-ink">
          <p className="font-semibold text-forest">Your order is ready for pickup.</p>
          <p className="mt-1 text-ink/60">Please bring your order number to the counter.</p>
        </div>
      )}
      {settings?.phone && (
        <div className="mt-5 rounded border border-forest/20 bg-forest/5 px-4 py-3 text-center text-sm text-ink/70">
          Questions about your order?{' '}
          <a href={`tel:${settings.phone}`} className="font-medium text-forest hover:underline">
            Call White House Eatry on {settings.phone}
          </a>
        </div>
      )}
      <div className="text-center mt-8">
        <button
          type="button"
          onClick={handleRepeatOrder}
          disabled={reordering}
          className="text-forest hover:underline text-sm mr-5 disabled:opacity-50"
        >
          {reordering ? 'Loading order…' : 'Order these again'}
        </button>
        <Link href="/menu" className="text-forest hover:underline text-sm">
          Order something else
        </Link>
      </div>
    </div>
  );
}
