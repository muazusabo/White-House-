'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { Category, Product } from '@/lib/types';
import CategoryTabs from '@/components/site/CategoryTabs';
import ProductRow from '@/components/site/ProductRow';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get<Category[]>('/categories'), api.get<Product[]>('/products')])
      .then(([cats, prods]) => {
        setCategories(cats);
        setProducts(prods);
      })
      .catch(() => setError('Could not load the menu right now. Please try again shortly.'))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = products.filter((p) => {
      const matchesCategory = activeCategory === null || p.categoryId === activeCategory;
      const matchesSearch = !term || p.name.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });

    const byCategory = new Map<number, Product[]>();
    for (const p of filtered) {
      const list = byCategory.get(p.categoryId) || [];
      list.push(p);
      byCategory.set(p.categoryId, list);
    }
    return byCategory;
  }, [products, activeCategory, search]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="font-display text-4xl text-ink mb-2">Today&apos;s menu</h1>
      <p className="text-ink/60 mb-8">Everything below is available for collection today.</p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search the menu"
          className="sm:ml-auto w-full sm:w-64 rounded border border-line bg-white/60 px-4 py-2 text-sm focus-ring"
        />
      </div>

      {loading && <p className="text-ink/50">Loading the menu&hellip;</p>}
      {error && <p className="text-clay">{error}</p>}

      {!loading && !error && grouped.size === 0 && (
        <div className="border border-line rounded p-10 text-center text-ink/60">
          Nothing matches that search right now. Try a different term or category.
        </div>
      )}

      <div className="space-y-10">
        {categories
          .filter((c) => grouped.has(c.id))
          .map((c) => (
            <div key={c.id}>
              <h2 className="font-display text-2xl text-ink mb-3">{c.name}</h2>
              <div className="border border-line rounded bg-white/40 divide-y divide-line">
                {grouped.get(c.id)!.map((p) => (
                  <ProductRow key={p.id} product={p} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
