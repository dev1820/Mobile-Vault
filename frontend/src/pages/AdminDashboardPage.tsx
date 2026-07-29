import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, getAdminProducts, setProductStatus } from "../api/productsApi";
import type { Product } from "../types/product";
import { ProductTable } from "../components/admin/ProductTable";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { Button } from "../components/ui/Button";
import { FullPageSpinner } from "../components/ui/Spinner";

export function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  async function refresh() {
    const page = await getAdminProducts({ size: 200, sort: "createdAt,desc" });
    setProducts(page.content);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleToggleStatus(product: Product) {
    const nextStatus = product.status === "AVAILABLE" ? "SOLD" : "AVAILABLE";
    const updated = await setProductStatus(product.id, nextStatus);
    setProducts((prev) => prev?.map((p) => (p.id === updated.id ? updated : p)) ?? null);
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    await deleteProduct(pendingDelete.id);
    setProducts((prev) => prev?.filter((p) => p.id !== pendingDelete.id) ?? null);
    setPendingDelete(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-vault-white">Listings</h1>
        <Link to="/admin/products/new">
          <Button>+ Add Listing</Button>
        </Link>
      </div>

      <div className="mt-6">
        {products === null ? (
          <FullPageSpinner />
        ) : (
          <ProductTable products={products} onToggleStatus={handleToggleStatus} onDelete={setPendingDelete} />
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete listing?"
        message={`This will permanently remove "${pendingDelete?.title}". This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
