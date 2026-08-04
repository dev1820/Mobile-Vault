import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteComplaint, getAdminComplaint, updateComplaintStatus } from "../api/complaintsApi";
import type { Complaint, ComplaintStatus } from "../types/complaint";
import { COMPLAINT_STATUS_LABELS, COMPLAINT_TYPE_LABELS } from "../types/complaint";
import { ImageGallery } from "../components/product/ImageGallery";
import { ComplaintStatusBadge } from "../components/admin/ComplaintStatusBadge";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { FullPageSpinner } from "../components/ui/Spinner";
import { imageUrl } from "../api/client";

export function AdminComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    getAdminComplaint(id).then(setComplaint);
  }, [id]);

  async function handleStatusChange(status: ComplaintStatus) {
    if (!complaint) return;
    setSavingStatus(true);
    try {
      const updated = await updateComplaintStatus(complaint.id, status);
      setComplaint(updated);
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleDelete() {
    if (!complaint) return;
    await deleteComplaint(complaint.id);
    navigate("/admin/complaints");
  }

  if (!complaint) {
    return <FullPageSpinner />;
  }

  const specs: [string, string][] = [
    ["Email", complaint.email],
    ["Phone", complaint.phoneNumber],
    ["Order Number", complaint.orderNumber],
    ["Complaint Type", COMPLAINT_TYPE_LABELS[complaint.complaintType]],
    ["Submitted", new Date(complaint.createdAt).toLocaleString()],
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/complaints" className="text-sm text-vault-silver hover:text-vault-gold">
        &larr; Back to complaints
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-vault-white">{complaint.fullName}</h1>
        <ComplaintStatusBadge status={complaint.status} />
      </div>

      <p className="mt-4 whitespace-pre-line rounded-lg border border-vault-silver/10 bg-vault-charcoal p-4 text-sm leading-relaxed text-vault-silver">
        {complaint.description}
      </p>

      {(complaint.images.length > 0 || complaint.videoUrl) && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {complaint.images.length > 0 && (
            <div>
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-vault-silver">
                Photos
              </span>
              <ImageGallery images={complaint.images} alt={`Complaint from ${complaint.fullName}`} />
            </div>
          )}
          {complaint.videoUrl && (
            <div>
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-vault-silver">
                Video
              </span>
              <video controls className="w-full rounded-lg bg-vault-charcoal">
                <source src={imageUrl(complaint.videoUrl)} />
              </video>
            </div>
          )}
        </div>
      )}

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
          value={complaint.status}
          disabled={savingStatus}
          onChange={(e) => handleStatusChange(e.target.value as ComplaintStatus)}
        >
          {Object.entries(COMPLAINT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <Button variant="danger" onClick={() => setConfirmingDelete(true)} className="mt-6">
        Delete Complaint
      </Button>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete complaint?"
        message="This will permanently remove this complaint and its photos/video. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
