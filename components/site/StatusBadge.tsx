import { OrderStatus } from '@/lib/types';
import { STATUS_LABEL } from '@/lib/format';

const STYLES: Record<OrderStatus, string> = {
  PENDING: 'bg-paperDim text-ink border-line',
  CONFIRMED: 'bg-marigold/15 text-marigoldDark border-marigold/40',
  PREPARING: 'bg-marigold/15 text-marigoldDark border-marigold/40',
  READY: 'bg-forest/15 text-forestDark border-forest/40',
  COMPLETED: 'bg-forest text-white border-forest',
  CANCELLED: 'bg-clay/10 text-clay border-clay/40',
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-sm font-medium ${STYLES[status]}`}
    >
      {STATUS_LABEL[status] || status}
    </span>
  );
}
