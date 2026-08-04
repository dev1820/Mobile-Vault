import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteDeviceRequest, getAdminDeviceRequest, updateDeviceRequestStatus } from "../api/deviceRequestsApi";
import type { DeviceRequest, DeviceRequestStatus } from "../types/deviceRequest";
import { DEVICE_REQUEST_STATUS_LABELS } from "../types/deviceRequest";
import { CATEGORY_LABELS } from "../types/product";
import { DeviceRequestStatusBadge } from "../components/admin/DeviceRequestStatusBadge";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { FullPageSpinner } from "../components/ui/Spinner";
import { formatPrice } from "../utils/format";

export function AdminDeviceRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<DeviceRequest | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    getAdminDeviceRequest(id).then(setRequest);
  }, [id]);

  async function handleStatusChange(status: DeviceRequestStatus) {
    if (!request) return;
    setSavingStatus(true);
    try {
      const updated = await updateDeviceRequestStatus(request.id, status);
      setRequest(updated);
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleDelete() {
    if (!request) return;
    await deleteDeviceRequest(request.id);
    navigate("/admin/device-requests");
  }

  if (!request) {
    return <FullPageSpinner />;
  }

  const specs: [string, string][] = [
    ["Category", CATEGORY_LABELS[request.category]],
    ["Email", request.customerEmail],
    ["Phone", request.customerPhone],
    ["Budget", request.budgetRupees != null ? formatPrice(request.budgetRupees) : "Not specified"],
    ["Submitted", new Date(request.createdAt).toLocaleString()],
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/admin/device-requests" className="text-sm text-vault-silver hover:text-vault-gold">
        &larr; Back to device requests
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-vault-white">{request.customerName}</h1>
        <DeviceRequestStatusBadge status={request.status} />
      </div>

      <p className="mt-2 font-display text-xl font-semibold text-vault-gold">{request.itemName}</p>

      <p className="mt-4 whitespace-pre-line rounded-lg border border-vault-silver/10 bg-vault-charcoal p-4 text-sm leading-relaxed text-vault-silver">
        {request.details}
      </p>

      <dl className="mt-6 divide-y divide-vault-silver/10 rounded-lg border border-vault-silver/10">
        {specs.map(([label, val]) => (
          <div key={label} className="flex justify-between px-4 py-2.5 text-sm">
            <dt className="text-vault-silver">{label}</dt>
            <dd className="font-medium text-vault-white">{val}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 rounded-lg border border-vault-silver/10 bg-vault-charcoal p-4">
        <Select
          label="Status"
          value={request.status}
          disabled={savingStatus}
          onChange={(e) => handleStatusChange(e.target.value as DeviceRequestStatus)}
        >
          {Object.entries(DEVICE_REQUEST_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <Button variant="danger" onClick={() => setConfirmingDelete(true)} className="mt-6">
        Delete Request
      </Button>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete device request?"
        message="This will permanently remove this request. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
