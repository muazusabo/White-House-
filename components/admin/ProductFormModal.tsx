'use client';

import { useEffect, useState } from 'react';
import { Category, Product } from '@/lib/types';
import { api, ApiError } from '@/lib/api';

interface Props {
  categories: Category[];
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductFormModal({ categories, product, onClose, onSaved }: Props) {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [categoryId, setCategoryId] = useState<number | ''>(product?.categoryId || categories[0]?.id || '');
  const [stock, setStock] = useState(product?.stock != null ? String(product.stock) : '');
  const [available, setAvailable] = useState(product?.available ?? true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleImageChange(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Images must be smaller than 8 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxDimension = 1200;
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext('2d');
        if (!context) {
          setError('Could not process that image.');
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        setImageUrl(canvas.toDataURL('image/webp', 0.82));
        setError('');
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      name,
      description: description || undefined,
      price: parseFloat(price),
      imageUrl: imageUrl || undefined,
      categoryId: Number(categoryId),
      stock: stock === '' ? undefined : parseInt(stock, 10),
      available,
    };

    try {
      if (product) {
        await api.patch(`/products/${product.id}`, payload, true);
      } else {
        await api.post('/products', payload, true);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save this product.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-md bg-paper border border-line rounded p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="font-display text-2xl text-ink mb-5">
          {product ? 'Edit product' : 'Add product'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-line bg-white/70 px-3 py-2 focus-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded border border-line bg-white/70 px-3 py-2 focus-ring"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded border border-line bg-white/70 px-3 py-2 focus-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock (optional)</label>
              <input
                type="number"
                min="0"
                placeholder="Unlimited"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded border border-line bg-white/70 px-3 py-2 focus-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full rounded border border-line bg-white/70 px-3 py-2 focus-ring"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product image</label>
            <label className="group flex cursor-pointer items-center gap-4 rounded border border-dashed border-line bg-paperDim/40 p-3 transition-colors hover:border-forest hover:bg-paperDim">
              <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded bg-ink/10">
                {imageUrl ? (
                  <img src={imageUrl} alt="Product preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="px-2 text-center text-xs text-ink/50">No image</span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-ink group-hover:text-forest">Choose an image</p>
                <p className="mt-1 text-xs text-ink/50">JPG, PNG or WebP, up to 8 MB</p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => handleImageChange(e.target.files?.[0])}
                className="sr-only"
              />
            </label>
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="mt-2 text-xs text-clay hover:underline focus-ring"
              >
                Remove image
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            Available for ordering
          </label>

          {error && <p className="text-clay text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded border border-line px-4 py-2 text-sm hover:bg-paperDim focus-ring"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || categories.length === 0}
              className="flex-1 rounded bg-ink text-paper px-4 py-2 text-sm font-medium hover:bg-forest focus-ring disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
