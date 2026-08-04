import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteComplaint, getAdminComplaints } from "../api/complaintsApi";
import type { Complaint } from "../types/complaint";
import { COMPLAINT_TYPE_LABELS } from "../types/complaint";
import { ComplaintStatusBadge } from "../components/admin/ComplaintStatusBadge";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { Button } from "../components/ui/Button";
import { FullPageSpinner } from "../components/ui/Spinner";

export function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Complaint | null>(null);

  async function refresh() {
    const page = await getAdminComplaints({ size: 200, sort: "createdAt,desc" });
    setComplaints(page.content);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    await deleteComplaint(pendingDelete.id);
    setComplaints((prev) => prev?.filter((c) => c.id !== pendingDelete.id) ?? null);
    setPendingDelete(null);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-vault-white">Complaints</h1>
      <p className="mt-1 text-sm text-vault-silver">Support tickets submitted from the T&amp;C page.</p>

      <div className="mt-6">
        {complaints === null ? (
          <FullPageSpinner />
        ) : complaints.length === 0 ? (
          <div className="rounded-lg border border-dashed border-vault-silver/20 py-16 text-center text-vault-silver">
            No complaints yet.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="hidden w-full border-collapse text-sm md:table">
              <thead>
                <tr className="border-b border-vault-silver/15 text-left text-xs uppercase tracking-wide text-vault-silver">
                  <th className="py-3 pr-4">Customer</th>
                  <th className="py-3 pr-4">Order #</th>
                  <th className="py-3 pr-4">Type</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Submitted</th>
                  <th className="py-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id} className="border-b border-vault-silver/10">
                    <td className="py-3 pr-4 text-vault-white">{c.fullName}</td>
                    <td className="py-3 pr-4 text-vault-silver">{c.orderNumber}</td>
                    <td className="py-3 pr-4 text-vault-silver">{COMPLAINT_TYPE_LABELS[c.complaintType]}</td>
                    <td className="py-3 pr-4">
                      <ComplaintStatusBadge status={c.status} />
                    </td>
                    <td className="py-3 pr-4 text-vault-silver">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/complaints/${c.id}`}>
                          <Button variant="secondary" className="px-3 py-1.5 text-xs">
                            View
                          </Button>
                        </Link>
                        <Button variant="danger" className="px-3 py-1.5 text-xs" onClick={() => setPendingDelete(c)}>
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
              {complaints.map((c) => (
                <div key={c.id} className="rounded-lg border border-vault-silver/10 bg-vault-charcoal p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-vault-white">{c.fullName}</p>
                      <p className="text-xs text-vault-silver">
                        {c.orderNumber} · {COMPLAINT_TYPE_LABELS[c.complaintType]}
                      </p>
                    </div>
                    <ComplaintStatusBadge status={c.status} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link to={`/admin/complaints/${c.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full px-3 py-1.5 text-xs">
                        View
                      </Button>
                    </Link>
                    <Button variant="danger" className="flex-1 px-3 py-1.5 text-xs" onClick={() => setPendingDelete(c)}>
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
        title="Delete complaint?"
        message={`This will permanently remove the complaint from ${pendingDelete?.fullName}. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
