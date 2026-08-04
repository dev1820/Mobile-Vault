import { ORDER_STATUS_LABELS, type OrderStatus } from "../../types/order";

const COLOR_CLASSES: Record<OrderStatus, string> = {
  PENDING_VERIFICATION: "border-vault-gold/60 text-vault-gold",
  ADVANCE_CONFIRMED: "border-sky-400/50 text-sky-300",
  OUT_FOR_DELIVERY: "border-purple-400/50 text-purple-300",
  DELIVERED: "border-emerald-400/50 text-emerald-300",
  CANCELLED: "border-red-400/50 text-red-300",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${COLOR_CLASSES[status]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
