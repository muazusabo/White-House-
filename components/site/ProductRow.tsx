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
    <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-5 sm:py-5">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-paperDim sm:h-24 sm:w-24">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl text-forest/35">✦</div>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium">{product.name}</p>
            {!product.available && (
              <span className="text-xs uppercase tracking-wide text-clay border border-clay/40 rounded-sm px-1.5 py-0.5">
                Unavailable
              </span>
            )}
          </div>
          <p className="font-display text-lg text-forest whitespace-nowrap">{formatPrice(product.price)}</p>
        </div>
        {product.description && (
          <p className="text-sm text-ink/60 mt-1 max-w-md">{product.description}</p>
        )}
      </div>
      <button
        onClick={handleAdd}
        disabled={!product.available}
        className={`shrink-0 rounded px-4 py-2 text-sm font-medium transition-colors focus-ring ${
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
