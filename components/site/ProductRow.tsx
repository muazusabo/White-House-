'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { useCart } from '@/context/CartContext';

export default function ProductRow({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="surface flex h-full flex-col overflow-hidden">
      <div className="h-44 w-full shrink-0 overflow-hidden bg-paperDim">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl text-forest/35">✦</div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-ink">{product.name}</p>
            <span className="rounded-full bg-paperDim px-2 py-1 text-[11px] font-medium text-ink/60">{product.category?.name || 'Menu'}</span>
            {!product.available && (
              <span className="text-xs uppercase tracking-wide text-clay border border-clay/40 rounded-sm px-1.5 py-0.5">
                Unavailable
              </span>
            )}
          </div>
          <p className="font-display text-xl text-forest whitespace-nowrap">{formatPrice(product.price)}</p>
        </div>
        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm text-ink/60">{product.description}</p>
        )}
      </div>
      <button
        onClick={handleAdd}
        disabled={!product.available}
        className={`mt-auto min-h-11 w-full rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-ring ${
          !product.available
            ? 'bg-paperDim text-ink/30 cursor-not-allowed'
            : added
            ? 'bg-forest text-white'
            : 'bg-ink text-paper hover:bg-forest'
        }`}
      >
        {added ? 'Added ✓' : 'Add to cart'}
      </button>
    </div>
  );
}
