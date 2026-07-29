import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../api/productsApi";
import type { Product } from "../types/product";
import { CATEGORY_LABELS, CONDITION_LABELS } from "../types/product";
import { ImageGallery } from "../components/product/ImageGallery";
import { StatusBadge } from "../components/product/StatusBadge";
import { ContactCTA } from "../components/product/ContactCTA";
import { FullPageSpinner } from "../components/ui/Spinner";
import { formatPrice } from "../utils/format";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setProduct(null);
    setNotFound(false);
    getProduct(id)
      .then((result) => {
        if (!cancelled) setProduct(result);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-vault-silver">This listing could not be found.</p>
        <Link to="/catalog" className="mt-4 inline-block text-vault-gold hover:underline">
          &larr; Back to catalog
        </Link>
      </div>
    );
  }

  if (!product) {
    return <FullPageSpinner />;
  }

  const specs = [
    product.category === "PHONE" ? ["Model", product.model] : null,
    ["Category", CATEGORY_LABELS[product.category]],
    product.storageCapacity ? ["Storage", product.storageCapacity] : null,
    product.color ? ["Color", product.color] : null,
    product.condition ? ["Condition", CONDITION_LABELS[product.condition]] : null,
    product.batteryHealthPercent != null ? ["Battery Health", `${product.batteryHealthPercent}%`] : null,
  ].filter(Boolean) as [string, string][];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link to="/catalog" className="text-sm text-vault-silver hover:text-vault-gold">
        &larr; Back to catalog
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ImageGallery images={product.images} alt={product.title} />

        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-2xl font-semibold text-vault-white sm:text-3xl">
              {product.title}
            </h1>
            <StatusBadge status={product.status} />
          </div>

          <p className="mt-2 font-display text-3xl font-bold text-vault-gold">
            {formatPrice(product.priceRupees)}
          </p>

          {product.description && (
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-vault-silver">
              {product.description}
            </p>
          )}

          {specs.length > 0 && (
            <dl className="mt-6 divide-y divide-vault-silver/10 rounded-lg border border-vault-silver/10">
              {specs.map(([label, val]) => (
                <div key={label} className="flex justify-between px-4 py-2.5 text-sm">
                  <dt className="text-vault-silver">{label}</dt>
                  <dd className="font-medium text-vault-white">{val}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-auto pt-8">
            <ContactCTA product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
