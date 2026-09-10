'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProductFormModal from '@/components/admin/ProductFormModal';
import CategoryFormModal from '@/components/admin/CategoryFormModal';
import { api, ApiError } from '@/lib/api';
import { Category, Product } from '@/lib/types';
import { formatPrice } from '@/lib/format';

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Product | null | 'new'>(null);
  const [addingCategory, setAddingCategory] = useState(false);

  function load() {
    Promise.all([api.get<Product[]>('/products'), api.get<Category[]>('/categories')])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
      })
      .catch(() => setError('Could not load products.'));
  }

  useEffect(load, []);

  async function toggleAvailability(product: Product) {
    try {
      await api.patch(`/products/${product.id}/availability`, { available: !product.available }, true);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update availability.');
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${product.id}`, true);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not delete this product.');
    }
  }

  return (
    <div className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest">Catalog</p><h1 className="font-display text-4xl text-ink">Products</h1></div>
        <div className="flex gap-2">
          <button
            onClick={() => setAddingCategory(true)}
            className="rounded border border-line px-4 py-2 text-sm hover:bg-paperDim focus-ring"
          >
            New category
          </button>
          <button
            onClick={() => setEditing('new')}
            className="min-h-11 rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-paper hover:bg-forestDark focus-ring"
          >
            Add product
          </button>
        </div>
      </div>

      {error && <p className="text-clay mb-4">{error}</p>}

      {categories.length === 0 && (
        <p className="text-ink/50 mb-4">Create a category first, then add products to it.</p>
      )}

      <div className="surface divide-y divide-line">
        {products.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-4 sm:flex-nowrap sm:gap-4 sm:px-5">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded bg-paperDim">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-lg text-forest/35">✦</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-ink/50">
                {p.category?.name} &middot; {formatPrice(p.price)}
                {p.stock != null && ` · ${p.stock} in stock`}
              </p>
            </div>
            <button
              onClick={() => toggleAvailability(p)}
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors focus-ring ${
                p.available
                  ? 'bg-forest/15 text-forestDark border-forest/40'
                  : 'bg-clay/10 text-clay border-clay/40'
              }`}
            >
              {p.available ? 'Available' : 'Unavailable'}
            </button>
            <button
              onClick={() => setEditing(p)}
              className="text-sm text-forest hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(p)}
              className="text-sm text-clay hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
        {products.length === 0 && (
          <p className="px-5 py-8 text-center text-ink/50">No products yet.</p>
        )}
      </div>

      {editing && (
        <ProductFormModal
          categories={categories}
          product={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      {addingCategory && (
        <CategoryFormModal
          onClose={() => setAddingCategory(false)}
          onSaved={() => {
            setAddingCategory(false);
            load();
          }}
        />
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <ProductsContent />
      </div>
    </AdminGuard>
  );
}
