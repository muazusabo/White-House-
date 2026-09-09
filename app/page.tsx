'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Product, RestaurantSettings } from '@/lib/types';
import { formatPrice, whatsappUrl } from '@/lib/format';

// Placeholder photography (source.unsplash.com is dead; Picsum is a stable
// no-key placeholder service). Swap these for real photos of your food and
// restaurant whenever you have them — that's the single highest-impact
// change you can make to this page.
const HERO_IMAGE = 'https://picsum.photos/seed/campus-hero/1800/1000';
const FALLBACK_DISH_IMAGE = (seed: string | number) =>
  `https://picsum.photos/seed/dish-${seed}/600/450`;

const FEATURES = [
  {
    title: 'Order ahead',
    body: "Browse what's cooking right now and place your order before you even leave class.",
    icon: (
      <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.5-6.5l-2.8 2.8M9.3 14.7l-2.8 2.8m0-11l2.8 2.8m8.4 8.4l-2.8-2.8" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: 'Pick your time',
    body: 'Choose exactly when you want to collect — today, tomorrow, or a time that fits your schedule.',
    icon: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: 'No queueing',
    body: 'Skip the line at the counter — just show your order number and collect when it\u2019s ready.',
    icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

const TESTIMONIALS = [
  {
    quote: "I order between lectures and it's ready by the time I get there. Genuinely changed how I eat on campus.",
    name: 'Amaka O.',
    role: '300L, Computer Science',
  },
  {
    quote: 'The jollof sells out fast, so being able to reserve mine ahead of time is a lifesaver.',
    name: 'Tunde B.',
    role: '200L, Economics',
  },
  {
    quote: 'Easy to use, and the staff always have my order ready right on time.',
    name: 'Grace I.',
    role: 'Postgraduate, Chemistry',
  },
];

export default function HomePage() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [dishes, setDishes] = useState<Product[]>([]);

  useEffect(() => {
    api.get<RestaurantSettings>('/settings').then(setSettings).catch(() => {});
    api
      .get<Product[]>('/products')
      .then((items) => setDishes(items.filter((p) => p.available).slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />

        <div className="relative mx-auto max-w-5xl px-5 pt-28 pb-24 md:pt-36 md:pb-32">
          <div className="max-w-2xl fade-up">
            <p className="text-marigold font-medium mb-3 tracking-wide">
              {settings?.location || 'On campus, ready when you are'}
            </p>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-white">
              Real food. Made fresh.
              <br />
              Ready when you are.
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-lg">
              Browse today&apos;s food, snacks, drinks and fruit, place your order, and pick a
              time to collect it &mdash; no queueing between classes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="btn-glow rounded bg-marigold text-ink px-6 py-3 font-medium hover:bg-marigoldDark hover:text-white transition-colors focus-ring"
              >
                Browse the menu
              </Link>
              <Link
                href="/track"
                className="rounded border border-white/50 text-white px-6 py-3 font-medium hover:bg-white/10 transition-colors focus-ring"
              >
                Track an order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="mx-auto max-w-5xl px-5 -mt-12 relative z-10 pb-20">
        <div className="grid sm:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card-lift bg-white rounded-lg border border-line p-6 shadow-sm"
            >
              <svg
                className="w-9 h-9 text-forest mb-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                {f.icon}
              </svg>
              <p className="font-display text-xl text-ink mb-1">{f.title}</p>
              <p className="text-sm text-ink/60">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular dishes */}
      {dishes.length > 0 && (
        <section className="mx-auto max-w-5xl px-5 pb-24">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-forest font-medium mb-1">On the menu</p>
              <h2 className="font-display text-3xl text-ink">Popular right now</h2>
            </div>
            <Link href="/menu" className="text-sm text-forest hover:underline whitespace-nowrap">
              See full menu
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map((dish) => (
              <div
                key={dish.id}
                className="card-lift bg-white rounded-lg border border-line overflow-hidden"
              >
                <div
                  className="h-40 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${dish.imageUrl || FALLBACK_DISH_IMAGE(dish.id)})`,
                  }}
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{dish.name}</p>
                    <p className="text-forest font-medium whitespace-nowrap">
                      {formatPrice(dish.price)}
                    </p>
                  </div>
                  {dish.description && (
                    <p className="text-sm text-ink/60 mt-1 line-clamp-2">{dish.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="bg-ink py-20">
        <div className="mx-auto max-w-5xl px-5">
          <p className="text-marigold font-medium mb-1 text-center">What students say</p>
          <h2 className="font-display text-3xl text-white text-center mb-10">
            Trusted by your classmates
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-lg p-6">
                <p className="text-white/80 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-white font-medium text-sm">{t.name}</p>
                <p className="text-white/50 text-xs">{t.role}</p>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs text-center mt-6">
            Example quotes &mdash; swap in real feedback from your own students.
          </p>
        </div>
      </section>

      {/* Practical info + CTA */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl text-ink mb-4">
              Ready when your class ends
            </h2>
            <p className="text-ink/60 mb-6 max-w-md">
              Order now and we&apos;ll have it ready for the time you choose. No more choosing
              between lunch and being late.
            </p>
            <Link
              href="/menu"
              className="btn-glow inline-block rounded bg-ink text-paper px-6 py-3 font-medium hover:bg-forest transition-colors focus-ring"
            >
              Start your order
            </Link>
          </div>

          {settings && (settings.openingHours || settings.phone || settings.location) && (
            <div className="border border-line rounded-lg p-6 bg-white/60 grid grid-cols-2 gap-6 text-sm">
              {settings.openingHours && (
                <div>
                  <p className="text-ink/50 mb-1">Opening hours</p>
                  <p className="font-medium">{settings.openingHours}</p>
                </div>
              )}
              {settings.location && (
                <div>
                  <p className="text-ink/50 mb-1">Where to collect</p>
                  <p className="font-medium">{settings.location}</p>
                </div>
              )}
              {settings.phone && (
                <div>
                  <p className="text-ink/50 mb-1">Questions?</p>
                  <a
                    href={whatsappUrl(settings.phone) || undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[#168c4a] hover:underline"
                  >
                    Message us on WhatsApp
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}