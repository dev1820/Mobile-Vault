import type { ProductStatus } from "../../types/product";

const LABELS: Record<ProductStatus, string> = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  SOLD: "Sold",
};

const COLOR_CLASSES: Record<ProductStatus, string> = {
  AVAILABLE: "border-vault-gold/60 text-vault-gold",
  RESERVED: "border-amber-400/60 bg-amber-400/10 text-amber-300",
  SOLD: "border-vault-silver/40 bg-vault-silver/10 text-vault-silver",
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${COLOR_CLASSES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
