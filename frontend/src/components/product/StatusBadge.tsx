import type { ProductStatus } from "../../types/product";

export function StatusBadge({ status }: { status: ProductStatus }) {
  const isAvailable = status === "AVAILABLE";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
        isAvailable
          ? "border-vault-gold/60 text-vault-gold"
          : "border-vault-silver/40 bg-vault-silver/10 text-vault-silver"
      }`}
    >
      {isAvailable ? "Available" : "Sold"}
    </span>
  );
}
