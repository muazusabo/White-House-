'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
  const { lines, updateQuantity, removeItem, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="font-display text-3xl text-ink mb-3">Your cart is empty</h1>
        <p className="text-ink/60 mb-8">Add something from today&apos;s menu to get started.</p>
        <Link
          href="/menu"
          className="inline-block rounded bg-ink text-paper px-6 py-3 font-medium hover:bg-forest transition-colors focus-ring"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="font-display text-4xl text-ink mb-8">Your cart</h1>

      <div className="border border-line rounded bg-white/40 divide-y divide-line">
        {lines.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-ink/50">{formatPrice(product.price)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="h-8 w-8 rounded border border-line hover:border-ink focus-ring"
                aria-label={`Decrease quantity of ${product.name}`}
              >
                −
              </button>
              <span className="w-6 text-center">{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="h-8 w-8 rounded border border-line hover:border-ink focus-ring"
                aria-label={`Increase quantity of ${product.name}`}
              >
                +
              </button>
            </div>
            <p className="w-24 text-right font-medium text-forest">
              {formatPrice(Number(product.price) * quantity)}
            </p>
            <button
              onClick={() => removeItem(product.id)}
              className="text-sm text-ink/40 hover:text-clay focus-ring"
              aria-label={`Remove ${product.name}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link href="/menu" className="text-sm text-forest hover:underline">
          Continue shopping
        </Link>
        <div className="text-right">
          <p className="text-sm text-ink/50">Subtotal</p>
          <p className="font-display text-2xl text-ink">{formatPrice(subtotal)}</p>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block text-center rounded bg-ink text-paper px-6 py-3 font-medium hover:bg-forest transition-colors focus-ring"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
