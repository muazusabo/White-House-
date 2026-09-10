'use client';

import { Category } from '@/lib/types';

interface Props {
  categories: Category[];
  active: number | null;
  onChange: (id: number | null) => void;
}

export default function CategoryTabs({ categories, active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onChange(null)}
        className={`min-h-11 shrink-0 rounded-full px-4 py-2 text-sm border transition-colors focus-ring ${
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
          className={`min-h-11 shrink-0 rounded-full px-4 py-2 text-sm border transition-colors focus-ring ${
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
