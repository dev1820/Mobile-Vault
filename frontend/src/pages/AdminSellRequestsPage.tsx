import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteSellRequest, getAdminSellRequests } from "../api/sellRequestsApi";
import type { SellRequest } from "../types/sellRequest";
import { SellRequestStatusBadge } from "../components/admin/SellRequestStatusBadge";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { Button } from "../components/ui/Button";
import { FullPageSpinner } from "../components/ui/Spinner";
import { formatPrice } from "../utils/format";

export function AdminSellRequestsPage() {
  const [requests, setRequests] = useState<SellRequest[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SellRequest | null>(null);

  async function refresh() {
    const page = await getAdminSellRequests({ size: 200, sort: "createdAt,desc" });
    setRequests(page.content);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    await deleteSellRequest(pendingDelete.id);
    setRequests((prev) => prev?.filter((r) => r.id !== pendingDelete.id) ?? null);
    setPendingDelete(null);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-vault-white">Sell Requests</h1>
      <p className="mt-1 text-sm text-vault-silver">Devices customers have submitted to sell or trade in.</p>

      <div className="mt-6">
        {requests === null ? (
          <FullPageSpinner />
        ) : requests.length === 0 ? (
          <div className="rounded-lg border border-dashed border-vault-silver/20 py-16 text-center text-vault-silver">
            No sell requests yet.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full border-collapse text-sm md:table">
              <thead>
                <tr className="border-b border-vault-silver/15 text-left text-xs uppercase tracking-wide text-vault-silver">
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Model</th>
                  <th className="py-3 pr-4">Expected Price</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Submitted</th>
                  <th className="py-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-vault-silver/10">
                    <td className="py-3 pr-4 text-vault-white">
                      {r.firstName} {r.lastName}
                    </td>
                    <td className="py-3 pr-4 text-vault-silver">{r.model}</td>
                    <td className="py-3 pr-4 text-vault-gold">{formatPrice(r.expectedPriceRupees)}</td>
                    <td className="py-3 pr-4">
                      <SellRequestStatusBadge status={r.status} />
                    </td>
                    <td className="py-3 pr-4 text-vault-silver">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/sell-requests/${r.id}`}>
                          <Button variant="secondary" className="px-3 py-1.5 text-xs">
                            View
                          </Button>
                        </Link>
                        <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={() => setPendingDelete(r)}>
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
              {requests.map((r) => (
                <div key={r.id} className="rounded-lg border border-vault-silver/10 bg-vault-charcoal p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-vault-white">
                        {r.firstName} {r.lastName}
                      </p>
                      <p className="text-xs text-vault-silver">{r.model}</p>
                      <p className="mt-1 font-display text-vault-gold">{formatPrice(r.expectedPriceRupees)}</p>
                    </div>
                    <SellRequestStatusBadge status={r.status} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link to={`/admin/sell-requests/${r.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full px-3 py-1.5 text-xs">
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="flex-1 px-3 py-1.5 text-xs"
                      onClick={() => setPendingDelete(r)}
                    >
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
        title="Delete sell request?"
        message={`This will permanently remove the submission from ${pendingDelete?.firstName} ${pendingDelete?.lastName}. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
