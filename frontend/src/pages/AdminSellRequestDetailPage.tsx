import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteSellRequest, getAdminSellRequest, updateSellRequestStatus } from "../api/sellRequestsApi";
import type { SellRequest, SellRequestStatus } from "../types/sellRequest";
import {
  ACCESSORIES_LABELS,
  REPAIR_STATUS_LABELS,
  SELL_REQUEST_STATUS_LABELS,
  SIM_STATUS_LABELS,
} from "../types/sellRequest";
import { ImageGallery } from "../components/product/ImageGallery";
import { SellRequestStatusBadge } from "../components/admin/SellRequestStatusBadge";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { FullPageSpinner } from "../components/ui/Spinner";
import { imageUrl } from "../api/client";
import { formatPrice } from "../utils/format";

export function AdminSellRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<SellRequest | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    getAdminSellRequest(id).then(setRequest);
  }, [id]);

  async function handleStatusChange(status: SellRequestStatus) {
    if (!request) return;
    setSavingStatus(true);
    try {
      const updated = await updateSellRequestStatus(request.id, status);
      setRequest(updated);
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleDelete() {
    if (!request) return;
    await deleteSellRequest(request.id);
    navigate("/admin/sell-requests");
  }

  if (!request) {
    return <FullPageSpinner />;
  }

  const specs: [string, string][] = [
    ["Email", request.email],
    ["Phone", request.phoneNumber],
    ["Phone Company", request.phoneCompany],
    ["Model", request.model],
    ["Condition", `${request.conditionRating}/10`],
    ["Storage", request.storageCapacity],
    ["Sim Status", SIM_STATUS_LABELS[request.simStatus]],
    ["Repair Status", REPAIR_STATUS_LABELS[request.repairStatus]],
    ["Accessories", ACCESSORIES_LABELS[request.accessories]],
    ["Serial Number", request.deviceSerialNumber],
    ["Submitted", new Date(request.createdAt).toLocaleString()],
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/sell-requests" className="text-sm text-vault-silver hover:text-vault-gold">
        &larr; Back to sell requests
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-vault-white">
          {request.firstName} {request.lastName}
        </h1>
        <SellRequestStatusBadge status={request.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <ImageGallery images={request.images} alt={`${request.model} submission`} />
          {request.videoUrl && (
            <video controls className="mt-4 w-full rounded-lg bg-vault-charcoal">
              <source src={imageUrl(request.videoUrl)} />
            </video>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <p className="font-display text-2xl font-semibold text-vault-gold">
            {formatPrice(request.expectedPriceRupees)}{" "}
            <span className="text-sm font-normal text-vault-silver">expected</span>
          </p>

          {request.deviceDetails && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-vault-silver">
              {request.deviceDetails}
            </p>
          )}

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
              value={request.status}
              disabled={savingStatus}
              onChange={(e) => handleStatusChange(e.target.value as SellRequestStatus)}
            >
              {Object.entries(SELL_REQUEST_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <Button variant="danger" onClick={() => setConfirmingDelete(true)} className="self-start">
            Delete Submission
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete sell request?"
        message="This will permanently remove this submission and its photos/video. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
