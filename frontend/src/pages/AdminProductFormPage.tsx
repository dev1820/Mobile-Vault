import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createProduct,
  deleteImage,
  deleteProduct,
  getProduct,
  setProductStatus,
  updateProduct,
  uploadImages,
  type ProductPayload,
} from "../api/productsApi";
import type { Product, ProductStatus } from "../types/product";
import { ProductForm } from "../components/admin/ProductForm";
import { ImageUploader } from "../components/admin/ImageUploader";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import { StatusBadge } from "../components/product/StatusBadge";
import { FullPageSpinner } from "../components/ui/Spinner";

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProduct(id).then((result) => {
      setProduct(result);
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(payload: ProductPayload) {
    setSubmitting(true);
    try {
      if (isEditMode && product) {
        const updated = await updateProduct(product.id, payload);
        setProduct(updated);
      } else {
        const created = await createProduct(payload);
        setProduct(created);
        navigate(`/admin/products/${created.id}/edit`, { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpload(files: File[]) {
    if (!product) return;
    const updated = await uploadImages(product.id, files);
    setProduct(updated);
  }

  async function handleDeleteImage(imageId: number) {
    if (!product) return;
    const updated = await deleteImage(product.id, imageId);
    setProduct(updated);
  }

  async function handleStatusChange(status: ProductStatus) {
    if (!product) return;
    const updated = await setProductStatus(product.id, status);
    setProduct(updated);
  }

  async function handleDeleteListing() {
    if (!product) return;
    await deleteProduct(product.id);
    navigate("/admin");
  }

  if (loading) {
    return <FullPageSpinner />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/admin" className="text-sm text-vault-silver hover:text-vault-gold">
        &larr; Back to listings
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-vault-white">
          {isEditMode ? "Edit Listing" : "Add Listing"}
        </h1>
        {product && <StatusBadge status={product.status} />}
      </div>

      <div className="mt-6 rounded-lg border border-vault-silver/10 bg-vault-charcoal p-6">
        <ProductForm
          submitLabel={isEditMode ? "Save Changes" : "Create Listing"}
          submitting={submitting}
          defaultValues={
            product
              ? {
                  title: product.title,
                  description: product.description ?? "",
                  category: product.category,
                  model: product.model ?? "",
                  storageCapacity: product.storageCapacity ?? "",
                  color: product.color ?? "",
                  condition: product.condition ?? "NEW",
                  priceRupees: product.priceRupees,
                  batteryHealthPercent: product.batteryHealthPercent ?? "",
                }
              : undefined
          }
          onSubmit={handleSubmit}
        />
      </div>

      {product && (
        <div className="mt-6 rounded-lg border border-vault-silver/10 bg-vault-charcoal p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-vault-white">Photos</h2>
          <ImageUploader images={product.images} onUpload={handleUpload} onDeleteImage={handleDeleteImage} />
        </div>
      )}

      {isEditMode && product && (
        <div className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-vault-silver/10 bg-vault-charcoal p-6">
          <Select
            label="Status"
            value={product.status}
            onChange={(e) => handleStatusChange(e.target.value as ProductStatus)}
            className="w-auto"
          >
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </Select>
          <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
            Delete Listing
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete listing?"
        message="This will permanently remove this listing and its photos. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteListing}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
