import { SELL_REQUEST_STATUS_LABELS, type SellRequestStatus } from "../../types/sellRequest";

const COLOR_CLASSES: Record<SellRequestStatus, string> = {
  PENDING: "border-vault-gold/60 text-vault-gold",
  CONTACTED: "border-sky-400/50 text-sky-300",
  ACCEPTED: "border-emerald-400/50 text-emerald-300",
  REJECTED: "border-red-400/50 text-red-300",
  COMPLETED: "border-vault-silver/40 bg-vault-silver/10 text-vault-silver",
};

export function SellRequestStatusBadge({ status }: { status: SellRequestStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${COLOR_CLASSES[status]}`}
    >
      {SELL_REQUEST_STATUS_LABELS[status]}
    </span>
  );
}
