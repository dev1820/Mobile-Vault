import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { imageUrl } from "../../api/client";
import { formatPrice } from "../../utils/format";
import { StatusBadge } from "./StatusBadge";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0];
  const isSold = product.status === "SOLD";

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-vault-silver/10 bg-vault-charcoal transition-colors hover:border-vault-gold/40"
    >
      <div className="relative aspect-square overflow-hidden bg-vault-charcoal-light">
        {cover ? (
          <img
            src={imageUrl(cover.url)}
            alt={product.title}
            className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              isSold ? "opacity-50 grayscale" : ""
            }`}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-vault-silver/30">
            No Photo
          </div>
        )}
        <div className="absolute left-2 top-2">
          <StatusBadge status={product.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-vault-white">{product.title}</h3>
        {(product.storageCapacity || product.color) && (
          <p className="text-xs text-vault-silver">
            {[product.storageCapacity, product.color].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-auto pt-2 font-display text-lg font-semibold text-vault-gold">
          {formatPrice(product.priceRupees)}
        </p>
      </div>
    </Link>
  );
}
