import { Link } from "react-router-dom";
import type { Product, ProductStatus } from "../../types/product";
import { CATEGORY_LABELS } from "../../types/product";
import { imageUrl } from "../../api/client";
import { formatPrice } from "../../utils/format";
import { StatusBadge } from "../product/StatusBadge";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

interface ProductTableProps {
  products: Product[];
  onStatusChange: (product: Product, status: ProductStatus) => void;
  onDelete: (product: Product) => void;
}

const STATUS_OPTIONS: ProductStatus[] = ["AVAILABLE", "RESERVED", "SOLD"];

function StatusSelect({ product, onStatusChange }: { product: Product; onStatusChange: ProductTableProps["onStatusChange"] }) {
  return (
    <Select
      value={product.status}
      onChange={(e) => onStatusChange(product, e.target.value as ProductStatus)}
      className="w-auto py-1.5 text-xs"
    >
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </option>
      ))}
    </Select>
  );
}

export function ProductTable({ products, onStatusChange, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-vault-silver/20 py-16 text-center text-vault-silver">
        No listings yet. Click &ldquo;Add Listing&rdquo; to create your first one.
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <table className="hidden w-full border-collapse text-sm md:table">
        <thead>
          <tr className="border-b border-vault-silver/15 text-left text-xs uppercase tracking-wide text-vault-silver">
            <th className="py-3 pr-4">Photo</th>
            <th className="py-3 pr-4">Title</th>
            <th className="py-3 pr-4">Category</th>
            <th className="py-3 pr-4">Price</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-vault-silver/10">
              <td className="py-3 pr-4">
                <div className="h-12 w-12 overflow-hidden rounded-md bg-vault-charcoal-light">
                  {product.images[0] && (
                    <img src={imageUrl(product.images[0].url)} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
              </td>
              <td className="py-3 pr-4 text-vault-white">{product.title}</td>
              <td className="py-3 pr-4 text-vault-silver">{CATEGORY_LABELS[product.category]}</td>
              <td className="py-3 pr-4 text-vault-gold">{formatPrice(product.priceRupees)}</td>
              <td className="py-3 pr-4">
                <StatusBadge status={product.status} />
              </td>
              <td className="py-3 pr-4">
                <div className="flex justify-end gap-2">
                  <StatusSelect product={product} onStatusChange={onStatusChange} />
                  <Link to={`/admin/products/${product.id}/edit`}>
                    <Button variant="secondary" className="px-3 py-1.5 text-xs">
                      Edit
                    </Button>
                  </Link>
                  <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={() => onDelete(product)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile stacked cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {products.map((product) => (
          <div key={product.id} className="rounded-lg border border-vault-silver/10 bg-vault-charcoal p-4">
            <div className="flex gap-3">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-vault-charcoal-light">
                {product.images[0] && (
                  <img src={imageUrl(product.images[0].url)} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-vault-white">{product.title}</p>
                <p className="text-xs text-vault-silver">{CATEGORY_LABELS[product.category]}</p>
                <p className="mt-1 font-display text-vault-gold">{formatPrice(product.priceRupees)}</p>
              </div>
              <StatusBadge status={product.status} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusSelect product={product} onStatusChange={onStatusChange} />
              <Link to={`/admin/products/${product.id}/edit`} className="flex-1">
                <Button variant="secondary" className="w-full px-3 py-1.5 text-xs">
                  Edit
                </Button>
              </Link>
              <Button variant="danger" className="flex-1 px-3 py-1.5 text-xs" onClick={() => onDelete(product)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
