import { Order } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/format';
import StatusBadge from './StatusBadge';

export default function OrderTicket({ order }: { order: Order }) {
  return (
    <div className="ticket rounded px-6 py-8">
      <div className="flex items-start justify-between border-b border-dashed border-line pb-5 mb-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/40">Order number</p>
          <p className="font-display text-2xl text-ink">{order.orderNumber}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-5 text-sm">
        <div>
          <p className="text-ink/40">Collection</p>
          <p className="font-medium">
            {formatDate(order.collectionDate)} &middot; {order.collectionTime}
          </p>
        </div>
        <div>
          <p className="text-ink/40">Name on order</p>
          <p className="font-medium">{order.customerName}</p>
        </div>
        <div>
          <p className="text-ink/40">Lodge number</p>
          <p className="font-medium">{order.lodgeNumber || 'Not provided'}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm border-t border-dashed border-line pt-5 mb-4">
        {order.items.map((item) => (
          <div key={item.id} className="leader-row">
            <span>
              {item.quantity} × {item.name}
            </span>
            <span className="leader" />
            <span>{formatPrice(item.subtotal)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-line pt-4 flex items-center justify-between">
        <span className="font-medium">Total</span>
        <span className="font-display text-xl text-forest">{formatPrice(order.total)}</span>
      </div>

      {order.note && (
        <p className="mt-5 text-sm text-ink/60 italic">&ldquo;{order.note}&rdquo;</p>
      )}
    </div>
  );
}
