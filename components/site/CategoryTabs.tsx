'use client';

import { Category } from '@/lib/types';

interface Props {
  categories: Category[];
  active: number | null;
  onChange: (id: number | null) => void;
}

export default function CategoryTabs({ categories, active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`rounded-full px-4 py-1.5 text-sm border transition-colors focus-ring ${
          active === null
            ? 'bg-ink text-paper border-ink'
            : 'border-line hover:border-ink'
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`rounded-full px-4 py-1.5 text-sm border transition-colors focus-ring ${
            active === c.id
              ? 'bg-ink text-paper border-ink'
              : 'border-line hover:border-ink'
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
