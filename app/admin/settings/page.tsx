'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { api, ApiError } from '@/lib/api';
import { RestaurantSettings } from '@/lib/types';

function SettingsContent() {
  const [form, setForm] = useState<RestaurantSettings>({
    restaurantName: '',
    logoUrl: '',
    phone: '',
    location: '',
    openingHours: '',
    collectionInstructions: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    paymentInstructions: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get<RestaurantSettings>('/settings')
      .then((s) =>
        setForm({
          restaurantName: s.restaurantName || '',
          logoUrl: s.logoUrl || '',
          phone: s.phone || '',
          location: s.location || '',
          openingHours: s.openingHours || '',
          collectionInstructions: s.collectionInstructions || '',
          bankName: s.bankName || '',
          accountName: s.accountName || '',
          accountNumber: s.accountNumber || '',
          paymentInstructions: s.paymentInstructions || '',
        }),
      )
      .catch(() => setError('Could not load settings.'))
      .finally(() => setLoading(false));
  }, []);

  function field(key: keyof RestaurantSettings) {
    return {
      value: form[key] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    setSaved(false);
    try {
      await api.patch('/settings', form, true);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save settings.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex-1 px-8 py-8 text-ink/40">Loading…</div>;
  }

  return (
    <div className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8 max-w-xl">
      <h1 className="font-display text-3xl text-ink mb-6">Business settings</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Restaurant name</label>
          <input {...field('restaurantName')} className="w-full rounded border border-line bg-white/60 px-4 py-2 focus-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Logo URL</label>
          <input {...field('logoUrl')} className="w-full rounded border border-line bg-white/60 px-4 py-2 focus-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">White House mobile number</label>
          <input {...field('phone')} className="w-full rounded border border-line bg-white/60 px-4 py-2 focus-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Campus location</label>
          <input {...field('location')} className="w-full rounded border border-line bg-white/60 px-4 py-2 focus-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Opening hours</label>
          <input {...field('openingHours')} className="w-full rounded border border-line bg-white/60 px-4 py-2 focus-ring" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Collection instructions</label>
          <textarea rows={3} {...field('collectionInstructions')} className="w-full rounded border border-line bg-white/60 px-4 py-2 focus-ring" />
        </div>
        <div className="border-t border-line pt-5 mt-6">
          <h2 className="font-display text-xl text-ink mb-1">Payment account details</h2>
          <p className="text-sm text-ink/60 mb-4">These details appear to customers before they submit an order.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bank name</label>
              <input {...field('bankName')} className="w-full rounded border border-line bg-white/60 px-4 py-2 focus-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Account name</label>
              <input {...field('accountName')} className="w-full rounded border border-line bg-white/60 px-4 py-2 focus-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Account number</label>
              <input {...field('accountNumber')} className="w-full rounded border border-line bg-white/60 px-4 py-2 focus-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment instructions</label>
              <textarea rows={3} {...field('paymentInstructions')} className="w-full rounded border border-line bg-white/60 px-4 py-2 focus-ring" />
            </div>
          </div>
        </div>

        {error && <p className="text-clay text-sm">{error}</p>}
        {saved && <p className="text-forest text-sm">Settings saved.</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded bg-ink text-paper px-6 py-2.5 font-medium hover:bg-forest transition-colors focus-ring disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </form>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <div className="flex">
        <AdminSidebar />
        <SettingsContent />
      </div>
    </AdminGuard>
  );
}
