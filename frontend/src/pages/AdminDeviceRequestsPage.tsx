import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteDeviceRequest, getAdminDeviceRequests } from "../api/deviceRequestsApi";
import type { DeviceRequest } from "../types/deviceRequest";
import { CATEGORY_LABELS } from "../types/product";
import { DeviceRequestStatusBadge } from "../components/admin/DeviceRequestStatusBadge";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { Button } from "../components/ui/Button";
import { FullPageSpinner } from "../components/ui/Spinner";

export function AdminDeviceRequestsPage() {
  const [requests, setRequests] = useState<DeviceRequest[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DeviceRequest | null>(null);

  async function refresh() {
    const page = await getAdminDeviceRequests({ size: 200, sort: "createdAt,desc" });
    setRequests(page.content);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    await deleteDeviceRequest(pendingDelete.id);
    setRequests((prev) => prev?.filter((r) => r.id !== pendingDelete.id) ?? null);
    setPendingDelete(null);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-vault-white">Device Requests</h1>
      <p className="mt-1 text-sm text-vault-silver">Items customers have asked us to source.</p>

      <div className="mt-6">
        {requests === null ? (
          <FullPageSpinner />
        ) : requests.length === 0 ? (
          <div className="rounded-lg border border-dashed border-vault-silver/20 py-16 text-center text-vault-silver">
            No device requests yet.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full border-collapse text-sm md:table">
              <thead>
                <tr className="border-b border-vault-silver/15 text-left text-xs uppercase tracking-wide text-vault-silver">
                  <th className="py-3 pr-4">Customer</th>
                  <th className="py-3 pr-4">Item</th>
                  <th className="py-3 pr-4">Category</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Submitted</th>
                  <th className="py-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-vault-silver/10">
                    <td className="py-3 pr-4 text-vault-white">{r.customerName}</td>
                    <td className="py-3 pr-4 text-vault-silver">{r.itemName}</td>
                    <td className="py-3 pr-4 text-vault-silver">{CATEGORY_LABELS[r.category]}</td>
                    <td className="py-3 pr-4">
                      <DeviceRequestStatusBadge status={r.status} />
                    </td>
                    <td className="py-3 pr-4 text-vault-silver">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/device-requests/${r.id}`}>
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
                      <p className="truncate text-sm font-medium text-vault-white">{r.customerName}</p>
                      <p className="text-xs text-vault-silver">
                        {r.itemName} · {CATEGORY_LABELS[r.category]}
                      </p>
                    </div>
                    <DeviceRequestStatusBadge status={r.status} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link to={`/admin/device-requests/${r.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full px-3 py-1.5 text-xs">
                        View
                      </Button>
                    </Link>
                    <Button variant="danger" className="flex-1 px-3 py-1.5 text-xs" onClick={() => setPendingDelete(r)}>
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
        title="Delete device request?"
        message={`This will permanently remove the request from ${pendingDelete?.customerName}. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
