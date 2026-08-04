import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteOrder, getAdminOrder, updateOrderStatus } from "../api/ordersApi";
import type { Order, OrderStatus } from "../types/order";
import { ORDER_STATUS_LABELS } from "../types/order";
import { OrderStatusBadge } from "../components/admin/OrderStatusBadge";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { FullPageSpinner } from "../components/ui/Spinner";
import { imageUrl } from "../api/client";
import { formatPrice } from "../utils/format";

export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  useEffect(() => {
    if (!id) return;
    getAdminOrder(id).then(setOrder);
  }, [id]);

  async function handleStatusChange(status: OrderStatus) {
    if (!order) return;
    setSavingStatus(true);
    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrder(updated);
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleCancelAndRelease() {
    if (!order) return;
    const updated = await updateOrderStatus(order.id, "CANCELLED");
    setOrder(updated);
    setConfirmingCancel(false);
  }

  async function handleDelete() {
    if (!order) return;
    await deleteOrder(order.id);
    navigate("/admin/orders");
  }

  if (!order) {
    return <FullPageSpinner />;
  }

  const specs: [string, string][] = [
    ["Email", order.customerEmail],
    ["Phone", order.customerPhone],
    ["Product", order.productTitle],
    ["Product Price", formatPrice(order.productPriceRupees)],
    ["Delivery City", order.deliveryCity],
    ["Payment Reference", order.paymentReference || "—"],
    ["Submitted", new Date(order.createdAt).toLocaleString()],
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/orders" className="text-sm text-vault-silver hover:text-vault-gold">
        &larr; Back to orders
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-vault-white">
          {order.customerFirstName} {order.customerLastName}
        </h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-vault-silver">
            Payment Proof
          </span>
          <a href={imageUrl(order.paymentProofUrl)} target="_blank" rel="noreferrer">
            <img
              src={imageUrl(order.paymentProofUrl)}
              alt="Payment proof"
              className="aspect-square w-full rounded-lg bg-vault-charcoal object-cover"
            />
          </a>

          <div className="mt-6">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-vault-silver">
              Delivery Address
            </span>
            <p className="whitespace-pre-line rounded-lg border border-vault-silver/10 bg-vault-charcoal p-4 text-sm text-vault-silver">
              {order.deliveryAddress}
            </p>
          </div>

          {order.deliveryNotes && (
            <div className="mt-4">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-vault-silver">
                Delivery Notes
              </span>
              <p className="whitespace-pre-line rounded-lg border border-vault-silver/10 bg-vault-charcoal p-4 text-sm text-vault-silver">
                {order.deliveryNotes}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <p className="font-display text-2xl font-semibold text-vault-gold">
            {formatPrice(order.advanceAmountRupees)}{" "}
            <span className="text-sm font-normal text-vault-silver">advance</span>
          </p>

          <dl className="divide-y divide-vault-silver/10 rounded-lg border border-vault-silver/10">
            {specs.map(([label, val]) => (
              <div key={label} className="flex justify-between px-4 py-2.5 text-sm">
                <dt className="text-vault-silver">{label}</dt>
                <dd className="font-medium text-vault-white">{val}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-lg border border-vault-silver/10 bg-vault-charcoal p-4">
            <Select
              label="Status"
              value={order.status}
              disabled={savingStatus}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            >
              {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-wrap gap-3">
            {order.status !== "CANCELLED" && (
              <Button variant="secondary" onClick={() => setConfirmingCancel(true)}>
                Cancel &amp; Release Listing
              </Button>
            )}
            <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
              Delete Order
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingCancel}
        title="Cancel order and release listing?"
        message="This marks the order as Cancelled and flips the linked listing back to Available so it can be purchased again."
        confirmLabel="Cancel & Release"
        onConfirm={handleCancelAndRelease}
        onCancel={() => setConfirmingCancel(false)}
      />

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete order?"
        message="This will permanently remove this order and its payment proof. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
