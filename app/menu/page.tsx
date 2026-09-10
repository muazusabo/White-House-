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
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
      <div className="mb-8 max-w-2xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-forest">Fresh from the kitchen</p>
        <h1 className="font-display text-4xl text-ink md:text-5xl">Choose your next meal</h1>
        <p className="mt-3 text-ink/60">Everything below is available for collection today.</p>
      </div>

      <div className="mb-10 space-y-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search meals, snacks and drinks"
          aria-label="Search menu"
          className="input max-w-xl"
        />
        <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
      </div>

      {loading && <p className="text-ink/50">Loading the menu&hellip;</p>}
      {error && <p className="text-clay">{error}</p>}

      {!loading && !error && grouped.size === 0 && (
        <div className="border border-line rounded p-10 text-center text-ink/60">
          Nothing matches that search right now. Try a different term or category.
        </div>
      )}

      <div className="space-y-12">
        {categories
          .filter((c) => grouped.has(c.id))
          .map((c) => (
            <div key={c.id}>
              <h2 className="mb-4 font-display text-2xl text-ink">{c.name}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
