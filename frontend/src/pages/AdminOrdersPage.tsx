import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteOrder, getAdminOrders } from "../api/ordersApi";
import type { Order } from "../types/order";
import { OrderStatusBadge } from "../components/admin/OrderStatusBadge";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { Button } from "../components/ui/Button";
import { FullPageSpinner } from "../components/ui/Spinner";
import { formatPrice } from "../utils/format";

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Order | null>(null);

  async function refresh() {
    const page = await getAdminOrders({ size: 200, sort: "createdAt,desc" });
    setOrders(page.content);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    await deleteOrder(pendingDelete.id);
    setOrders((prev) => prev?.filter((o) => o.id !== pendingDelete.id) ?? null);
    setPendingDelete(null);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-vault-white">Orders</h1>
      <p className="mt-1 text-sm text-vault-silver">Purchase requests with advance payment awaiting verification.</p>

      <div className="mt-6">
        {orders === null ? (
          <FullPageSpinner />
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-vault-silver/20 py-16 text-center text-vault-silver">
            No orders yet.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full border-collapse text-sm md:table">
              <thead>
                <tr className="border-b border-vault-silver/15 text-left text-xs uppercase tracking-wide text-vault-silver">
                  <th className="py-3 pr-4">Customer</th>
                  <th className="py-3 pr-4">Product</th>
                  <th className="py-3 pr-4">Advance</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Submitted</th>
                  <th className="py-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-vault-silver/10">
                    <td className="py-3 pr-4 text-vault-white">
                      {o.customerFirstName} {o.customerLastName}
                    </td>
                    <td className="py-3 pr-4 text-vault-silver">{o.productTitle}</td>
                    <td className="py-3 pr-4 text-vault-gold">{formatPrice(o.advanceAmountRupees)}</td>
                    <td className="py-3 pr-4">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="py-3 pr-4 text-vault-silver">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/orders/${o.id}`}>
                          <Button variant="secondary" className="px-3 py-1.5 text-xs">
                            View
                          </Button>
                        </Link>
                        <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={() => setPendingDelete(o)}>
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
              {orders.map((o) => (
                <div key={o.id} className="rounded-lg border border-vault-silver/10 bg-vault-charcoal p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-vault-white">
                        {o.customerFirstName} {o.customerLastName}
                      </p>
                      <p className="text-xs text-vault-silver">{o.productTitle}</p>
                      <p className="mt-1 font-display text-vault-gold">{formatPrice(o.advanceAmountRupees)}</p>
                    </div>
                    <OrderStatusBadge status={o.status} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link to={`/admin/orders/${o.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full px-3 py-1.5 text-xs">
                        View
                      </Button>
                    </Link>
                    <Button variant="danger" className="flex-1 px-3 py-1.5 text-xs" onClick={() => setPendingDelete(o)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete order?"
        message={`This will permanently remove the order from ${pendingDelete?.customerFirstName} ${pendingDelete?.customerLastName}. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
