'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { api, ApiError } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { Order, RestaurantSettings } from '@/lib/types';

function isoDateFor(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const router = useRouter();

  const [customerName, setCustomerName] = useState('');
  const [lodgeNumber, setLodgeNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [dateChoice, setDateChoice] = useState<'today' | 'tomorrow' | 'other'>('today');
  const [customDate, setCustomDate] = useState('');
  const [collectionTime, setCollectionTime] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('campus_restaurant_customer');
      if (saved) {
        const profile = JSON.parse(saved) as { customerName?: string; lodgeNumber?: string; phone?: string; email?: string };
        setCustomerName(profile.customerName || '');
        setLodgeNumber(profile.lodgeNumber || '');
        setPhone(profile.phone || '');
        setEmail(profile.email || '');
      }
    } catch {
      // Ignore invalid saved details.
    }
    api.get<RestaurantSettings>('/settings').then(setSettings).catch(() => {});
  }, []);

  const collectionDate =
    dateChoice === 'today'
      ? isoDateFor(0)
      : dateChoice === 'tomorrow'
      ? isoDateFor(1)
      : customDate;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!collectionDate) {
      setError('Please choose a collection date.');
      return;
    }
    if (!collectionTime.trim()) {
      setError('Please enter a collection time.');
      return;
    }
    if (!paymentProof) {
      setError('Please attach your payment proof.');
      return;
    }

    setSubmitting(true);
    try {
      const order = await api.post<Order>('/orders', {
        customerName,
        lodgeNumber,
        phone,
        email: email || undefined,
        note: note || undefined,
        collectionDate,
        collectionTime,
        items: lines.map((l) => ({
          productId: Number(l.product.id),
          quantity: Number(l.quantity),
        })),
      });
      if (!Number.isInteger(order.id) || order.id < 1) {
        throw new Error('The server returned an invalid order reference. Please try again.');
      }
      const proofData = new FormData();
      proofData.append('paymentProof', paymentProof);
      await api.upload<Order>(`/orders/${order.id}/payment-proof`, proofData);
      window.localStorage.setItem(
        'campus_restaurant_customer',
        JSON.stringify({ customerName, lodgeNumber, phone, email }),
      );
      clear();
      router.push(`/order/${order.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong placing your order. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="font-display text-3xl text-ink mb-3">Your cart is empty</h1>
        <p className="text-ink/60">Add something from the menu before checking out.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-5 sm:py-12 md:grid-cols-[1fr_320px] md:gap-10">
      <div>
        <h1 className="mb-6 font-display text-4xl text-ink sm:mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {settings?.collectionInstructions && (
            <div className="rounded border border-forest/20 bg-forest/5 px-4 py-3 text-sm text-ink/70">
              <p className="font-medium text-forest mb-1">Collection information</p>
              {settings.collectionInstructions}
            </div>
          )}
          {(settings?.bankName || settings?.accountName || settings?.accountNumber || settings?.paymentInstructions) && (
            <div className="rounded border border-line bg-white/50 px-4 py-4 text-sm">
              <p className="font-medium text-ink mb-2">Payment details</p>
              <div className="grid sm:grid-cols-3 gap-3 text-ink/70">
                {settings.bankName && <p><span className="block text-xs text-ink/45">Bank</span>{settings.bankName}</p>}
                {settings.accountName && <p><span className="block text-xs text-ink/45">Account name</span>{settings.accountName}</p>}
                {settings.accountNumber && <p><span className="block text-xs text-ink/45">Account number</span>{settings.accountNumber}</p>}
              </div>
              {settings.paymentInstructions && <p className="mt-3 text-ink/60">{settings.paymentInstructions}</p>}
            </div>
          )}
          {settings?.phone && (
            <div className="rounded border border-forest/20 bg-forest/5 px-4 py-3 text-sm text-ink/70">
              Need help with your order? Call White House Eatry on{' '}
              <a href={`tel:${settings.phone}`} className="font-medium text-forest hover:underline">
                {settings.phone}
              </a>
              .
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input focus-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone number</label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input focus-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lodge number</label>
              <input
                required
                value={lodgeNumber}
                onChange={(e) => setLodgeNumber(e.target.value)}
                placeholder="e.g. Lodge A12"
                className="input focus-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input focus-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Collection date</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(['today', 'tomorrow', 'other'] as const).map((choice) => (
                <button
                  type="button"
                  key={choice}
                  onClick={() => setDateChoice(choice)}
                  className={`rounded-full px-4 py-1.5 text-sm border transition-colors focus-ring ${
                    dateChoice === choice
                      ? 'bg-ink text-paper border-ink'
                      : 'border-line hover:border-ink'
                  }`}
                >
                  {choice === 'today' ? 'Today' : choice === 'tomorrow' ? 'Tomorrow' : 'Another date'}
                </button>
              ))}
            </div>
            {dateChoice === 'other' && (
              <input
                type="date"
                required
                min={isoDateFor(0)}
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full sm:w-56 rounded border border-line bg-white/60 px-4 py-2 focus-ring"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Collection time</label>
            <input
              required
              placeholder="e.g. 1:30 PM"
              value={collectionTime}
              onChange={(e) => setCollectionTime(e.target.value)}
              className="w-full sm:w-56 rounded border border-line bg-white/60 px-4 py-2 focus-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Note for the restaurant (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="e.g. Please prepare my food before my 2 PM class."
              className="w-full rounded border border-line bg-white/60 px-4 py-2 focus-ring"
            />
          </div>

          <div className="rounded border border-clay/30 bg-clay/5 px-4 py-4">
            <label className="block text-sm font-medium mb-1">Payment proof</label>
            <p className="text-xs text-ink/60 mb-2">Attach a screenshot or PDF of your payment receipt. Maximum 5 MB.</p>
            <input
              required
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
              className="block w-full text-sm"
            />
          </div>

          {error && (
            <div className="rounded border border-clay/40 bg-clay/5 px-4 py-3 text-clay text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-ink text-paper px-6 py-3 font-medium hover:bg-forest transition-colors focus-ring disabled:opacity-50"
          >
            {submitting ? 'Submitting your order…' : 'Place order — submit payment proof'}
          </button>
        </form>
      </div>

      <aside className="border border-line rounded bg-white/40 p-5 h-fit">
        <h2 className="font-display text-xl text-ink mb-4">Order summary</h2>
        <div className="space-y-2 text-sm mb-4">
          {lines.map((l) => (
            <div key={l.product.id} className="leader-row">
              <span>
                {l.quantity} × {l.product.name}
              </span>
              <span className="leader" />
              <span>{formatPrice(Number(l.product.price) * l.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-line pt-3 flex items-center justify-between">
          <span className="font-medium">Total</span>
          <span className="font-display text-xl text-forest">{formatPrice(subtotal)}</span>
        </div>
        <p className="text-xs text-ink/50 mt-4">
          Make payment using the account details above, then attach your proof of payment.
        </p>
      </aside>
    </div>
  );
}
