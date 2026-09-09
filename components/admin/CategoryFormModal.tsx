'use client';

import { useState } from 'react';
import { api, ApiError } from '@/lib/api';

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function CategoryFormModal({ onClose, onSaved }: Props) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/categories', { name, slug: slugify(name) }, true);
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create this category.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm bg-paper border border-line rounded p-6">
        <h2 className="font-display text-xl text-ink mb-4">New category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Drinks"
              className="w-full rounded border border-line bg-white/70 px-3 py-2 focus-ring"
            />
          </div>
          {error && <p className="text-clay text-sm">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded border border-line px-4 py-2 text-sm hover:bg-paperDim focus-ring"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded bg-ink text-paper px-4 py-2 text-sm font-medium hover:bg-forest focus-ring disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Add category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
